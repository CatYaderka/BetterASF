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
from pathlib import Path

try:
    import webview
except Exception:
    webview = None

HERE = Path(__file__).resolve().parent
APP_NAME = "BetterASF"
APP_VERSION = "2.0"
GITHUB_REPO = "CatYaderka/BetterASF"

_LOG_PATH = None
RUNTIME = {"steam_api_key": "", "asf_status": "starting", "asf_status_message": ""}


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


def ui_dir():
    for cand in (RES_DIR / "ui", APP_DIR / "ui"):
        if cand.exists():
            return cand
    return RES_DIR / "ui"


UI_DIR = ui_dir()
SETTINGS_FILE = DATA_DIR / "settings.json"

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
        # The setting is saved everywhere, but real autostart is configured only on Windows builds.
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
    """Create per-user Desktop and Start Menu shortcuts for the current executable."""
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
    """For one-file Windows builds: copy BetterASF.exe to Program Files and relaunch it."""
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

    try {{
        Copy-Item -LiteralPath $src -Destination $dst -Force
        Log 'Copy succeeded.'
    }} catch {{
        Log ('Copy failed: ' + $_.Exception.Message)
        if (Test-Path -LiteralPath $dst) {{
            Log 'Existing installed copy found, starting it.'
            Start-Process -FilePath $dst -WorkingDirectory $dstDir
            exit 0
        }}
        throw
    }}

    try {{ Unblock-File -LiteralPath $dst -ErrorAction SilentlyContinue }} catch {{}}

    $env:BETTERASF_NO_SELF_INSTALL = '1'
    Start-Process -FilePath $dst -WorkingDirectory $dstDir
    Log 'Installed copy started.'

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
    def __init__(self, exe, extra_args=None):
        self.exe = exe
        self.extra_args = extra_args or []
        self.proc = None
        self.job = None

    def start(self):
        # Important: do not pass --NO-RESTART. During self-update ASF terminates
        # the current process and starts a new one; with --NO-RESTART BetterASF would see
        # only a dead PID and keep showing no connection.
        cmd = [self.exe, "--SERVICE"] + list(self.extra_args)
        flags = 0
        if os.name == "nt":
            flags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
        log(f"Запуск ASF: {' '.join(cmd)}")
        log(f"  рабочая папка: {Path(self.exe).parent}")
        try:
            kwargs = dict(
                cwd=str(Path(self.exe).parent),
                creationflags=flags,
                stdin=subprocess.DEVNULL,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            if os.name != "nt":
                kwargs["start_new_session"] = True
            self.proc = subprocess.Popen(cmd, **kwargs)
            log(f"  ASF PID: {self.proc.pid}")

            if os.name == "nt":
                self.job = _create_kill_job()
                if self.job and _assign_to_job(self.job, self.proc.pid):
                    log("  ASF привязан к Job Object (убьётся вместе с приложением).")
                else:
                    log("  ВНИМАНИЕ: Job Object не назначен, используется taskkill.")
        except Exception as e:
            log(f"  ОШИБКА запуска ASF: {e}")

    def alive(self):
        return self.proc is not None and self.proc.poll() is None

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
    """Возвращает рабочий набор процесса в байтах без внешних зависимостей."""
    try:
        pid = int(pid)
    except Exception:
        return 0
    if os.name == "nt":
        try:
            import ctypes
            from ctypes import wintypes

            PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
            PROCESS_VM_READ = 0x0010

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
            kernel32.OpenProcess.restype = wintypes.HANDLE
            kernel32.CloseHandle.argtypes = [wintypes.HANDLE]
            psapi.GetProcessMemoryInfo.restype = wintypes.BOOL
            handle = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ, False, pid)
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
    else:
        try:
            with open(f"/proc/{pid}/statm", "r", encoding="utf-8") as f:
                parts = f.read().split()
            if len(parts) >= 2:
                return int(parts[1]) * os.sysconf("SC_PAGE_SIZE")
        except Exception:
            pass
    return 0


