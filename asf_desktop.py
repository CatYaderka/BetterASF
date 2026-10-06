import os
import sys
import json
import time
import socket
import signal
import threading
import subprocess
import http.server
import socketserver
import urllib.request
import urllib.error
import urllib.parse
import hashlib
import shutil
import tempfile
import zipfile
import base64
import re
from pathlib import Path

try:
    import webview
except Exception:
    webview = None

HERE = Path(__file__).resolve().parent
APP_NAME = "BetterASF"
APP_VERSION = "3.0"
GITHUB_REPO = "CatYaderka/BetterASF"






OFFICIAL_PLUGIN_DISPLAY_NAMES = {
    "archisteamfarmofficialpluginsitemsmatcher": "ItemsMatcher",
    "archisteamfarmofficialpluginsmobileauthenticator": "MobileAuthenticator",
    "archisteamfarmofficialpluginsmonitoring": "Monitoring",
    "archisteamfarmofficialpluginssteamtokendumper": "SteamTokenDumper",
}

DEFAULT_PLUGIN_STORE_SOURCES = (
    {"id": "official-monitoring", "name": "Monitoring", "repository": "JustArchiNET/ArchiSteamFarm", "asset_prefix": "ArchiSteamFarm.OfficialPlugins.Monitoring", "description": "Official ASF plugin that exports monitoring metrics."},
    {"id": "commandlessredeem", "name": "CommandlessRedeem", "repository": "CatPoweredPlugins/CommandlessRedeem", "description": "Redeems keys received through Steam chat without the standard redeem command."},
    {"id": "asf-achievement-manager", "name": "ASFAchievementManager", "repository": "CatPoweredPlugins/ASFAchievementManager", "description": "Manages Steam achievements through ASF commands."},
    {"id": "asf-enhance", "name": "ASFEnhance", "repository": "chr233/ASFEnhance", "description": "Extends ASF with additional commands and features."},
)


PLUGIN_CATALOG_FILENAME = "plugin_catalog.json"
PLUGIN_CATALOG_URL = f"https://raw.githubusercontent.com/{GITHUB_REPO}/main/{PLUGIN_CATALOG_FILENAME}"
PLUGIN_CATALOG_CACHE_FILE = None
PLUGIN_STORE_SOURCES = tuple(DEFAULT_PLUGIN_STORE_SOURCES)
_PLUGIN_CATALOG_STATE = {"loaded": False, "etag": "", "sources": tuple(DEFAULT_PLUGIN_STORE_SOURCES)}
_PLUGIN_CATALOG_LOCK = threading.RLock()
_PLUGIN_STORE_CACHE = {"at": 0.0, "items": [], "error": ""}
_PLUGIN_STORE_LOCK = threading.RLock()
_POPULAR_GAMES_CACHE = {"at": 0.0, "games": [], "error": ""}
_POPULAR_GAMES_LOCK = threading.RLock()
_GAME_META_CACHE = {}
_GAME_META_LOCK = threading.RLock()

_LOG_PATH = None
_EVENT_LOG_SERVICE = None
RUNTIME = {"steam_api_key": "", "ipc_password": "", "asf_status": "starting", "asf_status_message": ""}


def _set_log_path(p):
    global _LOG_PATH
    _LOG_PATH = p
    try:
        with open(_LOG_PATH, "w", encoding="utf-8") as f:
            f.write(f"=== {APP_NAME} log ===\n")
    except Exception:
        _LOG_PATH = None


def log(msg):
    line = f"[{APP_NAME}] {msg}"
    try:
        print(line, flush=True)
    except Exception:
        pass
    if _LOG_PATH:
        try:
            with open(_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(line + "\n")
        except Exception:
            pass
    if _EVENT_LOG_SERVICE:
        try:
            _EVENT_LOG_SERVICE.record(str(msg), source="python")
        except Exception:
            pass


def is_frozen():
    return getattr(sys, "frozen", False)


def app_dir():
    return Path(sys.executable).resolve().parent if is_frozen() else HERE


def resource_dir():
    return Path(getattr(sys, "_MEIPASS", app_dir())) if is_frozen() else HERE


APP_DIR = app_dir()
RES_DIR = resource_dir()


def _documents_dir():
    up = os.environ.get("USERPROFILE")
    if up:
        d = Path(up) / "Documents"
        if d.exists():
            return d
        return Path(up)
    return Path.home()


def data_dir():
    env = os.environ.get("ASF_DESKTOP_DATA")
    if env:
        d = Path(env)
        d.mkdir(parents=True, exist_ok=True)
        return d
    d = _documents_dir() / APP_NAME
    d.mkdir(parents=True, exist_ok=True)
    return d


DATA_DIR = data_dir()
PLUGIN_CATALOG_CACHE_FILE = DATA_DIR / "plugin-catalog-cache.json"
STEAM_APP_CATALOG_FILE = DATA_DIR / "steam-app-index.json"
STEAM_COVERS_DIR = DATA_DIR / "steam-covers"
EVENT_LOG_FILE = DATA_DIR / "events.jsonl"


def ui_dir():
    for cand in (RES_DIR / "ui", APP_DIR / "ui"):
        if cand.exists():
            return cand
    return RES_DIR / "ui"


UI_DIR = ui_dir()
SETTINGS_FILE = DATA_DIR / "settings.json"
HOUR_FARM_STATE_FILE = DATA_DIR / "hour-farm-state.json"
LOGIN_REQUEST_STATE_FILE = DATA_DIR / "login-requests-state.json"

DEFAULTS = {
    "asf_path": "",
    "ipc_host": "127.0.0.1",
    "ipc_port": "1242",
    "ipc_password": "",
    "window_title": APP_NAME,
    "window_width": "1200",
    "window_height": "800",
    "start_asf": "true",
    "self_install_to_program_files": "true",
    "create_shortcuts": "true",
    "startup_timeout": "180",
    "asf_self_restart_grace": "90",
    "asf_use_job_object": "false",
    "theme": "dark",
    "frameless": "true",
    "ui_port": "0",
    "ui_mode": "webview",
    "browser_path": "",
    "webview_low_memory": "true",
    "webview_aggressive": "true",
    "webview_single_process": "true",
    "webview_disable_gpu": "false",
    "webview_in_process_gpu": "false",
    "memory_trim": "true",
    "memory_trim_interval": "30",
    "memory_include_orphan_webview2": "true",
    "webview_extra_args": "",
    "steam_api_key": "",
}


def load_config():
    cfg = dict(DEFAULTS)
    ini = APP_DIR / "config.ini"
    if not ini.exists():
        ini = DATA_DIR / "config.ini"
    if not ini.exists():
        bundled = RES_DIR / "config.ini"
        if bundled.exists():
            target = DATA_DIR / "config.ini"
            try:
                target.write_text(bundled.read_text(encoding="utf-8"), encoding="utf-8")
                ini = target
            except Exception:
                ini = bundled
    if ini.exists():
        import configparser
        p = configparser.ConfigParser()
        try:
            p.read(ini, encoding="utf-8")
            if p.has_section("asf"):
                for k in cfg:
                    if p.has_option("asf", k):
                        cfg[k] = p.get("asf", k)
        except Exception:
            pass
    saved = _load_settings()
    if saved.get("theme") in ("dark", "light"):
        cfg["theme"] = saved["theme"]
    if saved.get("steam_api_key"):
        cfg["steam_api_key"] = saved["steam_api_key"]
    return cfg


def _load_settings():
    if SETTINGS_FILE.exists():
        try:
            return json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def _save_settings(patch):
    data = _load_settings()
    data.update(patch)
    try:
        SETTINGS_FILE.write_text(json.dumps(data), encoding="utf-8")
    except Exception:
        pass


def save_theme(theme):
    _save_settings({"theme": theme})


_CUSTOM_THEME_MEDIA_PREFIX = "custom-theme-media"
_CUSTOM_THEME_MEDIA_TYPES = {
    ".png": ("image/png", "image"),
    ".jpg": ("image/jpeg", "image"),
    ".webp": ("image/webp", "image"),
    ".gif": ("image/gif", "image"),
    ".mp4": ("video/mp4", "video"),
    ".webm": ("video/webm", "video"),
}
_CUSTOM_THEME_MAX_IMAGE_BYTES = 12 * 1024 * 1024
_CUSTOM_THEME_MAX_VIDEO_BYTES = 50 * 1024 * 1024


def _custom_theme_media_path(settings=None):
    settings = settings if isinstance(settings, dict) else _load_settings()
    filename = str(settings.get("custom_theme_media") or settings.get("custom_theme_image") or "")
    allowed = {f"{_CUSTOM_THEME_MEDIA_PREFIX}{ext}" for ext in _CUSTOM_THEME_MEDIA_TYPES}
    allowed.update({f"custom-theme-image{ext}" for ext in _CUSTOM_THEME_MEDIA_TYPES})
    if filename not in allowed:
        return None
    path = DATA_DIR / filename
    return path if path.is_file() else None


def custom_theme_state():
    settings = _load_settings()
    base = str(settings.get("custom_theme_base") or "dark").lower()
    if base not in ("dark", "light"):
        base = "dark"
    media = _custom_theme_media_path(settings)
    kind = _CUSTOM_THEME_MEDIA_TYPES.get(media.suffix.lower(), ("", ""))[1] if media else ""
    return {
        "ok": True,
        "base": base,
        "transparent": bool(settings.get("custom_theme_transparent", False)),
        "hasMedia": bool(media),
        "mediaType": kind,
        "mediaUrl": f"/__custom_theme/media?v={media.stat().st_mtime_ns}" if media else "",
    }


def _custom_theme_media_extension(data):
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if data.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if data.startswith(b"GIF87a") or data.startswith(b"GIF89a"):
        return ".gif"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return ".webp"
    if len(data) >= 12 and data[4:8] == b"ftyp":
        return ".mp4"
    if data.startswith(b"\x1a\x45\xdf\xa3"):
        return ".webm"
    return None


def save_custom_theme(payload):
    if not isinstance(payload, dict):
        return {"ok": False, "message": "Invalid custom theme data."}
    base = str(payload.get("base") or "dark").lower()
    if base not in ("dark", "light"):
        return {"ok": False, "message": "Invalid base theme."}
    patch = {
        "custom_theme_base": base,
        "custom_theme_transparent": bool(payload.get("transparent", False)),
    }
    try:
        if payload.get("removeImage"):
            for ext in _CUSTOM_THEME_MEDIA_TYPES:
                for prefix in ("custom-theme-image", _CUSTOM_THEME_MEDIA_PREFIX):
                    try:
                        (DATA_DIR / f"{prefix}{ext}").unlink(missing_ok=True)
                    except Exception:
                        pass
            patch["custom_theme_media"] = ""
            patch["custom_theme_image"] = ""

        media_data = payload.get("imageData")
        if media_data:
            if not isinstance(media_data, str) or not media_data.startswith("data:") or "," not in media_data:
                return {"ok": False, "message": "Invalid media format."}
            encoded = media_data.split(",", 1)[1]
            try:
                raw = base64.b64decode(encoded, validate=True)
            except Exception:
                return {"ok": False, "message": "Media data cannot be decoded."}
            ext = _custom_theme_media_extension(raw)
            if not ext:
                return {"ok": False, "message": "Use PNG, JPEG, WebP, GIF, MP4 or WebM."}
            limit = _CUSTOM_THEME_MAX_VIDEO_BYTES if _CUSTOM_THEME_MEDIA_TYPES[ext][1] == "video" else _CUSTOM_THEME_MAX_IMAGE_BYTES
            if not raw or len(raw) > limit:
                return {"ok": False, "message": "Media file exceeds the size limit."}
            for old_ext in _CUSTOM_THEME_MEDIA_TYPES:
                for prefix in ("custom-theme-image", _CUSTOM_THEME_MEDIA_PREFIX):
                    try:
                        (DATA_DIR / f"{prefix}{old_ext}").unlink(missing_ok=True)
                    except Exception:
                        pass
            target = DATA_DIR / f"{_CUSTOM_THEME_MEDIA_PREFIX}{ext}"
            temporary = target.with_suffix(target.suffix + ".part")
            temporary.write_bytes(raw)
            temporary.replace(target)
            patch["custom_theme_media"] = target.name
            patch["custom_theme_image"] = ""

        _save_settings(patch)
        return custom_theme_state()
    except Exception as exc:
        log(f"Custom theme save error: {exc}")
        return {"ok": False, "message": str(exc)}


def save_api_key(key):
    _save_settings({"steam_api_key": key or ""})


def get_app_setting(key, default=None):
    return _load_settings().get(key, default)


def set_app_setting(key, value):
    _save_settings({key: value})


def _autostart_command():
    if is_frozen():
        return f'"{sys.executable}"'
    return f'"{sys.executable}" "{Path(__file__).resolve()}"'


def set_autostart_enabled(enabled):
    enabled = bool(enabled)
    set_app_setting("autostart", enabled)
    if os.name != "nt":

        return True
    try:
        import winreg
        key_path = r"Software\Microsoft\Windows\CurrentVersion\Run"
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, key_path, 0, winreg.KEY_SET_VALUE) as k:
            if enabled:
                winreg.SetValueEx(k, APP_NAME, 0, winreg.REG_SZ, _autostart_command())
            else:
                try:
                    winreg.DeleteValue(k, APP_NAME)
                except FileNotFoundError:
                    pass
        return True
    except Exception as e:
        log(f"Не удалось изменить автозапуск: {e}")
        return False


def _is_under_path(path, parent):
    try:
        Path(path).resolve().relative_to(Path(parent).resolve())
        return True
    except Exception:
        return False


def _ps_quote(value):
    return "'" + str(value).replace("'", "''") + "'"


