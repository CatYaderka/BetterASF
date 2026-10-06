# BetterASF

[Русский](README.ru.md) · **English** · [Українська](README.uk.md)

BetterASF is a Windows desktop interface for [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm). It runs ASF in the background and brings bot management, farming, plugins and application settings into one WebView2 window.

## Features

### ASF control

- Starts ASF together with BetterASF.
- Monitors IPC and connection state.
- Waits for ASF self-update replacement processes without deleting the runtime.
- Saves startup diagnostics to `debug-log.txt` and `asf-launch.log`.
- Restarts ASF and checks for ASF updates from Settings.
- Supports tray mode, start minimized and Windows autostart.

### Bots

- Creates, edits and deletes bot configurations.
- Shows compact account cards in the Bots view.
- Opens a dedicated account profile window.
- Provides Settings, Start/Pause and Enable/Disable controls.
- Shows current games with Steam titles and cover art, including BetterASF hour-farming games.
- Displays aggregate online, farming, memory and uptime statistics.

### Steam Guard and sign-in

- Handles passwords, Steam Guard, 2FA, parental codes and login confirmation.
- Defers prompts with Later without immediately reopening them.
- Shows a blinking yellow Login requests navigation item below Settings.
- Writes new local log entries in the selected interface language.

### Card and hour farming

- Runs hour-farming automation in a background Python service, independent of WebView2.
- Starts hour farming after card farming finishes.
- Starts hour farming when BetterASF opens.
- Supports a separate game limit for each account.
- Supports per-account priority AppIDs.
- Orders games by ascending or descending playtime.
- Supports Steam’s current popular-games ranking.
- Returns ASF to card farming when an account receives queued card-drop games.
- Reapplies hour farming after connection recovery when appropriate.

### Plugins

- Lists installed ASF plugins.
- Shows the public plugin name from ASF `IPlugin.Name`.
- Recognizes bundled official plugins when ASF IPC is unavailable.
- Installs and removes GitHub ZIP releases.
- Confirms removal and restarts ASF to apply plugin changes.
- Uses safe extraction limits and path-traversal protection.
- Reads the remotely updateable `plugin_catalog.json` through HTTP ETags.

### Interface

- Russian, English and Ukrainian languages.
- Standard dark and light themes.
- Dead Dream themes.
- Custom theme with a dark/light base, PNG/JPG/WebP/GIF/MP4/WebM media background and transparent interface elements.
- Economy UI mode, event log and bot context menu.

## Quick start from source

Requires Windows 10/11, Python 3.10+, Edge WebView2 Runtime and ASF.

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

On Windows:

```bat
build_exe.bat
```

Output:

```text
dist\BetterASF.exe
```

The executable installs itself on first launch to:

```text
Program Files\BetterASF
```

Desktop and Start Menu shortcuts are created automatically.

## User data

User data is kept outside the executable:

```text
Documents\BetterASF\config\                  bot configurations
Documents\BetterASF\ASF-runtime\             ASF runtime
Documents\BetterASF\settings.json             BetterASF settings
Documents\BetterASF\custom-theme-image.*      custom theme background
Documents\BetterASF\steam-app-index.json        local Steam name catalogue
Documents\BetterASF\steam-covers\              cached Steam covers
Documents\BetterASF\plugin-catalog-cache.json plugin catalogue cache
Documents\BetterASF\debug-log.txt             BetterASF log
Documents\BetterASF\asf-launch.log            ASF startup output
```

To embed ASF, put a Windows ASF release into `_asf` before running `build_exe.bat`, so this file exists:

```text
_asf\ArchiSteamFarm.exe
```

## Plugin catalogue

Allowed plugin sources are listed in:

```text
plugin_catalog.json
```

When the store is opened, BetterASF conditionally downloads this file from the repository `main` branch with ETags. Release metadata is not refreshed unless the catalogue changed.

ASF plugins execute inside the ASF process. Install only projects you trust.

## Security

- Steam passwords and 2FA files remain under ASF’s configuration model.
- Plugin installation is limited to the catalogue rather than arbitrary download URLs.
- Errors supplied by Steam, ASF and GitHub are displayed in their source language.
- Review source code and bundled `_asf` files before trusting a prebuilt executable.

## License and disclaimer

BetterASF is distributed under the [MIT License](../LICENSE). It is not an official ArchiSteamFarm component and is not affiliated with JustArchiNET. Steam and related marks belong to their respective owners.
