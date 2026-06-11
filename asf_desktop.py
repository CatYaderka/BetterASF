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

import webview

HERE = Path(__file__).resolve().parent
APP_NAME = "BetterASF"

_LOG_PATH = None
RUNTIME = {"steam_api_key": ""}


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
    "startup_timeout": "60",
    "theme": "dark",
    "frameless": "true",
    "ui_port": "0",
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


def link_external_config(runtime):
    ext_cfg = DATA_DIR / "config"
    rt_cfg = runtime / "config"
    if not ext_cfg.exists():
        if rt_cfg.exists():
            try:
                rt_cfg.rename(ext_cfg)
            except Exception:
                ext_cfg.mkdir(parents=True, exist_ok=True)
        else:
            ext_cfg.mkdir(parents=True, exist_ok=True)
    try:
        if rt_cfg.exists() and not rt_cfg.is_symlink():
            import shutil
            shutil.rmtree(rt_cfg, ignore_errors=True)
        if not rt_cfg.exists():
            os.symlink(str(ext_cfg), str(rt_cfg), target_is_directory=True)
    except Exception:
        try:
            if os.name == "nt" and not rt_cfg.exists():
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

            rc = data.get("RemoteCommunication")
            if not isinstance(rc, int):
                rc = 3
            if not (rc & 1):
                rc = rc | 1
                data["RemoteCommunication"] = rc
                changed = True
            elif "RemoteCommunication" not in data:
                data["RemoteCommunication"] = rc
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
        cmd = [self.exe, "--SERVICE", "--NO-RESTART"] + list(self.extra_args)
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


def make_handler(ui_path, asf_host, asf_port, inject):
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
                        self.end_headers()
                        self.wfile.write(payload)
                        return
                except urllib.error.HTTPError as e:
                    payload = e.read()
                    Handler.good_host = hostc
                    self.send_response(e.code)
                    self.send_header("Content-Type", e.headers.get("Content-Type", "application/json"))
                    self.send_header("Content-Length", str(len(payload)))
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
            elif self.path.startswith("/__games"):
                self._games()
            elif self.path.startswith("/Api/"):
                self._proxy("GET")
            else:
                self._serve_static()

        def do_POST(self):
            if self.path.startswith("/Api/"):
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


def start_local_server(ui_path, asf_host, asf_port, inject, want_port=0):
    handler = make_handler(ui_path, asf_host, asf_port, inject)
    httpd = ThreadingServer(("127.0.0.1", want_port), handler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, port


class Bridge:
    def __init__(self):
        self.window = None
        self._max = False

    def minimize(self):
        try:
            self.window.minimize()
        except Exception:
            pass

    def toggle_maximize(self):
        try:
            self.window.restore() if self._max else self.window.maximize()
            self._max = not self._max
        except Exception:
            pass

    def close(self):
        try:
            self.window.destroy()
        except Exception:
            pass

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
            log("ВНИМАНИЕ: процесс ASF завершился. Смотрите log.txt в папке config ASF.")
            return
        time.sleep(1.0)
    log(f"ТАЙМАУТ: IPC {host}:{port} не поднялся за {timeout}с.")
    proc = asf_holder.get("proc")
    if proc is not None:
        log(f"  процесс ASF жив: {proc.alive()}")


def main():
    cfg = load_config()
    host = cfg["ipc_host"]
    port = int(cfg["ipc_port"])
    frameless = str(cfg["frameless"]).lower() in ("1", "true", "yes", "on")
    theme = cfg["theme"] if cfg["theme"] in ("dark", "light") else "dark"

    try:
        _set_log_path(DATA_DIR / "debug-log.txt")
    except Exception:
        pass

    log(f"frozen={is_frozen()}  APP_DIR={APP_DIR}")
    log(f"DATA_DIR={DATA_DIR}")
    log(f"UI_DIR={UI_DIR}")
    log(f"IPC цель: {host}:{port}  start_asf={cfg['start_asf']}  password={'да' if cfg['ipc_password'] else 'нет'}")

    asf_holder = {"proc": None}

    def launch_asf():
        if str(cfg["start_asf"]).lower() not in ("1", "true", "yes", "on"):
            log("start_asf=false -> ASF должен быть запущен отдельно.")
            return
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
        else:
            log("ВНИМАНИЕ: ArchiSteamFarm не найден (ни встроенный, ни рядом).")

    threading.Thread(target=launch_asf, daemon=True).start()

    RUNTIME["steam_api_key"] = cfg.get("steam_api_key", "")
    inject = {
        "apiBase": "",
        "ipcPort": port,
        "password": cfg["ipc_password"],
        "theme": theme,
        "appName": APP_NAME,
        "hasApiKey": bool(cfg.get("steam_api_key")),
        "frameless": frameless,
    }

    if not UI_DIR.exists():
        log(f"ОШИБКА: не найдена папка интерфейса: {UI_DIR}")
        sys.exit(1)

    try:
        httpd, ui_port = start_local_server(UI_DIR, host, port, inject, int(cfg["ui_port"]))
    except Exception as e:
        log(f"Не удалось запустить локальный сервер: {e}")
        sys.exit(1)

    local_url = f"http://127.0.0.1:{ui_port}/"
    log(f"Интерфейс: {local_url}  (прокси -> {host}:{port})")

    threading.Thread(
        target=monitor_ipc, args=(host, port, int(cfg["startup_timeout"]), asf_holder),
        daemon=True,
    ).start()

    for _ in range(50):
        if ipc_ready("127.0.0.1", ui_port):
            break
        time.sleep(0.05)

    bridge = Bridge()
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
    bridge.window = window

    _stopped = {"done": False}

    def cleanup():
        if _stopped["done"]:
            return
        _stopped["done"] = True
        log("Завершение работы...")
        try:
            httpd.shutdown()
        except Exception:
            pass
        proc = asf_holder.get("proc")
        if proc:
            proc.stop()

    window.events.closed += cleanup

    gui = "edgechromium" if os.name == "nt" else None
    try:
        webview.start(gui=gui, debug=False)
    finally:
        cleanup()


if __name__ == "__main__":
    main()