def _child_process_map():
    """Карта parent_pid -> [child_pid] для подсчёта памяти WebView/дочерних процессов."""
    mp = {}
    if os.name == "nt":
        try:
            import ctypes
            from ctypes import wintypes
            TH32CS_SNAPPROCESS = 0x00000002
            INVALID_HANDLE_VALUE = ctypes.c_void_p(-1).value

            class PROCESSENTRY32W(ctypes.Structure):
                _fields_ = [
                    ("dwSize", wintypes.DWORD), ("cntUsage", wintypes.DWORD),
                    ("th32ProcessID", wintypes.DWORD), ("th32DefaultHeapID", ctypes.c_void_p),
                    ("th32ModuleID", wintypes.DWORD), ("cntThreads", wintypes.DWORD),
                    ("th32ParentProcessID", wintypes.DWORD), ("pcPriClassBase", ctypes.c_long),
                    ("dwFlags", wintypes.DWORD), ("szExeFile", wintypes.WCHAR * 260),
                ]

            k32 = ctypes.windll.kernel32
            k32.CreateToolhelp32Snapshot.restype = wintypes.HANDLE
            k32.CloseHandle.argtypes = [wintypes.HANDLE]
            snap = k32.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0)
            if snap == INVALID_HANDLE_VALUE:
                return mp
            try:
                pe = PROCESSENTRY32W()
                pe.dwSize = ctypes.sizeof(pe)
                ok = k32.Process32FirstW(snap, ctypes.byref(pe))
                while ok:
                    mp.setdefault(int(pe.th32ParentProcessID), []).append(int(pe.th32ProcessID))
                    ok = k32.Process32NextW(snap, ctypes.byref(pe))
            finally:
                k32.CloseHandle(snap)
        except Exception:
            return mp
    else:
        try:
            proc = Path("/proc")
            for d in proc.iterdir():
                if not d.name.isdigit():
                    continue
                try:
                    text = (d / "stat").read_text(encoding="utf-8", errors="ignore")
                    # pid (comm) state ppid ...; comm can contain spaces, so use the last closing parenthesis.
                    rest = text[text.rfind(")") + 2:].split()
                    ppid = int(rest[1])
                    mp.setdefault(ppid, []).append(int(d.name))
                except Exception:
                    pass
        except Exception:
            pass
    return mp


def _process_name_map():
    """Карта pid -> exe name. Нужна, потому что WebView2 иногда не висит дочерним процессом Python."""
    names = {}
    if os.name == "nt":
        try:
            import ctypes
            from ctypes import wintypes
            TH32CS_SNAPPROCESS = 0x00000002
            INVALID_HANDLE_VALUE = ctypes.c_void_p(-1).value

            class PROCESSENTRY32W(ctypes.Structure):
                _fields_ = [
                    ("dwSize", wintypes.DWORD), ("cntUsage", wintypes.DWORD),
                    ("th32ProcessID", wintypes.DWORD), ("th32DefaultHeapID", ctypes.c_void_p),
                    ("th32ModuleID", wintypes.DWORD), ("cntThreads", wintypes.DWORD),
                    ("th32ParentProcessID", wintypes.DWORD), ("pcPriClassBase", ctypes.c_long),
                    ("dwFlags", wintypes.DWORD), ("szExeFile", wintypes.WCHAR * 260),
                ]

            k32 = ctypes.windll.kernel32
            k32.CreateToolhelp32Snapshot.restype = wintypes.HANDLE
            k32.CloseHandle.argtypes = [wintypes.HANDLE]
            snap = k32.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0)
            if snap == INVALID_HANDLE_VALUE:
                return names
            try:
                pe = PROCESSENTRY32W()
                pe.dwSize = ctypes.sizeof(pe)
                ok = k32.Process32FirstW(snap, ctypes.byref(pe))
                while ok:
                    names[int(pe.th32ProcessID)] = str(pe.szExeFile or "").lower()
                    ok = k32.Process32NextW(snap, ctypes.byref(pe))
            finally:
                k32.CloseHandle(snap)
        except Exception:
            return names
    else:
        try:
            for d in Path("/proc").iterdir():
                if not d.name.isdigit():
                    continue
                try:
                    names[int(d.name)] = (d / "comm").read_text(encoding="utf-8", errors="ignore").strip().lower()
                except Exception:
                    pass
        except Exception:
            pass
    return names


