<p align="center">
  <img src=".github/logo.png" alt="BetterASF" width="120">
</p>

<h1 align="center">BetterASF</h1>

<p align="center">
  Desktop-оболочка для ArchiSteamFarm с собственным интерфейсом и запуском без браузера.
</p>

---

## О проекте

BetterASF — это неофициальный лаунчер и интерфейс для [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm). Приложение запускает ASF в фоне, поднимает локальный интерфейс и открывает его в отдельном окне на базе WebView2.

Основная идея простая: не открывать ASF UI в браузере и не править конфиги вручную каждый раз, а держать управление ботами, командами и настройками в одном desktop-окне.

Проект в первую очередь рассчитан на Windows 10/11.

## Возможности

- запуск и остановка ASF вместе с BetterASF;
- собственный интерфейс для управления ботами;
- просмотр статуса ботов, фарма карточек и базовой статистики;
- отправка команд в ASF через IPC API;
- создание и редактирование конфигов ботов из интерфейса;
- ввод Steam Guard / 2FA в отдельном окне;
- список плагинов ASF;
- ручной и автоматический фарм часов;
- несколько тем оформления;
- сворачивание в tray;
- автозапуск вместе с Windows;
- проверка обновлений BetterASF через GitHub Releases;
- режим пониженного потребления памяти для WebView2.

## Как это работает

BetterASF состоит из двух частей:

```text
asf_desktop.py  — запуск ASF, локальный сервер, прокси к IPC, окно WebView2
ui/             — HTML/CSS/JS интерфейс
```

При запуске приложение:

1. ищет `ArchiSteamFarm.exe`;
2. при необходимости распаковывает встроенную папку `_asf` в runtime-каталог;
3. запускает ASF;
4. ждёт, пока поднимется IPC;
5. запускает локальный HTTP-сервер;
6. проксирует запросы интерфейса к ASF API;
7. открывает окно WebView2 или внешний браузер, если выбран browser-режим.

## Установка из исходников

### Требования

- Windows 10/11;
- Python 3.10 или новее;
- Microsoft Edge WebView2 Runtime;
- ArchiSteamFarm.

### Установка зависимостей

```bat
python -m pip install -r requirements.txt
```

### Запуск

```bat
python asf_desktop.py
```

Также можно использовать готовые bat-файлы:

```text
Run-ASF-Desktop.bat  — обычный запуск
Debug-Run.bat        — запуск с консолью и диагностикой
```

## Где должен лежать ASF

BetterASF ищет ASF в нескольких местах:

```text
Documents\BetterASF\ASF-runtime\ArchiSteamFarm.exe
папка рядом с BetterASF
путь из config.ini, параметр asf_path
```

Если в сборку добавлена папка `_asf`, она копируется в:

```text
Documents\BetterASF\ASF-runtime
```

Пользовательские конфиги ботов хранятся отдельно, поэтому они не должны теряться при обновлении программы.

## Данные и настройки

Основная папка данных:

```text
Documents\BetterASF
```

В ней обычно находятся:

```text
ASF-runtime\       — распакованный ASF
config\            — конфиги ботов ASF
settings.json      — настройки интерфейса
debug-log.txt      — лог отладочного запуска
```

Основной файл конфигурации проекта:

```text
config.ini
```

Часть настроек можно менять из интерфейса, часть — вручную в `config.ini`.

## Основные параметры config.ini

| Параметр | Описание |
|---|---|
| `asf_path` | Явный путь к `ArchiSteamFarm.exe`. |
| `start_asf` | Запускать ASF вместе с BetterASF. |
| `ipc_host` | Хост IPC ASF. Обычно `127.0.0.1`. |
| `ipc_port` | Порт IPC ASF. Обычно `1242`. |
| `ipc_password` | Пароль IPC, если он задан в ASF. |
| `startup_timeout` | Сколько ждать запуска IPC. |
| `ui_mode` | `webview` или `browser`. |
| `window_width` / `window_height` | Размер окна при запуске. |
| `theme` | Тема по умолчанию. |
| `frameless` | Использовать кастомную рамку окна. |
| `webview_low_memory` | Включить low-memory режим для WebView2. |
| `memory_trim` | Периодически подрезать working set процессов. |
| `steam_api_key` | Steam Web API key для функций, которым нужен список игр. |

## Сборка exe

Сборка выполняется через PyInstaller:

```bat
python -m pip install -r requirements.txt pyinstaller
pyinstaller asf_desktop.spec
```

После сборки файл появится в:

```text
dist\BetterASF.exe
```

Если нужно собрать exe со встроенным ASF, положите файлы ASF в папку `_asf` перед сборкой.

## Обновления

BetterASF может проверять новые версии через GitHub Releases этого репозитория.

Если найден релиз с версией выше текущей, в интерфейсе появляется уведомление с кнопкой загрузки. Автоматическая установка рассчитана на Windows-сборку `.exe`.

## Частые проблемы

### Нет связи с ASF

Проверьте, что в ASF включён IPC и порт совпадает с `ipc_port` в `config.ini`.

Обычно ASF IPC доступен по адресу:

```text
http://127.0.0.1:1242
```

Если задан `IPCPassword`, укажите его в `config.ini` или через окно авторизации.

### Окно пустое или белое

Проверьте, установлен ли Microsoft Edge WebView2 Runtime. Если WebView2 не запускается, можно временно переключить режим интерфейса:

```ini
ui_mode = browser
```

### ASF не находится

Укажите путь вручную:

```ini
asf_path = C:\path\to\ArchiSteamFarm.exe
```

Либо положите ASF в папку рядом с приложением или в `Documents\BetterASF\ASF-runtime`.

### Не сохраняются конфиги

Проверьте права на запись в папку:

```text
Documents\BetterASF
```

Если приложение запущено из `Program Files`, пользовательские данные всё равно должны храниться в `Documents\BetterASF`.

## Структура репозитория

```text
BetterASF/
├─ asf_desktop.py        # основной Python-лаунчер
├─ config.ini            # настройки по умолчанию
├─ requirements.txt      # зависимости Python
├─ asf_desktop.spec      # конфиг PyInstaller
├─ build_exe.bat         # сборка exe
├─ Run-ASF-Desktop.bat   # обычный запуск
├─ Debug-Run.bat         # запуск с консолью
├─ _asf/                 # место для встроенного ASF runtime
└─ ui/
   ├─ index.html         # разметка интерфейса
   ├─ app.js             # логика интерфейса
   ├─ style.css          # стили
   └─ preview.html       # локальный предпросмотр
```

## Замечания по безопасности

BetterASF работает поверх ASF IPC API. Steam-аккаунты и пароли сохраняются в конфигурации ASF, а не в отдельном облачном сервисе BetterASF.

Перед использованием готовых exe-сборок лучше проверить исходники, релиз и содержимое папки `_asf`, особенно если сборка получена не из этого репозитория.

## Лицензия

Проект распространяется по лицензии MIT. Подробнее см. файл [LICENSE](LICENSE).

## Отказ от ответственности

BetterASF не является официальной частью ArchiSteamFarm и не связан с JustArchiNET. Все торговые марки и названия принадлежат их владельцам.
