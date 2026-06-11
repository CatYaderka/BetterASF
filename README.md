<div align="center">

<img src=".github/logo.png" alt="BetterASF" width="140" />

# BetterASF

**Современный нативный интерфейс для [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm) — без браузера.**

Запускает ASF и открывает собственный красивый интерфейс в нативном окне Windows.
Тёмный минимализм, pill-навигация, переключатель тем, кастомная рамка окна.

![Platform](https://img.shields.io/badge/platform-Windows-0a84ff?style=flat-square)
![Python](https://img.shields.io/badge/python-3.10%2B-6f7bff?style=flat-square)
![UI](https://img.shields.io/badge/UI-WebView2-a06bff?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-57cbde?style=flat-square)

</div>

---

## ✨ Возможности

- 🖥️ **Свой интерфейс без браузера** — нативное окно на Edge WebView2 (встроен в Windows 10/11).
- 🎨 **Дизайн в тёмном минимализме** — pill-навигация, скруглённые карточки, акцент в стиле Steam, шрифт Inter.
- 🌗 **Светлая / тёмная тема** — переключение в один клик, выбор запоминается.
- 🪟 **Кастомная рамка окна** — своя титульная полоса (перетаскивание, свернуть/развернуть/закрыть).
- 🤖 **Полная настройка ботов из интерфейса** — создание, редактирование и удаление
  без команд и правки JSON: логин/пароль, группа для подписки, пауза, обмен карточками.
- 🔐 **Ввод Steam Guard / 2FA прямо в окне** — с подписью, для какого аккаунта (не в терминале).
- 👥 **Подписка на группу [BetterASF](https://steamcommunity.com/groups/BetterASF)** по умолчанию (можно сменить или отключить).
- ⌨️ **Команды ASF** — выполнение `status`, `stats`, `help` и любых других с выводом.
- 📊 **Статистика** — память, аптайм, версия, счётчики ботов.
- 📦 **Встраивание ASF в один `.exe`** — переносится одной программой.
- 🛠️ **Установщик** — установка в Program Files, ярлыки на Рабочем столе и в Меню Пуск.

---

## 📑 Содержание

- [Быстрый старт](#-быстрый-старт)
- [Сборка `.exe`](#-сборка-exe-один-файл)
- [Установщик](#-установщик-program-files--ярлыки)
- [Где хранятся данные](#-где-хранятся-данные)
- [Настройки](#-настройки-configini)
- [Как это устроено](#-как-это-устроено)
- [Структура проекта](#-структура-проекта)
- [Решение проблем](#-решение-проблем)

---

## 🚀 Быстрый старт

> Нужен **Python 3.10+** ([скачать](https://www.python.org/), при установке отметьте *Add Python to PATH*).

```bat
:: 1. Установить зависимости
pip install -r requirements.txt

:: 2. Положить папку рядом с ArchiSteamFarm.exe
::    (или указать путь в config.ini -> asf_path)

:: 3. Запустить
Run-ASF-Desktop.bat
```

Откроется окно с интерфейсом. ASF запустится автоматически в фоне и **закроется вместе с приложением**.

> 👀 Хотите посмотреть интерфейс без запуска? Откройте **`ui/preview.html`** в браузере — это демо с тестовыми данными.

---

## 📦 Сборка `.exe` (один файл)

Можно собрать **один `BetterASF.exe`** со встроенным интерфейсом и (опционально) самим ASF.

```bat
:: (опционально) вшить ASF: скачайте ASF-win-x64 с релизов ASF
:: и распакуйте его содержимое в папку _asf  (см. _asf/ГДЕ-ASF.txt)

build_exe.bat
:: результат: dist\BetterASF.exe
```

При запуске встроенный ASF распаковывается рядом в `ASF-runtime\`, а ваши аккаунты
остаются в отдельной папке `config\`. Перенос программы = `BetterASF.exe` + папка `config\`.

> Сборку нужно выполнять **на Windows** — собрать Windows-`.exe` на Linux/macOS нельзя.

---

## 🛠️ Установщик (Program Files + ярлыки)

В комплекте — скрипт [Inno Setup](https://jrsoftware.org/isdl.php) для профессионального `setup.exe`.

```bat
:: 1. Собрать приложение
build_exe.bat

:: 2. Установить Inno Setup, открыть installer.iss и нажать Build
::    (или: ISCC installer.iss)
:: результат: Output\BetterASF-Setup.exe
```

Установщик ставит программу в `Program Files\BetterASF`, создаёт ярлыки на **Рабочем столе**
и в **Меню Пуск**, регистрирует удаление. Аккаунты при этом хранятся в `Документы\BetterASF`
(с правами на запись и сохраняются при удалении/переустановке).

---

## 📂 Где хранятся данные

| Режим | Программа | ASF + аккаунты |
|-------|-----------|----------------|
| **Портативный** | рядом с `BetterASF.exe` | `ASF-runtime\`, `config\` рядом с exe |
| **Установка** | `Program Files\BetterASF` | `Документы\BetterASF\ASF-runtime`, `…\config` |

Приложение само определяет режим. Папка `config\` — это **ваши аккаунты**, держите её в бэкапе.

---

## ⚙️ Настройки (`config.ini`)

| Параметр          | Описание                                                            |
|-------------------|--------------------------------------------------------------------|
| `asf_path`        | Путь к `ArchiSteamFarm.exe`. Пусто = искать рядом / встроенный.     |
| `ipc_host` `ipc_port` | Адрес IPC ASF (по умолчанию `127.0.0.1:1242`).                 |
| `ipc_password`    | Значение `IPCPassword` из `ASF.json`, если задано.                  |
| `start_asf`       | `true` — лаунчер сам запускает ASF; `false` — ASF запущен отдельно. |
| `theme`           | Стартовая тема: `dark` или `light`.                                 |
| `frameless`       | `true` — окно без системной рамки со своей титульной полосой.       |
| `window_title`    | Заголовок окна (по умолчанию `BetterASF`).                          |
| `window_width` `window_height` | Размеры окна.                                         |
| `startup_timeout` | Сколько секунд ждать поднятия IPC.                                  |
| `ui_port`         | Порт локального сервера интерфейса (`0` = авто).                    |

---

## 🔧 Как это устроено

```
BetterASF.exe
   ├─ запускает ArchiSteamFarm.exe (в фоне, без консоли, --SERVICE)
   ├─ подписывает ботов на Steam-группу BetterASF (в их конфигах)
   ├─ поднимает локальный сервер:
   │     • отдаёт ui/ (наш HTML/CSS/JS)
   │     • проксирует /Api/* -> ASF (IPv4/IPv6) — снимает CORS
   ├─ открывает нативное окно (Edge WebView2) на нашем интерфейсе
   └─ при закрытии — завершает ASF целиком (taskkill /T)
```

Интерфейс общается с ASF через его официальный IPC API (тот же, что у ASF-ui),
поэтому совместим с любыми версиями ASF, а вёрстка полностью под контролем.

---

## 🗂️ Структура проекта

```
BetterASF/
├─ asf_desktop.py        # лаунчер: запуск ASF, локальный сервер/прокси, окно
├─ ui/                   # собственный интерфейс
│  ├─ index.html         #   разметка
│  ├─ style.css          #   стиль (тёмный минимализм, pill-навигация)
│  ├─ app.js             #   логика + работа с API ASF
│  └─ preview.html       #   демо с тестовыми данными
├─ asf_desktop.spec      # конфигурация сборки PyInstaller
├─ installer.iss         # установщик Inno Setup
├─ build_exe.bat         # сборка одного .exe
├─ Run-ASF-Desktop.bat   # запуск
├─ Debug-Run.bat         # запуск с консолью и логом (диагностика)
├─ config.ini            # настройки
├─ requirements.txt      # зависимости Python
├─ installed.flag        # маркер режима установки (для установщика)
├─ icon.ico / icon_source.png   # иконка приложения
└─ _asf/                 # сюда кладётся ASF для встраивания в .exe
```

---

## 🩺 Решение проблем

<details>
<summary><b>«Нет связи с ASF», хотя ASF работает</b></summary>

Запустите **`Debug-Run.bat`**, откройте вкладку **«Журнал»** и посмотрите строку
`Диагностика связи: {...}` — она покажет, по какому адресу (IPv4/IPv6) доступен ASF.
Полный лог сохраняется в `debug-log.txt` в папке данных.
</details>

<details>
<summary><b>Окно пустое или белое</b></summary>

Установите [Microsoft Edge WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)
(на новых Windows он уже есть). Убедитесь, что в `ASF.json` включён `IPC`.
</details>

<details>
<summary><b>ASF не находится</b></summary>

Положите `BetterASF.exe` рядом с `ArchiSteamFarm.exe`, встройте ASF в сборку
(папка `_asf`), либо укажите путь в `config.ini → asf_path`.
</details>

<details>
<summary><b>Нужна обычная рамка Windows</b></summary>

Поставьте `frameless = false` в `config.ini`.
</details>

---

<div align="center">
<sub>BetterASF — Made with <3 by CatYaderka</sub>
</div>