def _webview2_pids_for_stats(mp, name_map, descendants, include_orphans=True):
    desc = set(descendants or [])
    by_name = {pid for pid, nm in (name_map or {}).items() if nm == "msedgewebview2.exe" or nm == "msedgewebview2"}
    child_webviews = by_name & desc
    if child_webviews:
        return child_webviews, False
    # On some WebView2/COM runtimes msedgewebview2.exe processes are not Python children,
    # while Task Manager still shows them as WebView2. For a realistic BetterASF value,
    # include orphan WebView2 processes; disable this if other WebView2 apps are running.
    return (by_name if include_orphans else set()), True if by_name and include_orphans else False


def _descendants(root_pid, mp):
    out = []
    stack = list(mp.get(int(root_pid), []))
    seen = set()
    while stack:
        pid = stack.pop()
        if pid in seen:
            continue
        seen.add(pid)
        out.append(pid)
        stack.extend(mp.get(pid, []))
    return out


def app_memory_stats(asf_pid=None, exclude_pids=None, include_orphan_webview2=True):
    self_pid = os.getpid()
    mp = _child_process_map()
    name_map = _process_name_map()
    descendants = _descendants(self_pid, mp)
    app_pids = [self_pid] + descendants

    webview_pids, webview_orphan_mode = _webview2_pids_for_stats(mp, name_map, descendants, include_orphan_webview2)
    app_pids = list(dict.fromkeys(app_pids + list(webview_pids)))

    exclude = set()
    if asf_pid:
        try:
            exclude.add(int(asf_pid))
            exclude.update(_descendants(int(asf_pid), mp))
        except Exception:
            pass
    for ep in (exclude_pids or []):
        if ep:
            try:
                exclude.add(int(ep))
                exclude.update(_descendants(int(ep), mp))
            except Exception:
                pass
    app_pids = [p for p in app_pids if p not in exclude]
    webview_pids = [p for p in webview_pids if p not in exclude]

    app_bytes = sum(_process_memory_bytes(p) for p in app_pids)
    webview_bytes = sum(_process_memory_bytes(p) for p in webview_pids)
    self_bytes = _process_memory_bytes(self_pid)
    return {
        "pid": self_pid,
        "pids": app_pids,
        "memoryBytes": app_bytes,
        "memoryKb": int(app_bytes / 1024),
        "selfMemoryKb": int(self_bytes / 1024),
        "webviewPids": list(webview_pids),
        "webviewMemoryKb": int(webview_bytes / 1024),
        "webviewOrphanMode": bool(webview_orphan_mode),
        "asfPid": int(asf_pid) if asf_pid else None,
    }


def ipc_ready(host, port):
    hosts = [host]
    for h in ("127.0.0.1", "::1"):
        if h not in hosts:
            hosts.append(h)
    for h in hosts:
        try:
            with socket.create_connection((h, port), timeout=2):
                return True
        except OSError:
            continue
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


