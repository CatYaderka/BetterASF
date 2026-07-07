<div align="center">

<img src=".github/logo.png" alt="BetterASF" width="140" />

# BetterASF v2.0

**Современный desktop-интерфейс для [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm) на Python, pywebview и Edge WebView2.**

</div>

---

## Что это

BetterASF запускает ASF в фоне и открывает удобный нативный интерфейс управления ботами, командами, плагинами, Steam Guard и фармом карточек. Проект хранит пользовательские данные в `Documents\BetterASF`, поэтому конфиги ботов не теряются при обновлении программы.

## Главное в v2.0

- **Оптимизированный WebView2-режим**: агрессивные флаги Chromium, `single-process`/ограничение renderer-процессов, trim working set и корректный подсчёт памяти WebView2.
- **Автозапуск ASF и устойчивость к самообновлению ASF**: BetterASF запускает ASF без `--NO-RESTART`, корректно переживает обновление ASF и повторно стартует процесс, если IPC не поднялся.
- **Автоподписка на группу BetterASF**: для ботов задаётся `s_SteamMasterClanID = 103582791475681171`; автоподписка на оригинальную группу ASF не включается.
- **4 темы оформления**:
  - тёмная стандартная;
  - светлая стандартная;
  - тёмная Dead Dream;
  - светлая Dead Dream.
- **Статистика фарма**: игры, карточки, примерное оставшееся время, состояние ботов и память `ASF / BetterASF / WebView2`.
- **Фарм часов**:
  - ручной запуск через кнопку-молнию;
  - автоматический запуск после завершения фарма карточек;
  - запуск фарма часов при старте BetterASF.
- **Системные настройки**:
  - сворачивание в tray;
  - запуск вместе с Windows;
  - запуск в минимизированном состоянии;
  - кнопки перезагрузки ASF и проверки обновления ASF.
- **Проверка обновлений BetterASF через GitHub Releases**: если доступен релиз новее текущей версии, снизу появляется уведомление с кнопкой скачивания.

## Быстрый старт

### 1. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 2. Запуск

```bash
python asf_desktop.py
```

Или используйте готовые `.bat`-файлы:

- `Run-ASF-Desktop.bat` — обычный запуск;
- `Debug-Run.bat` — запуск с консолью и диагностикой.

### 3. ASF runtime

BetterASF ищет ASF в нескольких местах:

- `Documents\BetterASF\ASF-runtime\ArchiSteamFarm.exe`;
- рядом с приложением;
- путь из `config.ini` (`asf_path`).

Если в сборку встроена папка `_asf`, она распаковывается в `Documents\BetterASF\ASF-runtime`.

## Конфигурация

Основной файл:

```text
config.ini
```

Пользовательские настройки интерфейса сохраняются в:

```text
Documents\BetterASF\settings.json
```

Конфиги ботов ASF хранятся в:

```text
Documents\BetterASF\config
```

### Важные параметры `config.ini`

| Параметр | Назначение |
|---|---|
| `start_asf` | Запускать ASF вместе с BetterASF. |
| `ipc_host`, `ipc_port` | Адрес IPC ASF. По умолчанию `127.0.0.1:1242`. |
| `startup_timeout` | Сколько ждать поднятия ASF IPC. |
| `ui_mode` | `webview` — встроенный интерфейс; `browser` — внешний браузер/app mode. |
| `webview_low_memory` | Включить оптимизированный режим WebView2. |
| `webview_aggressive` | Агрессивнее отключать лишние сервисы Chromium. |
| `webview_single_process` | Пытаться ограничить WebView2 одним renderer-процессом. |
| `webview_disable_gpu` | Отключить GPU. Может вызвать серое окно на некоторых системах. |
| `webview_in_process_gpu` | Пытаться держать GPU внутри процесса WebView2. |
| `memory_trim` | Периодически подрезать working set BetterASF/WebView2. |
| `memory_include_orphan_webview2` | Учитывать `msedgewebview2.exe`, даже если runtime не показывает его дочерним процессом Python. |

## Сборка `.exe`

На Windows:

```bash
python -m pip install -r requirements.txt pyinstaller
pyinstaller asf_desktop.spec
```

Результат появится в:

```text
dist\BetterASF.exe
```

## Tray

Для настоящего сворачивания в системный tray используются:

```text
pystray
Pillow
```

Они уже указаны в `requirements.txt` и добавлены в `asf_desktop.spec`.

## GitHub updates

Текущая версия задаётся в `asf_desktop.py`:

```python
APP_VERSION = "2.0"
```

Проверка обновлений сравнивает текущую версию с GitHub Releases репозитория:

```text
CatYaderka/BetterASF
```

Если найден релиз с тегом выше текущего (`v2.1`, `v3.0` и т.п.), BetterASF показывает нижний баннер с кнопкой скачивания последнего release asset.

## License

См. файл `LICENSE`.

Automatic update installation downloads the latest GitHub release `.exe`, starts an elevated replacement task, closes the current instance, copies the new executable to `Program Files\BetterASF`, and starts the updated copy.