def ensure_user_shortcuts(cfg):

    enabled = str(cfg.get("create_shortcuts", "true")).lower() in ("1", "true", "yes", "on")
    if not enabled or os.name != "nt" or not is_frozen():
        return
    try:
        import base64
        target = str(Path(sys.executable).resolve())
        workdir = str(Path(sys.executable).resolve().parent)
        icon = target
        ps = f"""
$ErrorActionPreference = 'SilentlyContinue'
$target = {_ps_quote(target)}
$workdir = {_ps_quote(workdir)}
$icon = {_ps_quote(icon)}
$desktop = [Environment]::GetFolderPath('DesktopDirectory')
$programs = [Environment]::GetFolderPath('Programs')
$startDir = Join-Path $programs 'BetterASF'
New-Item -ItemType Directory -Force -Path $startDir | Out-Null
$links = @(
    (Join-Path $desktop 'BetterASF.lnk'),
    (Join-Path $startDir 'BetterASF.lnk')
)
$ws = New-Object -ComObject WScript.Shell
foreach ($lnk in $links) {{
    $need = $true
    if (Test-Path -LiteralPath $lnk) {{
        try {{
            $existing = $ws.CreateShortcut($lnk)
            if ($existing.TargetPath -eq $target) {{ $need = $false }}
        }} catch {{}}
    }}
    if ($need) {{
        $sc = $ws.CreateShortcut($lnk)
        $sc.TargetPath = $target
        $sc.WorkingDirectory = $workdir
        $sc.IconLocation = $icon
        $sc.Description = 'BetterASF'
        $sc.Save()
    }}
}}
"""
        encoded = base64.b64encode(ps.encode("utf-16le")).decode("ascii")
        subprocess.Popen(
            ["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-EncodedCommand", encoded],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        log("Shortcuts: Desktop and Start Menu check requested.")
    except Exception as e:
        log(f"Shortcuts error: {e}")


def ensure_program_files_install(cfg):

    enabled = str(cfg.get("self_install_to_program_files", "true")).lower() in ("1", "true", "yes", "on")
    if not enabled or os.name != "nt" or not is_frozen():
        return False
    if os.environ.get("BETTERASF_NO_SELF_INSTALL") == "1":
        return False

    src = Path(sys.executable).resolve()
    pf = os.environ.get("ProgramFiles") or os.environ.get("PROGRAMFILES")
    if not pf:
        log("Self-install: ProgramFiles environment variable is missing.")
        return False
    install_dir = Path(pf) / APP_NAME
    dst = install_dir / f"{APP_NAME}.exe"

    if _is_under_path(src, install_dir):
        return False

    try:
        import base64
        install_log = DATA_DIR / "self-install.log"
        ps = f"""
$ErrorActionPreference = 'Stop'
$src = {_ps_quote(src)}
$dstDir = {_ps_quote(install_dir)}
$dst = {_ps_quote(dst)}
$oldPid = {os.getpid()}
$log = {_ps_quote(install_log)}
function Log($m) {{
    try {{
        $dir = Split-Path -Parent $log
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Add-Content -LiteralPath $log -Encoding UTF8 -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + ' ' + $m)
    }} catch {{}}
}}
try {{
    Log 'Self-install started.'
    Log ('Source: ' + $src)
    Log ('Target: ' + $dst)
    New-Item -ItemType Directory -Force -Path $dstDir | Out-Null

    Write-Host 'BetterASF self-install' -ForegroundColor Cyan
    Write-Host ('Source: ' + $src)
    Write-Host ('Target: ' + $dst)

    Log 'Stopping old installed BetterASF processes if any.'
    try {{
        $oldInstalled = Get-CimInstance Win32_Process -Filter "Name='BetterASF.exe'" | Where-Object {{ $_.ExecutablePath -eq $dst -and $_.ProcessId -ne $oldPid }}
        foreach ($p in $oldInstalled) {{
            Log ('Stopping old installed process PID ' + $p.ProcessId)
            Write-Host ('Stopping old installed BetterASF PID ' + $p.ProcessId) -ForegroundColor Yellow
            Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
        }}
        Start-Sleep -Milliseconds 800
    }} catch {{ Log ('Process cleanup warning: ' + $_.Exception.Message) }}

    $copied = $false
    for ($i = 1; $i -le 10; $i++) {{
        try {{
            Write-Host ('Copy attempt ' + $i + '/10...') -ForegroundColor Cyan
            Copy-Item -LiteralPath $src -Destination $dst -Force
            $copied = $true
            Log 'Copy succeeded.'
            break
        }} catch {{
            Log ('Copy attempt ' + $i + ' failed: ' + $_.Exception.Message)
            Write-Host ('Copy attempt failed: ' + $_.Exception.Message) -ForegroundColor Yellow
            Start-Sleep -Seconds 1
        }}
    }}
    if (-not $copied) {{ throw 'Unable to copy BetterASF.exe to Program Files. See self-install.log.' }}

    try {{ Unblock-File -LiteralPath $dst -ErrorAction SilentlyContinue }} catch {{}}

    $srcHash = (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash
    $dstHash = (Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash
    if ($srcHash -ne $dstHash) {{ throw 'Copied file hash mismatch.' }}
    Log 'Hash verification succeeded.'

    $env:BETTERASF_NO_SELF_INSTALL = '1'
    Start-Process -FilePath $dst -WorkingDirectory $dstDir
    Log 'Installed copy started.'
    Write-Host 'Installed copy started.' -ForegroundColor Green

    try {{ Wait-Process -Id $oldPid -Timeout 45 -ErrorAction SilentlyContinue }} catch {{}}
    Start-Sleep -Milliseconds 1000
    try {{
        if ((Test-Path -LiteralPath $src) -and ($src -ne $dst)) {{
            Remove-Item -LiteralPath $src -Force -ErrorAction SilentlyContinue
            Log 'Original file removal requested.'
        }}
    }} catch {{ Log ('Original removal failed: ' + $_.Exception.Message) }}
}} catch {{
    Log ('Fatal: ' + $_.Exception.Message)
}}
"""
        encoded = base64.b64encode(ps.encode("utf-16le")).decode("ascii")
        params = f'-NoProfile -ExecutionPolicy Bypass -EncodedCommand {encoded}'
        import ctypes
        rc = ctypes.windll.shell32.ShellExecuteW(None, "runas", "powershell.exe", params, None, 1)
        if int(rc) <= 32:
            log(f"Self-install: elevation was not started, ShellExecute={int(rc)}")
            return False
        log(f"Self-install: elevated copy task started. Target: {dst}")
        log(f"Self-install: details will be written to {install_log}")
        return True
    except Exception as e:
        log(f"Self-install error: {e}")
        return False


def find_asf_executable(configured):
    if configured:
        p = Path(configured)
        if p.exists():
            return str(p)
    cands = [
        DATA_DIR / "ASF-runtime" / "ArchiSteamFarm.exe",
        APP_DIR / "ArchiSteamFarm.exe",
        APP_DIR / "ArchiSteamFarm" / "ArchiSteamFarm.exe",
        APP_DIR / "ASF-runtime" / "ArchiSteamFarm.exe",
        APP_DIR.parent / "ArchiSteamFarm.exe",
    ]
    if os.name != "nt":
        cands += [DATA_DIR / "ASF-runtime" / "ArchiSteamFarm",
                  APP_DIR / "ArchiSteamFarm", APP_DIR / "ASF-runtime" / "ArchiSteamFarm",
                  APP_DIR.parent / "ArchiSteamFarm"]
    for c in cands:
        if c.exists():
            return str(c)
    return None


def extract_embedded_asf():
    embedded = RES_DIR / "_asf"
    if not embedded.exists():
        return None

    runtime = DATA_DIR / "ASF-runtime"

    def runtime_exe_path():
        for nm in ("ArchiSteamFarm.exe", "ArchiSteamFarm"):
            p = runtime / nm
            if p.exists():
                return p
        return runtime / "ArchiSteamFarm.exe"

    runtime_exe = runtime_exe_path()

    ver_src = embedded / "_asf_version.txt"
    ver_dst = runtime / "_asf_version.txt"
    src_ver = ver_src.read_text(encoding="utf-8").strip() if ver_src.exists() else "1"
    dst_ver = ver_dst.read_text(encoding="utf-8").strip() if ver_dst.exists() else ""

    if runtime_exe.exists() and dst_ver == src_ver:
        return str(runtime_exe)

    import shutil
    log(f"Распаковка встроенного ASF в {runtime}")
    runtime.mkdir(parents=True, exist_ok=True)
    for item in embedded.rglob("*"):
        rel = item.relative_to(embedded)
        dst = runtime / rel
        if item.is_dir():
            dst.mkdir(parents=True, exist_ok=True)
        else:
            dst.parent.mkdir(parents=True, exist_ok=True)
            if rel.parts and rel.parts[0].lower() == "config" and dst.exists():
                continue
            try:
                shutil.copy2(item, dst)
            except Exception as e:
                log(f"copy fail: {rel} {e}")
    try:
        ver_dst.write_text(src_ver, encoding="utf-8")
    except Exception:
        pass

    link_external_config(runtime)
    runtime_exe = runtime_exe_path()
    return str(runtime_exe) if runtime_exe.exists() else None


def reset_embedded_asf_runtime():
    embedded = RES_DIR / "_asf"
    runtime = DATA_DIR / "ASF-runtime"
    if not embedded.exists():
        log("ASF recovery: embedded ASF is not available, runtime reset skipped.")
        return False
    try:
        import shutil
        if runtime.exists() or os.path.lexists(str(runtime)):
            log(f"ASF recovery: removing broken runtime {runtime}")
            shutil.rmtree(str(runtime), ignore_errors=True)
            if os.path.lexists(str(runtime)):
                try:
                    os.rmdir(str(runtime))
                except Exception:
                    if os.name == "nt":
                        subprocess.run(["cmd", "/c", "rd", "/s", "/q", str(runtime)],
                                       creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                                       check=False)
        return True
    except Exception as e:
        log(f"ASF recovery: runtime cleanup failed: {e}")
        return False


def link_external_config(runtime):
    ext_cfg = DATA_DIR / "config"
    rt_cfg = runtime / "config"
    if not ext_cfg.exists():
        if rt_cfg.exists() and not os.path.islink(str(rt_cfg)):
            try:
                rt_cfg.rename(ext_cfg)
            except Exception:
                ext_cfg.mkdir(parents=True, exist_ok=True)
        else:
            ext_cfg.mkdir(parents=True, exist_ok=True)
    if os.path.lexists(str(rt_cfg)):
        try:
            if os.path.islink(str(rt_cfg)):
                os.unlink(str(rt_cfg))
            elif os.path.isdir(str(rt_cfg)):
                import shutil
                shutil.rmtree(str(rt_cfg), ignore_errors=True)
                if os.path.lexists(str(rt_cfg)):
                    try:
                        os.rmdir(str(rt_cfg))
                    except Exception:
                        subprocess.run(["cmd", "/c", "rd", "/s", "/q", str(rt_cfg)],
                                       creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                                       check=False)
            else:
                os.remove(str(rt_cfg))
        except Exception:
            pass
    try:
        os.symlink(str(ext_cfg), str(rt_cfg), target_is_directory=True)
    except Exception:
        try:
            if os.name == "nt" and not os.path.lexists(str(rt_cfg)):
                subprocess.run(["cmd", "/c", "mklink", "/J", str(rt_cfg), str(ext_cfg)],
                               creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                               check=False)
        except Exception:
            pass


BETTERASF_CLAN_ID = "103582791475681171"


def enable_betterasf_group(exe_path):
    folders = []
    if exe_path:
        folders.append(Path(exe_path).parent / "config")
    folders.append(DATA_DIR / "config")
    seen = set()
    patched = 0
    for folder in folders:
        try:
            rp = folder.resolve()
        except Exception:
            rp = folder
        if rp in seen or not folder.exists():
            continue
        seen.add(rp)
        for cfg in folder.glob("*.json"):
            name = cfg.name.lower()
            if name in ("asf.json", "ipc.json") or name.startswith("minimal"):
                continue
            try:
                raw = cfg.read_text(encoding="utf-8")
                data = json.loads(raw)
            except Exception:
                continue
            if not isinstance(data, dict):
                continue
            changed = False

            cur_clan = str(data.get("s_SteamMasterClanID") or data.get("SteamMasterClanID") or "0")
            if cur_clan != BETTERASF_CLAN_ID:
                data.pop("SteamMasterClanID", None)
                data["s_SteamMasterClanID"] = BETTERASF_CLAN_ID
                changed = True



            if changed:
                try:
                    cfg.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
                    patched += 1
                    log(f"Подписка на BetterASF включена: {cfg.name}")
                except Exception as e:
                    log(f"Не удалось пропатчить {cfg.name}: {e}")
    if patched == 0:
        log("Подписка на BetterASF: уже настроена или конфигов нет.")


def _create_kill_job():
    if os.name != "nt":
        return None
    try:
        import ctypes
        from ctypes import wintypes

        JobObjectExtendedLimitInformation = 9
        JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE = 0x2000

        class JOBOBJECT_BASIC_LIMIT_INFORMATION(ctypes.Structure):
            _fields_ = [
                ("PerProcessUserTimeLimit", wintypes.LARGE_INTEGER),
                ("PerJobUserTimeLimit", wintypes.LARGE_INTEGER),
                ("LimitFlags", wintypes.DWORD),
                ("MinimumWorkingSetSize", ctypes.c_size_t),
                ("MaximumWorkingSetSize", ctypes.c_size_t),
                ("ActiveProcessLimit", wintypes.DWORD),
                ("Affinity", ctypes.POINTER(wintypes.ULONG)),
                ("PriorityClass", wintypes.DWORD),
                ("SchedulingClass", wintypes.DWORD),
            ]

        class IO_COUNTERS(ctypes.Structure):
            _fields_ = [
                ("ReadOperationCount", ctypes.c_ulonglong),
                ("WriteOperationCount", ctypes.c_ulonglong),
                ("OtherOperationCount", ctypes.c_ulonglong),
                ("ReadTransferCount", ctypes.c_ulonglong),
                ("WriteTransferCount", ctypes.c_ulonglong),
                ("OtherTransferCount", ctypes.c_ulonglong),
            ]

        class JOBOBJECT_EXTENDED_LIMIT_INFORMATION(ctypes.Structure):
            _fields_ = [
                ("BasicLimitInformation", JOBOBJECT_BASIC_LIMIT_INFORMATION),
                ("IoInfo", IO_COUNTERS),
                ("ProcessMemoryLimit", ctypes.c_size_t),
                ("JobMemoryLimit", ctypes.c_size_t),
                ("PeakProcessMemoryUsed", ctypes.c_size_t),
                ("PeakJobMemoryUsed", ctypes.c_size_t),
            ]

        kernel32 = ctypes.windll.kernel32
        job = kernel32.CreateJobObjectW(None, None)
        if not job:
            return None
        info = JOBOBJECT_EXTENDED_LIMIT_INFORMATION()
        info.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
        ok = kernel32.SetInformationJobObject(
            job, JobObjectExtendedLimitInformation,
            ctypes.byref(info), ctypes.sizeof(info),
        )
        if not ok:
            kernel32.CloseHandle(job)
            return None
        return job
    except Exception as e:
        log(f"Job Object недоступен: {e}")
        return None


def _assign_to_job(job, pid):
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        PROCESS_SET_QUOTA = 0x0100
        PROCESS_TERMINATE = 0x0001
        handle = kernel32.OpenProcess(PROCESS_SET_QUOTA | PROCESS_TERMINATE, False, pid)
        if not handle:
            return False
        ok = kernel32.AssignProcessToJobObject(job, handle)
        kernel32.CloseHandle(handle)
        return bool(ok)
    except Exception as e:
        log(f"AssignProcessToJobObject error: {e}")
        return False


class ASFProcess:
    def __init__(self, exe, extra_args=None, use_job_object=False):
        self.exe = exe
        self.extra_args = extra_args or []
        self.use_job_object = bool(use_job_object)
        self.proc = None
        self.job = None
        self.replaced_by_self_update = False

    def start(self):



        cmd = [self.exe, "--SERVICE"] + list(self.extra_args)
        flags = 0
        if os.name == "nt":
            flags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
        log(f"Запуск ASF: {' '.join(cmd)}")
        log(f"  рабочая папка: {Path(self.exe).parent}")
        try:
            launch_log = DATA_DIR / "asf-launch.log"
            launch_log.parent.mkdir(parents=True, exist_ok=True)
            with open(launch_log, "ab", buffering=0) as output:
                output.write((f"\n=== ASF launch {time.strftime('%Y-%m-%d %H:%M:%S')} ===\n").encode("utf-8"))
                kwargs = dict(
                    cwd=str(Path(self.exe).parent),
                    creationflags=flags,
                    stdin=subprocess.DEVNULL,
                    stdout=output,
                    stderr=subprocess.STDOUT,
                )
                if os.name != "nt":
                    kwargs["start_new_session"] = True
                self.proc = subprocess.Popen(cmd, **kwargs)
            self.replaced_by_self_update = False
            log(f"  ASF PID: {self.proc.pid}; startup output: {launch_log}")



            if os.name == "nt" and self.use_job_object:
                self.job = _create_kill_job()
                if self.job and _assign_to_job(self.job, self.proc.pid):
                    log("  ASF attached to Job Object (explicitly enabled).")
                else:
                    log("  Job Object was not assigned; taskkill fallback will be used.")
        except Exception as e:
            log(f"  ОШИБКА запуска ASF: {e}")

    def alive(self):
        return self.replaced_by_self_update or (self.proc is not None and self.proc.poll() is None)

    def mark_self_update_successor(self):
        self.replaced_by_self_update = True

    def _stop_self_update_successor(self):

        if os.name != "nt":
            return
        try:
            target = _ps_quote(str(Path(self.exe).resolve()))
            script = (
                "$target=" + target + "; "
                "Get-CimInstance Win32_Process -Filter \"Name='ArchiSteamFarm.exe'\" | "
                "Where-Object { $_.ExecutablePath -eq $target } | "
                "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"
            )
            subprocess.run(["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script],
                           creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0), timeout=15,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
        except Exception as exc:
            log(f"ASF successor stop error: {exc}")

    def restart(self):
        old_pid = self.proc.pid if self.proc else None
        log(f"Перезапуск ASF после раннего завершения" + (f" (старый PID {old_pid})" if old_pid else "") + "...")
        try:
            if self.proc and self.proc.poll() is None:
                self.stop()
        except Exception:
            pass
        self._close_job()
        self.proc = None
        self.start()

    def stop(self):
        if not self.proc:
            return
        pid = self.proc.pid
        if self.proc.poll() is not None:
            if self.replaced_by_self_update:
                log("Stopping ASF self-update successor...")
                self._stop_self_update_successor()
            self.replaced_by_self_update = False
            self._close_job()
            return
        log(f"Остановка ASF (PID {pid})...")
        if os.name == "nt":
            try:
                subprocess.run(
                    ["taskkill", "/PID", str(pid), "/T", "/F"],
                    creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                    timeout=15, check=False,
                )
            except Exception as e:
                log(f"  taskkill error: {e}")
            try:
                self.proc.kill()
            except Exception:
                pass
            self._close_job()
        else:
            try:
                os.killpg(os.getpgid(pid), signal.SIGTERM)
                self.proc.wait(timeout=10)
            except Exception:
                try:
                    os.killpg(os.getpgid(pid), signal.SIGKILL)
                except Exception:
                    try:
                        self.proc.kill()
                    except Exception:
                        pass
        log("ASF остановлен.")

    def _close_job(self):
        if self.job:
            try:
                import ctypes
                ctypes.windll.kernel32.CloseHandle(self.job)
            except Exception:
                pass
            self.job = None


def _process_memory_bytes(pid):
    try:
        pid = int(pid)
    except Exception:
        return 0
    if os.name == "nt":
        try:
            import ctypes
            from ctypes import wintypes

            class PROCESS_MEMORY_COUNTERS(ctypes.Structure):
                _fields_ = [
                    ("cb", wintypes.DWORD),
                    ("PageFaultCount", wintypes.DWORD),
                    ("PeakWorkingSetSize", ctypes.c_size_t),
                    ("WorkingSetSize", ctypes.c_size_t),
                    ("QuotaPeakPagedPoolUsage", ctypes.c_size_t),
                    ("QuotaPagedPoolUsage", ctypes.c_size_t),
                    ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t),
                    ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
                    ("PagefileUsage", ctypes.c_size_t),
                    ("PeakPagefileUsage", ctypes.c_size_t),
                ]

            kernel32 = ctypes.windll.kernel32
            psapi = ctypes.windll.psapi
            handle = kernel32.OpenProcess(0x1000 | 0x0010, False, pid)
            if not handle:
                return 0
            try:
                counters = PROCESS_MEMORY_COUNTERS()
                counters.cb = ctypes.sizeof(counters)
                if psapi.GetProcessMemoryInfo(handle, ctypes.byref(counters), counters.cb):
                    return int(counters.WorkingSetSize)
            finally:
                kernel32.CloseHandle(handle)
        except Exception:
            return 0
    try:
        parts = Path(f"/proc/{pid}/statm").read_text(encoding="utf-8").split()
        if len(parts) >= 2:
            return int(parts[1]) * os.sysconf("SC_PAGE_SIZE")
    except Exception:
        pass
    return 0


def _child_process_map():
    result = {}
    if os.name == "nt":
        try:
            import ctypes
            from ctypes import wintypes

            class PROCESSENTRY32W(ctypes.Structure):
                _fields_ = [
                    ("dwSize", wintypes.DWORD),
                    ("cntUsage", wintypes.DWORD),
                    ("th32ProcessID", wintypes.DWORD),
                    ("th32DefaultHeapID", ctypes.c_size_t),
                    ("th32ModuleID", wintypes.DWORD),
                    ("cntThreads", wintypes.DWORD),
                    ("th32ParentProcessID", wintypes.DWORD),
                    ("pcPriClassBase", ctypes.c_long),
                    ("dwFlags", wintypes.DWORD),
                    ("szExeFile", wintypes.WCHAR * 260),
                ]

            kernel32 = ctypes.windll.kernel32
            snapshot = kernel32.CreateToolhelp32Snapshot(0x00000002, 0)
            invalid = ctypes.c_void_p(-1).value
            if snapshot == invalid:
                return result
            try:
                entry = PROCESSENTRY32W()
                entry.dwSize = ctypes.sizeof(entry)
                current = kernel32.Process32FirstW(snapshot, ctypes.byref(entry))
                while current:
                    result.setdefault(int(entry.th32ParentProcessID), []).append(int(entry.th32ProcessID))
                    current = kernel32.Process32NextW(snapshot, ctypes.byref(entry))
            finally:
                kernel32.CloseHandle(snapshot)
        except Exception:
            pass
        return result
    try:
        for path in Path("/proc").iterdir():
            if not path.name.isdigit():
                continue
            try:
                stat = (path / "stat").read_text(encoding="utf-8", errors="ignore")
                rest = stat[stat.rfind(")") + 2:].split()
                parent = int(rest[1])
                result.setdefault(parent, []).append(int(path.name))
            except Exception:
                pass
    except Exception:
        pass
    return result


def _process_name_map():
    result = {}
    if os.name == "nt":
        try:
            import ctypes
            from ctypes import wintypes

            class PROCESSENTRY32W(ctypes.Structure):
                _fields_ = [
                    ("dwSize", wintypes.DWORD),
                    ("cntUsage", wintypes.DWORD),
                    ("th32ProcessID", wintypes.DWORD),
                    ("th32DefaultHeapID", ctypes.c_size_t),
                    ("th32ModuleID", wintypes.DWORD),
                    ("cntThreads", wintypes.DWORD),
                    ("th32ParentProcessID", wintypes.DWORD),
                    ("pcPriClassBase", ctypes.c_long),
                    ("dwFlags", wintypes.DWORD),
                    ("szExeFile", wintypes.WCHAR * 260),
                ]

            kernel32 = ctypes.windll.kernel32
            snapshot = kernel32.CreateToolhelp32Snapshot(0x00000002, 0)
            invalid = ctypes.c_void_p(-1).value
            if snapshot == invalid:
                return result
            try:
                entry = PROCESSENTRY32W()
                entry.dwSize = ctypes.sizeof(entry)
                current = kernel32.Process32FirstW(snapshot, ctypes.byref(entry))
                while current:
                    result[int(entry.th32ProcessID)] = str(entry.szExeFile).lower()
                    current = kernel32.Process32NextW(snapshot, ctypes.byref(entry))
            finally:
                kernel32.CloseHandle(snapshot)
        except Exception:
            pass
        return result
    try:
        for path in Path("/proc").iterdir():
            if path.name.isdigit():
                try:
                    result[int(path.name)] = (path / "comm").read_text(encoding="utf-8", errors="ignore").strip().lower()
                except Exception:
                    pass
    except Exception:
        pass
    return result


def _descendants(root_pid, process_map):
    result = []
    pending = [int(root_pid)]
    seen = set(pending)
    while pending:
        parent = pending.pop()
        for child in process_map.get(parent, []):
            if child not in seen:
                seen.add(child)
                result.append(child)
                pending.append(child)
    return result


def _webview2_pids_for_stats(process_map, name_map, descendants, include_orphans=True):
    descendants = set(descendants)
    webview_names = {"msedgewebview2.exe", "msedgewebview2"}
    found = {pid for pid in descendants if name_map.get(pid, "") in webview_names}
    orphan_mode = False
    if include_orphans:
        orphan = {pid for pid, name in name_map.items() if name in webview_names}
        if orphan - found:
            orphan_mode = True
        found.update(orphan)
    return found, orphan_mode


def app_memory_stats(asf_pid=None, exclude_pids=None, include_orphan_webview2=True):
    process_map = _child_process_map()
    name_map = _process_name_map()
    self_pid = os.getpid()
    app_pids = [self_pid] + _descendants(self_pid, process_map)
    webview_pids, orphan_mode = _webview2_pids_for_stats(
        process_map, name_map, _descendants(self_pid, process_map), include_orphan_webview2,
    )
    excluded = set()
    for value in list(exclude_pids or []) + ([asf_pid] if asf_pid else []):
        try:
            pid = int(value)
            excluded.add(pid)
            excluded.update(_descendants(pid, process_map))
        except Exception:
            pass
    app_pids = [pid for pid in app_pids if pid not in excluded]
    webview_pids = [pid for pid in webview_pids if pid not in excluded]
    app_bytes = sum(_process_memory_bytes(pid) for pid in app_pids)
    webview_bytes = sum(_process_memory_bytes(pid) for pid in webview_pids)
    return {
        "pid": self_pid,
        "pids": app_pids,
        "memoryBytes": app_bytes,
        "memoryKb": int(app_bytes / 1024),
        "selfMemoryKb": int(_process_memory_bytes(self_pid) / 1024),
        "webviewPids": list(webview_pids),
        "webviewMemoryKb": int(webview_bytes / 1024),
        "webviewOrphanMode": bool(orphan_mode),
        "asfPid": int(asf_pid) if asf_pid else None,
    }


def ipc_ready(host, port):
    hosts = [host]
    for candidate in ("127.0.0.1", "::1"):
        if candidate not in hosts:
            hosts.append(candidate)
    for candidate in hosts:
        try:
            with socket.create_connection((candidate, port), timeout=2):
                return True
        except OSError:
            pass
    return False


def _normalize_version(v):
    v = str(v or "").strip()
    if v.lower().startswith("v"):
        v = v[1:]
    return v


def _version_tuple(v):
    parts = []
    for x in _normalize_version(v).replace("-", ".").split("."):
        try:
            parts.append(int("".join(ch for ch in x if ch.isdigit()) or "0"))
        except Exception:
            parts.append(0)
    while len(parts) < 3:
        parts.append(0)
    return tuple(parts[:4])


def _best_release_asset(release):
    assets = release.get("assets") or []
    if not assets:
        return release.get("zipball_url") or release.get("html_url")
    preferred_ext = (".exe", ".msi", ".zip", ".7z")
    for ext in preferred_ext:
        for a in assets:
            name = (a.get("name") or "").lower()
            if name.endswith(ext) and a.get("browser_download_url"):
                return a.get("browser_download_url")
    for a in assets:
        if a.get("browser_download_url"):
            return a.get("browser_download_url")
    return release.get("zipball_url") or release.get("html_url")


def check_github_update():
    result = {
        "ok": False,
        "update": False,
        "currentVersion": APP_VERSION,
        "repo": GITHUB_REPO,
        "message": "Не удалось проверить обновления.",
    }
    headers = {"User-Agent": f"{APP_NAME}/{APP_VERSION}", "Accept": "application/vnd.github+json"}
    current_tuple = _version_tuple(APP_VERSION)
    try:
        request = urllib.request.Request(f"https://api.github.com/repos/{GITHUB_REPO}/releases?per_page=30", headers=headers)
        with urllib.request.urlopen(request, timeout=8) as response:
            releases = json.loads(response.read().decode("utf-8", "ignore"))
        candidates = []
        for release in releases if isinstance(releases, list) else []:
            if release.get("draft"):
                continue
            version = _normalize_version(release.get("tag_name") or release.get("name") or "")
            if version:
                candidates.append((_version_tuple(version), version, release))
        if candidates:
            candidates.sort(key=lambda item: item[0], reverse=True)
            latest_tuple, latest_version, latest_release = candidates[0]
            update = latest_tuple > current_tuple
            return {
                "ok": True,
                "source": "release",
                "update": update,
                "currentVersion": APP_VERSION,
                "latestVersion": latest_version,
                "url": latest_release.get("html_url") or f"https://github.com/{GITHUB_REPO}/releases/latest",
                "downloadUrl": _best_release_asset(latest_release),
                "message": f"Доступна новая версия BetterASF v{latest_version}" if update else f"BetterASF v{APP_VERSION} — актуальная версия.",
            }
    except Exception as exc:
        log(f"GitHub update releases error: {exc}")
    try:
        request = urllib.request.Request(f"https://api.github.com/repos/{GITHUB_REPO}/tags?per_page=30", headers=headers)
        with urllib.request.urlopen(request, timeout=8) as response:
            tags = json.loads(response.read().decode("utf-8", "ignore"))
        candidates = []
        for tag in tags if isinstance(tags, list) else []:
            version = _normalize_version(tag.get("name") or "")
            if version:
                candidates.append((_version_tuple(version), version, tag))
        if candidates:
            candidates.sort(key=lambda item: item[0], reverse=True)
            latest_tuple, latest_version, tag = candidates[0]
            update = latest_tuple > current_tuple
            return {
                "ok": True,
                "source": "tag",
                "update": update,
                "currentVersion": APP_VERSION,
                "latestVersion": latest_version,
                "url": f"https://github.com/{GITHUB_REPO}/releases/latest",
                "downloadUrl": f"https://github.com/{GITHUB_REPO}/archive/refs/tags/{tag.get('name')}.zip",
                "message": f"Доступен новый тег BetterASF v{latest_version}" if update else f"BetterASF v{APP_VERSION} — актуальная версия.",
            }
    except Exception as exc:
        log(f"GitHub update tags error: {exc}")
        result["error"] = str(exc)
    return result


def _download_file(url, target):
    headers = {"User-Agent": f"{APP_NAME}/{APP_VERSION}"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as r:
        target.parent.mkdir(parents=True, exist_ok=True)
        tmp = target.with_suffix(target.suffix + ".part")
        with open(tmp, "wb") as f:
            while True:
                chunk = r.read(1024 * 256)
                if not chunk:
                    break
                f.write(chunk)
        try:
            tmp.replace(target)
        except Exception:
            if target.exists():
                target.unlink()
            tmp.rename(target)
    return target


def install_github_update(exit_callback=None):

    info = check_github_update()
    if not info.get("ok"):
        return {"ok": False, "message": info.get("message") or "Update check failed."}
    if not info.get("update"):
        return {"ok": False, "message": "No newer BetterASF release is available."}

    url = info.get("downloadUrl") or info.get("url")
    if not url:
        return {"ok": False, "message": "GitHub release does not provide a downloadable asset."}
    if ".exe" not in url.lower().split("?")[0]:
        return {
            "ok": False,
            "message": "The latest release asset is not an .exe file. Open GitHub and update manually.",
            "url": info.get("url"),
            "downloadUrl": url,
        }
    if os.name != "nt":
        return {"ok": False, "message": "Automatic replacement is supported only on Windows."}

    pf = os.environ.get("ProgramFiles") or os.environ.get("PROGRAMFILES")
    if not pf:
        return {"ok": False, "message": "ProgramFiles environment variable is missing."}

    try:
        version = _normalize_version(info.get("latestVersion") or "latest") or "latest"
        updates_dir = DATA_DIR / "updates"
        downloaded = updates_dir / f"BetterASF-{version}.exe"
        install_dir = Path(pf) / APP_NAME
        dst = install_dir / f"{APP_NAME}.exe"
        update_log = DATA_DIR / "update.log"

        import base64
        ps = f"""
$ErrorActionPreference = 'Stop'
$Host.UI.RawUI.WindowTitle = 'BetterASF Updater'
Clear-Host
Write-Host 'BetterASF updater started...' -ForegroundColor Cyan
$url = {_ps_quote(url)}
$download = {_ps_quote(downloaded)}
$dstDir = {_ps_quote(install_dir)}
$dst = {_ps_quote(dst)}
$oldPid = {os.getpid()}
$log = {_ps_quote(update_log)}
function Log($m) {{
    try {{
        $dir = Split-Path -Parent $log
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Add-Content -LiteralPath $log -Encoding UTF8 -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + ' ' + $m)
    }} catch {{}}
}}
function Download-WithProgress($source, $target) {{
    Write-Host '[1/4] Downloading BetterASF update...' -ForegroundColor Cyan
    Write-Host ('URL: ' + $source)
    $dir = Split-Path -Parent $target
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $tmp = $target + '.part'
    if (Test-Path -LiteralPath $tmp) {{ Remove-Item -LiteralPath $tmp -Force }}
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
    $req = [Net.HttpWebRequest]::Create($source)
    $req.UserAgent = 'BetterASF-Updater'
    $res = $req.GetResponse()
    try {{
        $total = [int64]$res.ContentLength
        $input = $res.GetResponseStream()
        $output = [IO.File]::Open($tmp, [IO.FileMode]::Create, [IO.FileAccess]::Write, [IO.FileShare]::None)
        try {{
            $buffer = New-Object byte[] 1048576
            [int64]$readTotal = 0
            $lastShown = -1
            while (($read = $input.Read($buffer, 0, $buffer.Length)) -gt 0) {{
                $output.Write($buffer, 0, $read)
                $readTotal += $read
                if ($total -gt 0) {{
                    $pct = [int](($readTotal * 100) / $total)
                    Write-Progress -Activity 'Downloading BetterASF' -Status ($pct.ToString() + '%') -PercentComplete $pct
                    if ($pct -ge ($lastShown + 10)) {{
                        Write-Host ('  ' + $pct + '%')
                        $lastShown = $pct
                    }}
                }} else {{
                    Write-Progress -Activity 'Downloading BetterASF' -Status ($readTotal.ToString() + ' bytes')
                }}
            }}
        }} finally {{
            if ($output) {{ $output.Dispose() }}
            if ($input) {{ $input.Dispose() }}
        }}
    }} finally {{
        if ($res) {{ $res.Dispose() }}
    }}
    Move-Item -LiteralPath $tmp -Destination $target -Force
    Write-Progress -Activity 'Downloading BetterASF' -Completed
    Write-Host '[1/4] Download complete.' -ForegroundColor Green
}}
try {{
    Log 'Update started.'
    Log ('Download URL: ' + $url)
    Log ('Target exe: ' + $dst)

    Write-Host 'BetterASF updater' -ForegroundColor Cyan
    Write-Host 'The current BetterASF and ASF processes will be closed before installation.'
    Write-Host ''

    Write-Host '[0/4] Waiting for BetterASF to close...' -ForegroundColor Cyan
    try {{ Wait-Process -Id $oldPid -Timeout 90 -ErrorAction SilentlyContinue }} catch {{}}
    Start-Sleep -Milliseconds 1200

    Download-WithProgress $url $download

    Write-Host '[2/4] Preparing Program Files directory...' -ForegroundColor Cyan
    New-Item -ItemType Directory -Force -Path $dstDir | Out-Null

    Write-Host '[3/4] Installing update...' -ForegroundColor Cyan
    Copy-Item -LiteralPath $download -Destination $dst -Force
    try {{ Unblock-File -LiteralPath $dst -ErrorAction SilentlyContinue }} catch {{}}
    Log 'Copy succeeded.'

    Write-Host '[4/4] Starting updated BetterASF...' -ForegroundColor Cyan
    $env:BETTERASF_NO_SELF_INSTALL = '1'
    Start-Process -FilePath $dst -WorkingDirectory $dstDir
    Log 'Updated BetterASF started.'
    try {{ Remove-Item -LiteralPath $download -Force -ErrorAction SilentlyContinue }} catch {{}}
    Write-Host 'Done. This window will close in 3 seconds.' -ForegroundColor Green
    Start-Sleep -Seconds 3
}} catch {{
    $msg = $_.Exception.Message
    Log ('Fatal: ' + $msg)
    Write-Host ''
    Write-Host ('Update failed: ' + $msg) -ForegroundColor Red
    Write-Host ('Log: ' + $log) -ForegroundColor Yellow
    Read-Host 'Press Enter to close'
}}
"""
        script_path = updates_dir / "update-betterasf.ps1"
        script_path.parent.mkdir(parents=True, exist_ok=True)
        script_path.write_text(ps, encoding="utf-8-sig")
        params = f'-NoProfile -ExecutionPolicy Bypass -File "{script_path}"'
        import ctypes
        rc = ctypes.windll.shell32.ShellExecuteW(None, "runas", "powershell.exe", params, None, 1)
        if int(rc) <= 32:
            return {"ok": False, "message": f"Elevation was not started, ShellExecute={int(rc)}"}

        log(f"Updater: elevated updater started, script={script_path}, log={update_log}")
        return {"ok": True, "message": "Updater started. BetterASF and ASF will close now.", "version": version}
    except Exception as e:
        log(f"Updater error: {e}")
        return {"ok": False, "message": str(e)}



def _merge_plugin_catalog(base, incoming):
    by_id = {item["id"]: item for item in base}
    ordered = []
    for item in incoming:
        by_id[item["id"]] = item
        ordered.append(item["id"])
    for item in base:
        if item["id"] not in ordered:
            ordered.append(item["id"])
    return tuple(by_id[item_id] for item_id in ordered)


def _valid_plugin_catalog(payload):

    raw = payload.get("plugins") if isinstance(payload, dict) else payload
    if not isinstance(raw, list):
        return None
    result = []
    seen = set()
    for entry in raw[:30]:
        if not isinstance(entry, dict):
            return None
        if entry.get("betterasf_compatible") is not True:
            continue
        plugin_id = str(entry.get("id") or "").strip()
        name = str(entry.get("name") or "").strip()
        repository = str(entry.get("repository") or "").strip()
        if (not plugin_id or not name or not repository or plugin_id in seen or
                not all(ch.isalnum() or ch in "-_." for ch in plugin_id) or
                repository.count("/") != 1 or
                not all(ch.isalnum() or ch in "-_./" for ch in repository)):
            return None
        source = {
            "id": plugin_id,
            "name": name[:120],
            "repository": repository,
            "description": str(entry.get("description") or "").strip()[:800],
        }
        prefix = str(entry.get("asset_prefix") or "").strip()
        if prefix:
            source["asset_prefix"] = prefix[:160]
        result.append(source)
        seen.add(plugin_id)
    return tuple(result) if result else None


def _packaged_plugin_catalog():
    for path in (RES_DIR / PLUGIN_CATALOG_FILENAME, APP_DIR / PLUGIN_CATALOG_FILENAME, HERE / PLUGIN_CATALOG_FILENAME):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            sources = _valid_plugin_catalog(data)
            if sources:
                return sources
        except Exception:
            continue
    return tuple(DEFAULT_PLUGIN_STORE_SOURCES)


def _read_catalog_cache():
    try:
        data = json.loads(PLUGIN_CATALOG_CACHE_FILE.read_text(encoding="utf-8"))
        sources = _valid_plugin_catalog(data)
        if sources:
            return str(data.get("etag") or ""), _merge_plugin_catalog(DEFAULT_PLUGIN_STORE_SOURCES, sources)
    except Exception:
        pass
    return "", _merge_plugin_catalog(DEFAULT_PLUGIN_STORE_SOURCES, _packaged_plugin_catalog())


def _write_catalog_cache(etag, sources):
    try:
        payload = {"etag": str(etag or ""), "plugins": list(sources)}
        PLUGIN_CATALOG_CACHE_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception as exc:
        log(f"Plugin catalogue cache write error: {exc}")


def load_plugin_catalog():

    global PLUGIN_STORE_SOURCES
    with _PLUGIN_CATALOG_LOCK:
        if not _PLUGIN_CATALOG_STATE["loaded"]:
            etag, sources = _read_catalog_cache()
            _PLUGIN_CATALOG_STATE.update({"loaded": True, "etag": etag, "sources": sources})
            PLUGIN_STORE_SOURCES = sources

        previous = _PLUGIN_CATALOG_STATE["sources"]
        previous_etag = _PLUGIN_CATALOG_STATE["etag"]
        headers = {"User-Agent": f"{APP_NAME}/{APP_VERSION} plugin-catalog", "Accept": "application/json"}
        if _PLUGIN_CATALOG_STATE["etag"]:
            headers["If-None-Match"] = _PLUGIN_CATALOG_STATE["etag"]
        try:
            request = urllib.request.Request(PLUGIN_CATALOG_URL, headers=headers)
            with urllib.request.urlopen(request, timeout=12) as response:
                payload = json.loads(response.read().decode("utf-8", "ignore"))
                sources = _valid_plugin_catalog(payload)
                if not sources:
                    return previous, False, False
                sources = _merge_plugin_catalog(DEFAULT_PLUGIN_STORE_SOURCES, sources)
                etag = response.headers.get("ETag") or ""
        except urllib.error.HTTPError as exc:


            if exc.code == 304:
                return previous, False, True
            return previous, False, False
        except Exception as exc:
            log(f"Plugin catalogue refresh error: {exc}")
            return previous, False, False

        changed = sources != previous
        _PLUGIN_CATALOG_STATE.update({"etag": etag, "sources": sources})
        PLUGIN_STORE_SOURCES = sources
        if changed:
            with _PLUGIN_STORE_LOCK:
                _PLUGIN_STORE_CACHE.update({"at": 0.0, "items": [], "error": ""})
            _write_catalog_cache(etag, sources)
            log(f"Plugin catalogue updated: {len(sources)} entries.")
        elif etag and etag != previous_etag:
            _write_catalog_cache(etag, sources)
        return sources, changed, False


def _github_json(url, timeout=15):
    request = urllib.request.Request(url, headers={
        "User-Agent": f"{APP_NAME}/{APP_VERSION} plugin-store",
        "Accept": "application/vnd.github+json",
    })
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8", "ignore"))


def _catalog_asset(release, source):
    prefix = str(source.get("asset_prefix") or "").lower()
    assets = release.get("assets") or []
    candidates = []
    for asset in assets:
        name = str(asset.get("name") or "")
        lower = name.lower()
        if not lower.endswith(".zip") or not asset.get("browser_download_url"):
            continue
        if prefix and not lower.startswith(prefix):
            continue
        candidates.append(asset)
    if not candidates and not prefix:
        candidates = [a for a in assets if str(a.get("name") or "").lower().endswith(".zip") and a.get("browser_download_url")]
    return candidates[0] if candidates else None


def get_plugin_store(force=False):

    sources, catalogue_changed, catalogue_unchanged = load_plugin_catalog()
    now = time.time()
    with _PLUGIN_STORE_LOCK:


        if not catalogue_changed and _PLUGIN_STORE_CACHE["items"]:
            return {"ok": True, "items": _PLUGIN_STORE_CACHE["items"], "cached": True, "catalogueUnchanged": catalogue_unchanged}

    items = []
    errors = []
    for source in sources:
        item = dict(source)
        repository = source["repository"]
        try:



            repo = _github_json(f"https://api.github.com/repos/{repository}")
            release = _github_json(f"https://api.github.com/repos/{repository}/releases/latest")
            asset = _catalog_asset(release, source)
            item.update({
                "name": source["name"] if source.get("asset_prefix") else (repo.get("name") or source["name"]),
                "description": source["description"] if source.get("asset_prefix") else (repo.get("description") or source["description"]),
                "repositoryUrl": repo.get("html_url") or f"https://github.com/{repository}",
                "author": (repo.get("owner") or {}).get("login") or repository.split("/", 1)[0],
                "stars": int(repo.get("stargazers_count") or 0),
                "version": release.get("tag_name") or "—",
                "releaseUrl": release.get("html_url") or f"https://github.com/{repository}",
                "available": bool(asset),
                "assetName": asset.get("name") if asset else "",
            })
        except Exception as exc:
            item.update({
                "repositoryUrl": f"https://github.com/{repository}",
                "author": repository.split("/", 1)[0],
                "version": "—",
                "available": False,
                "error": str(exc),
            })
            errors.append(f"{item['name']}: {exc}")
        items.append(item)

    with _PLUGIN_STORE_LOCK:
        _PLUGIN_STORE_CACHE.update({"at": now, "items": items, "error": "; ".join(errors[:2])})
    return {"ok": True, "items": items, "cached": False, "warning": "; ".join(errors[:2])}


def get_popular_games(force=False):

    now = time.time()
    with _POPULAR_GAMES_LOCK:
        if not force and _POPULAR_GAMES_CACHE["games"] and now - _POPULAR_GAMES_CACHE["at"] < 10 * 60:
            return {"ok": True, "games": _POPULAR_GAMES_CACHE["games"], "cached": True}
    try:
        data = _github_json("https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/", timeout=12)
        ranks = (data.get("response") or {}).get("ranks") or []
        games = []
        for rank in ranks:
            try:
                app_id = int(rank.get("appid"))
            except Exception:
                continue
            if app_id > 0:
                games.append({"appID": app_id, "rank": int(rank.get("rank") or len(games) + 1), "players": int(rank.get("peak_in_game") or 0)})
        if not games:
            raise RuntimeError("Steam returned an empty popularity list")
        with _POPULAR_GAMES_LOCK:
            _POPULAR_GAMES_CACHE.update({"at": now, "games": games, "error": ""})
        return {"ok": True, "games": games, "cached": False}
    except Exception as exc:
        log(f"Steam popularity list error: {exc}")
        return {"ok": False, "games": [], "message": str(exc)}


class ASFPluginManager:

    MAX_DOWNLOAD_BYTES = 128 * 1024 * 1024
    MAX_UNPACKED_BYTES = 384 * 1024 * 1024
    MAX_ARCHIVE_MEMBERS = 4000

    def __init__(self, runtime_dir_provider, maintenance_runner=None):
        self.runtime_dir_provider = runtime_dir_provider
        self.maintenance_runner = maintenance_runner
        self.lock = threading.RLock()

    def _runtime_dir(self):
        runtime = self.runtime_dir_provider() if self.runtime_dir_provider else None
        return Path(runtime).resolve() if runtime else None

    @staticmethod
    def _safe_name(value):
        value = "".join(ch for ch in str(value or "") if ch.isalnum() or ch in "-_.")
        return value.strip(".")[:96]

    def _plugins_dir(self):
        runtime = self._runtime_dir()
        if not runtime:
            raise RuntimeError("ASF runtime is not available yet")
        target = runtime / "plugins"
        target.mkdir(parents=True, exist_ok=True)
        return target.resolve()

    @staticmethod
    def _assembly_plugin_name(dlls):

        for dll in dlls:
            key = "".join(ch for ch in dll.stem.lower() if ch.isalnum())
            if key in OFFICIAL_PLUGIN_DISPLAY_NAMES:
                return OFFICIAL_PLUGIN_DISPLAY_NAMES[key]


        for dll in dlls:
            if not dll.stem.lower().endswith(".resources"):
                return dll.stem
        return ""

    def library(self):
        try:
            root = self._plugins_dir()
        except Exception as exc:
            return {"ok": False, "items": [], "message": str(exc)}
        catalog_ids = {self._safe_name(x["id"]): x for x in PLUGIN_STORE_SOURCES}
        items = []
        try:
            for path in sorted(root.iterdir(), key=lambda x: x.name.lower()):
                if not path.is_dir():
                    continue
                dlls = list(path.rglob("*.dll"))
                source = catalog_ids.get(path.name)


                inferred_name = self._assembly_plugin_name(dlls)
                items.append({
                    "id": path.name,
                    "name": source["name"] if source else (inferred_name or "Plugin"),
                    "directory": path.name,
                    "managed": bool(source),
                    "assemblyNames": [dll.name for dll in dlls if not dll.stem.lower().endswith(".resources")],
                    "files": len(dlls),
                    "size": sum(x.stat().st_size for x in path.rglob("*") if x.is_file()),
                })
        except Exception as exc:
            return {"ok": False, "items": [], "message": str(exc)}
        return {"ok": True, "items": items, "runtime": str(root.parent)}

    @staticmethod
    def _download_asset(asset, target):
        url = asset.get("browser_download_url")
        if not url:
            raise RuntimeError("The GitHub release does not provide a ZIP asset")
        request = urllib.request.Request(url, headers={"User-Agent": f"{APP_NAME}/{APP_VERSION} plugin-store"})
        digest = hashlib.sha256()
        count = 0
        with urllib.request.urlopen(request, timeout=60) as response, open(target, "wb") as out:
            while True:
                block = response.read(1024 * 256)
                if not block:
                    break
                count += len(block)
                if count > ASFPluginManager.MAX_DOWNLOAD_BYTES:
                    raise RuntimeError("Plugin archive is larger than the 128 MB safety limit")
                digest.update(block)
                out.write(block)
        expected = str(asset.get("digest") or "")
        if expected.lower().startswith("sha256:") and digest.hexdigest().lower() != expected.split(":", 1)[1].lower():
            raise RuntimeError("GitHub release asset SHA-256 verification failed")

    @classmethod
    def _extract_archive(cls, archive_path, staging):
        with zipfile.ZipFile(archive_path) as archive:
            members = [x for x in archive.infolist() if not x.is_dir()]
            if len(members) > cls.MAX_ARCHIVE_MEMBERS:
                raise RuntimeError("Plugin archive contains too many files")
            total = sum(max(0, x.file_size) for x in members)
            if total > cls.MAX_UNPACKED_BYTES:
                raise RuntimeError("Plugin archive exceeds the 384 MB unpacked safety limit")
            root = staging.resolve()
            for member in members:
                destination = (root / member.filename).resolve()
                try:
                    destination.relative_to(root)
                except ValueError:
                    raise RuntimeError("Unsafe path found in plugin archive")
                destination.parent.mkdir(parents=True, exist_ok=True)
                with archive.open(member) as inp, open(destination, "wb") as out:
                    shutil.copyfileobj(inp, out)
        folders = [x for x in staging.iterdir() if x.is_dir()]
        files = [x for x in staging.iterdir() if x.is_file()]

        if len(folders) == 1 and not files:
            return folders[0]
        return staging

    def _run_maintenance(self, operation):
        if self.maintenance_runner:
            return self.maintenance_runner(operation)
        return operation()

    def install(self, plugin_id):
        load_plugin_catalog()
        plugin_id = self._safe_name(plugin_id)
        source = next((x for x in PLUGIN_STORE_SOURCES if x["id"] == plugin_id), None)
        if not source:
            return {"ok": False, "message": "Unknown plugin catalogue identifier."}
        with self.lock:
            try:
                release = _github_json(f"https://api.github.com/repos/{source['repository']}/releases/latest")
                asset = _catalog_asset(release, source)
                if not asset:
                    return {"ok": False, "message": "No compatible ZIP asset was found in the latest GitHub release."}
                with tempfile.TemporaryDirectory(prefix="betterasf-plugin-", dir=str(DATA_DIR)) as tmp:
                    tmp_path = Path(tmp)
                    archive = tmp_path / "plugin.zip"
                    self._download_asset(asset, archive)
                    unpacked = self._extract_archive(archive, tmp_path / "unpacked")
                    if not list(unpacked.rglob("*.dll")):
                        return {"ok": False, "message": "The GitHub ZIP does not contain a plugin DLL; it was not installed."}
                    root = self._plugins_dir()
                    destination = root / plugin_id
                    def replace_plugin():
                        backup = root / f".{plugin_id}.backup"
                        if backup.exists():
                            shutil.rmtree(backup, ignore_errors=True)
                        if destination.exists():
                            destination.replace(backup)
                        try:
                            shutil.copytree(unpacked, destination)
                        except Exception:
                            if backup.exists() and not destination.exists():
                                backup.replace(destination)
                            raise
                        shutil.rmtree(backup, ignore_errors=True)
                        return {"ok": True, "message": f"{source['name']} installed. ASF was restarted to load it.", "restartRequired": False}
                    return self._run_maintenance(replace_plugin)
            except Exception as exc:
                log(f"Plugin install error ({plugin_id}): {exc}")
                return {"ok": False, "message": str(exc)}

    def remove(self, directory):
        directory = self._safe_name(directory)
        if not directory:
            return {"ok": False, "message": "Invalid plugin directory."}
        with self.lock:
            try:
                root = self._plugins_dir()
                target = (root / directory).resolve()
                target.relative_to(root)
                if not target.exists() or not target.is_dir():
                    return {"ok": False, "message": "Plugin directory was not found."}
                def remove_plugin():
                    shutil.rmtree(target)
                    return {"ok": True, "message": "Plugin removed. ASF was restarted."}
                return self._run_maintenance(remove_plugin)
            except Exception as exc:
                log(f"Plugin removal error ({directory}): {exc}")
                return {"ok": False, "message": str(exc)}

class SteamMetadataService:
    def __init__(self, api_key_provider):
        self.api_key_provider = api_key_provider
        self.lock = threading.RLock()
        self.catalog = {}
        self.loaded = False

    def _load_catalog(self):
        if self.loaded:
            return
        self.loaded = True
        try:
            data = json.loads(STEAM_APP_CATALOG_FILE.read_text(encoding="utf-8"))
            self.catalog = {str(appid): str(name) for appid, name in data.items() if str(appid).isdigit() and str(name)}
        except Exception:
            self.catalog = {}

    def _save_catalog(self):
        try:
            STEAM_APP_CATALOG_FILE.write_text(json.dumps(self.catalog, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        except Exception:
            pass

    def add_names(self, games):
        changed = False
        with self.lock:
            self._load_catalog()
            for game in games or []:
                try:
                    appid = int(game.get("appid") if isinstance(game, dict) else game[0])
                except Exception:
                    continue
                name = str(game.get("name") if isinstance(game, dict) else game[1] if len(game) > 1 else "").strip()
                if appid > 0 and name and self.catalog.get(str(appid)) != name:
                    self.catalog[str(appid)] = name
                    changed = True
            if changed:
                self._save_catalog()

    def owned_games(self, steam_id):
        key = str(self.api_key_provider() or "").strip()
        if not key or not steam_id:
            return []
        url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=%s&steamid=%s&include_played_free_games=1&include_appinfo=1&format=json" % (urllib.parse.quote(key), urllib.parse.quote(str(steam_id)))
        request = urllib.request.Request(url, headers={"User-Agent": f"{APP_NAME}/{APP_VERSION}"})
        with urllib.request.urlopen(request, timeout=15) as response:
            data = json.loads(response.read().decode("utf-8", "ignore"))
        games = (data.get("response") or {}).get("games") or []
        self.add_names(games)
        return games

    def metadata(self, appids, steam_id="", language="english"):
        clean = []
        for value in appids if isinstance(appids, (list, tuple, set)) else []:
            try:
                appid = int(value)
            except Exception:
                continue
            if appid > 0 and appid not in clean:
                clean.append(appid)
        clean = clean[:64]
        with self.lock:
            self._load_catalog()
            result = {str(appid): {"name": self.catalog.get(str(appid), "")} for appid in clean}
        missing = [appid for appid in clean if not result[str(appid)]["name"]]
        if missing and steam_id:
            try:
                self.owned_games(steam_id)
                with self.lock:
                    result.update({str(appid): {"name": self.catalog.get(str(appid), "")} for appid in missing})
            except Exception:
                pass
        missing = [appid for appid in clean if not result[str(appid)]["name"]]
        if missing:
            self._resolve_store_names(missing, language, result)
        return {"ok": True, "items": result}

    def _resolve_store_names(self, appids, language, result):
        allowed = {"english", "russian", "ukrainian"}
        language = language if language in allowed else "english"
        def fetch(appid):
            try:
                url = f"https://store.steampowered.com/api/appdetails?appids={appid}&l={language}"
                request = urllib.request.Request(url, headers={"User-Agent": f"{APP_NAME}/{APP_VERSION}"})
                with urllib.request.urlopen(request, timeout=7) as response:
                    data = json.loads(response.read().decode("utf-8", "ignore"))
                app = data.get(str(appid)) or {}
                details = app.get("data") if app.get("success") else {}
                return appid, str((details or {}).get("name") or "")
            except Exception:
                return appid, ""
        try:
            from concurrent.futures import ThreadPoolExecutor
            with ThreadPoolExecutor(max_workers=min(6, len(appids))) as executor:
                for appid, name in executor.map(fetch, appids):
                    result[str(appid)] = {"name": name}
                    if name:
                        self.add_names([{"appid": appid, "name": name}])
        except Exception:
            pass

    def cover(self, appid):
        try:
            appid = int(appid)
        except Exception:
            return None, ""
        if appid <= 0:
            return None, ""
        STEAM_COVERS_DIR.mkdir(parents=True, exist_ok=True)
        for extension, mime in ((".jpg", "image/jpeg"), (".png", "image/png"), (".webp", "image/webp")):
            path = STEAM_COVERS_DIR / f"{appid}{extension}"
            if path.is_file():
                try:
                    path.touch()
                except Exception:
                    pass
                return path, mime
        try:
            url = f"https://cdn.cloudflare.steamstatic.com/steam/apps/{appid}/header.jpg"
            request = urllib.request.Request(url, headers={"User-Agent": f"{APP_NAME}/{APP_VERSION}"})
            with urllib.request.urlopen(request, timeout=12) as response:
                raw = response.read(5 * 1024 * 1024 + 1)
            if not raw or len(raw) > 5 * 1024 * 1024:
                return None, ""
            if raw.startswith(b"\xff\xd8\xff"):
                extension, mime = ".jpg", "image/jpeg"
            elif raw.startswith(b"\x89PNG\r\n\x1a\n"):
                extension, mime = ".png", "image/png"
            elif len(raw) >= 12 and raw[:4] == b"RIFF" and raw[8:12] == b"WEBP":
                extension, mime = ".webp", "image/webp"
            else:
                return None, ""
            path = STEAM_COVERS_DIR / f"{appid}{extension}"
            temporary = path.with_suffix(path.suffix + ".part")
            temporary.write_bytes(raw)
            temporary.replace(path)
            self._prune_covers()
            return path, mime
        except Exception:
            return None, ""

    def _prune_covers(self):
        try:
            files = [path for path in STEAM_COVERS_DIR.iterdir() if path.is_file()]
            total = sum(path.stat().st_size for path in files)
            limit = 300 * 1024 * 1024
            if total <= limit:
                return
            for path in sorted(files, key=lambda item: item.stat().st_atime):
                if total <= limit:
                    break
                size = path.stat().st_size
                path.unlink(missing_ok=True)
                total -= size
        except Exception:
            pass


class SettingsService:
    def snapshot(self):
        data = _load_settings()
        return {
            "minimize_to_tray": bool(data.get("minimize_to_tray", False)),
            "autostart": bool(data.get("autostart", False)),
            "economy_mode": bool(data.get("economy_mode", False)),
            "auto_hour_farm_after_cards": bool(data.get("auto_hour_farm_after_cards", False)),
            "start_hour_farm_on_launch": bool(data.get("start_hour_farm_on_launch", False)),
            "launch_minimized": bool(data.get("launch_minimized", False)),
            "sidebar_collapsed": bool(data.get("sidebar_collapsed", False)),
            "language": str(data.get("language", "ru") or "ru"),
            "theme_full": str(data.get("theme_full", "") or ""),
            "hour_farm_priority_mode": str(data.get("hour_farm_priority_mode", "hours_desc") or "hours_desc"),
            "priority_hour_farm_appids": str(data.get("priority_hour_farm_appids", "") or ""),
            "hour_farm_max_games_by_bot": data.get("hour_farm_max_games_by_bot", {}) if isinstance(data.get("hour_farm_max_games_by_bot", {}), dict) else {},
            "steam_api_key": bool((RUNTIME.get("steam_api_key") or data.get("steam_api_key") or "").strip()),
        }

    def update(self, patch):
        if not isinstance(patch, dict):
            return {"ok": False, "message": "Invalid settings payload."}
        ok = True
        for key, value in patch.items():
            if key == "autostart":
                ok = bool(set_autostart_enabled(bool(value))) and ok
            elif key in ("minimize_to_tray", "economy_mode", "auto_hour_farm_after_cards", "start_hour_farm_on_launch", "launch_minimized", "sidebar_collapsed"):
                set_app_setting(key, bool(value))
            elif key == "language" and value in ("ru", "en", "uk"):
                set_app_setting(key, value)
            elif key == "theme_full" and value in ("dark", "light", "dark-img", "light-img", "custom"):
                set_app_setting(key, value)
            elif key == "hour_farm_priority_mode" and value in ("hours_asc", "hours_desc", "popular"):
                set_app_setting(key, value)
            elif key == "priority_hour_farm_appids":
                clean = "".join(char if (char.isdigit() or char in ",; \n\t") else " " for char in str(value or ""))
                set_app_setting(key, clean.strip())
            elif key == "hour_farm_max_games_by_bot":
                clean = {}
                if isinstance(value, dict):
                    for name, limit in value.items():
                        try:
                            clean[str(name)] = max(1, min(32, int(limit)))
                        except Exception:
                            clean[str(name)] = 32
                set_app_setting(key, clean)
            elif key == "steam_api_key":
                value = str(value or "").strip()
                RUNTIME["steam_api_key"] = value
                save_api_key(value)
            else:
                ok = False
        return {"ok": ok, "settings": self.snapshot()}


class ThemeService:
    def state(self):
        return custom_theme_state()

    def save(self, payload):
        return save_custom_theme(payload)


class EventLogService:
    def __init__(self):
        self.lock = threading.RLock()
        self.events = []
        self.next_id = 0
        self._load()

    def _load(self):
        try:
            lines = EVENT_LOG_FILE.read_text(encoding="utf-8", errors="ignore").splitlines()[-700:]
            for line in lines:
                item = json.loads(line)
                if isinstance(item, dict) and item.get("message"):
                    self.events.append(item)
                    self.next_id = max(self.next_id, int(item.get("id") or 0))
        except Exception:
            pass

    def record(self, message, level="info", source="ui", language=""):
        with self.lock:
            self.next_id += 1
            item = {"id": self.next_id, "time": int(time.time()), "message": str(message), "level": str(level), "source": str(source), "language": str(language)}
            self.events.append(item)
            if len(self.events) > 700:
                self.events = self.events[-700:]
            try:
                with open(EVENT_LOG_FILE, "a", encoding="utf-8") as file:
                    file.write(json.dumps(item, ensure_ascii=False) + "\n")
                if EVENT_LOG_FILE.stat().st_size > 2 * 1024 * 1024:
                    EVENT_LOG_FILE.write_text("\n".join(json.dumps(event, ensure_ascii=False) for event in self.events) + "\n", encoding="utf-8")
            except Exception:
                pass
            return item

    def status(self, since=0):
        with self.lock:
            return {"ok": True, "events": [event for event in self.events if event["id"] > int(since or 0)], "lastEventId": self.next_id}

    def clear(self):
        with self.lock:
            self.events = []
            self.next_id = 0
            try:
                EVENT_LOG_FILE.unlink(missing_ok=True)
            except Exception:
                pass
        return {"ok": True}


class CacheService:
    def __init__(self, steam_metadata_service=None, event_log_service=None):
        self.steam_metadata_service = steam_metadata_service
        self.event_log_service = event_log_service

    @staticmethod
    def _size(path):
        try:
            if path.is_file():
                return path.stat().st_size
            return sum(item.stat().st_size for item in path.rglob("*") if item.is_file())
        except Exception:
            return 0

    def status(self):
        return {
            "ok": True,
            "items": {
                "steam_names": self._size(STEAM_APP_CATALOG_FILE),
                "steam_covers": self._size(STEAM_COVERS_DIR),
                "plugin_catalog": self._size(PLUGIN_CATALOG_CACHE_FILE),
                "events": self._size(EVENT_LOG_FILE),
            },
        }

    def clear(self, name):
        targets = {
            "steam_names": STEAM_APP_CATALOG_FILE,
            "steam_covers": STEAM_COVERS_DIR,
            "plugin_catalog": PLUGIN_CATALOG_CACHE_FILE,
            "events": EVENT_LOG_FILE,
        }
        target = targets.get(name)
        if not target:
            return {"ok": False, "message": "Unknown cache target."}
        try:
            if name == "events" and self.event_log_service:
                return self.event_log_service.clear()
            if target.is_dir():
                shutil.rmtree(target, ignore_errors=True)
            else:
                target.unlink(missing_ok=True)
            if name == "steam_names" and self.steam_metadata_service:
                with self.steam_metadata_service.lock:
                    self.steam_metadata_service.catalog = {}
                    self.steam_metadata_service.loaded = False
            return {"ok": True}
        except Exception as exc:
            return {"ok": False, "message": str(exc)}


class DiagnosticsService:
    def __init__(self, bot_service, hour_farm_service, login_request_service, cache_service):
        self.bot_service = bot_service
        self.hour_farm_service = hour_farm_service
        self.login_request_service = login_request_service
        self.cache_service = cache_service

    def status(self):
        try:
            bots = self.bot_service.bots().get("bots") or {}
            bot_count = len(bots)
        except Exception as exc:
            bot_count = 0
            bots_error = str(exc)
        else:
            bots_error = ""
        runtime = find_asf_executable("")
        return {
            "ok": True,
            "app_version": APP_VERSION,
            "asf_runtime": runtime or "",
            "asf_ipc": ipc_ready("127.0.0.1", self.bot_service.port),
            "bot_count": bot_count,
            "bots_error": bots_error,
            "hour_farm": self.hour_farm_service.status(),
            "login_requests": self.login_request_service.status(),
            "cache": self.cache_service.status().get("items", {}),
            "log_files": {
                "debug": str(DATA_DIR / "debug-log.txt"),
                "launch": str(DATA_DIR / "asf-launch.log"),
            },
        }


class UpdateService:
    def __init__(self, bot_service):
        self.bot_service = bot_service

    def status(self):
        try:
            asf = self.bot_service.request("/Api/ASF").get("Result") or {}
        except Exception:
            asf = {}
        return {
            "ok": True,
            "betterasf": check_github_update(),
            "asf_version": asf.get("Version") if isinstance(asf, dict) else None,
            "plugin_catalog": {"count": len(PLUGIN_STORE_SOURCES)},
        }


class BotService:
    def __init__(self, host, port, password_provider):
        self.host = host
        self.port = int(port)
        self.password_provider = password_provider
        self.state_lock = threading.RLock()
        self.running_since = {}
        self.online_since = {}

    def _hosts(self):
        result = []
        for host in (self.host, "127.0.0.1", "localhost"):
            if host and host not in result:
                result.append(host)
        return result

    def request(self, path, method="GET", payload=None, timeout=10):
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        last_error = None
        for host in self._hosts():
            request = urllib.request.Request(f"http://{host}:{self.port}{path}", data=body, method=method)
            request.add_header("Content-Type", "application/json")
            password = self.password_provider() or ""
            if password:
                request.add_header("Authentication", password)
            try:
                with urllib.request.urlopen(request, timeout=timeout) as response:
                    raw = response.read().decode("utf-8", "ignore")
                    return json.loads(raw) if raw else {}
            except Exception as exc:
                last_error = exc
        raise RuntimeError(str(last_error or "ASF unavailable"))

    def bots(self):
        data = self.request("/Api/Bot/ASF")
        bots = data.get("Result") if isinstance(data, dict) else {}
        bots = bots if isinstance(bots, dict) else {}
        now = time.time()
        with self.state_lock:
            names = set(bots)
            self.running_since = {name: value for name, value in self.running_since.items() if name in names}
            self.online_since = {name: value for name, value in self.online_since.items() if name in names}
            for name, bot in bots.items():
                if not isinstance(bot, dict):
                    continue
                if bot.get("KeepRunning"):
                    self.running_since.setdefault(name, now)
                else:
                    self.running_since.pop(name, None)
                if bot.get("IsConnectedAndLoggedOn"):
                    self.online_since.setdefault(name, now)
                else:
                    self.online_since.pop(name, None)
                bot["BetterASFRunningSeconds"] = int(now - self.running_since[name]) if name in self.running_since else 0
                bot["BetterASFOnlineSeconds"] = int(now - self.online_since[name]) if name in self.online_since else 0
        return {"ok": True, "bots": bots}

    def profile(self, name):
        bots = self.bots().get("bots") or {}
        bot = bots.get(name)
        if not isinstance(bot, dict):
            return {"ok": False, "message": "Bot was not found."}
        return {"ok": True, "bot": bot}

    def action(self, name, action):
        bots = self.bots().get("bots") or {}
        bot = bots.get(name)
        if not isinstance(bot, dict):
            return {"ok": False, "message": "Bot was not found."}
        if action in ("enable", "disable"):
            config = dict(bot.get("BotConfig") or {})
            enabled = action == "enable"
            config["Enabled"] = enabled
            self.request("/Api/Bot/" + urllib.parse.quote(name), "POST", {"BotConfig": config})
            if not enabled and bot.get("KeepRunning"):
                self.request("/Api/Bot/" + urllib.parse.quote(name) + "/Stop", "POST", {})
            return {"ok": True, "enabled": enabled}
        paths = {
            "start": ("/Start", {}),
            "stop": ("/Stop", {}),
            "resume": ("/Resume", {}),
            "pause": ("/Pause", {"Permanent": True, "ResumeInSeconds": 0}),
            "reset": ("/Api/Command", {"Command": "reset " + name}),
        }
        if action not in paths:
            return {"ok": False, "message": "Unsupported bot action."}
        suffix, payload = paths[action]
        if action == "reset":
            self.request(suffix, "POST", payload)
        else:
            self.request("/Api/Bot/" + urllib.parse.quote(name) + suffix, "POST", payload)
        return {"ok": True, "action": action}

    def input(self, name, input_type, value):
        self.request("/Api/Bot/" + urllib.parse.quote(name) + "/Input", "POST", {"Type": int(input_type), "Value": str(value)})
        return {"ok": True}


class BotConfigService:
    def __init__(self, bot_service):
        self.bot_service = bot_service

    @staticmethod
    def _number(value, default, minimum=0, maximum=255):
        try:
            return max(minimum, min(maximum, int(value)))
        except Exception:
            return default

    @staticmethod
    def _bool(value, default=False):
        return bool(value) if value is not None else default

    def _existing_config(self, name):
        bots = self.bot_service.bots().get("bots") or {}
        bot = bots.get(name) or {}
        return dict(bot.get("BotConfig") or {}) if isinstance(bot, dict) else {}

    def _form(self, name, config):
        farming = int(config.get("FarmingPreferences") or 0)
        trading = int(config.get("TradingPreferences") or 0)
        behaviour = int(config.get("BotBehaviour") or 0)
        redeeming = int(config.get("RedeemingPreferences") or 0)
        limits = _load_settings().get("hour_farm_max_games_by_bot")
        try:
            hour_max = max(1, min(32, int((limits or {}).get(name, 32))))
        except Exception:
            hour_max = 32
        return {
            "name": name,
            "steam_login": config.get("SteamLogin") or "",
            "enabled": config.get("Enabled") is not False,
            "online_status": config.get("OnlineStatus", 1),
            "hours_until_cards": config.get("HoursUntilCardDrops", 3),
            "farm_paused": bool(farming & 1),
            "shutdown_after_farm": bool(farming & 2),
            "priority_only": bool(farming & 8),
            "skip_unplayed": bool(farming & 32),
            "accept_donations": bool(trading & 1),
            "matcher": bool(trading & 2),
            "match_all": bool(trading & 4),
            "no_bot_trades": bool(trading & 8),
            "match_actively": bool(trading & 16),
            "accept_gifts": bool(config.get("AcceptGifts")),
            "reject_friends": bool(behaviour & 1),
            "reject_trades": bool(behaviour & 2),
            "reject_groups": bool(behaviour & 4),
            "dismiss_notifications": bool(behaviour & 8),
            "mark_read": bool(behaviour & 16),
            "mark_self": bool(behaviour & 32),
            "no_incoming_trades": bool(behaviour & 64),
            "forwarding": bool(redeeming & 1),
            "distributing": bool(redeeming & 2),
            "keep_missing": bool(redeeming & 4),
            "assume_wallet": bool(redeeming & 8),
            "farm_order": (config.get("FarmingOrders") or [0])[0],
            "ui_mode": config.get("UserInterfaceMode", 0),
            "device": config.get("GamingDeviceType", 1),
            "trade_check": config.get("TradeCheckPeriod", 60),
            "send_trade": config.get("SendTradePeriod", 0),
            "trade_token": config.get("SteamTradeToken") or "",
            "machine": config.get("MachineName") or "",
            "custom_farm": config.get("CustomGamePlayedWhileFarming") or "",
            "custom_idle": config.get("CustomGamePlayedWhileIdle") or "",
            "idle_games": config.get("GamesPlayedWhileIdle") or [],
            "parental_code": config.get("SteamParentalCode") or "",
            "use_login_keys": config.get("UseLoginKeys") is not False,
            "hour_max": hour_max,
        }

    def form(self, name):
        return {"ok": True, "form": self._form(name, self._existing_config(name))}

    def save(self, fields):
        if not isinstance(fields, dict):
            return {"ok": False, "message": "Invalid bot form."}
        name = str(fields.get("name") or "").strip()
        if not re.fullmatch(r"[A-Za-z0-9_-]+", name):
            return {"ok": False, "message": "Bot name is invalid."}
        farming = (1 if self._bool(fields.get("farm_paused")) else 0) | (2 if self._bool(fields.get("shutdown_after_farm")) else 0) | (8 if self._bool(fields.get("priority_only")) else 0) | (32 if self._bool(fields.get("skip_unplayed")) else 0)
        trading = (1 if self._bool(fields.get("accept_donations")) else 0) | (2 if self._bool(fields.get("matcher")) else 0) | (4 if self._bool(fields.get("match_all")) else 0) | (8 if self._bool(fields.get("no_bot_trades")) else 0) | (16 if self._bool(fields.get("match_actively")) else 0)
        behaviour = (1 if self._bool(fields.get("reject_friends")) else 0) | (2 if self._bool(fields.get("reject_trades")) else 0) | (4 if self._bool(fields.get("reject_groups")) else 0) | (8 if self._bool(fields.get("dismiss_notifications")) else 0) | (16 if self._bool(fields.get("mark_read")) else 0) | (32 if self._bool(fields.get("mark_self")) else 0) | (64 if self._bool(fields.get("no_incoming_trades")) else 0)
        redeeming = (1 if self._bool(fields.get("forwarding")) else 0) | (2 if self._bool(fields.get("distributing")) else 0) | (4 if self._bool(fields.get("keep_missing")) else 0) | (8 if self._bool(fields.get("assume_wallet")) else 0)
        idle_games = []
        for value in fields.get("idle_games") or []:
            try:
                appid = int(value)
            except Exception:
                continue
            if appid > 0 and appid not in idle_games:
                idle_games.append(appid)
        config = {
            "Enabled": self._bool(fields.get("enabled"), True),
            "OnlineStatus": self._number(fields.get("online_status"), 1, 0, 7),
            "HoursUntilCardDrops": self._number(fields.get("hours_until_cards"), 3),
            "FarmingPreferences": farming,
            "TradingPreferences": trading,
            "BotBehaviour": behaviour,
            "RedeemingPreferences": redeeming,
            "AcceptGifts": self._bool(fields.get("accept_gifts")),
            "UseLoginKeys": self._bool(fields.get("use_login_keys"), True),
            "FarmingOrders": [self._number(fields.get("farm_order"), 0, 0, 8)],
            "UserInterfaceMode": self._number(fields.get("ui_mode"), 0, 0, 2),
            "GamingDeviceType": self._number(fields.get("device"), 1, 1, 4),
            "TradeCheckPeriod": self._number(fields.get("trade_check"), 60),
            "SendTradePeriod": self._number(fields.get("send_trade"), 0),
            "GamesPlayedWhileIdle": idle_games,
            "s_SteamMasterClanID": BETTERASF_CLAN_ID,
            "RemoteCommunication": 2,
        }
        string_fields = {
            "SteamLogin": fields.get("steam_login"),
            "SteamPassword": fields.get("steam_password"),
            "SteamTradeToken": fields.get("trade_token"),
            "MachineName": fields.get("machine"),
            "CustomGamePlayedWhileFarming": fields.get("custom_farm"),
            "CustomGamePlayedWhileIdle": fields.get("custom_idle"),
            "SteamParentalCode": fields.get("parental_code"),
        }
        for key, value in string_fields.items():
            value = str(value or "").strip()
            if value:
                config[key] = value
        self.bot_service.request("/Api/Bot/" + urllib.parse.quote(name), "POST", {"BotConfig": config})
        settings = _load_settings()
        limits = settings.get("hour_farm_max_games_by_bot") if isinstance(settings.get("hour_farm_max_games_by_bot"), dict) else {}
        limits[name] = self._number(fields.get("hour_max"), 32, 1, 32)
        _save_settings({"hour_farm_max_games_by_bot": limits})
        return {"ok": True, "name": name}

    def delete(self, name):
        self.bot_service.request("/Api/Bot/" + urllib.parse.quote(name), "DELETE")
        limits = _load_settings().get("hour_farm_max_games_by_bot")
        if isinstance(limits, dict) and name in limits:
            limits.pop(name, None)
            _save_settings({"hour_farm_max_games_by_bot": limits})
        return {"ok": True}


class LoginRequestService:
    def __init__(self, bot_service, stop_event):
        self.bot_service = bot_service
        self.stop_event = stop_event
        self.lock = threading.RLock()
        self.requests = {}
        self.deferred = set()
        self.events = []
        self.event_id = 0
        self.started = False
        self.thread = None
        self._load_state()

    def _load_state(self):
        try:
            data = json.loads(LOGIN_REQUEST_STATE_FILE.read_text(encoding="utf-8"))
            self.deferred = set(str(x) for x in data.get("deferred") or [])
        except Exception:
            pass

    def _save_state(self):
        try:
            LOGIN_REQUEST_STATE_FILE.write_text(json.dumps({"deferred": sorted(self.deferred)}), encoding="utf-8")
        except Exception:
            pass

    def _event(self, key, **data):
        self.event_id += 1
        self.events.append({"id": self.event_id, "time": int(time.time()), "key": key, "data": data})
        if len(self.events) > 80:
            self.events = self.events[-80:]

    @staticmethod
    def _key(bot, input_type):
        return str(bot) + ":" + str(input_type)

    def start(self):
        if self.started:
            return
        self.started = True
        self.thread = threading.Thread(target=self._loop, daemon=True)
        self.thread.start()

    def stop(self):
        self.started = False

    def _sync(self):
        bots = self.bot_service.bots().get("bots") or {}
        current = {}
        for name, bot in bots.items():
            try:
                input_type = int(bot.get("RequiredInput")) if isinstance(bot, dict) else 0
            except Exception:
                input_type = 0
            if input_type in (1, 2, 3, 4, 5, 7):
                key = self._key(name, input_type)
                current[key] = {"bot": name, "type": input_type}
        with self.lock:
            previous = set(self.requests)
            self.requests = current
            for key in set(current) - previous:
                self._event("login_request_new", bot=current[key]["bot"], input_type=current[key]["type"])
            for key in previous - set(current):
                self.deferred.discard(key)
                self._event("login_request_resolved", bot=key.rsplit(":", 1)[0])
            self.deferred.intersection_update(current)
            self._save_state()

    def _loop(self):
        while self.started and not self.stop_event.is_set():
            try:
                self._sync()
            except Exception as exc:
                with self.lock:
                    self._event("login_request_poll_error", error=str(exc))
            self.stop_event.wait(5)

    def status(self, since=0):
        with self.lock:
            requests = []
            for key, item in self.requests.items():
                requests.append({"bot": item["bot"], "type": item["type"], "deferred": key in self.deferred})
            return {"ok": True, "requests": requests, "events": [item for item in self.events if item["id"] > int(since or 0)], "lastEventId": self.event_id}

    def defer(self, keys=None):
        with self.lock:
            selected = set(str(key) for key in keys) if isinstance(keys, list) else set(self.requests)
            self.deferred.update(key for key in selected if key in self.requests)
            self._save_state()
        return self.status()

    def submit(self, bot, input_type, value):
        result = self.bot_service.input(bot, input_type, value)
        with self.lock:
            self.deferred.discard(self._key(bot, input_type))
            self._save_state()
        return result


class HourFarmService:
    def __init__(self, host, port, password_provider, stop_event, steam_metadata_service=None):
        self.host = host
        self.port = int(port)
        self.password_provider = password_provider
        self.stop_event = stop_event
        self.steam_metadata_service = steam_metadata_service
        self.lock = threading.RLock()
        self.operation_lock = threading.Lock()
        self.active = {}
        self.seen_card_work = set()
        self.auto_boosted = set()
        self.reapply_at = {}
        self.events = []
        self.event_id = 0
        self.started = False
        self.startup_done = False
        self.startup_started_at = 0.0
        self.thread = None
        self._load_state()

    def _load_state(self):
        try:
            data = json.loads(HOUR_FARM_STATE_FILE.read_text(encoding="utf-8"))
            active = data.get("active") if isinstance(data, dict) else {}
            if isinstance(active, dict):
                self.active = {str(name): [int(x) for x in ids if int(x) > 0] for name, ids in active.items() if isinstance(ids, list)}
                self.auto_boosted = set(self.active)
        except Exception:
            pass

    def _save_state(self):
        try:
            HOUR_FARM_STATE_FILE.write_text(json.dumps({"active": self.active}, ensure_ascii=False), encoding="utf-8")
        except Exception:
            pass

    def _event(self, key, **data):
        with self.lock:
            self.event_id += 1
            self.events.append({"id": self.event_id, "time": int(time.time()), "key": key, "data": data})
            if len(self.events) > 120:
                self.events = self.events[-120:]

    def status(self, since=0):
        with self.lock:
            return {
                "ok": True,
                "active": {name: list(ids) for name, ids in self.active.items()},
                "events": [item for item in self.events if item["id"] > int(since or 0)],
                "lastEventId": self.event_id,
            }

    def start(self):
        if self.started:
            return
        self.started = True
        self.startup_started_at = time.time()
        self.thread = threading.Thread(target=self._loop, daemon=True)
        self.thread.start()

    def stop(self):
        self.started = False

    def _hosts(self):
        result = []
        for host in (self.host, "127.0.0.1", "localhost"):
            if host and host not in result:
                result.append(host)
        return result

    def _asf_api(self, path, method="GET", payload=None, timeout=10):
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        last_error = None
        for host in self._hosts():
            request = urllib.request.Request(f"http://{host}:{self.port}{path}", data=body, method=method)
            request.add_header("Content-Type", "application/json")
            password = self.password_provider() or ""
            if password:
                request.add_header("Authentication", password)
            try:
                with urllib.request.urlopen(request, timeout=timeout) as response:
                    raw = response.read().decode("utf-8", "ignore")
                    return json.loads(raw) if raw else {}
            except Exception as exc:
                last_error = exc
        raise RuntimeError(str(last_error or "ASF unavailable"))

    def _bots(self):
        data = self._asf_api("/Api/Bot/ASF")
        result = data.get("Result") if isinstance(data, dict) else {}
        return result if isinstance(result, dict) else {}

    @staticmethod
    def _enabled(bot):
        if not isinstance(bot, dict) or bot.get("Enabled") is False:
            return False
        config = bot.get("BotConfig") or {}
        return config.get("Enabled") is not False and bot.get("KeepRunning") is not False

    @classmethod
    def _idle(cls, bot):
        if not cls._enabled(bot) or not bot.get("IsConnectedAndLoggedOn"):
            return False
        farmer = bot.get("CardsFarmer") or {}
        return not (farmer.get("CurrentGamesFarming") or []) and not (farmer.get("GamesToFarm") or [])

    @classmethod
    def _card_queue(cls, bot):
        if not cls._enabled(bot) or not bot.get("IsConnectedAndLoggedOn"):
            return False
        return bool((bot.get("CardsFarmer") or {}).get("GamesToFarm") or [])

    @staticmethod
    def _parse_appids(text):
        result = []
        for value in re.findall(r"\d+", str(text or "")):
            appid = int(value)
            if appid > 0 and appid not in result:
                result.append(appid)
        return result

    @staticmethod
    def _settings():
        data = _load_settings()
        mode = str(data.get("hour_farm_priority_mode") or "hours_desc")
        if mode not in ("hours_asc", "hours_desc", "popular"):
            mode = "hours_desc"
        limits = data.get("hour_farm_max_games_by_bot") if isinstance(data.get("hour_farm_max_games_by_bot"), dict) else {}
        return {
            "auto": bool(data.get("auto_hour_farm_after_cards", False)),
            "startup": bool(data.get("start_hour_farm_on_launch", False)),
            "priority": HourFarmService._parse_appids(data.get("priority_hour_farm_appids", "")),
            "mode": mode,
            "limits": limits,
            "api_key": str(RUNTIME.get("steam_api_key") or data.get("steam_api_key") or "").strip(),
        }

    @staticmethod
    def _limit(limits, name):
        try:
            return max(1, min(32, int(limits.get(name, 32))))
        except Exception:
            return 32

    def _owned_games(self, steam_id, api_key):
        url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=%s&steamid=%s&include_played_free_games=1&include_appinfo=1&format=json" % (urllib.parse.quote(api_key), urllib.parse.quote(str(steam_id)))
        request = urllib.request.Request(url, headers={"User-Agent": f"{APP_NAME}/{APP_VERSION}"})
        with urllib.request.urlopen(request, timeout=15) as response:
            data = json.loads(response.read().decode("utf-8", "ignore"))
        response = data.get("response") or {}
        raw_games = response.get("games") or []
        if "games" not in response:
            return None
        if self.steam_metadata_service:
            self.steam_metadata_service.add_names(raw_games)
        games = []
        for game in raw_games:
            try:
                appid = int(game.get("appid"))
            except Exception:
                continue
            if appid > 0:
                games.append({"appid": appid, "hours": float(game.get("playtime_forever") or 0) / 60.0})
        return games

    def _popular_ids(self):
        data = get_popular_games()
        return [int(item["appID"]) for item in data.get("games") or [] if item.get("appID")]

    def _play(self, name, appids):
        self._asf_api("/Api/Command", "POST", {"Command": "play " + name + " " + ",".join(str(x) for x in appids)})

    def _reset(self, name):
        self._asf_api("/Api/Command", "POST", {"Command": "reset " + name})

    def start_hour_farm(self, targets=None, reason="manual"):
        with self.operation_lock:
            settings = self._settings()
            if not settings["api_key"]:
                self._event("hour_service_need_api_key")
                return {"ok": False, "message": "Steam Web API key is required."}
            try:
                bots = self._bots()
            except Exception as exc:
                self._event("hour_service_asf_unavailable", error=str(exc))
                return {"ok": False, "message": str(exc)}
            allowed = set(targets or []) if targets else None
            names = [name for name, bot in bots.items() if self._idle(bot) and (allowed is None or name in allowed)]
            if not names:
                self._event("hour_service_no_targets")
                return {"ok": True, "started": 0}
            owned = {}
            for name in names:
                bot = bots[name]
                steam_id = bot.get("s_SteamID") or bot.get("SteamID")
                if not steam_id:
                    self._event("hour_service_skip_no_steamid", bot=name)
                    continue
                try:
                    games = self._owned_games(steam_id, settings["api_key"])
                except Exception as exc:
                    self._event("hour_service_games_error", bot=name, error=str(exc))
                    continue
                if games is None:
                    self._event("hour_service_private_games", bot=name)
                    continue
                owned[name] = games
            popular = self._popular_ids() if settings["mode"] == "popular" else []
            used_popular = set()
            started = 0
            for name, games in owned.items():
                max_games = self._limit(settings["limits"], name)
                game_ids = {item["appid"] for item in games}
                selected = [appid for appid in settings["priority"] if appid in game_ids][:max_games]
                selected_set = set(selected)
                ordered = sorted(games, key=lambda item: (item["hours"], item["appid"]) if settings["mode"] == "hours_asc" else (-item["hours"], item["appid"]))
                candidates = ordered
                if settings["mode"] == "popular" and popular:
                    popular_games = [appid for appid in popular if appid in game_ids and appid not in used_popular]
                    candidates = [{"appid": appid} for appid in popular_games] + ordered
                for item in candidates:
                    appid = int(item["appid"])
                    if len(selected) >= max_games:
                        break
                    if appid in selected_set:
                        continue
                    selected.append(appid)
                    selected_set.add(appid)
                    if appid in popular:
                        used_popular.add(appid)
                if not selected:
                    continue
                try:
                    self._play(name, selected)
                    with self.lock:
                        self.active[name] = selected
                        self.auto_boosted.add(name)
                        self.reapply_at[name] = time.time() + 600
                        self._save_state()
                    self._event("hour_service_started", bot=name, count=len(selected), reason=reason)
                    started += 1
                except Exception as exc:
                    self._event("hour_service_play_error", bot=name, error=str(exc))
            if not started:
                self._event("hour_service_no_games")
            return {"ok": True, "started": started}

    def _return_cards(self, bots):
        for name in list(self.active):
            bot = bots.get(name) or {}
            valid = self._enabled(bot) and bool(bot.get("IsConnectedAndLoggedOn"))
            queued_cards = self._card_queue(bot)
            if not valid and not queued_cards:
                with self.lock:
                    self.active.pop(name, None)
                    self.auto_boosted.discard(name)
                    self.reapply_at.pop(name, None)
                    self._save_state()
                continue
            if not queued_cards:
                continue
            with self.lock:
                self.active.pop(name, None)
                self.auto_boosted.discard(name)
                self.reapply_at.pop(name, None)
                self._save_state()
            try:
                self._reset(name)
                self._event("hour_service_cards_take_over", bot=name)
            except Exception as exc:
                self._event("hour_service_reset_error", bot=name, error=str(exc))

    def _auto_after_cards(self, bots, settings):
        if not settings["auto"]:
            return
        names = list(bots)
        if not self.seen_card_work:
            for name in names:
                if self._card_queue(bots[name]):
                    self.seen_card_work.add(name)
            return
        for name in names:
            if self._card_queue(bots[name]):
                self.seen_card_work.add(name)
                self.auto_boosted.discard(name)
        targets = [name for name in names if self._idle(bots[name]) and name in self.seen_card_work and name not in self.auto_boosted]
        if targets:
            self.start_hour_farm(targets, "after_cards")

    def _startup(self, bots, settings):
        if not settings["startup"] or self.startup_done:
            return
        pending = [name for name, bot in bots.items() if self._enabled(bot) and not bot.get("IsConnectedAndLoggedOn") and not bot.get("RequiredInput")]
        if pending and time.time() - self.startup_started_at < 180:
            return
        self.startup_done = True
        targets = [name for name, bot in bots.items() if self._idle(bot)]
        if targets:
            self.start_hour_farm(targets, "startup")

    def _reapply(self, bots, settings):
        if not (settings["auto"] or settings["startup"]):
            return
        now = time.time()
        targets = [name for name in self.active if self._idle(bots.get(name) or {}) and now >= self.reapply_at.get(name, 0)]
        if targets:
            for name in targets:
                self.reapply_at[name] = now + 600
            self.start_hour_farm(targets, "reconnect")

    def _loop(self):
        while self.started and not self.stop_event.is_set():
            try:
                settings = self._settings()
                bots = self._bots()
                self._return_cards(bots)
                self._startup(bots, settings)
                self._auto_after_cards(bots, settings)
                self._reapply(bots, settings)
            except Exception as exc:
                self._event("hour_service_poll_error", error=str(exc))
            self.stop_event.wait(7)


def make_handler(ui_path, asf_host, asf_port, inject, stats_provider=None, exit_callback=None, plugin_manager=None, hour_farm_service=None, bot_service=None, login_request_service=None, bot_config_service=None, steam_metadata_service=None, settings_service=None, theme_service=None, event_log_service=None, cache_service=None, diagnostics_service=None, update_service=None):
    class Handler(http.server.BaseHTTPRequestHandler):
        timeout = 10
        good_host = None

        def log_message(self, *a):
            pass

        def _send_bytes(self, data, ctype, code=200):
            try:
                self.send_response(code)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Length", str(len(data)))
                self.send_header("Connection", "close")
                self.end_headers()
                self.wfile.write(data)
            except Exception:
                pass

        def _serve_static(self):
            rel = self.path.split("?", 1)[0].lstrip("/")
            if rel == "favicon.ico":
                self._send_bytes(b"", "image/x-icon")
                return
            if rel in ("", "/"):
                rel = "index.html"
            target = (ui_path / rel).resolve()
            try:
                target.relative_to(ui_path.resolve())
            except Exception:
                self.send_error(403)
                return
            if not target.exists() or target.is_dir():
                target = ui_path / "index.html"
            ctype = {
                ".html": "text/html; charset=utf-8",
                ".css": "text/css; charset=utf-8",
                ".js": "application/javascript; charset=utf-8",
                ".json": "application/json; charset=utf-8",
                ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon",
                ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
            }.get(target.suffix, "application/octet-stream")
            try:
                data = target.read_bytes()
            except Exception:
                self.send_error(404)
                return
            if target.name == "index.html":
                cfg_js = ("<script>window.ASF_CONFIG=%s;</script>" % json.dumps(inject)).encode("utf-8")
                data = data.replace(b"</head>", cfg_js + b"</head>")
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(data)

        def _proxy(self, method):
            length = int(self.headers.get("Content-Length", 0) or 0)
            body = self.rfile.read(length) if length else None
            candidates = []
            if self.headers.get("Authentication"):
                RUNTIME["ipc_password"] = self.headers.get("Authentication")
            if Handler.good_host:
                candidates.append(Handler.good_host)
            for h in (asf_host, "127.0.0.1", "localhost", "[::1]"):
                if h not in candidates:
                    candidates.append(h)
            last_err = None
            for hostc in candidates:
                url = f"http://{hostc}:{asf_port}{self.path}"
                req = urllib.request.Request(url, data=body, method=method)
                for h in ("Content-Type", "Authentication"):
                    if self.headers.get(h):
                        req.add_header(h, self.headers.get(h))
                try:
                    with urllib.request.urlopen(req, timeout=8) as resp:
                        payload = resp.read()
                        Handler.good_host = hostc
                        self.send_response(resp.status)
                        self.send_header("Content-Type", resp.headers.get("Content-Type", "application/json"))
                        self.send_header("Content-Length", str(len(payload)))
                        self.send_header("Connection", "close")
                        self.end_headers()
                        self.wfile.write(payload)
                        return
                except urllib.error.HTTPError as e:
                    payload = e.read()
                    Handler.good_host = hostc
                    self.send_response(e.code)
                    self.send_header("Content-Type", e.headers.get("Content-Type", "application/json"))
                    self.send_header("Content-Length", str(len(payload)))
                    self.send_header("Connection", "close")
                    self.end_headers()
                    self.wfile.write(payload)
                    return
                except Exception as e:
                    last_err = e
                    continue
            msg = json.dumps({"Message": f"ASF недоступен ({last_err})", "Success": False}).encode()
            try:
                self.send_response(503)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(msg)))
                self.send_header("Connection", "close")
                self.end_headers()
                self.wfile.write(msg)
            except Exception:
                pass

        def _health(self):
            results = {}
            for h in ("127.0.0.1", "localhost", "[::1]"):
                try:
                    with urllib.request.urlopen(f"http://{h}:{asf_port}/", timeout=3) as r:
                        results[h] = r.status
                except urllib.error.HTTPError as e:
                    results[h] = e.code
                except Exception as e:
                    results[h] = f"err: {e}"
            info = {
                "proxy": "ok",
                "asf_port": asf_port,
                "good_host": Handler.good_host,
                "hosts": results,
            }
            self._send_bytes(json.dumps(info).encode(), "application/json")

        def _custom_theme_media(self):
            media = _custom_theme_media_path()
            if not media:
                self.send_error(404)
                return
            try:
                mime = _CUSTOM_THEME_MEDIA_TYPES.get(media.suffix.lower(), ("application/octet-stream", ""))[0]
                self._send_bytes(media.read_bytes(), mime)
            except Exception:
                self.send_error(404)

        def _custom_theme(self):
            if self.command == "GET":
                self._send_bytes(json.dumps(custom_theme_state()).encode(), "application/json")
                return
            try:
                length = int(self.headers.get("Content-Length", 0) or 0)
                if length > _CUSTOM_THEME_MAX_VIDEO_BYTES * 2:
                    raise ValueError("Request is too large")
                payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
            except Exception as exc:
                self._send_bytes(json.dumps({"ok": False, "message": str(exc)}).encode(), "application/json", 400)
                return
            result = save_custom_theme(payload)
            self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)

        def _settings(self):
            if self.command == "GET":
                result = settings_service.snapshot() if settings_service else {}
                self._send_bytes(json.dumps(result).encode(), "application/json")
                return
            try:
                length = int(self.headers.get("Content-Length", 0) or 0)
                payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
            except Exception:
                payload = {}
            result = settings_service.update(payload) if settings_service else {"ok": False, "message": "Settings service is unavailable."}
            self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)

        def _theme(self):
            if self.command == "GET":
                result = theme_service.state() if theme_service else {"ok": False}
            else:
                try:
                    length = int(self.headers.get("Content-Length", 0) or 0)
                    payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
                except Exception:
                    payload = {}
                result = theme_service.save(payload) if theme_service else {"ok": False, "message": "Theme service is unavailable."}
            self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)

        def _events(self):
            if self.command == "GET":
                try:
                    query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    since = int((query.get("since") or [0])[0])
                except Exception:
                    since = 0
                result = event_log_service.status(since) if event_log_service else {"ok": False}
            else:
                try:
                    length = int(self.headers.get("Content-Length", 0) or 0)
                    payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
                except Exception:
                    payload = {}
                result = event_log_service.record(message=payload.get("message", ""), level=payload.get("level", "info"), source=payload.get("source", "ui"), language=payload.get("language", "")) if event_log_service else {"ok": False}
                result = {"ok": True, "event": result} if isinstance(result, dict) and result.get("id") else result
            self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)

        def _cache(self):
            if self.command == "GET":
                result = cache_service.status() if cache_service else {"ok": False}
            else:
                try:
                    length = int(self.headers.get("Content-Length", 0) or 0)
                    payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
                except Exception:
                    payload = {}
                result = cache_service.clear(payload.get("name")) if cache_service else {"ok": False}
            self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)

        def _diagnostics(self):
            result = diagnostics_service.status() if diagnostics_service else {"ok": False}
            self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)

        def _updates(self):
            result = update_service.status() if update_service else {"ok": False}
            self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)

        def _game_meta(self):
            query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            appids = [value for value in ((query.get("appids") or [""])[0]).split(",") if value.strip()]
            language = (query.get("lang") or ["english"])[0]
            steam_id = (query.get("steamid") or [""])[0]
            result = steam_metadata_service.metadata(appids, steam_id, language) if steam_metadata_service else {"ok": False, "items": {}}
            self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)

        def _steam_cover(self):
            appid = self.path.split("?", 1)[0].rsplit("/", 1)[-1]
            path, mime = steam_metadata_service.cover(appid) if steam_metadata_service else (None, "")
            if not path:
                self.send_error(404)
                return
            self._send_bytes(path.read_bytes(), mime)

        def _games(self):
            from urllib.parse import urlparse, parse_qs
            qs = parse_qs(urlparse(self.path).query)
            steamid = (qs.get("steamid") or [""])[0]
            limit = int((qs.get("limit") or ["32"])[0])
            if not steamid.isdigit():
                self._send_bytes(json.dumps({"games": [], "error": "bad steamid"}).encode(), "application/json")
                return
            if not (len(steamid) == 17 and steamid.startswith("7656119")):
                log(f"__games: подозрительный SteamID '{steamid}' (не похож на SteamID64)")
                self._send_bytes(json.dumps({
                    "games": [], "error": "bad_steamid",
                    "message": f"Некорректный SteamID: {steamid}"
                }).encode(), "application/json")
                return

            api_key = (RUNTIME.get("steam_api_key") or "").strip()
            games = []

            if api_key:
                try:
                    url = ("https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/"
                           f"?key={api_key}&steamid={steamid}"
                           "&include_played_free_games=1&include_appinfo=0&format=json")
                    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=15) as r:
                        raw = r.read().decode("utf-8", "ignore")
                    data = json.loads(raw)
                    resp = data.get("response", {})
                    if "games" not in resp:
                        log(f"__games {steamid}: ответ Steam без 'games': {raw[:200]}")
                        self._send_bytes(json.dumps({
                            "games": [], "error": "private",
                            "message": "Steam не вернул список игр. Проверьте: профиль публичный И в Приватности 'Игровые данные' = Открытый доступ; ключ создан для домена."
                        }).encode(), "application/json")
                        return
                    log(f"__games {steamid}: получено игр {len(resp.get('games') or [])}")
                    for g in (resp.get("games") or []):
                        aid = g.get("appid")
                        mins = g.get("playtime_forever", 0) or 0
                        if aid:
                            games.append({"appID": int(aid), "hours": round(mins / 60.0, 1)})
                    games.sort(key=lambda x: x["hours"], reverse=True)
                    self._send_bytes(json.dumps({"games": games[:limit], "source": "webapi"}).encode(), "application/json")
                    return
                except urllib.error.HTTPError as e:
                    if e.code in (401, 403):
                        self._send_bytes(json.dumps({
                            "games": [], "error": "bad_key", "needKey": True,
                            "message": "Неверный или недействительный Steam API ключ."
                        }).encode(), "application/json")
                    else:
                        self._send_bytes(json.dumps({
                            "games": [], "error": f"http_{e.code}",
                            "message": f"Steam API вернул HTTP {e.code}."
                        }).encode(), "application/json")
                    return
                except Exception as e:
                    self._send_bytes(json.dumps({
                        "games": [], "error": "webapi", "message": str(e)
                    }).encode(), "application/json")
                    return

            self._send_bytes(json.dumps({
                "games": [], "error": "no_api_key", "needKey": True,
                "message": "Нужен Steam Web API ключ."
            }).encode(), "application/json")
            return

        def do_GET(self):
            if self.path.startswith("/__health"):
                self._health()
            elif self.path.startswith("/__appstate"):
                payload = {
                    "asf_status": RUNTIME.get("asf_status", "unknown"),
                    "asf_status_message": RUNTIME.get("asf_status_message", ""),
                }
                self._send_bytes(json.dumps(payload).encode(), "application/json")
            elif self.path.startswith("/__check_update"):
                self._send_bytes(json.dumps(check_github_update()).encode(), "application/json")
            elif self.path.startswith("/__settings"):
                self._settings()
            elif self.path.startswith("/__theme") or self.path == "/__custom_theme":
                self._theme()
            elif self.path.startswith("/__events"):
                self._events()
            elif self.path.startswith("/__cache"):
                self._cache()
            elif self.path.startswith("/__diagnostics"):
                self._diagnostics()
            elif self.path.startswith("/__updates/status"):
                self._updates()
            elif self.path.startswith("/__custom_theme/media") or self.path.startswith("/__custom_theme/image"):
                self._custom_theme_media()
            elif self.path.startswith("/__custom_theme"):
                self._custom_theme()
            elif self.path.startswith("/__appstats"):
                try:
                    info = stats_provider() if stats_provider else app_memory_stats(None)
                except Exception as e:
                    info = {"error": str(e), "memoryKb": 0, "memoryBytes": 0}
                self._send_bytes(json.dumps(info).encode(), "application/json")
            elif self.path.startswith("/__botconfigs/"):
                name = urllib.parse.unquote(self.path.split("/", 3)[2])
                result = bot_config_service.form(name) if bot_config_service else {"ok": False, "message": "Bot config service is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 404)
            elif self.path.startswith("/__bots/") and self.path.endswith("/profile"):
                name = urllib.parse.unquote(self.path.split("/", 3)[2])
                result = bot_service.profile(name) if bot_service else {"ok": False, "message": "Bot service is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 404)
            elif self.path == "/__bots" or self.path.startswith("/__bots?"):
                result = bot_service.bots() if bot_service else {"ok": False, "message": "Bot service is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)
            elif self.path.startswith("/__login_requests/status"):
                try:
                    query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                    since = int((query.get("since") or [0])[0])
                except Exception:
                    since = 0
                result = login_request_service.status(since) if login_request_service else {"ok": False, "message": "Login request service is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)
            elif self.path.startswith("/__hourfarm/status"):
                try:
                    from urllib.parse import urlparse, parse_qs
                    query = parse_qs(urlparse(self.path).query)
                    since = int((query.get("since") or [0])[0])
                except Exception:
                    since = 0
                result = hour_farm_service.status(since) if hour_farm_service else {"ok": False, "message": "Hour farm service is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)
            elif self.path.startswith("/__steam/cover/"):
                self._steam_cover()
            elif self.path.startswith("/__game_meta"):
                self._game_meta()
            elif self.path.startswith("/__games"):
                self._games()
            elif self.path.startswith("/__popular_games"):
                self._send_bytes(json.dumps(get_popular_games()).encode(), "application/json")
            elif self.path.startswith("/__plugins/library"):
                result = plugin_manager.library() if plugin_manager else {"ok": False, "items": [], "message": "Plugin manager is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)
            elif self.path.startswith("/__plugins/store"):
                refresh_store = "refresh=1" in self.path or "force=1" in self.path
                self._send_bytes(json.dumps(get_plugin_store(force=refresh_store)).encode(), "application/json")
            elif self.path.startswith("/Api/"):
                self._proxy("GET")
            else:
                self._serve_static()

        def do_POST(self):
            if self.path.startswith("/__settings"):
                self._settings()
            elif self.path.startswith("/__theme") or self.path == "/__custom_theme":
                self._theme()
            elif self.path.startswith("/__events/clear"):
                result = event_log_service.clear() if event_log_service else {"ok": False}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)
            elif self.path.startswith("/__events"):
                self._events()
            elif self.path.startswith("/__cache"):
                self._cache()
            elif self.path == "/__botconfigs":
                try:
                    length = int(self.headers.get("Content-Length", 0) or 0)
                    payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
                except Exception:
                    payload = {}
                result = bot_config_service.save(payload.get("fields")) if bot_config_service else {"ok": False, "message": "Bot config service is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)
            elif self.path.startswith("/__bots/") and self.path.endswith("/action"):
                try:
                    length = int(self.headers.get("Content-Length", 0) or 0)
                    payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
                except Exception:
                    payload = {}
                name = urllib.parse.unquote(self.path.split("/", 3)[2])
                result = bot_service.action(name, str(payload.get("action") or "")) if bot_service else {"ok": False, "message": "Bot service is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)
            elif self.path.startswith("/__login_requests/defer"):
                try:
                    length = int(self.headers.get("Content-Length", 0) or 0)
                    payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
                except Exception:
                    payload = {}
                result = login_request_service.defer(payload.get("keys")) if login_request_service else {"ok": False, "message": "Login request service is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)
            elif self.path.startswith("/__login_requests/input"):
                try:
                    length = int(self.headers.get("Content-Length", 0) or 0)
                    payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
                    result = login_request_service.submit(payload.get("bot"), payload.get("type"), payload.get("value")) if login_request_service else {"ok": False, "message": "Login request service is unavailable."}
                except Exception as exc:
                    result = {"ok": False, "message": str(exc)}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)
            elif self.path.startswith("/__hourfarm/start"):
                try:
                    length = int(self.headers.get("Content-Length", 0) or 0)
                    payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
                except Exception:
                    payload = {}
                targets = payload.get("targets") if isinstance(payload.get("targets"), list) else None
                result = hour_farm_service.start_hour_farm(targets, "manual") if hour_farm_service else {"ok": False, "message": "Hour farm service is unavailable."}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 503)
            elif self.path.startswith("/__install_update"):
                result = install_github_update(exit_callback)
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 500)
            elif self.path.startswith("/__plugins/install") or self.path.startswith("/__plugins/remove"):
                try:
                    length = int(self.headers.get("Content-Length", 0) or 0)
                    payload = json.loads(self.rfile.read(length).decode("utf-8", "ignore") or "{}")
                except Exception:
                    payload = {}
                if not plugin_manager:
                    result = {"ok": False, "message": "Plugin manager is unavailable."}
                elif self.path.startswith("/__plugins/install"):
                    result = plugin_manager.install(payload.get("id"))
                else:
                    result = plugin_manager.remove(payload.get("directory"))
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)
            elif self.path.startswith("/__exit"):
                self._send_bytes(json.dumps({"ok": True}).encode(), "application/json")
                if exit_callback:
                    try:
                        threading.Thread(target=exit_callback, daemon=True).start()
                    except Exception:
                        pass
            elif self.path.startswith("/Api/"):
                self._proxy("POST")
            else:
                self.send_error(404)

        def do_PUT(self):
            self._proxy("PUT") if self.path.startswith("/Api/") else self.send_error(404)

        def do_DELETE(self):
            if self.path.startswith("/__botconfigs/"):
                name = urllib.parse.unquote(self.path.split("/", 3)[2])
                try:
                    result = bot_config_service.delete(name) if bot_config_service else {"ok": False, "message": "Bot config service is unavailable."}
                except Exception as exc:
                    result = {"ok": False, "message": str(exc)}
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 400)
            else:
                self._proxy("DELETE") if self.path.startswith("/Api/") else self.send_error(404)

    return Handler


class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def start_local_server(ui_path, asf_host, asf_port, inject, want_port=0, stats_provider=None, exit_callback=None, plugin_manager=None, hour_farm_service=None, bot_service=None, login_request_service=None, bot_config_service=None, steam_metadata_service=None, settings_service=None, theme_service=None, event_log_service=None, cache_service=None, diagnostics_service=None, update_service=None):
    handler = make_handler(ui_path, asf_host, asf_port, inject, stats_provider, exit_callback, plugin_manager, hour_farm_service, bot_service, login_request_service, bot_config_service, steam_metadata_service, settings_service, theme_service, event_log_service, cache_service, diagnostics_service, update_service)
    httpd = ThreadingServer(("127.0.0.1", want_port), handler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, port


def _browser_candidates(configured=""):
    cands = []
    if configured:
        cands.append(Path(configured))
    if os.name == "nt":
        envs = [os.environ.get("PROGRAMFILES"), os.environ.get("PROGRAMFILES(X86)"), os.environ.get("LOCALAPPDATA")]
        for base in [e for e in envs if e]:
            b = Path(base)
            cands += [
                b / "Microsoft" / "Edge" / "Application" / "msedge.exe",
                b / "Google" / "Chrome" / "Application" / "chrome.exe",
                b / "Chromium" / "Application" / "chrome.exe",
            ]
    else:
        for nm in ("microsoft-edge", "msedge", "google-chrome", "chromium", "chromium-browser", "firefox"):
            cands.append(Path(nm))
    return cands


def _which_program(name):
    try:
        import shutil
        found = shutil.which(str(name))
        return found
    except Exception:
        return None


def _trim_process_working_set(pid):
    if os.name != "nt":
        return False
    try:
        import ctypes
        from ctypes import wintypes

        pid = int(pid)
        kernel32 = ctypes.windll.kernel32
        psapi = ctypes.windll.psapi
        handle = kernel32.OpenProcess(0x1000 | 0x0100, False, pid)
        if not handle:
            return False
        try:
            psapi.EmptyWorkingSet.restype = wintypes.BOOL
            return bool(psapi.EmptyWorkingSet(handle))
        finally:
            kernel32.CloseHandle(handle)
    except Exception:
        return False


def start_memory_trim_thread(cfg, asf_holder):
    enabled = str(cfg.get("memory_trim", "true")).lower() in ("1", "true", "yes", "on")
    if os.name != "nt" or not enabled:
        return
    try:
        interval = max(10, int(cfg.get("memory_trim_interval", "30") or 30))
    except Exception:
        interval = 30

    def worker():
        import gc
        log(f"Memory Trim: включён, интервал {interval}с.")
        time.sleep(8)
        while True:
            try:
                gc.collect()
                mp = _child_process_map()
                self_pid = os.getpid()
                pids = [self_pid] + _descendants(self_pid, mp)
                exclude = set()
                proc = asf_holder.get("proc")
                if proc and proc.proc:
                    try:
                        asf_pid = int(proc.proc.pid)
                        exclude.add(asf_pid)
                        exclude.update(_descendants(asf_pid, mp))
                    except Exception:
                        pass
                browser_pid = RUNTIME.get("browser_pid")
                if browser_pid:
                    try:
                        browser_pid = int(browser_pid)
                        exclude.add(browser_pid)
                        exclude.update(_descendants(browser_pid, mp))
                    except Exception:
                        pass
                include_orphans = str(cfg.get("memory_include_orphan_webview2", "true")).lower() in ("1", "true", "yes", "on")
                name_map = _process_name_map()
                webview_pids, _ = _webview2_pids_for_stats(mp, name_map, _descendants(self_pid, mp), include_orphans)
                pids = list(dict.fromkeys(pids + list(webview_pids)))
                for pid in pids:
                    if pid not in exclude:
                        _trim_process_working_set(pid)
            except Exception:
                pass
            time.sleep(interval)

    threading.Thread(target=worker, daemon=True).start()


def configure_webview2_low_memory(cfg):

    enabled = str(cfg.get("webview_low_memory", "true")).lower() in ("1", "true", "yes", "on")
    if os.name != "nt" or not enabled:
        os.environ.pop("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", None)
        os.environ.pop("WEBVIEW2_USER_DATA_FOLDER", None)
        return

    profile = DATA_DIR / "WebView2Profile"
    try:
        profile.mkdir(parents=True, exist_ok=True)
        os.environ["WEBVIEW2_USER_DATA_FOLDER"] = str(profile)
    except Exception:
        pass

    aggressive = str(cfg.get("webview_aggressive", "true")).lower() in ("1", "true", "yes", "on")
    single_process = str(cfg.get("webview_single_process", "true")).lower() in ("1", "true", "yes", "on")
    disable_gpu = str(cfg.get("webview_disable_gpu", "false")).lower() in ("1", "true", "yes", "on")
    in_process_gpu = str(cfg.get("webview_in_process_gpu", "false")).lower() in ("1", "true", "yes", "on")

    flags = [

        "--disable-background-networking",
        "--disable-sync",
        "--disable-extensions",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-domain-reliability",
        "--disable-background-mode",
        "--disable-renderer-backgrounding",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--no-first-run",
        "--no-default-browser-check",
        "--no-service-autorun",


        "--disable-print-preview",
        "--disable-speech-api",
        "--disable-notifications",
        "--mute-audio",
        "--metrics-recording-only",
        "--disable-logging",
        "--log-level=3",


        "--disk-cache-size=1",
        "--media-cache-size=1",


        "--js-flags=--max-old-space-size=96",
    ]

    if single_process:
        flags += [


            "--single-process",
            "--renderer-process-limit=1",
            "--process-per-site",
        ]

    if aggressive:
        flags += [


            "--disable-site-isolation-trials",
            "--disable-web-security",
            "--disable-features=IsolateOrigins,site-per-process,CalculateNativeWinOcclusion,BackForwardCache,AcceptCHFrame,AutofillServerCommunication,OptimizationHints,MediaRouter,InterestFeedContentSuggestions,msSmartScreenProtection",
            "--disable-breakpad",
            "--disable-crash-reporter",
            "--disable-hang-monitor",
            "--disable-ipc-flooding-protection",
        ]

    if in_process_gpu and not disable_gpu:
        flags += [


            "--in-process-gpu",
        ]

    if disable_gpu:
        flags += [

            "--disable-gpu",
            "--disable-gpu-compositing",
            "--disable-accelerated-video-decode",
            "--disable-accelerated-video-encode",
            "--disable-smooth-scrolling",
        ]

    extra = (cfg.get("webview_extra_args") or "").strip()
    if extra:
        flags.extend(extra.split())


    value = " ".join(dict.fromkeys(flags))
    os.environ["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = value
    log(
        "WebView2 Low Memory: включён "
        f"(aggressive={aggressive}, single_process={single_process}, in_process_gpu={in_process_gpu}, disable_gpu={disable_gpu})."
    )
    log(f"WebView2 args: {value}")


def launch_browser_app(url, configured=""):
    profile = DATA_DIR / "BrowserProfile"
    profile.mkdir(parents=True, exist_ok=True)
    for candidate in _browser_candidates(configured):
        executable = str(candidate) if candidate.exists() else _which_program(str(candidate))
        if not executable:
            continue
        try:
            if "firefox" in Path(executable).name.lower():
                command = [executable, "--new-window", url]
            else:
                command = [
                    executable, f"--app={url}", f"--user-data-dir={profile}",
                    "--no-first-run", "--no-default-browser-check", "--disable-extensions",
                ]
            return subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception as exc:
            log(f"Не удалось запустить браузер {executable}: {exc}")
    try:
        import webbrowser
        webbrowser.open(url)
    except Exception as exc:
        log(f"Не удалось открыть браузер: {exc}")
    return None


class Bridge:
    def __init__(self):
        self._window = None
        self._max = False
        self._tray_icon = None
        self._tray_ready = False

    def _show_window(self, *args):
        try:
            if self._window:
                try:
                    self._window.show()
                except Exception:
                    pass
                try:
                    self._window.restore()
                except Exception:
                    pass
        except Exception:
            pass

    def _exit_from_tray(self, *args):
        try:
            self._stop_tray()
        except Exception:
            pass
        try:
            if self._window:
                self._window.destroy()
        except Exception:
            pass

    def _ensure_tray(self):
        if self._tray_ready:
            return True
        try:
            import pystray
            from PIL import Image, ImageDraw

            img = None
            for icon_path in (RES_DIR / "icon.ico", APP_DIR / "icon.ico", RES_DIR / "icon_source.png", APP_DIR / "icon_source.png"):
                try:
                    if icon_path.exists():
                        img = Image.open(icon_path).convert("RGBA")
                        img = img.resize((64, 64), Image.LANCZOS)
                        log(f"Tray: используется иконка приложения {icon_path}")
                        break
                except Exception as e:
                    log(f"Tray: не удалось загрузить иконку {icon_path}: {e}")
            if img is None:

                img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
                d = ImageDraw.Draw(img)
                d.rounded_rectangle((8, 8, 56, 56), radius=14, fill=(111, 123, 255, 255))
                d.ellipse((25, 25, 39, 39), fill=(255, 255, 255, 255))

            menu = pystray.Menu(
                pystray.MenuItem("Открыть BetterASF", self._show_window, default=True),
                pystray.MenuItem("Выход", self._exit_from_tray),
            )
            self._tray_icon = pystray.Icon(APP_NAME, img, APP_NAME, menu)
            self._tray_icon.run_detached()
            self._tray_ready = True
            log("Tray: иконка создана.")
            return True
        except Exception as e:
            log(f"Tray недоступен ({e}); fallback = обычное сворачивание.")
            return False

    def _stop_tray(self):
        icon = self._tray_icon
        self._tray_icon = None
        self._tray_ready = False
        if icon:
            try:
                icon.stop()
            except Exception:
                pass

    def _hide_to_tray(self):
        try:
            if self._ensure_tray():
                try:
                    self._window.hide()
                except Exception:
                    self._window.minimize()
                return True
        except Exception:
            pass
        try:
            self._window.minimize()
        except Exception:
            pass
        return False

    def minimize(self):
        try:
            if get_app_setting("minimize_to_tray", False):
                return self._hide_to_tray()
            self._window.minimize()
        except Exception:
            pass

    def toggle_maximize(self):
        try:
            self._window.restore() if self._max else self._window.maximize()
            self._max = not self._max
        except Exception:
            pass

    def close(self):
        try:
            if get_app_setting("minimize_to_tray", False):
                return self._hide_to_tray()
            self._window.destroy()
        except Exception:
            pass
        return False

    def get_settings(self):
        data = _load_settings()
        return {
            "minimize_to_tray": bool(data.get("minimize_to_tray", False)),
            "autostart": bool(data.get("autostart", False)),
            "economy_mode": bool(data.get("economy_mode", False)),
            "auto_hour_farm_after_cards": bool(data.get("auto_hour_farm_after_cards", False)),
            "start_hour_farm_on_launch": bool(data.get("start_hour_farm_on_launch", False)),
            "launch_minimized": bool(data.get("launch_minimized", False)),
            "language": str(data.get("language", "ru") or "ru"),
            "hour_farm_priority_mode": str(data.get("hour_farm_priority_mode", "hours_desc") or "hours_desc"),
            "priority_hour_farm_appids": str(data.get("priority_hour_farm_appids", "") or ""),
            "hour_farm_max_games_by_bot": data.get("hour_farm_max_games_by_bot", {}) if isinstance(data.get("hour_farm_max_games_by_bot", {}), dict) else {},
        }

    def set_app_setting(self, key, value):
        if key == "minimize_to_tray":
            set_app_setting(key, bool(value))
            return True
        if key == "autostart":
            return set_autostart_enabled(bool(value))
        if key == "economy_mode":
            set_app_setting(key, bool(value))
            return True
        if key == "auto_hour_farm_after_cards":
            set_app_setting(key, bool(value))
            return True
        if key == "start_hour_farm_on_launch":
            set_app_setting(key, bool(value))
            return True
        if key == "launch_minimized":
            set_app_setting(key, bool(value))
            return True
        if key == "language" and value in ("ru", "en", "uk"):
            set_app_setting(key, value)
            return True
        if key == "hour_farm_priority_mode" and value in ("hours_asc", "hours_desc", "popular"):
            set_app_setting(key, value)
            return True
        return False

    def exit_app(self):
        try:
            RUNTIME["asf_status"] = "stopping"
            RUNTIME["asf_status_message"] = "BetterASF is closing for update."
            if self._window:
                self._window.destroy()
            return True
        except Exception:
            return False

    def set_theme(self, theme):
        if theme in ("dark", "light"):
            save_theme(theme)
        return theme

    def set_api_key(self, key):
        key = (key or "").strip()
        RUNTIME["steam_api_key"] = key
        save_api_key(key)
        return True


def monitor_ipc(host, port, timeout, asf_holder):
    deadline = time.time() + timeout
    last = None
    restarts = 0
    dead_since = None
    while time.time() < deadline:
        ready = ipc_ready(host, port)
        if ready != last:
            log(f"IPC {host}:{port} -> {'ДОСТУПЕН' if ready else 'недоступен'}")
            last = ready
        if ready:
            log("ASF IPC поднялся. Связь должна работать.")
            return
        proc = asf_holder.get("proc")
        if proc is not None and not proc.alive():
            if dead_since is None:
                dead_since = time.time()
                log("ASF завершился до поднятия IPC. Жду несколько секунд: возможно, это штатный рестарт после самообновления.")


            if (time.time() - dead_since) >= 8:
                if restarts < 2:
                    restarts += 1
                    dead_since = None
                    log("IPC так и не появился после обновления. Пробую запустить ASF снова.")
                    try:
                        proc.restart()
                    except Exception as e:
                        log(f"Ошибка повторного запуска ASF: {e}")
                    time.sleep(2.0)
                    continue
                log("ВНИМАНИЕ: процесс ASF завершился. Смотрите log.txt в папке config ASF.")
                return
        else:
            dead_since = None
        time.sleep(1.0)
    log(f"ТАЙМАУТ: IPC {host}:{port} не поднялся за {timeout}с.")
    proc = asf_holder.get("proc")
    if proc is not None:
        log(f"  процесс ASF жив: {proc.alive()}")


def main():
    cfg = load_config()
    host = cfg["ipc_host"]
    port = int(cfg["ipc_port"])
    ui_mode = str(cfg.get("ui_mode", "browser")).strip().lower()
    if ui_mode not in ("browser", "webview"):
        ui_mode = "browser"
    frameless = str(cfg["frameless"]).lower() in ("1", "true", "yes", "on")
    theme = cfg["theme"] if cfg["theme"] in ("dark", "light") else "dark"

    try:
        _set_log_path(DATA_DIR / "debug-log.txt")
    except Exception:
        pass

    log(f"frozen={is_frozen()}  APP_DIR={APP_DIR}")
    log(f"DATA_DIR={DATA_DIR}")
    log(f"UI_DIR={UI_DIR}")
    if ensure_program_files_install(cfg):
        return
    ensure_user_shortcuts(cfg)
    log(f"IPC цель: {host}:{port}  start_asf={cfg['start_asf']}  password={'да' if cfg['ipc_password'] else 'нет'}  ui_mode={ui_mode}")

    asf_holder = {"proc": None}
    exit_event = threading.Event()
    start_memory_trim_thread(cfg, asf_holder)

    start_lock = threading.RLock()
    plugin_operation = threading.Event()

    def set_asf_status(status, message=""):
        RUNTIME["asf_status"] = status
        RUNTIME["asf_status_message"] = message

    def start_asf_process(force_reinstall=False, reason="startup"):
        if str(cfg["start_asf"]).lower() not in ("1", "true", "yes", "on"):
            set_asf_status("external", "ASF is expected to be started separately.")
            log("start_asf=false -> ASF должен быть запущен отдельно.")
            return None
        with start_lock:
            set_asf_status("recovering" if force_reinstall else "starting",
                           "Restoring ASF runtime..." if force_reinstall else "Starting ASF...")
            old = asf_holder.get("proc")
            if force_reinstall and old is not None:
                try:
                    old.stop()
                except Exception:
                    pass
                asf_holder["proc"] = None





            exe = None
            try:
                exe = extract_embedded_asf()
            except Exception as e:
                log(f"Ошибка распаковки встроенного ASF: {e}")
            if not exe:
                exe = find_asf_executable(cfg["asf_path"])
            if exe:
                log(f"Найден ASF: {exe}")
                try:
                    enable_betterasf_group(exe)
                except Exception as e:
                    log(f"Ошибка настройки подписки на BetterASF: {e}")
                use_job = str(cfg.get("asf_use_job_object", "false")).lower() in ("1", "true", "yes", "on")
                proc = ASFProcess(exe, use_job_object=use_job)
                proc.start()
                asf_holder["proc"] = proc
                set_asf_status("starting", f"ASF process started ({reason}).")
                return proc
            set_asf_status("offline", "ArchiSteamFarm executable was not found.")
            log("ВНИМАНИЕ: ArchiSteamFarm не найден (ни встроенный, ни рядом).")
            return None

    def wait_for_asf_ipc(timeout):
        deadline = time.time() + timeout
        last = None
        while not exit_event.is_set() and time.time() < deadline:
            ready = ipc_ready(host, port)
            if ready != last:
                log(f"IPC {host}:{port} -> {'ДОСТУПЕН' if ready else 'недоступен'}")
                last = ready
            if ready:
                set_asf_status("online", "ASF IPC is available.")
                log("ASF IPC поднялся. Связь должна работать.")
                return True
            proc = asf_holder.get("proc")
            if proc is not None and not proc.alive():
                set_asf_status("recovering", "ASF process exited before IPC became available.")
                return False
            time.sleep(1.0)
        if not exit_event.is_set():
            set_asf_status("recovering", "ASF IPC startup timeout.")
            log(f"ТАЙМАУТ: IPC {host}:{port} не поднялся за {timeout}с.")
        return False

    def run_plugin_maintenance(operation):

        with start_lock:
            plugin_operation.set()
            set_asf_status("recovering", "Applying plugin changes and restarting ASF...")
            try:
                old = asf_holder.get("proc")
                if old:
                    old.stop()
                asf_holder["proc"] = None
                result = operation()
                if result.get("ok"):
                    start_asf_process(False, "plugin_change")
                return result
            finally:
                plugin_operation.clear()

    def asf_supervisor():
        if str(cfg["start_asf"]).lower() not in ("1", "true", "yes", "on"):
            return
        timeout = int(cfg["startup_timeout"])
        try:
            self_restart_grace = max(15, int(cfg.get("asf_self_restart_grace", "90") or 90))
        except Exception:
            self_restart_grace = 90
        start_asf_process(False, "startup")
        wait_for_asf_ipc(timeout)
        while not exit_event.is_set():
            if plugin_operation.is_set():
                time.sleep(1.0)
                continue
            proc = asf_holder.get("proc")
            if proc is None:
                set_asf_status("recovering", "ASF process is missing. Starting the existing runtime...")
                start_asf_process(False, "missing_process")
                wait_for_asf_ipc(timeout)
            elif not proc.alive():


                set_asf_status("recovering", "Waiting for ASF self-update restart...")
                log(f"ASF launcher PID exited. Waiting up to {self_restart_grace}s for its self-update successor; runtime will be preserved.")
                successor_ready = False
                for _ in range(self_restart_grace):
                    if exit_event.is_set() or plugin_operation.is_set():
                        return
                    if ipc_ready(host, port):
                        set_asf_status("online", "ASF IPC is available after self-update restart.")
                        proc.mark_self_update_successor()
                        log("ASF self-update successor opened IPC successfully.")
                        successor_ready = True
                        break
                    time.sleep(1.0)
                if not successor_ready:

                    set_asf_status("recovering", "ASF did not restart itself. Trying the current runtime without reset...")
                    log("ASF successor did not open IPC. Restarting the current runtime without deleting ASF-runtime.")
                    start_asf_process(False, "after_self_update")
                    wait_for_asf_ipc(timeout)
            else:
                if ipc_ready(host, port):
                    if RUNTIME.get("asf_status") != "online":
                        set_asf_status("online", "ASF IPC is available.")
                elif proc.replaced_by_self_update:


                    proc.replaced_by_self_update = False
                    set_asf_status("recovering", "ASF self-update successor lost IPC. Checking restart...")
                elif RUNTIME.get("asf_status") == "online":
                    set_asf_status("starting", "ASF process is alive, IPC is temporarily unavailable.")
            time.sleep(2.0)

    supervisor_started = {"done": False}

    def start_asf_supervisor_once():
        if supervisor_started["done"]:
            return
        supervisor_started["done"] = True
        log("ASF supervisor: starting after UI initialization.")
        threading.Thread(target=asf_supervisor, daemon=True).start()
        hour_farm_service.start()
        login_request_service.start()

    RUNTIME["steam_api_key"] = cfg.get("steam_api_key", "")
    RUNTIME["ipc_password"] = cfg.get("ipc_password", "")
    inject = {
        "apiBase": "",
        "ipcPort": port,
        "password": cfg["ipc_password"],
        "theme": theme,
        "appName": APP_NAME,
        "appVersion": APP_VERSION,
        "githubRepo": GITHUB_REPO,
        "hasApiKey": bool(cfg.get("steam_api_key")),
        "frameless": frameless if ui_mode == "webview" else False,
        "interfaceMode": ui_mode,
    }

    if not UI_DIR.exists():
        log(f"ОШИБКА: не найдена папка интерфейса: {UI_DIR}")
        sys.exit(1)

    def plugin_runtime_dir():
        process = asf_holder.get("proc")
        if process and process.exe:
            return str(Path(process.exe).parent)
        existing = find_asf_executable(cfg.get("asf_path", ""))
        return str(Path(existing).parent) if existing else None

    plugin_manager = ASFPluginManager(plugin_runtime_dir, run_plugin_maintenance)
    settings_service = SettingsService()
    theme_service = ThemeService()
    event_log_service = EventLogService()
    global _EVENT_LOG_SERVICE
    _EVENT_LOG_SERVICE = event_log_service
    steam_metadata_service = SteamMetadataService(lambda: RUNTIME.get("steam_api_key") or _load_settings().get("steam_api_key", ""))
    bot_service = BotService(host, port, lambda: RUNTIME.get("ipc_password") or cfg.get("ipc_password", ""))
    bot_config_service = BotConfigService(bot_service)
    login_request_service = LoginRequestService(bot_service, exit_event)
    hour_farm_service = HourFarmService(host, port, lambda: RUNTIME.get("ipc_password") or cfg.get("ipc_password", ""), exit_event, steam_metadata_service)
    cache_service = CacheService(steam_metadata_service, event_log_service)
    diagnostics_service = DiagnosticsService(bot_service, hour_farm_service, login_request_service, cache_service)
    update_service = UpdateService(bot_service)

    try:
        httpd, ui_port = start_local_server(
            UI_DIR, host, port, inject, int(cfg["ui_port"]),
            stats_provider=lambda: app_memory_stats(
                asf_holder.get("proc").proc.pid if asf_holder.get("proc") and asf_holder.get("proc").proc else None,
                exclude_pids=[RUNTIME.get("browser_pid")],
                include_orphan_webview2=str(cfg.get("memory_include_orphan_webview2", "true")).lower() in ("1", "true", "yes", "on"),
            ),
            exit_callback=lambda: exit_event.set(),
            plugin_manager=plugin_manager,
            hour_farm_service=hour_farm_service,
            bot_service=bot_service,
            login_request_service=login_request_service,
            bot_config_service=bot_config_service,
            steam_metadata_service=steam_metadata_service,
            settings_service=settings_service,
            theme_service=theme_service,
            event_log_service=event_log_service,
            cache_service=cache_service,
            diagnostics_service=diagnostics_service,
            update_service=update_service,
        )
    except Exception as e:
        log(f"Не удалось запустить локальный сервер: {e}")
        sys.exit(1)

    local_url = f"http://127.0.0.1:{ui_port}/"
    log(f"Интерфейс: {local_url}  (прокси -> {host}:{port})")

    for _ in range(50):
        if ipc_ready("127.0.0.1", ui_port):
            break
        time.sleep(0.05)

    _stopped = {"done": False}
    bridge_ref = {"bridge": None}

    def cleanup():
        if _stopped["done"]:
            return
        _stopped["done"] = True
        exit_event.set()
        hour_farm_service.stop()
        login_request_service.stop()
        RUNTIME["asf_status"] = "stopping"
        RUNTIME["asf_status_message"] = "BetterASF is shutting down."
        log("Завершение работы...")
        try:
            br = bridge_ref.get("bridge")
            if br:
                br._stop_tray()
        except Exception:
            pass
        try:
            httpd.shutdown()
        except Exception:
            pass
        proc = asf_holder.get("proc")
        if proc:
            proc.stop()

    if ui_mode == "browser":
        browser_proc = launch_browser_app(local_url, cfg.get("browser_path", ""))
        RUNTIME["browser_pid"] = browser_proc.pid if browser_proc is not None else None
        start_asf_supervisor_once()
        log("Browser Mode: WebView2 внутри BetterASF не запускается. Закройте окно браузера или нажмите Ctrl+C для выхода.")
        try:
            while not exit_event.is_set():
                if browser_proc is not None and browser_proc.poll() is not None:
                    log("Окно внешнего браузера закрыто.")
                    break
                time.sleep(0.5)
        except KeyboardInterrupt:
            pass
        finally:
            cleanup()
        return

    if webview is None:
        log("pywebview недоступен, переключаюсь на Browser Mode.")
        browser_proc = launch_browser_app(local_url, cfg.get("browser_path", ""))
        RUNTIME["browser_pid"] = browser_proc.pid if browser_proc is not None else None
        start_asf_supervisor_once()
        try:
            while not exit_event.is_set():
                if browser_proc is not None and browser_proc.poll() is not None:
                    break
                time.sleep(0.5)
        except KeyboardInterrupt:
            pass
        finally:
            cleanup()
        return

    configure_webview2_low_memory(cfg)

    bridge = Bridge()
    bridge_ref["bridge"] = bridge
    bg = "#000000" if theme == "dark" else "#f5f5f7"
    window = webview.create_window(
        title=cfg["window_title"],
        url=local_url,
        width=int(cfg["window_width"]),
        height=int(cfg["window_height"]),
        min_size=(900, 600),
        background_color=bg,
        frameless=frameless,
        easy_drag=False,
        resizable=True,
        js_api=bridge,
    )
    bridge._window = window

    def on_loaded():
        start_asf_supervisor_once()
        if get_app_setting("launch_minimized", False):
            def delayed_minimize():
                time.sleep(0.35)
                try:
                    bridge.minimize()
                except Exception:
                    pass
            threading.Thread(target=delayed_minimize, daemon=True).start()

    try:
        window.events.loaded += on_loaded
    except Exception:
        pass
    window.events.closed += cleanup

    def delayed_supervisor_fallback():
        time.sleep(12.0)
        start_asf_supervisor_once()

    threading.Thread(target=delayed_supervisor_fallback, daemon=True).start()

    gui = "edgechromium" if os.name == "nt" else None
    try:
        webview.start(gui=gui, debug=False)
    finally:
        cleanup()


if __name__ == "__main__":
    main()