def _local_git_commit():
    try:
        head = APP_DIR / ".git" / "HEAD"
        if head.exists():
            txt = head.read_text(encoding="utf-8", errors="ignore").strip()
            if txt.startswith("ref:"):
                ref = txt.split(" ", 1)[1].strip()
                rp = APP_DIR / ".git" / ref
                if rp.exists():
                    return rp.read_text(encoding="utf-8", errors="ignore").strip()[:12]
            return txt[:12]
    except Exception:
        pass
    return ""


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
    """Проверяет релизы BetterASF на GitHub и отдаёт прямую ссылку на скачивание последней версии."""
    result = {
        "ok": False,
        "update": False,
        "currentVersion": APP_VERSION,
        "repo": GITHUB_REPO,
        "message": "Не удалось проверить обновления.",
    }
    headers = {"User-Agent": f"{APP_NAME}/{APP_VERSION}", "Accept": "application/vnd.github+json"}
    current_tuple = _version_tuple(APP_VERSION)

    # 1) Main path: GitHub Releases. Pick the newest release by semver tag_name.
    try:
        req = urllib.request.Request(f"https://api.github.com/repos/{GITHUB_REPO}/releases?per_page=30", headers=headers)
        with urllib.request.urlopen(req, timeout=8) as r:
            releases = json.loads(r.read().decode("utf-8", "ignore"))
        candidates = []
        for rel in releases if isinstance(releases, list) else []:
            if rel.get("draft"):
                continue
            tag = rel.get("tag_name") or rel.get("name") or ""
            ver = _normalize_version(tag)
            if not ver:
                continue
            vt = _version_tuple(ver)
            candidates.append((vt, ver, rel))
        if candidates:
            candidates.sort(key=lambda x: x[0], reverse=True)
            latest_tuple, latest_v, latest_rel = candidates[0]
            has_update = latest_tuple > current_tuple
            download_url = _best_release_asset(latest_rel)
            result.update({
                "ok": True,
                "source": "release",
                "update": bool(has_update),
                "currentVersion": APP_VERSION,
                "latestVersion": latest_v,
                "url": latest_rel.get("html_url") or f"https://github.com/{GITHUB_REPO}/releases/latest",
                "downloadUrl": download_url,
                "message": (f"Доступна новая версия BetterASF v{latest_v}" if has_update else f"BetterASF v{APP_VERSION} — актуальная версия."),
            })
            return result
    except Exception as e:
        log(f"GitHub update releases error: {e}")

    # 2) Fallback: if no releases exist, check tags. This is not a release download, but shows a new tag.
    try:
        req = urllib.request.Request(f"https://api.github.com/repos/{GITHUB_REPO}/tags?per_page=30", headers=headers)
        with urllib.request.urlopen(req, timeout=8) as r:
            tags = json.loads(r.read().decode("utf-8", "ignore"))
        candidates = []
        for tag in tags if isinstance(tags, list) else []:
            name = tag.get("name") or ""
            ver = _normalize_version(name)
            if ver:
                candidates.append((_version_tuple(ver), ver, tag))
        if candidates:
            candidates.sort(key=lambda x: x[0], reverse=True)
            latest_tuple, latest_v, tag = candidates[0]
            has_update = latest_tuple > current_tuple
            zip_url = f"https://github.com/{GITHUB_REPO}/archive/refs/tags/{tag.get('name')}.zip"
            result.update({
                "ok": True,
                "source": "tag",
                "update": bool(has_update),
                "currentVersion": APP_VERSION,
                "latestVersion": latest_v,
                "url": f"https://github.com/{GITHUB_REPO}/releases/latest",
                "downloadUrl": zip_url,
                "message": (f"Доступен новый тег BetterASF v{latest_v}" if has_update else f"BetterASF v{APP_VERSION} — актуальная версия."),
            })
            return result
    except Exception as e:
        log(f"GitHub update tags error: {e}")
        result["error"] = str(e)

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
    """Start an elevated visible updater that downloads the latest exe, closes BetterASF/ASF and replaces the installed copy."""
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


def make_handler(ui_path, asf_host, asf_port, inject, stats_provider=None, exit_callback=None):
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

        def _settings(self):
            if self.command == "GET":
                data = _load_settings()
                payload = {
                    "minimize_to_tray": bool(data.get("minimize_to_tray", False)),
                    "autostart": bool(data.get("autostart", False)),
                    "economy_mode": bool(data.get("economy_mode", False)),
                    "auto_hour_farm_after_cards": bool(data.get("auto_hour_farm_after_cards", False)),
                    "start_hour_farm_on_launch": bool(data.get("start_hour_farm_on_launch", False)),
                    "launch_minimized": bool(data.get("launch_minimized", False)),
                    "priority_hour_farm_appids": str(data.get("priority_hour_farm_appids", "") or ""),
                    "steam_api_key": bool((RUNTIME.get("steam_api_key") or data.get("steam_api_key") or "").strip()),
                    "ui_mode": inject.get("interfaceMode", "browser"),
                }
                self._send_bytes(json.dumps(payload).encode(), "application/json")
                return
            try:
                length = int(self.headers.get("Content-Length", 0) or 0)
                raw = self.rfile.read(length).decode("utf-8", "ignore") if length else "{}"
                patch = json.loads(raw or "{}")
            except Exception:
                self._send_bytes(json.dumps({"ok": False, "message": "bad json"}).encode(), "application/json", 400)
                return
            ok = True
            for key, value in patch.items():
                if key == "autostart":
                    ok = bool(set_autostart_enabled(bool(value))) and ok
                elif key in ("minimize_to_tray", "economy_mode", "auto_hour_farm_after_cards", "start_hour_farm_on_launch", "launch_minimized"):
                    set_app_setting(key, bool(value))
                elif key == "theme" and value in ("dark", "light"):
                    save_theme(value)
                elif key == "priority_hour_farm_appids":
                    raw = str(value or "")
                    # Keep only digits and common separators; UI normalizes the value too.
                    cleaned = "".join(ch if (ch.isdigit() or ch in ",; \n\t") else " " for ch in raw)
                    set_app_setting(key, cleaned.strip())
                elif key == "steam_api_key":
                    val = (value or "").strip()
                    RUNTIME["steam_api_key"] = val
                    save_api_key(val)
                else:
                    ok = False
            self._send_bytes(json.dumps({"ok": ok}).encode(), "application/json")

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
            elif self.path.startswith("/__appstats"):
                try:
                    info = stats_provider() if stats_provider else app_memory_stats(None)
                except Exception as e:
                    info = {"error": str(e), "memoryKb": 0, "memoryBytes": 0}
                self._send_bytes(json.dumps(info).encode(), "application/json")
            elif self.path.startswith("/__games"):
                self._games()
            elif self.path.startswith("/Api/"):
                self._proxy("GET")
            else:
                self._serve_static()

        def do_POST(self):
            if self.path.startswith("/__settings"):
                self._settings()
            elif self.path.startswith("/__install_update"):
                result = install_github_update(exit_callback)
                self._send_bytes(json.dumps(result).encode(), "application/json", 200 if result.get("ok") else 500)
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
            self._proxy("DELETE") if self.path.startswith("/Api/") else self.send_error(404)

    return Handler


