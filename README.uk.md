# BetterASF

[Русский](README.ru.md) · [English](README.en.md) · **Українська**

**BetterASF 3.0** — неофіційний desktop-лаунчер та інтерфейс WebView2 для [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm) у Windows. Він об’єднує керування ботами, команди ASF, плагіни, фарм карток і налаштування фарму годин в одному вікні.

## Можливості

- Запуск і контроль ASF через IPC API.
- Дані користувача зберігаються в `Documents\BetterASF`, поза `Program Files` та виконуваним файлом.
- Створення й редагування конфігурацій ботів у інтерфейсі.
- Підтримка Steam Guard, 2FA, батьківського коду та підтвердження входу.
- Відкладений запит на вхід показується жовтим пунктом **«Запити на вхід»**, що повільно блимає, без повторного відкриття вікна.
- Бібліотека плагінів ASF і магазин плагінів на основі GitHub.
- Автоматично оновлюваний файл джерел магазину `plugin_catalog.json`.
- Фарм годин за зростанням/спаданням годин або за актуальним Steam-топом онлайну.
- Інтерфейс російською, англійською та українською.
- Трей, запуск у згорнутому стані та автозавантаження Windows.
- Режим зниження пам’яті WebView2 і самооновлення BetterASF.

## Вимоги

- Windows 10/11;
- Python 3.10+ для запуску з вихідного коду;
- Microsoft Edge WebView2 Runtime;
- ArchiSteamFarm;
- Steam Web API key лише для функцій, яким потрібний список ігор акаунта.

## Запуск із вихідного коду

```bat
python -m pip install -r requirements.txt
python asf_desktop.py
```

Додаткові сценарії:

```text
Run-ASF-Desktop.bat  звичайний запуск
Debug-Run.bat        запуск із діагностикою
```

## Збірка

У Windows запустіть:

```bat
build_exe.bat
```

Файл збірки:

```text
dist\BetterASF.exe
```

Однофайлова версія під час першого запуску встановлюється в `Program Files\BetterASF` та створює ярлики на Робочому столі й у меню «Пуск». Дані користувача залишаються тут:

```text
Documents\BetterASF\config\       конфігурації ботів
Documents\BetterASF\ASF-runtime\  runtime ASF
```

Щоб вбудувати ASF у `.exe`, перед збіркою помістіть вміст Windows-релізу ASF в `_asf`, щоб існував файл `_asf\ArchiSteamFarm.exe`.

## Відновлення після оновлення ASF

Під час самооновлення ASF замінює старий процес новим PID. BetterASF чекає replacement-процес і не видаляє наявний runtime автоматично. Журнали запуску:

```text
Documents\BetterASF\debug-log.txt
Documents\BetterASF\asf-launch.log
```

## Магазин плагінів

Список джерел магазину міститься у файлі:

```text
plugin_catalog.json
```

Під час відкриття «Магазину плагінів» BetterASF умовно запитує цей самий файл із гілки `main` репозиторію через HTTP ETag. Дані GitHub Release оновлюються лише тоді, коли сам каталог змінився. Кеш:

```text
Documents\BetterASF\plugin-catalog-cache.json
```

Додавайте тільки плагіни та репозиторії, яким довіряєте: ASF-плагін виконує свій код усередині процесу ASF.

## Ключові параметри конфігурації

| Параметр | Призначення |
| --- | --- |
| `asf_path` | Явний шлях до `ArchiSteamFarm.exe`. |
| `ipc_host`, `ipc_port` | IPC endpoint ASF. |
| `startup_timeout` | Час очікування запуску ASF/IPC. |
| `asf_self_restart_grace` | Час очікування ASF після самооновлення. |
| `asf_use_job_object` | Рекомендовано лишати `false` для сумісності з оновленням ASF. |
| `webview_low_memory` | Увімкнення режиму зниження пам’яті WebView2. |

## Ліцензія та застереження

BetterASF поширюється за [ліцензією MIT](LICENSE). Проєкт не є офіційною частиною ArchiSteamFarm і не пов’язаний із JustArchiNET. Steam та пов’язані торгові марки належать відповідним власникам.
