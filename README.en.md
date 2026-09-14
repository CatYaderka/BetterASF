# BetterASF

[Русский](README.ru.md) · **English** · [Українська](README.uk.md)

**BetterASF 3.0** is an unofficial Windows desktop launcher and WebView2 interface for [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm). It keeps bot management, ASF commands, plugin management, card farming and hour-farming controls in one window.

## Features

- Starts and supervises ASF through its IPC API.
- Keeps user data in `Documents\BetterASF`, outside `Program Files` and outside the application executable.
- Creates and edits bot configurations from the UI.
- Supports Steam Guard, 2FA, parental-code and login confirmations.
- A deferred login request appears as a blinking yellow **Login requests** navigation item; it does not repeatedly reopen its modal.
- Provides an ASF plugin library and a GitHub-backed plugin store.
- Uses `plugin_catalog.json` as a remotely updateable source list for the store.
- Offers hour-farming ordering by ascending playtime, descending playtime, or Steam’s current popular-games list.
- Offers Russian, English and Ukrainian UI languages.
- Supports tray mode, start minimized and Windows autostart.
- Includes WebView2 memory-saving settings and BetterASF self-update support.

## Requirements

- Windows 10/11;
- Python 3.10+ for source runs;
- Microsoft Edge WebView2 Runtime;
- ArchiSteamFarm;
- a Steam Web API key only for features that need the owned-games list.

## Run from source

```bat
python -m pip install -r requirements.txt
python asf_desktop.py
```

Useful scripts:

```text
Run-ASF-Desktop.bat  normal launch
Debug-Run.bat        launch with diagnostics
```

## Build

On Windows, run:

```bat
build_exe.bat
```

The result is:

```text
dist\BetterASF.exe
```

A single-file build installs itself into `Program Files\BetterASF` on first launch and creates Desktop and Start Menu shortcuts. User data remains in:

```text
Documents\BetterASF\config\       bot configuration
Documents\BetterASF\ASF-runtime\  ASF runtime
```

To embed ASF, put the contents of an ASF Windows release into `_asf` before building, so that `_asf\ArchiSteamFarm.exe` exists.

## ASF update recovery

ASF self-update replaces the old process with a new PID. BetterASF waits for the replacement process and preserves the existing runtime instead of deleting it automatically. Startup diagnostics are saved to:

```text
Documents\BetterASF\debug-log.txt
Documents\BetterASF\asf-launch.log
```

## Plugin store

The store reads its source list from:

```text
plugin_catalog.json
```

When the Plugin Store is opened, BetterASF conditionally fetches the same file from the `main` branch of this repository using HTTP ETags. Release metadata is refreshed only when the catalogue changed. The cache is stored in:

```text
Documents\BetterASF\plugin-catalog-cache.json
```

Only add repositories and release ZIP files you trust. ASF plugins run inside the ASF process and can execute arbitrary code.

## Configuration highlights

| Setting | Purpose |
| --- | --- |
| `asf_path` | Explicit path to `ArchiSteamFarm.exe`. |
| `ipc_host`, `ipc_port` | ASF IPC endpoint. |
| `startup_timeout` | ASF startup/IPC timeout. |
| `asf_self_restart_grace` | Time to wait for ASF self-update restart. |
| `asf_use_job_object` | Keep `false` for better ASF self-update compatibility. |
| `webview_low_memory` | Enables WebView2 memory reductions. |

## License and disclaimer

BetterASF is distributed under the [MIT License](LICENSE). It is not an official part of ArchiSteamFarm and is not affiliated with JustArchiNET. Steam and related marks belong to their respective owners.