class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def start_local_server(ui_path, asf_host, asf_port, inject, want_port=0, stats_provider=None, exit_callback=None):
    handler = make_handler(ui_path, asf_host, asf_port, inject, stats_provider, exit_callback)
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
    """Сбрасывает неиспользуемые resident pages процесса. Это снижает Working Set в Диспетчере задач."""
    if os.name != "nt":
        return False
    try:
        import ctypes
        from ctypes import wintypes
        pid = int(pid)
        PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
        PROCESS_SET_QUOTA = 0x0100
        kernel32 = ctypes.windll.kernel32
        psapi = ctypes.windll.psapi
        kernel32.OpenProcess.restype = wintypes.HANDLE
        handle = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_SET_QUOTA, False, pid)
        if not handle:
            return False
        try:
            # EmptyWorkingSet is softer and safer than SetProcessWorkingSetSize(-1, -1).
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
    """Настраивает Edge WebView2 через WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS.

    Режим рассчитан на тест памяти: single-process + отключение фоновых сервисов.
    GPU по умолчанию НЕ отключаем, потому что на системе пользователя это уже давало серое окно.
    Если нужно проверить совсем жёстко — webview_disable_gpu=true в config.ini.
    """
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
        # Edge background services/networking not needed by the local UI
        "--disable-background-networking",
        "--disable-sync",
        "--disable-extensions",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-domain-reliability",
        "--disable-background-mode",
        "--no-first-run",
        "--no-default-browser-check",
        "--no-service-autorun",

        # Unused subsystems
        "--disable-print-preview",
        "--disable-speech-api",
        "--disable-notifications",
        "--mute-audio",
        "--metrics-recording-only",
        "--disable-logging",
        "--log-level=3",

        # Cache/profile: reduce disk and media cache
        "--disk-cache-size=1",
        "--media-cache-size=1",

        # Limit UI JS heap so leaks/DOM growth cannot expand indefinitely
        "--js-flags=--max-old-space-size=96",
    ]

    if single_process:
        flags += [
            # Requested WebView2 single-process mode. Chromium/WebView2 can partially ignore
            # this flag in newer runtimes, but when allowed the renderer moves into the browser process.
            "--single-process",
            "--renderer-process-limit=1",
            "--process-per-site",
        ]

    if aggressive:
        flags += [
            # Reduce isolated renderer process count and extra services.
            # This is less safe for a normal browser, but BetterASF UI is local: 127.0.0.1.
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
            # Try to remove the separate GPU process while keeping hardware acceleration.
            # May be unstable on some drivers, therefore exposed in config.ini.
            "--in-process-gpu",
        ]

    if disable_gpu:
        flags += [
            # The riskiest block. It can reduce GPU memory, but may cause a gray window on some systems.
            "--disable-gpu",
            "--disable-gpu-compositing",
            "--disable-accelerated-video-decode",
            "--disable-accelerated-video-encode",
            "--disable-smooth-scrolling",
        ]

    extra = (cfg.get("webview_extra_args") or "").strip()
    if extra:
        flags.extend(extra.split())

    # Remove duplicates while preserving order.
    value = " ".join(dict.fromkeys(flags))
    os.environ["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = value
    log(
        "WebView2 Low Memory: включён "
        f"(aggressive={aggressive}, single_process={single_process}, in_process_gpu={in_process_gpu}, disable_gpu={disable_gpu})."
    )
    log(f"WebView2 args: {value}")


def launch_browser_app(url, configured=""):
    """Открывает UI во внешнем браузере в app-режиме без WebView2 внутри BetterASF."""
    profile = DATA_DIR / "BrowserProfile"
    profile.mkdir(parents=True, exist_ok=True)
    for cand in _browser_candidates(configured):
        exe = None
        if cand.exists():
            exe = str(cand)
        else:
            exe = _which_program(str(cand))
        if not exe:
            continue
        name = Path(exe).name.lower()
        try:
            if "firefox" in name:
                cmd = [exe, "--new-window", url]
            else:
                cmd = [
                    exe, f"--app={url}", f"--user-data-dir={profile}",
                    "--no-first-run", "--no-default-browser-check", "--disable-extensions",
                ]
            log(f"Запуск внешнего интерфейса: {' '.join(cmd)}")
            return subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception as e:
            log(f"Не удалось запустить браузер {exe}: {e}")
            continue
    try:
        import webbrowser
        log("Не найден Edge/Chrome, открываю системный браузер обычным способом.")
        webbrowser.open(url)
    except Exception as e:
        log(f"Не удалось открыть браузер: {e}")
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
                # Fallback only when the icon file is missing.
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
            "priority_hour_farm_appids": str(data.get("priority_hour_farm_appids", "") or ""),
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
            # If ASF starts a new process after update, IPC will appear without our intervention.
            # Only if the port is still unavailable after 8 seconds, start ASF again manually.
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

    start_lock = threading.Lock()

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
            if force_reinstall:
                reset_embedded_asf_runtime()

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
                proc = ASFProcess(exe)
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

    def asf_supervisor():
        if str(cfg["start_asf"]).lower() not in ("1", "true", "yes", "on"):
            return
        timeout = int(cfg["startup_timeout"])
        start_asf_process(False, "startup")
        wait_for_asf_ipc(timeout)
        while not exit_event.is_set():
            proc = asf_holder.get("proc")
            if proc is None:
                set_asf_status("recovering", "ASF process is missing. Restarting...")
                start_asf_process(True, "missing_process")
                wait_for_asf_ipc(timeout)
            elif not proc.alive():
                set_asf_status("recovering", "ASF process exited. Waiting for possible self-restart...")
                log("ASF process exited while BetterASF is still running. Waiting 8s before runtime recovery.")
                recovered_by_self = False
                for _ in range(8):
                    if exit_event.is_set():
                        return
                    if ipc_ready(host, port):
                        set_asf_status("online", "ASF IPC is available after self-restart.")
                        recovered_by_self = True
                        break
                    time.sleep(1.0)
                if recovered_by_self:
                    continue
                set_asf_status("recovering", "ASF crashed. Restoring bundled runtime...")
                log("ASF did not recover by itself. Removing ASF-runtime and extracting bundled ASF again.")
                start_asf_process(True, "process_exit")
                wait_for_asf_ipc(timeout)
            else:
                if ipc_ready(host, port):
                    if RUNTIME.get("asf_status") != "online":
                        set_asf_status("online", "ASF IPC is available.")
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

    RUNTIME["steam_api_key"] = cfg.get("steam_api_key", "")
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

    try:
        httpd, ui_port = start_local_server(
            UI_DIR, host, port, inject, int(cfg["ui_port"]),
            stats_provider=lambda: app_memory_stats(
                asf_holder.get("proc").proc.pid if asf_holder.get("proc") and asf_holder.get("proc").proc else None,
                exclude_pids=[RUNTIME.get("browser_pid")],
                include_orphan_webview2=str(cfg.get("memory_include_orphan_webview2", "true")).lower() in ("1", "true", "yes", "on"),
            ),
            exit_callback=lambda: exit_event.set(),
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
