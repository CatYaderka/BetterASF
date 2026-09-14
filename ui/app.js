
'use strict';

const CFG = window.ASF_CONFIG || {};


const I18N = {
  ru: {
    not_connected: 'не подключено', connected: 'подключено', no_connection: 'нет связи', recovering: 'восстановление', starting_asf: 'запуск ASF',
    nav_control: 'Управление', nav_dashboard: 'Главная', nav_bots: 'Боты', nav_commands: 'Команды', nav_plugins: 'Плагины', nav_log: 'Журнал', nav_settings: 'Настройки', login_requests: 'Запросы на вход', nav_stats: 'Статистика',
    stat_farming: 'Фарм', stat_online: 'В сети', stat_offline: 'Не в сети', stat_total: 'Всего', sys_memory_total: 'Память всего', sys_uptime: 'Аптайм', sys_version: 'Версия',
    dashboard_title: 'Главная', bots_title: 'Боты', commands_title: 'Команды', plugins_title: 'Плагины', log_title: 'Журнал', settings_title: 'Настройки',
    refresh: 'Обновить', execute: 'Выполнить', clear: 'Очистить', save: 'Сохранить', cancel: 'Отмена', remove: 'Удалить', install: 'Установить', installing: 'Установка…', removing: 'Удаление…',
    appearance_title: 'Оформление и темы', behavior_title: 'Поведение приложения', priority_games: 'Приоритетные игры для фарма часов', language_label: 'Язык интерфейса',
    theme_choose: 'Выбрать тему из списка:', custom_theme: 'Своя тема', custom_theme_add: 'Создать свою тему', custom_theme_title: 'Своя тема', custom_theme_sub: 'Выберите светлую или тёмную основу, загрузите своё изображение и при необходимости сделайте элементы прозрачными.', custom_theme_base: 'Основа темы', custom_theme_dark: 'Тёмная', custom_theme_light: 'Светлая', custom_theme_image: 'Своя картинка', custom_theme_image_hint: 'PNG, JPG или WebP, до 12 МБ. Если файл не выбрать, сохранится текущая картинка.', custom_theme_transparent: 'Включить прозрачность элементов', custom_theme_remove_image: 'Убрать картинку', custom_theme_saved: 'Своя тема сохранена', custom_theme_error: 'Не удалось сохранить свою тему', custom_theme_image_too_large: 'Картинка должна быть не больше 12 МБ', custom_theme_image_invalid: 'Выберите PNG, JPG или WebP', custom_theme_image_loaded: 'Картинка выбрана',
    kpi_games: 'Игр осталось', kpi_time: 'Времени осталось', kpi_cards: 'Карт осталось', dashboard_refresh: 'Обновить', commands_hint: 'Подсказки:', command_placeholder: 'Введите команду, напр. status ASF', command_output: 'Вывод команды появится здесь…',
    appearance_sub: 'Выберите цветовую схему и фоновое изображение для интерфейса BetterASF.', behavior_sub: 'Настройки самого BetterASF. Они сохраняются в Documents\BetterASF\settings.json.',
    tray_title: 'Сворачивание в трей', tray_sub: 'Кнопка закрытия будет сворачивать BetterASF, не завершая ASF.', minimized_title: 'Запуск в минимизированном состоянии', minimized_sub: 'После открытия BetterASF сразу свернётся; если включён трей — спрячется в трей.', autostart_title: 'Запуск вместе с системой', autostart_sub: 'Добавляет BetterASF в автозагрузку текущего пользователя Windows.', economy_title: 'Экономичный режим интерфейса', economy_sub: 'Отключает фоновые картинки, blur/тяжёлые тени, аватарки и реже обновляет данные.',
    auto_hours_title: 'Запуск фарма часов после карточек', auto_hours_sub: 'Когда обычный фарм карточек закончится, BetterASF автоматически запустит топ-32 игр по часам.', start_hours_title: 'Фарм часов при запуске BetterASF', start_hours_sub: 'При старте интерфейса сразу запускает топ-32 игр на аккаунтах без оставшихся карточек.', priority_hint: 'Эти AppID применяются к каждому аккаунту отдельно: если игра есть в библиотеке — она запускается, если нет — пропускается. После них список дополняется играми по часам.',
    plugins_library: 'Библиотека', plugins_store: 'Магазин плагинов', plugins_library_note: 'Установленные плагины ASF. После изменения ASF перезапускается автоматически.', plugins_store_note: 'Каталог и ZIP-релизы проверяются напрямую на GitHub. Устанавливайте только плагины, которым доверяете.',
    plugin_remove_title: 'Удалить плагин?', plugin_remove_text: 'Плагин будет удалён из ASF:', plugin_remove_restart: 'ASF будет автоматически перезапущен. Это действие нельзя отменить.',
    plugin_empty: 'Установленных плагинов нет.', plugin_loaded: 'Загружен ASF', plugin_not_loaded: 'Ожидает перезапуска', plugin_unknown: 'Плагин', plugin_store_loading: 'Загрузка каталога GitHub…', plugin_library_loading: 'Загрузка библиотеки…', plugin_files: 'DLL-файлов', plugin_size: 'Размер', plugin_source: 'Источник', plugin_version: 'Версия', plugin_author: 'Автор', plugin_unavailable: 'В GitHub нет ZIP-релиза', plugin_restart: 'ASF перезапускается для применения изменения.',
    hour_priority_mode: 'Режим приоритетного фарма часов', experimental: 'Экспериментальная функция', hours_asc: 'По возрастанию часов', hours_desc: 'По убыванию часов', hours_popular: 'Популярные — списки из топа по онлайну', hour_priority_mode_hint: 'В режиме «Популярные» BetterASF берёт актуальный топ Steam по онлайну и выдаёт следующим аккаунтам разные списки игр.',
    setting_saved: 'Настройка сохранена', settings_error: 'Не удалось применить настройку', language_saved: 'Язык интерфейса изменён', priority_mode_saved: 'Режим приоритетного фарма сохранён',
    bot_disabled: 'Отключён', bot_offline: 'Не в сети', bot_paused: 'Пауза', bot_farming: 'Фармит', bot_online: 'В сети', bot_settings: 'Настройки бота', start_bot: 'Запустить бота', stop_bot: 'Остановить бота', resume_farm: 'Продолжить фарм', pause_farm: 'Пауза фарма', new_bot: 'Новый бот', save_bot: 'Сохранить', create_bot: 'Создать', keep_password: '(оставьте пустым, чтобы не менять)',
    plugins_failed: 'Не удалось получить плагины', plugin_store_failed: 'Не удалось загрузить каталог GitHub', plugin_installed: 'Плагин установлен', plugin_removed: 'Плагин удалён',
    input_login_title: 'Логин Steam', input_login_label: 'логин', input_login_placeholder: 'Steam логин', input_password_title: 'Пароль Steam', input_password_label: 'пароль', input_password_placeholder: 'Пароль', input_guard_title: 'Steam Guard', input_guard_label: 'код Steam Guard (из e-mail)', input_parental_title: 'Родительский код', input_parental_label: 'родительский код Steam', input_parental_placeholder: 'Код', input_2fa_title: 'Двухфакторный код (2FA)', input_2fa_label: 'код аутентификатора', input_confirm_title: 'Подтверждение входа', input_confirm_label: 'подтверждение', input_request_for: 'Запрос на вход для аккаунта:', input_enter_for: 'Введите {value} для аккаунта:', input_required_for: 'Вход не завершён для {bot}: требуется {value}', input_required: 'Требуется {value} для бота {bot}', input_value_required: 'Введите значение', input_sent: 'Отправлено для {bot}', input_later: 'Запрос входа отложен', input_alert: 'Есть запросы на вход. Нажмите, чтобы открыть.',
    popular_loading: 'получаю глобальный топ Steam по онлайну', popular_unavailable: 'Глобальный топ Steam недоступен; использую порядок по часам.', update_downloading: 'Загрузка…', update_started: 'Обновление запущено, BetterASF закроется', update_failed: 'Не удалось обновить', update_check_failed: 'Не удалось проверить обновления', update_none: 'Обновлений нет', update_available: 'Доступна новая версия BetterASF {version}', update_button: 'Обновить', asf_restart: 'Перезагрузка ASF', asf_update_check: 'Проверка обновления ASF',
  },
  en: {
    not_connected: 'not connected', connected: 'connected', no_connection: 'no connection', recovering: 'recovering', starting_asf: 'starting ASF',
    nav_control: 'Control', nav_dashboard: 'Dashboard', nav_bots: 'Bots', nav_commands: 'Commands', nav_plugins: 'Plugins', nav_log: 'Log', nav_settings: 'Settings', login_requests: 'Login requests', nav_stats: 'Statistics',
    stat_farming: 'Farming', stat_online: 'Online', stat_offline: 'Offline', stat_total: 'Total', sys_memory_total: 'Total memory', sys_uptime: 'Uptime', sys_version: 'Version',
    dashboard_title: 'Dashboard', bots_title: 'Bots', commands_title: 'Commands', plugins_title: 'Plugins', log_title: 'Log', settings_title: 'Settings',
    refresh: 'Refresh', execute: 'Run', clear: 'Clear', save: 'Save', cancel: 'Cancel', remove: 'Remove', install: 'Install', installing: 'Installing…', removing: 'Removing…',
    appearance_title: 'Appearance and themes', behavior_title: 'Application behavior', priority_games: 'Priority games for hour farming', language_label: 'Interface language',
    theme_choose: 'Choose a theme from the list:', custom_theme: 'Custom theme', custom_theme_add: 'Create custom theme', custom_theme_title: 'Custom theme', custom_theme_sub: 'Choose a light or dark base, upload your own image and optionally make interface elements transparent.', custom_theme_base: 'Theme base', custom_theme_dark: 'Dark', custom_theme_light: 'Light', custom_theme_image: 'Custom image', custom_theme_image_hint: 'PNG, JPG or WebP, up to 12 MB. If no file is selected, the current image is kept.', custom_theme_transparent: 'Enable transparent elements', custom_theme_remove_image: 'Remove image', custom_theme_saved: 'Custom theme saved', custom_theme_error: 'Could not save custom theme', custom_theme_image_too_large: 'Image must be 12 MB or smaller', custom_theme_image_invalid: 'Select a PNG, JPG or WebP image', custom_theme_image_loaded: 'Image selected',
    kpi_games: 'Games remaining', kpi_time: 'Time remaining', kpi_cards: 'Cards remaining', dashboard_refresh: 'Refresh', commands_hint: 'Hints:', command_placeholder: 'Enter a command, e.g. status ASF', command_output: 'Command output will appear here…',
    appearance_sub: 'Choose the colour scheme and background image for the BetterASF interface.', behavior_sub: 'BetterASF settings. They are saved in Documents\BetterASF\settings.json.',
    tray_title: 'Minimize to tray', tray_sub: 'The Close button minimizes BetterASF without closing ASF.', minimized_title: 'Start minimized', minimized_sub: 'BetterASF minimizes immediately after opening; if tray is enabled, it hides in the tray.', autostart_title: 'Start with Windows', autostart_sub: 'Adds BetterASF to the current Windows user’s startup.', economy_title: 'Economy interface mode', economy_sub: 'Disables background images, blur/heavy shadows and avatars, and refreshes data less often.',
    auto_hours_title: 'Start hour farming after cards', auto_hours_sub: 'After normal card farming is finished, BetterASF starts the top 32 games by playtime.', start_hours_title: 'Hour farming on BetterASF startup', start_hours_sub: 'On interface startup, starts the top 32 games for accounts with no cards remaining.', priority_hint: 'These AppIDs apply to every account individually: a game is started only if the account owns it. The list is then filled with games selected by the chosen order.',
    plugins_library: 'Library', plugins_store: 'Plugin store', plugins_library_note: 'Installed ASF plugins. ASF restarts automatically after a change.', plugins_store_note: 'The catalogue and ZIP releases are checked directly on GitHub. Install only plugins you trust.',
    plugin_remove_title: 'Remove plugin?', plugin_remove_text: 'This plugin will be removed from ASF:', plugin_remove_restart: 'ASF will restart automatically. This action cannot be undone.',
    plugin_empty: 'No installed plugins.', plugin_loaded: 'Loaded by ASF', plugin_not_loaded: 'Waiting for restart', plugin_unknown: 'Plugin', plugin_store_loading: 'Loading GitHub catalogue…', plugin_library_loading: 'Loading library…', plugin_files: 'DLL files', plugin_size: 'Size', plugin_source: 'Source', plugin_version: 'Version', plugin_author: 'Author', plugin_unavailable: 'No ZIP release on GitHub', plugin_restart: 'ASF is restarting to apply the change.',
    hour_priority_mode: 'Priority hour-farming mode', experimental: 'Experimental feature', hours_asc: 'Hours ascending', hours_desc: 'Hours descending', hours_popular: 'Popular — consecutive lists from online top', hour_priority_mode_hint: 'In Popular mode, BetterASF gets Steam’s current online leaderboard and gives subsequent accounts different game lists.',
    setting_saved: 'Setting saved', settings_error: 'Could not apply setting', language_saved: 'Interface language changed', priority_mode_saved: 'Priority farming mode saved',
    bot_disabled: 'Disabled', bot_offline: 'Offline', bot_paused: 'Paused', bot_farming: 'Farming', bot_online: 'Online', bot_settings: 'Bot settings', start_bot: 'Start bot', stop_bot: 'Stop bot', resume_farm: 'Resume farming', pause_farm: 'Pause farming', new_bot: 'New bot', save_bot: 'Save', create_bot: 'Create', keep_password: '(leave empty to keep unchanged)',
    plugins_failed: 'Could not load plugins', plugin_store_failed: 'Could not load GitHub catalogue', plugin_installed: 'Plugin installed', plugin_removed: 'Plugin removed',
    input_login_title: 'Steam login', input_login_label: 'login', input_login_placeholder: 'Steam login', input_password_title: 'Steam password', input_password_label: 'password', input_password_placeholder: 'Password', input_guard_title: 'Steam Guard', input_guard_label: 'Steam Guard code (from e-mail)', input_parental_title: 'Parental code', input_parental_label: 'Steam parental code', input_parental_placeholder: 'Code', input_2fa_title: 'Two-factor code (2FA)', input_2fa_label: 'authenticator code', input_confirm_title: 'Login confirmation', input_confirm_label: 'confirmation', input_request_for: 'Login request for account:', input_enter_for: 'Enter {value} for the account:', input_required_for: 'Login is not complete for {bot}: {value} is required', input_required: '{value} is required for bot {bot}', input_value_required: 'Enter a value', input_sent: 'Sent for {bot}', input_later: 'Login request deferred', input_alert: 'There are pending login requests. Click to open.',
    popular_loading: 'getting Steam’s global online leaderboard', popular_unavailable: 'Steam’s global leaderboard is unavailable; using the hours order.', update_downloading: 'Downloading…', update_started: 'Update started, BetterASF will close', update_failed: 'Could not update', update_check_failed: 'Could not check for updates', update_none: 'No updates available', update_available: 'A new BetterASF version {version} is available', update_button: 'Update', asf_restart: 'Restart ASF', asf_update_check: 'Check ASF update',
  },
  uk: {
    not_connected: 'не підключено', connected: 'підключено', no_connection: 'немає зв’язку', recovering: 'відновлення', starting_asf: 'запуск ASF',
    nav_control: 'Керування', nav_dashboard: 'Головна', nav_bots: 'Боти', nav_commands: 'Команди', nav_plugins: 'Плагіни', nav_log: 'Журнал', nav_settings: 'Налаштування', login_requests: 'Запити на вхід', nav_stats: 'Статистика',
    stat_farming: 'Фарм', stat_online: 'У мережі', stat_offline: 'Не в мережі', stat_total: 'Усього', sys_memory_total: 'Уся пам’ять', sys_uptime: 'Аптайм', sys_version: 'Версія',
    dashboard_title: 'Головна', bots_title: 'Боти', commands_title: 'Команди', plugins_title: 'Плагіни', log_title: 'Журнал', settings_title: 'Налаштування',
    refresh: 'Оновити', execute: 'Виконати', clear: 'Очистити', save: 'Зберегти', cancel: 'Скасувати', remove: 'Видалити', install: 'Встановити', installing: 'Встановлення…', removing: 'Видалення…',
    appearance_title: 'Оформлення та теми', behavior_title: 'Поведінка програми', priority_games: 'Пріоритетні ігри для фарму годин', language_label: 'Мова інтерфейсу',
    theme_choose: 'Вибрати тему зі списку:', custom_theme: 'Власна тема', custom_theme_add: 'Створити власну тему', custom_theme_title: 'Власна тема', custom_theme_sub: 'Виберіть світлу або темну основу, завантажте своє зображення та за потреби зробіть елементи прозорими.', custom_theme_base: 'Основа теми', custom_theme_dark: 'Темна', custom_theme_light: 'Світла', custom_theme_image: 'Власна картинка', custom_theme_image_hint: 'PNG, JPG або WebP, до 12 МБ. Якщо файл не вибрати, поточна картинка збережеться.', custom_theme_transparent: 'Увімкнути прозорість елементів', custom_theme_remove_image: 'Прибрати картинку', custom_theme_saved: 'Власну тему збережено', custom_theme_error: 'Не вдалося зберегти власну тему', custom_theme_image_too_large: 'Картинка має бути не більшою за 12 МБ', custom_theme_image_invalid: 'Виберіть PNG, JPG або WebP', custom_theme_image_loaded: 'Картинку вибрано',
    kpi_games: 'Ігор залишилося', kpi_time: 'Часу залишилося', kpi_cards: 'Карток залишилося', dashboard_refresh: 'Оновити', commands_hint: 'Підказки:', command_placeholder: 'Введіть команду, напр. status ASF', command_output: 'Вивід команди з’явиться тут…',
    appearance_sub: 'Виберіть кольорову схему та фонове зображення для інтерфейсу BetterASF.', behavior_sub: 'Налаштування самого BetterASF. Вони зберігаються в Documents\BetterASF\settings.json.',
    tray_title: 'Згортання в трей', tray_sub: 'Кнопка закриття згортатиме BetterASF, не завершуючи ASF.', minimized_title: 'Запуск у згорнутому стані', minimized_sub: 'Після відкриття BetterASF одразу згорнеться; якщо ввімкнений трей — сховається в трей.', autostart_title: 'Запуск разом із системою', autostart_sub: 'Додає BetterASF до автозавантаження поточного користувача Windows.', economy_title: 'Економний режим інтерфейсу', economy_sub: 'Вимикає фонові картинки, blur/важкі тіні, аватарки та рідше оновлює дані.',
    auto_hours_title: 'Запуск фарму годин після карток', auto_hours_sub: 'Коли звичайний фарм карток завершиться, BetterASF автоматично запустить топ-32 ігор за годинами.', start_hours_title: 'Фарм годин під час запуску BetterASF', start_hours_sub: 'Під час запуску інтерфейсу одразу запускає топ-32 ігор на акаунтах без карток, що залишилися.', priority_hint: 'Ці AppID застосовуються до кожного акаунта окремо: гра запускається, якщо вона є в бібліотеці. Після них список доповнюється іграми за вибраним порядком.',
    plugins_library: 'Бібліотека', plugins_store: 'Магазин плагінів', plugins_library_note: 'Встановлені плагіни ASF. Після зміни ASF перезапускається автоматично.', plugins_store_note: 'Каталог і ZIP-релізи перевіряються безпосередньо на GitHub. Встановлюйте лише плагіни, яким довіряєте.',
    plugin_remove_title: 'Видалити плагін?', plugin_remove_text: 'Плагін буде видалено з ASF:', plugin_remove_restart: 'ASF буде автоматично перезапущено. Цю дію не можна скасувати.',
    plugin_empty: 'Встановлених плагінів немає.', plugin_loaded: 'Завантажено ASF', plugin_not_loaded: 'Очікує перезапуску', plugin_unknown: 'Плагін', plugin_store_loading: 'Завантаження каталогу GitHub…', plugin_library_loading: 'Завантаження бібліотеки…', plugin_files: 'DLL-файлів', plugin_size: 'Розмір', plugin_source: 'Джерело', plugin_version: 'Версія', plugin_author: 'Автор', plugin_unavailable: 'У GitHub немає ZIP-релізу', plugin_restart: 'ASF перезапускається для застосування зміни.',
    hour_priority_mode: 'Режим пріоритетного фарму годин', experimental: 'Експериментальна функція', hours_asc: 'За зростанням годин', hours_desc: 'За спаданням годин', hours_popular: 'Популярні — послідовні списки з топу онлайну', hour_priority_mode_hint: 'У режимі «Популярні» BetterASF бере актуальний топ Steam за онлайном і видає наступним акаунтам різні списки ігор.',
    setting_saved: 'Налаштування збережено', settings_error: 'Не вдалося застосувати налаштування', language_saved: 'Мову інтерфейсу змінено', priority_mode_saved: 'Режим пріоритетного фарму збережено',
    bot_disabled: 'Вимкнено', bot_offline: 'Не в мережі', bot_paused: 'Пауза', bot_farming: 'Фармить', bot_online: 'У мережі', bot_settings: 'Налаштування бота', start_bot: 'Запустити бота', stop_bot: 'Зупинити бота', resume_farm: 'Продовжити фарм', pause_farm: 'Пауза фарму', new_bot: 'Новий бот', save_bot: 'Зберегти', create_bot: 'Створити', keep_password: '(залиште порожнім, щоб не змінювати)',
    plugins_failed: 'Не вдалося отримати плагіни', plugin_store_failed: 'Не вдалося завантажити каталог GitHub', plugin_installed: 'Плагін установлено', plugin_removed: 'Плагін видалено',
    input_login_title: 'Логін Steam', input_login_label: 'логін', input_login_placeholder: 'Логін Steam', input_password_title: 'Пароль Steam', input_password_label: 'пароль', input_password_placeholder: 'Пароль', input_guard_title: 'Steam Guard', input_guard_label: 'код Steam Guard (з e-mail)', input_parental_title: 'Батьківський код', input_parental_label: 'батьківський код Steam', input_parental_placeholder: 'Код', input_2fa_title: 'Двофакторний код (2FA)', input_2fa_label: 'код автентифікатора', input_confirm_title: 'Підтвердження входу', input_confirm_label: 'підтвердження', input_request_for: 'Запит на вхід для акаунта:', input_enter_for: 'Введіть {value} для акаунта:', input_required_for: 'Вхід не завершено для {bot}: потрібен {value}', input_required: 'Потрібно {value} для бота {bot}', input_value_required: 'Введіть значення', input_sent: 'Надіслано для {bot}', input_later: 'Запит на вхід відкладено', input_alert: 'Є запити на вхід. Натисніть, щоб відкрити.',
    popular_loading: 'отримую глобальний топ Steam за онлайном', popular_unavailable: 'Глобальний топ Steam недоступний; використовую порядок за годинами.', update_downloading: 'Завантаження…', update_started: 'Оновлення запущено, BetterASF закриється', update_failed: 'Не вдалося оновити', update_check_failed: 'Не вдалося перевірити оновлення', update_none: 'Оновлень немає', update_available: 'Доступна нова версія BetterASF {version}', update_button: 'Оновити', asf_restart: 'Перезапуск ASF', asf_update_check: 'Перевірка оновлення ASF',
  }
};
let UI_LANGUAGE = localStorage.getItem('betterasf_language') || 'ru';
if (!I18N[UI_LANGUAGE]) UI_LANGUAGE = 'ru';

function t(key) {
  return (I18N[UI_LANGUAGE] && I18N[UI_LANGUAGE][key]) || I18N.ru[key] || key;
}

function tf(key, values = {}) {
  return t(key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
}

// Covers static form labels that do not need an individual data-i18n attribute.
// Source text is retained in a WeakMap, so changing language repeatedly remains reversible.
const STATIC_TEXT_I18N = {
  en: {
    'Загрузка…': 'Loading…', 'Тёмная': 'Dark', 'Светлая': 'Light', 'Тёмная тема (Стандартная)': 'Dark theme (Standard)', 'Светлая тема (Стандартная)': 'Light theme (Standard)', 'Тёмная тема (Dead Dream)': 'Dark theme (Dead Dream)', 'Светлая тема (Dead Dream)': 'Light theme (Dead Dream)', 'Выбрать тему из списка:': 'Choose a theme from the list:',
    'Журнал событий интерфейса…': 'Interface event log…', 'Новый бот': 'New bot', 'Все настройки задаются здесь — без команд и правки JSON.': 'All settings are configured here — no commands or JSON editing required.', 'Имя бота': 'Bot name', 'Логин Steam': 'Steam login', 'Пароль Steam': 'Steam password', 'Максимум игр для фарма часов': 'Maximum games for hour farming', 'Включён': 'Enabled', 'Расширенные настройки': 'Advanced settings',
    'Онлайн-статус': 'Online status', 'В сети': 'Online', 'Не в сети': 'Offline', 'Не беспокоить': 'Do not disturb', 'Нет на месте': 'Away', 'Сон': 'Snooze', 'Невидимый': 'Invisible', 'Часов до выпадения карт': 'Hours until card drops', 'Фарминг': 'Farming', 'Пауза по умолчанию': 'Paused by default', 'Выкл. после фарма': 'Shutdown after farming', 'Пропускать несыгранные': 'Skip unplayed', 'Только приоритетная очередь': 'Priority queue only',
    'Обмен и предметы': 'Trading and items', 'STM (обмен карточками)': 'STM (card trading)', 'Обмен на всё': 'Match everything', 'Принимать донат': 'Accept donations', 'Принимать подарки': 'Accept gifts', 'Поведение': 'Behaviour', 'Отклонять чужие обмены': 'Reject other trades', 'Отклонять чужие заявки в друзья': 'Reject friend requests', 'Отклонять приглашения в группы': 'Reject group invitations', 'Поведение (доп.)': 'Behaviour (additional)', 'Скрывать уведомления инвентаря': 'Dismiss inventory notifications', 'Отмечать сообщения прочитанными': 'Mark messages as read', 'Отмечать свои сообщения': 'Mark own messages', 'Не разбирать входящие обмены': 'Do not parse incoming trades', 'Обмен (доп.)': 'Trading (additional)', 'Активный обмен (MatchActively)': 'Active matching (MatchActively)', 'Не принимать обмены ботов': 'Reject bot trades',
    'Распространение ключей': 'Key distribution', 'Порядок фарма': 'Farming order', 'Не упорядочен': 'Unordered', 'Карты ↑': 'Cards ↑', 'Карты ↓': 'Cards ↓', 'Часы ↑': 'Hours ↑', 'Часы ↓': 'Hours ↓', 'Имя ↑': 'Name ↑', 'Имя ↓': 'Name ↓', 'Режим интерфейса (UI)': 'UI mode', 'Устройство': 'Device', 'ПК': 'PC', 'Период проверки обменов (мин)': 'Trade check period (min)', 'Период отправки обменов (дней)': 'Trade send period (days)', 'Имя компьютера (MachineName)': 'Computer name (MachineName)', 'Игра при фарме (CustomGamePlayedWhileFarming)': 'Game while farming (CustomGamePlayedWhileFarming)', 'Игра в простое (CustomGamePlayedWhileIdle)': 'Game while idle (CustomGamePlayedWhileIdle)', 'Игры в простое (AppID через запятую)': 'Idle games (AppIDs separated by commas)', 'Родительский код Steam': 'Steam parental code', 'Запоминать вход (UseLoginKeys)': 'Remember login (UseLoginKeys)',
    'Удалить бота': 'Delete bot', 'Создать': 'Create', 'Подтверждение входа': 'Login confirmation', 'Введите код для аккаунта.': 'Enter the account code.', 'Подтвердите вход в приложении': 'Confirm login in the Steam app', 'Steam на телефоне.': 'on your phone.', 'Позже': 'Later', 'Войти по коду': 'Sign in with code', 'Подтвердить': 'Confirm', 'Steam Web API ключ': 'Steam Web API key', 'Для подбора игр по количеству часов нужен бесплатный Steam Web API ключ. Получите его на': 'A free Steam Web API key is required to select games by playtime. Get it at', '(в поле домена впишите любое, напр.': '(enter any value in the domain field, e.g.', '). Ключ хранится локально.': '). The key is stored locally.', 'Сохранить и запустить': 'Save and start', 'Пароль IPC': 'IPC password', 'ASF защищён паролем (IPCPassword). Введите его, чтобы подключиться.': 'ASF is protected with an IPC password. Enter it to connect.', 'Подключиться': 'Connect'
  },
  uk: {
    'Загрузка…': 'Завантаження…', 'Тёмная': 'Темна', 'Светлая': 'Світла', 'Тёмная тема (Стандартная)': 'Темна тема (Стандартна)', 'Светлая тема (Стандартная)': 'Світла тема (Стандартна)', 'Тёмная тема (Dead Dream)': 'Темна тема (Dead Dream)', 'Светлая тема (Dead Dream)': 'Світла тема (Dead Dream)', 'Выбрать тему из списка:': 'Вибрати тему зі списку:',
    'Журнал событий интерфейса…': 'Журнал подій інтерфейсу…', 'Новый бот': 'Новий бот', 'Все настройки задаются здесь — без команд и правки JSON.': 'Усі налаштування задаються тут — без команд і редагування JSON.', 'Имя бота': 'Ім’я бота', 'Логин Steam': 'Логін Steam', 'Пароль Steam': 'Пароль Steam', 'Максимум игр для фарма часов': 'Максимум ігор для фарму годин', 'Включён': 'Увімкнено', 'Расширенные настройки': 'Розширені налаштування',
    'Онлайн-статус': 'Онлайн-статус', 'В сети': 'У мережі', 'Не в сети': 'Не в мережі', 'Не беспокоить': 'Не турбувати', 'Нет на месте': 'Немає на місці', 'Сон': 'Сон', 'Невидимый': 'Невидимий', 'Часов до выпадения карт': 'Годин до випадіння карток', 'Фарминг': 'Фармінг', 'Пауза по умолчанию': 'Пауза за замовчуванням', 'Выкл. после фарма': 'Вимкнути після фарму', 'Пропускать несыгранные': 'Пропускати незіграні', 'Только приоритетная очередь': 'Лише пріоритетна черга',
    'Обмен и предметы': 'Обмін і предмети', 'STM (обмен карточками)': 'STM (обмін картками)', 'Обмен на всё': 'Обмін на все', 'Принимать донат': 'Приймати донати', 'Принимать подарки': 'Приймати подарунки', 'Поведение': 'Поведінка', 'Отклонять чужие обмены': 'Відхиляти чужі обміни', 'Отклонять чужие заявки в друзья': 'Відхиляти чужі заявки в друзі', 'Отклонять приглашения в группы': 'Відхиляти запрошення до груп', 'Поведение (доп.)': 'Поведінка (додатково)', 'Скрывать уведомления инвентаря': 'Приховувати сповіщення інвентарю', 'Отмечать сообщения прочитанными': 'Позначати повідомлення прочитаними', 'Отмечать свои сообщения': 'Позначати власні повідомлення', 'Не разбирать входящие обмены': 'Не обробляти вхідні обміни', 'Обмен (доп.)': 'Обмін (додатково)', 'Активный обмен (MatchActively)': 'Активний обмін (MatchActively)', 'Не принимать обмены ботов': 'Не приймати обміни ботів',
    'Распространение ключей': 'Розповсюдження ключів', 'Порядок фарма': 'Порядок фарму', 'Не упорядочен': 'Не впорядкований', 'Карты ↑': 'Картки ↑', 'Карты ↓': 'Картки ↓', 'Часы ↑': 'Години ↑', 'Часы ↓': 'Години ↓', 'Имя ↑': 'Ім’я ↑', 'Имя ↓': 'Ім’я ↓', 'Режим интерфейса (UI)': 'Режим інтерфейсу (UI)', 'Устройство': 'Пристрій', 'ПК': 'ПК', 'Период проверки обменов (мин)': 'Період перевірки обмінів (хв)', 'Период отправки обменов (дней)': 'Період надсилання обмінів (днів)', 'Имя компьютера (MachineName)': 'Ім’я комп’ютера (MachineName)', 'Игра при фарме (CustomGamePlayedWhileFarming)': 'Гра під час фарму (CustomGamePlayedWhileFarming)', 'Игра в простое (CustomGamePlayedWhileIdle)': 'Гра в простої (CustomGamePlayedWhileIdle)', 'Игры в простое (AppID через запятую)': 'Ігри в простої (AppID через кому)', 'Родительский код Steam': 'Батьківський код Steam', 'Запоминать вход (UseLoginKeys)': 'Запам’ятовувати вхід (UseLoginKeys)',
    'Удалить бота': 'Видалити бота', 'Создать': 'Створити', 'Подтверждение входа': 'Підтвердження входу', 'Введите код для аккаунта.': 'Введіть код для акаунта.', 'Подтвердите вход в приложении': 'Підтвердьте вхід у застосунку', 'Steam на телефоне.': 'Steam на телефоні.', 'Позже': 'Пізніше', 'Войти по коду': 'Увійти за кодом', 'Подтвердить': 'Підтвердити', 'Steam Web API ключ': 'Ключ Steam Web API', 'Для подбора игр по количеству часов нужен бесплатный Steam Web API ключ. Получите его на': 'Для підбору ігор за кількістю годин потрібен безкоштовний ключ Steam Web API. Отримайте його на', '(в поле домена впишите любое, напр.': '(у поле домену введіть будь-що, напр.', '). Ключ хранится локально.': '). Ключ зберігається локально.', 'Сохранить и запустить': 'Зберегти та запустити', 'Пароль IPC': 'Пароль IPC', 'ASF защищён паролем (IPCPassword). Введите его, чтобы подключиться.': 'ASF захищений паролем (IPCPassword). Введіть його для підключення.', 'Подключиться': 'Підключитися'
  }
};
const STATIC_ATTRIBUTE_I18N = {
  en: {
    'Сменить тему': 'Change theme', 'Свернуть': 'Minimize', 'Развернуть': 'Maximize', 'Закрыть': 'Close', 'Например: 730, 570, 440': 'For example: 730, 570, 440', 'Перезагрузить ASF': 'Restart ASF', 'Проверить обновление ASF': 'Check ASF update', 'Бустить часы: запустить топ-32 игр по часам на отфармленных аккаунтах': 'Boost hours: start the top 32 games by playtime on farmed accounts', 'Есть запросы на вход': 'There are pending login requests', 'например, main': 'for example, main', 'Steam логин': 'Steam login', 'Пароль': 'Password', 'напр. AbCdEf': 'e.g. AbCdEf', 'оставьте пустым для авто': 'leave empty for automatic value', 'название или пусто': 'name or empty', 'напр. 730,440': 'e.g. 730,440', 'оставьте пустым, если нет': 'leave empty if none', 'Код': 'Code', 'Вставьте API ключ': 'Paste API key'
  },
  uk: {
    'Сменить тему': 'Змінити тему', 'Свернуть': 'Згорнути', 'Развернуть': 'Розгорнути', 'Закрыть': 'Закрити', 'Например: 730, 570, 440': 'Наприклад: 730, 570, 440', 'Перезагрузить ASF': 'Перезапустити ASF', 'Проверить обновление ASF': 'Перевірити оновлення ASF', 'Бустить часы: запустить топ-32 игр по часам на отфармленных аккаунтах': 'Буст годин: запустити топ-32 ігор за годинами на відфармлених акаунтах', 'Есть запросы на вход': 'Є запити на вхід', 'например, main': 'наприклад, main', 'Steam логин': 'Логін Steam', 'Пароль': 'Пароль', 'напр. AbCdEf': 'напр. AbCdEf', 'оставьте пустым для авто': 'залиште порожнім для авто', 'название или пусто': 'назва або порожньо', 'напр. 730,440': 'напр. 730,440', 'оставьте пустым, если нет': 'залиште порожнім, якщо немає', 'Код': 'Код', 'Вставьте API ключ': 'Вставте API ключ'
  }
};
const ORIGINAL_STATIC_ATTRIBUTES = new WeakMap();
function translateStaticAttributes() {
  const map = STATIC_ATTRIBUTE_I18N[UI_LANGUAGE] || {};
  $$('[title], [placeholder], [aria-label]').forEach(element => {
    if (element.hasAttribute('data-i18n-placeholder') || element.hasAttribute('data-i18n-title')) return;
    let originals = ORIGINAL_STATIC_ATTRIBUTES.get(element);
    if (!originals) {
      originals = {};
      for (const attr of ['title', 'placeholder', 'aria-label']) {
        if (element.hasAttribute(attr)) originals[attr] = element.getAttribute(attr);
      }
      ORIGINAL_STATIC_ATTRIBUTES.set(element, originals);
    }
    for (const [attr, source] of Object.entries(originals)) {
      element.setAttribute(attr, map[source] || source);
    }
  });
}

const ORIGINAL_STATIC_TEXT = new WeakMap();
function translateStaticText() {
  const map = STATIC_TEXT_I18N[UI_LANGUAGE] || {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const parent = node.parentElement;
    if (!parent || ['SCRIPT', 'STYLE'].includes(parent.tagName) || parent.closest('[data-i18n]')) return;
    const source = ORIGINAL_STATIC_TEXT.get(node) ?? node.nodeValue;
    if (!ORIGINAL_STATIC_TEXT.has(node)) ORIGINAL_STATIC_TEXT.set(node, source);
    const leading = (source.match(/^\s*/) || [''])[0];
    const trailing = (source.match(/\s*$/) || [''])[0];
    const core = source.trim();
    if (!core) return;
    node.nodeValue = leading + (map[core] || core) + trailing;
  });
}

function applyLanguage(language, persist = true) {
  UI_LANGUAGE = I18N[language] ? language : 'ru';
  document.documentElement.lang = UI_LANGUAGE === 'uk' ? 'uk' : UI_LANGUAGE;
  if (persist) localStorage.setItem('betterasf_language', UI_LANGUAGE);
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  translateStaticText();
  translateStaticAttributes();
  const picker = $('#set-language');
  if (picker) picker.value = UI_LANGUAGE;
  if (typeof BOTS !== 'undefined' && Object.keys(BOTS || {}).length) renderBots(BOTS);
  if (typeof updateDeferredGuardButton === 'function') updateDeferredGuardButton(BOTS);
  if ($('#view-plugins') && $('#view-plugins').classList.contains('active')) loadPlugins();
}

const API_CANDIDATES = (() => {
  if (CFG.apiBase) return [CFG.apiBase.replace(/\/+$/, '')];

  return [''];
})();
let API_BASE = API_CANDIDATES[0] || '';
let IPC_PASSWORD = CFG.password || localStorage.getItem('asf_ipc_password') || '';
let pollTimer = null;
let ECONOMY_MODE = localStorage.getItem('asf_economy_mode') === '1';
let CUSTOM_THEME = { base: 'dark', transparent: false, imageUrl: '', hasImage: false };
let CUSTOM_THEME_PENDING_IMAGE = '';
let CUSTOM_THEME_REMOVE_IMAGE = false;
let CUSTOM_THEME_PREVIOUS_SELECTION = 'dark';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const LOG_TEXT_I18N = {
  ru: [
    ['Updater error:', 'Ошибка обновления:'], ['Updater:', 'Обновление:'], ['Plugin install error:', 'Ошибка установки плагина:'], ['Plugin removal error:', 'Ошибка удаления плагина:'], ['Plugin:', 'Плагин:'], ['GitHub plugins:', 'Плагины GitHub:']
  ],
  en: [
    ['Интерфейс запущен. База API:', 'Interface started. API base:'], ['Интерфейс готов. ASF запускается в фоне.', 'Interface is ready. ASF is starting in the background.'], ['Диагностика связи:', 'Connection diagnostics:'], ['Рабочий хост ASF:', 'Working ASF host:'], ['Прокси /__health не ответил.', 'The /__health proxy did not respond.'],
    ['Буст часов: подходящих аккаунтов нет.', 'Hour boost: no eligible accounts.'], ['Буст часов: аккаунтов ', 'Hour boost: accounts '], ['Буст часов: приоритетные AppID:', 'Hour boost: priority AppIDs:'], ['Буст часов:', 'Hour boost:'], ['нет SteamID, пропуск', 'no SteamID, skipping'], ['ошибка запроса игр', 'game request error'], ['игры скрыты приватностью', 'games are hidden by privacy settings'], ['в библиотеке нет игр, пропуск', 'no games in the library, skipping'], ['Нужен корректный Steam Web API ключ.', 'A valid Steam Web API key is required.'], ['нет игр для запуска, пропуск', 'no games to start, skipping'], ['нет приоритетных игр ', 'missing priority games '], ['пропуск для этого аккаунта', 'skipping for this account'], ['запущено ', 'started '], [' игр', ' games'], ['приоритетных:', 'priority:'], ['ошибка play', 'play error'],
    ['Фарм часов при запуске: ', 'Hour farming on startup: '], ['пропущен, вход не завершён.', 'skipped, login is not complete.'], ['жду инициализацию ботов', 'waiting for bot initialization'], ['подходящих аккаунтов нет.', 'no eligible accounts.'], ['Автофарм часов: обычный фарм закончился для ', 'Automatic hour farming: normal farming completed for '], ['Проверка фарма часов после восстановления связи:', 'Checking hour farming after connection recovery:'],
    ['ASF восстанавливается:', 'ASF is recovering:'], ['ASF запускается в фоне. Интерфейс уже доступен.', 'ASF is starting in the background. The interface is already available.'], ['ASF запускается в фоне.', 'ASF is starting in the background.'], ['Связь с ASF установлена.', 'Connected to ASF.'], ['Нет связи с ASF (ожидание запуска):', 'No ASF connection (waiting for startup):'],
    ['Команда:', 'Command:'], ['команда ASF "', 'ASF command "'], ['" отправлена.', '" sent.'], ['Ошибка сохранения бота:', 'Bot save error:'], ['Удалён бот:', 'Bot deleted:'], ['Изменён бот:', 'Bot changed:'], ['Создан бот:', 'Bot created:'], ['Бот ', 'Bot '], ['Ошибка:', 'Error:'], ['Updater:', 'Updater:'], ['Updater error:', 'Updater error:'], ['Plugin:', 'Plugin:'], ['Plugin install error:', 'Plugin install error:'], ['Plugin removal error:', 'Plugin removal error:'], ['GitHub plugins:', 'GitHub plugins:']
  ],
  uk: [
    ['Интерфейс запущен. База API:', 'Інтерфейс запущено. База API:'], ['Интерфейс готов. ASF запускается в фоне.', 'Інтерфейс готовий. ASF запускається у фоні.'], ['Диагностика связи:', 'Діагностика з’єднання:'], ['Рабочий хост ASF:', 'Робочий хост ASF:'], ['Прокси /__health не ответил.', 'Проксі /__health не відповів.'],
    ['Буст часов: подходящих аккаунтов нет.', 'Буст годин: немає відповідних акаунтів.'], ['Буст часов: аккаунтов ', 'Буст годин: акаунтів '], ['Буст часов: приоритетные AppID:', 'Буст годин: пріоритетні AppID:'], ['Буст часов:', 'Буст годин:'], ['нет SteamID, пропуск', 'немає SteamID, пропуск'], ['ошибка запроса игр', 'помилка запиту ігор'], ['игры скрыты приватностью', 'ігри приховані налаштуваннями приватності'], ['в библиотеке нет игр, пропуск', 'у бібліотеці немає ігор, пропуск'], ['Нужен корректный Steam Web API ключ.', 'Потрібен коректний ключ Steam Web API.'], ['нет игр для запуска, пропуск', 'немає ігор для запуску, пропуск'], ['нет приоритетных игр ', 'немає пріоритетних ігор '], ['пропуск для этого аккаунта', 'пропуск для цього акаунта'], ['запущено ', 'запущено '], [' игр', ' ігор'], ['приоритетных:', 'пріоритетних:'], ['ошибка play', 'помилка play'],
    ['Фарм часов при запуске: ', 'Фарм годин під час запуску: '], ['пропущен, вход не завершён.', 'пропущено, вхід не завершено.'], ['жду инициализацию ботов', 'очікую ініціалізацію ботів'], ['подходящих аккаунтов нет.', 'немає відповідних акаунтів.'], ['Автофарм часов: обычный фарм закончился для ', 'Автофарм годин: звичайний фарм завершився для '], ['Проверка фарма часов после восстановления связи:', 'Перевірка фарму годин після відновлення зв’язку:'],
    ['ASF восстанавливается:', 'ASF відновлюється:'], ['ASF запускается в фоне. Интерфейс уже доступен.', 'ASF запускається у фоні. Інтерфейс уже доступний.'], ['ASF запускается в фоне.', 'ASF запускається у фоні.'], ['Связь с ASF установлена.', 'З’єднання з ASF встановлено.'], ['Нет связи с ASF (ожидание запуска):', 'Немає зв’язку з ASF (очікування запуску):'],
    ['Команда:', 'Команда:'], ['команда ASF "', 'команду ASF "'], ['" отправлена.', '" надіслано.'], ['Ошибка сохранения бота:', 'Помилка збереження бота:'], ['Удалён бот:', 'Бота видалено:'], ['Изменён бот:', 'Бота змінено:'], ['Создан бот:', 'Бота створено:'], ['Бот ', 'Бот '], ['Ошибка:', 'Помилка:'], ['Updater:', 'Оновлювач:'], ['Updater error:', 'Помилка оновлювача:'], ['Plugin:', 'Плагін:'], ['Plugin install error:', 'Помилка встановлення плагіна:'], ['Plugin removal error:', 'Помилка видалення плагіна:'], ['GitHub plugins:', 'Плагіни GitHub:']
  ]
};

function localizeLogText(message) {
  let text = String(message ?? '');
  for (const [source, localized] of LOG_TEXT_I18N[UI_LANGUAGE] || []) {
    text = text.split(source).join(localized);
  }
  return text;
}

function logEvent(msg) {
  const el = $('#log-output');
  if (!el) return;
  const locale = UI_LANGUAGE === 'uk' ? 'uk-UA' : UI_LANGUAGE === 'en' ? 'en-US' : 'ru-RU';
  const now = new Date().toLocaleTimeString(locale);
  el.textContent += `[${now}] ${localizeLogText(msg)}\n`;
  el.scrollTop = el.scrollHeight;
}

function toast(msg, type = '') {
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'toast ' + type; }, 2600);
}

function hideUpdateBanner(id = '') {
  const b = $('#update-banner');
  if (b) { b.classList.remove('show'); b.setAttribute('aria-hidden', 'true'); }
  if (id) localStorage.setItem('betterasf_update_dismissed', id);
}

async function installBetterASFUpdate(btn) {
  if (btn) { btn.disabled = true; btn.textContent = t('update_downloading'); }
  try {
    const r = await fetch('/__install_update', { method: 'POST', cache: 'no-store' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) throw new Error(d.message || ('HTTP ' + r.status));
    toast(t('update_started'), 'ok');
    logEvent('Updater: ' + (d.message || 'update started'));
    hideUpdateBanner();
    setTimeout(async () => {
      const a = bridge();
      if (a && a.exit_app) {
        try { await a.exit_app(); return; } catch (e) {}
      }
      try { await fetch('/__exit', { method: 'POST' }); } catch (e) {}
    }, 500);
  } catch (e) {
    toast(t('update_failed') + ': ' + e.message, 'err');
    logEvent('Updater error: ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = t('update_button'); }
  }
}

async function checkBetterASFUpdate(manual = false) {
  try {
    const r = await fetch('/__check_update', { cache: 'no-store' });
    const d = await r.json();
    if (!d || !d.ok) {
      if (manual) toast(t('update_check_failed'), 'err');
      return;
    }
    const updateId = d.latestVersion || d.latestCommit || d.downloadUrl || d.url || 'unknown';
    if (!d.update) {
      if (manual) toast(t('update_none'), 'ok');
      return;
    }
    if (!manual && localStorage.getItem('betterasf_update_dismissed') === updateId) return;

    const b = $('#update-banner');
    const text = $('#update-banner-text');
    const link = $('#update-banner-link');
    const ok = $('#update-banner-ok');
    if (!b || !text || !link || !ok) return;
    text.textContent = tf('update_available', { version: d.latestVersion ? 'v' + d.latestVersion : '' }).trim();
    link.textContent = t('update_button');
    link.onclick = () => installBetterASFUpdate(link);
    ok.textContent = '×';
    ok.onclick = () => hideUpdateBanner(updateId);
    b.classList.add('show');
    b.setAttribute('aria-hidden', 'false');
    logEvent('GitHub: ' + text.textContent);
  } catch (e) {
    if (manual) toast(t('update_check_failed') + ': ' + e.message, 'err');
  }
}

function setConn(ok) {
  const c = $('#conn');
  if (ok) { c.textContent = t('connected'); c.className = 'tb-conn tb-conn--on'; }
  else { c.textContent = t('no_connection'); c.className = 'tb-conn tb-conn--off'; }
}

function setConnRecovering() {
  const c = $('#conn');
  if (!c) return;
  c.textContent = t('recovering');
  c.className = 'tb-conn tb-conn--recover';
}

function setConnStarting() {
  const c = $('#conn');
  if (!c) return;
  c.textContent = t('starting_asf');
  c.className = 'tb-conn tb-conn--wait';
}

async function getAppState() {
  const r = await fetch('/__appstate', { cache: 'no-store' });
  return await r.json();
}

async function rawFetch(base, path, opts, headers) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeout || 8000);
  try {
    return await fetch(base + path, Object.assign({}, opts, { headers, signal: ctrl.signal }));
  } finally {
    clearTimeout(timer);
  }
}

async function api(path, opts = {}) {
  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    IPC_PASSWORD ? { 'Authentication': IPC_PASSWORD } : {},
    opts.headers || {}
  );

  const bases = [];
  if (API_BASE !== null && API_BASE !== undefined) bases.push(API_BASE);
  for (const b of API_CANDIDATES) if (!bases.includes(b)) bases.push(b);

  let lastErr = null;
  for (const base of bases) {
    let res;
    try {
      res = await rawFetch(base, path, opts, headers);
    } catch (e) {
      lastErr = e;
      continue;
    }

    API_BASE = base;
    if (res.status === 401) { showAuthModal(); throw new Error('Требуется пароль IPC (401)'); }
    let data = null;
    try { data = await res.json(); } catch (e) {  }
    if (!res.ok) throw new Error((data && data.Message) || `HTTP ${res.status}`);
    return data;
  }
  throw new Error('ASF недоступен (' + (lastErr ? lastErr.message : 'нет ответа') + ')');
}

function botState(bot) {
  if (!bot.KeepRunning) return { key: 'offline', label: t('bot_disabled') };
  if (!bot.IsConnectedAndLoggedOn) return { key: 'offline', label: t('bot_offline') };
  const cf = bot.CardsFarmer || {};
  if (cf.Paused) return { key: 'online', label: t('bot_paused') };
  if (cf.NowFarming) return { key: 'farming', label: t('bot_farming') };
  return { key: 'online', label: t('bot_online') };
}

function isPaused(bot) {
  return !!(bot.CardsFarmer && bot.CardsFarmer.Paused);
}

function botAvatar(bot) {
  if (ECONOMY_MODE) return '';
  if (bot.AvatarHash && /^[a-f0-9]{40}$/i.test(bot.AvatarHash)) {
    return `https://avatars.akamai.steamstatic.com/${bot.AvatarHash}_medium.jpg`;
  }
  return '';
}

function botCardHTML(name, bot) {
  const st = botState(bot);
  const av = botAvatar(bot);
  const avHtml = av
    ? `<img class="bot-av" src="${av}" alt="" onerror="this.style.visibility='hidden'">`
    : `<div class="bot-av"></div>`;
  const running = bot.KeepRunning;
  const powerTitle = running ? t('stop_bot') : t('start_bot');
  const powerAct = running ? 'stop' : 'start';
  return `
    <div class="bot-card" data-bot="${name}">
      ${avHtml}
      <div class="bot-info bot-edit" data-edit="${name}" title="${t('bot_settings')}">
        <div class="bot-name"><span class="dot ${st.key}"></span>${escapeHtml(bot.Nickname || name)}</div>
        <div class="bot-status">${st.label}</div>
      </div>
      <div class="bot-actions">
        <button class="btn icon" title="${t('bot_settings')}" data-act="edit" data-bot="${name}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
        ${running ? (isPaused(bot)
          ? `<button class="btn icon" title="${t('resume_farm')}" data-act="resume" data-bot="${name}">
               <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l14 8-14 8z"/></svg></button>`
          : `<button class="btn icon" title="${t('pause_farm')}" data-act="pause" data-bot="${name}">
               <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg></button>`
        ) : ''}
        <button class="btn icon" title="${powerTitle}" data-act="${powerAct}" data-bot="${name}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/></svg></button>
      </div>
    </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

let BOTS = {};
function renderBots(bots) {
  BOTS = bots || {};
  const names = Object.keys(bots || {});
  let farming = 0, online = 0, offline = 0;
  for (const n of names) {
    const st = botState(bots[n]);
    if (st.key === 'farming') farming++;
    else if (st.key === 'online') online++;
    else offline++;
  }
  $('#st-farming').textContent = farming;
  $('#st-online').textContent = online + farming;
  $('#st-offline').textContent = offline;
  $('#st-total').textContent = names.length;

  let games = 0, cards = 0, totalSeconds = 0, hasData = false;
  for (const n of names) {
    const cf = bots[n].CardsFarmer;
    if (cf) {
      const countedAppIDs = new Set();
      if (Array.isArray(cf.GamesToFarm)) {
        games += cf.GamesToFarm.length;
        hasData = true;
        for (const game of cf.GamesToFarm) {
          if (game && typeof game.AppID === 'number') {
            countedAppIDs.add(game.AppID);
            if (typeof game.CardsRemaining === 'number') {
              cards += game.CardsRemaining;
            }
          }
        }
      }
      if (Array.isArray(cf.CurrentGamesFarming)) {
        for (const game of cf.CurrentGamesFarming) {
          if (game && typeof game.AppID === 'number' && !countedAppIDs.has(game.AppID)) {
            countedAppIDs.add(game.AppID);
            if (typeof game.CardsRemaining === 'number') {
              cards += game.CardsRemaining;
            }
          }
        }
      }
      if (typeof cf.TimeRemaining === 'string') {
        const parts = cf.TimeRemaining.split(':');
        if (parts.length >= 2) {
          let hrs = 0, mins = 0, secs = 0, days = 0;
          let hourPart = parts[0];
          if (hourPart.includes('.')) {
            const dayParts = hourPart.split('.');
            days = parseInt(dayParts[0], 10) || 0;
            hrs = parseInt(dayParts[1], 10) || 0;
          } else {
            hrs = parseInt(hourPart, 10) || 0;
          }
          mins = parseInt(parts[1], 10) || 0;
          if (parts.length >= 3) {
            secs = parseInt(parts[2], 10) || 0;
          }
          totalSeconds += (days * 86400) + (hrs * 3600) + (mins * 60) + secs;
        }
      }
    }
  }

  let timeStr = '—';
  if (hasData && totalSeconds > 0) {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    if (d > 0) {
      timeStr = `${d}д ${h}ч`;
    } else if (h > 0) {
      timeStr = `${h}ч ${m}м`;
    } else {
      timeStr = `${m}м`;
    }
  }

  $('#kpi-games').textContent = hasData ? games : '—';
  $('#kpi-cards').textContent = hasData ? cards : '—';
  $('#kpi-time').textContent = timeStr;

  const cardsHtml = names.length
    ? names.map(n => botCardHTML(n, bots[n])).join('')
    : `<div class="empty">Ботов не найдено. Добавьте бота в ASF.</div>`;

  $('#dash-bots').innerHTML = cardsHtml +
    `<div class="bot-card is-add" id="addBotDash">＋ Добавить бота</div>`;
  $('#bots-list').innerHTML = cardsHtml +
    `<div class="bot-card is-add" id="addBotList">＋ Добавить бота</div>`;

  bindBotActions();
}

function bindBotActions() {
  $$('[data-act]').forEach(btn => {
    btn.onclick = async () => {
      const bot = btn.getAttribute('data-bot');
      const act = btn.getAttribute('data-act');
      if (act === 'edit') { openEditBot(bot); return; }
      try {
        if (act === 'pause') {
          await api(`/Api/Bot/${encodeURIComponent(bot)}/Pause`, {
            method: 'POST', body: JSON.stringify({ Permanent: true, ResumeInSeconds: 0 }),
          });
          toast(`Пауза: ${bot}`, 'ok');
        } else if (act === 'resume') {
          await api(`/Api/Bot/${encodeURIComponent(bot)}/Resume`, { method: 'POST' });
          toast(`Возобновлено: ${bot}`, 'ok');
        } else {
          await api(`/Api/Bot/${encodeURIComponent(bot)}/${act === 'start' ? 'Start' : 'Stop'}`, { method: 'POST' });
          toast(`${act === 'start' ? 'Запуск' : 'Остановка'}: ${bot}`, 'ok');
        }
        logEvent(`Бот ${bot}: ${act}`);
        setTimeout(refresh, 900);
      } catch (e) { toast(e.message, 'err'); logEvent('Ошибка: ' + e.message); }
    };
  });
  $$('[data-edit]').forEach(el => { el.onclick = () => openEditBot(el.getAttribute('data-edit')); });
  const a1 = $('#addBotDash'), a2 = $('#addBotList');
  if (a1) a1.onclick = openAddBot;
  if (a2) a2.onclick = openAddBot;
}

let _editingBot = null;

const FP = { paused: 1, shutdown: 2, priorityonly: 8, skipunplayed: 32 };
const TP = { donations: 1, matcher: 2, matchall: 4, nobottrades: 8, matchactively: 16 };
const BB = { rejfriends: 1, rejtrades: 2, rejgroups: 4, dismissnotif: 8, markread: 16, markself: 32, noincoming: 64 };
const RP = { forwarding: 1, distributing: 2, keepmissing: 4, assumewallet: 8 };

function setChk(id, v) { const el = $('#' + id); if (el) el.checked = !!v; }
function getChk(id) { const el = $('#' + id); return el && el.checked; }

function showAdvanced(open) {
  $('#ab-adv').style.display = open ? 'block' : 'none';
  $('#ab-adv-toggle').classList.toggle('open', open);
}

function fillForm(c) {
  $('#ab-login').value = c.SteamLogin || '';
  $('#ab-pass').value = '';
  $('#ab-enabled').checked = c.Enabled !== false;
  $('#ab-online').value = String(c.OnlineStatus != null ? c.OnlineStatus : 1);
  $('#ab-hours').value = (c.HoursUntilCardDrops != null ? c.HoursUntilCardDrops : 3);
  const fp = c.FarmingPreferences || 0, tp = c.TradingPreferences || 0,
        bb = c.BotBehaviour || 0, rp = c.RedeemingPreferences || 0;
  setChk('ab-paused', fp & FP.paused);
  setChk('ab-shutdown', fp & FP.shutdown);
  setChk('ab-priorityonly', fp & FP.priorityonly);
  setChk('ab-skipunplayed', fp & FP.skipunplayed);
  setChk('ab-matcher', tp & TP.matcher);
  setChk('ab-matchall', tp & TP.matchall);
  setChk('ab-donations', tp & TP.donations);
  setChk('ab-gifts', !!c.AcceptGifts);
  setChk('ab-matchactively', tp & TP.matchactively);
  setChk('ab-nobottrades', tp & TP.nobottrades);
  setChk('ab-rejtrades', bb & BB.rejtrades);
  setChk('ab-rejfriends', bb & BB.rejfriends);
  setChk('ab-rejgroups', bb & BB.rejgroups);
  setChk('ab-dismissnotif', bb & BB.dismissnotif);
  setChk('ab-markread', bb & BB.markread);
  setChk('ab-markself', bb & BB.markself);
  setChk('ab-noincoming', bb & BB.noincoming);
  setChk('ab-forwarding', rp & RP.forwarding);
  setChk('ab-distributing', rp & RP.distributing);
  setChk('ab-keepmissing', rp & RP.keepmissing);
  setChk('ab-assumewallet', rp & RP.assumewallet);
  $('#ab-farmorder').value = String((c.FarmingOrders && c.FarmingOrders[0]) || 0);
  $('#ab-uimode').value = String(c.UserInterfaceMode != null ? c.UserInterfaceMode : 0);
  const botNameForLimit = _editingBot || $('#ab-name').value || '';
  $('#ab-hour-max-games').value = String(hourFarmMaxForBot(botNameForLimit));
  $('#ab-device').value = String(c.GamingDeviceType != null ? c.GamingDeviceType : 1);
  $('#ab-tradecheck').value = (c.TradeCheckPeriod != null ? c.TradeCheckPeriod : 60);
  $('#ab-sendtrade').value = (c.SendTradePeriod != null ? c.SendTradePeriod : 0);
  $('#ab-tradetoken').value = c.SteamTradeToken || '';
  $('#ab-machine').value = c.MachineName || '';
  $('#ab-custfarm').value = c.CustomGamePlayedWhileFarming || '';
  $('#ab-custidle').value = c.CustomGamePlayedWhileIdle || '';
  $('#ab-idlegames').value = (c.GamesPlayedWhileIdle || []).join(',');
  $('#ab-parental').value = c.SteamParentalCode || '';
  setChk('ab-loginkeys', c.UseLoginKeys !== false);
}

function openAddBot() {
  _editingBot = null;
  $('#ab-title').textContent = t('new_bot');
  $('#ab-save').textContent = t('create_bot');
  $('#ab-delete').style.display = 'none';
  $('#ab-name').disabled = false;
  $('#ab-name').value = '';
  $('#ab-pass-hint').textContent = '';
  fillForm({ Enabled: true, OnlineStatus: 1, HoursUntilCardDrops: 3 });
  showAdvanced(false);
  $('#addbot-modal').classList.add('show');
  $('#ab-name').focus();
}

function openEditBot(name) {
  const bot = BOTS[name];
  const c = (bot && bot.BotConfig) ? bot.BotConfig : {};
  _editingBot = name;
  $('#ab-title').textContent = t('bot_settings');
  $('#ab-save').textContent = t('save_bot');
  $('#ab-delete').style.display = 'inline-flex';
  $('#ab-name').disabled = true;
  $('#ab-name').value = name;
  $('#ab-pass-hint').textContent = t('keep_password');
  fillForm(c);
  showAdvanced(false);
  $('#addbot-modal').classList.add('show');
}

function closeAddBot() { $('#addbot-modal').classList.remove('show'); _editingBot = null; }

async function saveBot() {
  const name = $('#ab-name').value.trim();
  const login = $('#ab-login').value.trim();
  const pass = $('#ab-pass').value;
  if (!name) { toast('Введите имя бота', 'err'); return; }
  if (!/^[A-Za-z0-9_-]+$/.test(name)) { toast('Имя: только латиница, цифры, _ и -', 'err'); return; }

  let fp = 0, tp = 0, bb = 0, rp = 0;
  if (getChk('ab-paused')) fp |= FP.paused;
  if (getChk('ab-shutdown')) fp |= FP.shutdown;
  if (getChk('ab-priorityonly')) fp |= FP.priorityonly;
  if (getChk('ab-skipunplayed')) fp |= FP.skipunplayed;
  if (getChk('ab-matcher')) tp |= TP.matcher;
  if (getChk('ab-matchall')) tp |= TP.matchall;
  if (getChk('ab-donations')) tp |= TP.donations;
  if (getChk('ab-matchactively')) tp |= TP.matchactively;
  if (getChk('ab-nobottrades')) tp |= TP.nobottrades;
  if (getChk('ab-rejtrades')) bb |= BB.rejtrades;
  if (getChk('ab-rejfriends')) bb |= BB.rejfriends;
  if (getChk('ab-rejgroups')) bb |= BB.rejgroups;
  if (getChk('ab-dismissnotif')) bb |= BB.dismissnotif;
  if (getChk('ab-markread')) bb |= BB.markread;
  if (getChk('ab-markself')) bb |= BB.markself;
  if (getChk('ab-noincoming')) bb |= BB.noincoming;
  if (getChk('ab-forwarding')) rp |= RP.forwarding;
  if (getChk('ab-distributing')) rp |= RP.distributing;
  if (getChk('ab-keepmissing')) rp |= RP.keepmissing;
  if (getChk('ab-assumewallet')) rp |= RP.assumewallet;

  const idleGames = $('#ab-idlegames').value.split(',')
    .map(s => parseInt(s.trim(), 10)).filter(n => Number.isFinite(n) && n > 0);

  const cfg = {
    Enabled: $('#ab-enabled').checked,
    OnlineStatus: parseInt($('#ab-online').value, 10),
    HoursUntilCardDrops: Math.max(0, Math.min(255, parseInt($('#ab-hours').value, 10) || 3)),
    FarmingPreferences: fp,
    TradingPreferences: tp,
    BotBehaviour: bb,
    RedeemingPreferences: rp,
    AcceptGifts: getChk('ab-gifts'),
    UseLoginKeys: getChk('ab-loginkeys'),
    FarmingOrders: [parseInt($('#ab-farmorder').value, 10)],
    UserInterfaceMode: parseInt($('#ab-uimode').value, 10),
    GamingDeviceType: parseInt($('#ab-device').value, 10),
    TradeCheckPeriod: Math.max(0, Math.min(255, parseInt($('#ab-tradecheck').value, 10) || 60)),
    SendTradePeriod: Math.max(0, Math.min(255, parseInt($('#ab-sendtrade').value, 10) || 0)),
    GamesPlayedWhileIdle: idleGames,
    s_SteamMasterClanID: '103582791475681171',
    RemoteCommunication: 2,
  };
  const token = $('#ab-tradetoken').value.trim();
  const machine = $('#ab-machine').value.trim();
  const custFarm = $('#ab-custfarm').value.trim();
  const custIdle = $('#ab-custidle').value.trim();
  const parental = $('#ab-parental').value.trim();
  if (token) cfg.SteamTradeToken = token;
  if (machine) cfg.MachineName = machine;
  if (custFarm) cfg.CustomGamePlayedWhileFarming = custFarm;
  if (custIdle) cfg.CustomGamePlayedWhileIdle = custIdle;
  if (parental) cfg.SteamParentalCode = parental;
  if (login) cfg.SteamLogin = login;
  if (pass) cfg.SteamPassword = pass;

  try {
    await api('/Api/Bot/' + encodeURIComponent(name), {
      method: 'POST',
      body: JSON.stringify({ BotConfig: cfg }),
    });
    await saveHourFarmMaxForBot(name, $('#ab-hour-max-games').value);
    toast(_editingBot ? ('Сохранено: ' + name) : ('Бот создан: ' + name), 'ok');
    logEvent((_editingBot ? 'Изменён' : 'Создан') + ' бот: ' + name);
    closeAddBot();
    setTimeout(refresh, 700);
  } catch (e) {
    toast(e.message, 'err');
    logEvent('Ошибка сохранения бота: ' + e.message);
  }
}

async function deleteBot() {
  if (!_editingBot) return;
  if (!confirm('Удалить бота "' + _editingBot + '"? Конфиг будет удалён.')) return;
  try {
    await api('/Api/Bot/' + encodeURIComponent(_editingBot), { method: 'DELETE' });
    toast('Бот удалён: ' + _editingBot, 'ok');
    logEvent('Удалён бот: ' + _editingBot);
    closeAddBot();
    setTimeout(refresh, 700);
  } catch (e) {
    toast(e.message, 'err');
  }
}

function fmtMem(kb) {
  if (!kb) return '—';
  const mb = kb / 1024;
  return mb >= 1024 ? (mb / 1024).toFixed(2) + ' GB' : mb.toFixed(0) + ' MB';
}
function fmtUptime(startTimeIso) {
  if (!startTimeIso) return '—';
  const start = new Date(startTimeIso).getTime();
  if (isNaN(start)) return '—';
  let s = Math.floor((Date.now() - start) / 1000);
  const d = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600;
  const m = Math.floor(s / 60);
  if (d) return `${d}д ${h}ч`;
  if (h) return `${h}ч ${m}м`;
  return `${m}м`;
}

async function refreshAppStats(asfKb = 0) {
  try {
    const r = await fetch('/__appstats', { cache: 'no-store' });
    const d = await r.json();
    const appKb = Number(d.memoryKb || 0);
    const webviewKb = Number(d.webviewMemoryKb || 0);
    const totalKb = appKb + Number(asfKb || 0);
    const appEl = $('#sys-app-mem');
    const totalEl = $('#sys-mem-total');
    if (appEl) {
      appEl.textContent = fmtMem(appKb);
      if (webviewKb) {
        appEl.title = 'Python/UI backend + WebView2: ' + fmtMem(webviewKb) +
          (d.webviewOrphanMode ? ' (WebView2 найден не как дочерний процесс)' : '');
      }
    }
    if (totalEl) totalEl.textContent = totalKb ? fmtMem(totalKb) : '—';
  } catch (e) {
    const appEl = $('#sys-app-mem');
    if (appEl) appEl.textContent = '—';
  }
}

async function refreshASF() {
  try {
    const r = await api('/Api/ASF');
    const d = r && r.Result ? r.Result : {};
    const asfKb = Number(d.MemoryUsage || 0);
    $('#sys-mem').textContent = fmtMem(asfKb);
    await refreshAppStats(asfKb);
    $('#sys-up').textContent = fmtUptime(d.ProcessStartTime || d.StartTime);
    $('#sys-ver').textContent = d.Version ? ('v' + (d.Version.Major !== undefined ?
      `${d.Version.Major}.${d.Version.Minor}.${d.Version.Build}` : d.Version)) : '—';
  } catch (e) {
    await refreshAppStats(0);
  }
}

async function refreshBots() {
  const r = await api('/Api/Bot/ASF');
  const bots = r && r.Result ? r.Result : {};
  renderBots(bots);
  checkRequiredInput(bots);
  maybeStartHourFarmOnLaunch(bots);
  maybeAutoHourFarmAfterCards(bots);
  maybeReapplyHourFarmAfterReconnect(bots);
}

const INPUT_TYPES = {
  1: { titleKey: 'input_login_title', labelKey: 'input_login_label', phKey: 'input_login_placeholder', upper: false, confirm: false },
  2: { titleKey: 'input_password_title', labelKey: 'input_password_label', phKey: 'input_password_placeholder', upper: false, confirm: false },
  3: { titleKey: 'input_guard_title', labelKey: 'input_guard_label', ph: 'XXXXX', upper: true, confirm: false },
  4: { titleKey: 'input_parental_title', labelKey: 'input_parental_label', phKey: 'input_parental_placeholder', upper: false, confirm: false },
  5: { titleKey: 'input_2fa_title', labelKey: 'input_2fa_label', ph: '00000', upper: true, confirm: false },
  7: { titleKey: 'input_confirm_title', labelKey: 'input_confirm_label', ph: '', upper: false, confirm: true },
};

function inputInfo(type) {
  const source = INPUT_TYPES[type];
  if (!source) return null;
  return Object.assign({}, source, {
    title: t(source.titleKey), label: t(source.labelKey), ph: source.phKey ? t(source.phKey) : (source.ph || ''),
  });
}

let _guardActive = null;
const _deferredGuards = new Set();

function guardKey(bot, type) {
  return String(bot) + ':' + String(type);
}

function pendingGuards(bots = BOTS) {
  const pending = [];
  for (const name of Object.keys(bots || {})) {
    const type = bots[name] && bots[name].RequiredInput;
    if (type && inputInfo(type)) pending.push({ bot: name, type });
  }
  return pending;
}

function updateDeferredGuardButton(bots = BOTS) {
  const button = $('#pending-input-nav');
  if (!button) return;
  const pending = pendingGuards(bots);
  const pendingKeys = new Set(pending.map(x => guardKey(x.bot, x.type)));
  for (const key of Array.from(_deferredGuards)) {
    if (!pendingKeys.has(key)) _deferredGuards.delete(key);
  }
  const hasPending = pending.length > 0;
  button.classList.toggle('show', hasPending);
  button.setAttribute('aria-hidden', hasPending ? 'false' : 'true');
  button.title = t('input_alert');
  button.setAttribute('aria-label', t('input_alert'));
  const count = $('#pending-input-count');
  if (count) count.textContent = String(pending.length);
}

function checkRequiredInput(bots) {
  const pending = pendingGuards(bots);
  for (const item of pending) {
    const info = inputInfo(item.type);
    const key = guardKey(item.bot, item.type);
    if (!_inputLogged.has(key)) {
      _inputLogged.add(key);
      logEvent(tf('input_required_for', { bot: item.bot, value: info.label }));
    }
  }
  updateDeferredGuardButton(bots);
  if (_guardActive) return;
  const next = pending.find(item => !_deferredGuards.has(guardKey(item.bot, item.type)));
  if (next) openGuard(next.bot, next.type);
}

function openGuard(botName, type) {
  const info = inputInfo(type);
  if (!info) return;
  _deferredGuards.delete(guardKey(botName, type));
  _guardActive = { bot: botName, type };
  $('#guard-acc').textContent = botName;
  $('#guard-title').textContent = info.title;

  if (info.confirm) {
    $('#guard-sub').textContent = t('input_request_for');
    $('#guard-confirm-view').style.display = 'block';
    $('#guard-code-view').style.display = 'none';
    $('#guard-send').style.display = 'none';
    $('#guard-bycode').style.display = 'inline-flex';
  } else {
    showGuardCode(type);
  }
  $('#guard-modal').classList.add('show');
  updateDeferredGuardButton(BOTS);
  logEvent(tf('input_required', { value: info.confirm ? info.title : info.label, bot: botName }));
}

function showGuardCode(type) {
  const info = inputInfo(type);
  if (!info || !_guardActive) return;
  _guardActive.type = type;
  $('#guard-title').textContent = info.title;
  $('#guard-sub').textContent = tf('input_enter_for', { value: info.label });
  $('#guard-confirm-view').style.display = 'none';
  $('#guard-code-view').style.display = 'block';
  $('#guard-send').style.display = 'inline-flex';
  $('#guard-bycode').style.display = 'none';
  const inp = $('#guard-input');
  inp.value = '';
  inp.type = (type === 2 || type === 4) ? 'password' : 'text';
  inp.placeholder = info.ph;
  inp.style.textTransform = info.upper ? 'uppercase' : 'none';
  setTimeout(() => inp.focus(), 50);
}

function guardByCode() {
  showGuardCode(5);
}

function deferGuard() {
  // "Later" silences the whole current batch, not only the open bot. Otherwise
  // a second pending account would immediately reopen the same modal.
  pendingGuards(BOTS).forEach(item => _deferredGuards.add(guardKey(item.bot, item.type)));
  closeGuard();
  updateDeferredGuardButton(BOTS);
  toast(t('input_later'), 'ok');
}

function openDeferredGuard() {
  if (_guardActive) return;
  const pending = pendingGuards(BOTS);
  const next = pending.find(item => _deferredGuards.has(guardKey(item.bot, item.type))) || pending[0];
  if (next) openGuard(next.bot, next.type);
}

function closeGuard() {
  $('#guard-modal').classList.remove('show');
  _guardActive = null;
}

async function sendGuard() {
  if (!_guardActive) return;
  const active = _guardActive;
  const info = inputInfo(active.type) || {};
  let val = $('#guard-input').value.trim();
  if (info.upper) val = val.toUpperCase();
  if (!val) { toast(t('input_value_required'), 'err'); return; }
  try {
    await api('/Api/Bot/' + encodeURIComponent(active.bot) + '/Input', {
      method: 'POST',
      body: JSON.stringify({ Type: active.type, Value: val }),
    });
    _deferredGuards.delete(guardKey(active.bot, active.type));
    toast(tf('input_sent', { bot: active.bot }), 'ok');
    logEvent(tf('input_sent', { bot: active.bot }));
    closeGuard();
    setTimeout(refresh, 1200);
  } catch (e) {
    toast(e.message, 'err');
  }
}

let _boosting = false;
let AUTO_HOUR_FARM = localStorage.getItem('asf_auto_hour_farm_after_cards') === '1';
let START_HOUR_FARM = localStorage.getItem('asf_start_hour_farm_on_launch') === '1';
let PRIORITY_HOUR_APPIDS = localStorage.getItem('asf_priority_hour_farm_appids') || '';
let HOUR_FARM_PRIORITY_MODE = localStorage.getItem('asf_hour_farm_priority_mode') || 'hours_desc';
if (!['hours_asc', 'hours_desc', 'popular'].includes(HOUR_FARM_PRIORITY_MODE)) HOUR_FARM_PRIORITY_MODE = 'hours_desc';
let HOUR_FARM_MAX_BY_BOT = {};
try { HOUR_FARM_MAX_BY_BOT = JSON.parse(localStorage.getItem('asf_hour_farm_max_by_bot') || '{}') || {}; } catch (e) { HOUR_FARM_MAX_BY_BOT = {}; }
let _startupHourDone = false;
let _startupWaitStarted = 0;
let _lastStartupWaitLog = 0;
let _autoHourInitialized = false;
const _autoHourSeenCardWork = new Set();
const _autoHourBoosted = new Set();
const _inputLogged = new Set();
const _hourReapplyAt = new Map();

function isBotEnabled(bot) {
  if (!bot) return false;
  if (bot.Enabled === false) return false;
  if (bot.BotConfig && bot.BotConfig.Enabled === false) return false;
  return bot.KeepRunning !== false;
}

function hourFarmMaxForBot(name) {
  const n = parseInt(HOUR_FARM_MAX_BY_BOT[name], 10);
  return Number.isFinite(n) ? Math.max(1, Math.min(32, n)) : 32;
}

async function saveHourFarmMaxForBot(name, value) {
  if (!name) return;
  let n = parseInt(value, 10);
  if (!Number.isFinite(n)) n = 32;
  n = Math.max(1, Math.min(32, n));
  HOUR_FARM_MAX_BY_BOT[name] = n;
  localStorage.setItem('asf_hour_farm_max_by_bot', JSON.stringify(HOUR_FARM_MAX_BY_BOT));
  try { await localSettings({ hour_farm_max_games_by_bot: HOUR_FARM_MAX_BY_BOT }); } catch (e) {}
}

function hasCardWork(bot) {
  if (!isBotEnabled(bot) || !bot.IsConnectedAndLoggedOn) return false;
  const cf = bot.CardsFarmer || {};
  return !!(cf.NowFarming ||
    (Array.isArray(cf.CurrentGamesFarming) && cf.CurrentGamesFarming.length > 0) ||
    (Array.isArray(cf.GamesToFarm) && cf.GamesToFarm.length > 0));
}

function isFarmedIdle(bot) {
  if (!isBotEnabled(bot) || !bot.IsConnectedAndLoggedOn) return false;
  const cf = bot.CardsFarmer || {};
  const farming = (cf.CurrentGamesFarming || []).length > 0;
  const toFarm = Array.isArray(cf.GamesToFarm) ? cf.GamesToFarm.length : 0;
  return !farming && toFarm === 0;
}

function parseAppIDsText(text) {
  const seen = new Set();
  const out = [];
  String(text || '').split(/[^0-9]+/).forEach(x => {
    if (!x) return;
    const id = parseInt(x, 10);
    if (Number.isFinite(id) && id > 0 && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  });
  return out;
}

function normalizeAppIDsText(text) {
  return parseAppIDsText(text).join(', ');
}

async function fetchGames(steamid, limit = 32) {
  const g = await api('/__games?steamid=' + steamid + '&limit=' + encodeURIComponent(String(limit)), { timeout: 20000 });
  return g || {};
}

let _popularGames = null;
let _popularGamesAt = 0;
async function fetchPopularGames() {
  if (_popularGames && Date.now() - _popularGamesAt < 10 * 60 * 1000) return _popularGames;
  const r = await fetch('/__popular_games', { cache: 'no-store' });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.ok || !Array.isArray(d.games)) throw new Error(d.message || 'Steam popularity list unavailable');
  _popularGames = d.games;
  _popularGamesAt = Date.now();
  return _popularGames;
}

async function boostHours(options = {}) {
  if (_boosting) return;
  _boosting = true;
  const fab = $('#boost-fab');
  fab.classList.add('busy');
  try {
    const r = await api('/Api/Bot/ASF');
    const bots = r && r.Result ? r.Result : {};
    const only = options.targets ? new Set(options.targets) : null;
    const targets = Object.keys(bots).filter(n => isFarmedIdle(bots[n]) && (!only || only.has(n)));
    if (!targets.length) {
      toast('Нет аккаунтов с отфармленными карточками', 'err');
      logEvent('Буст часов: подходящих аккаунтов нет.');
      return;
    }
    logEvent('Буст часов: аккаунтов ' + targets.length);

    const priorityInput = $('#set-priority-hour-games');
    if (priorityInput) {
      PRIORITY_HOUR_APPIDS = normalizeAppIDsText(priorityInput.value || PRIORITY_HOUR_APPIDS);
      priorityInput.value = PRIORITY_HOUR_APPIDS;
      localStorage.setItem('asf_priority_hour_farm_appids', PRIORITY_HOUR_APPIDS);
      localSettings({ priority_hour_farm_appids: PRIORITY_HOUR_APPIDS }).catch(() => {});
    }
    const priority = parseAppIDsText(PRIORITY_HOUR_APPIDS);
    const priorityMode = ['hours_asc', 'hours_desc', 'popular'].includes(HOUR_FARM_PRIORITY_MODE) ? HOUR_FARM_PRIORITY_MODE : 'hours_desc';
    if (priority.length) logEvent('Буст часов: приоритетные AppID: ' + priority.join(', '));
    if (priorityMode === 'popular') logEvent('Буст часов: ' + t('popular_loading'));

    let needKey = false;
    const ownedByBot = {};
    const ownedSetByBot = {};

    for (const name of targets) {
      const sid = bots[name].s_SteamID || (bots[name].SteamID != null ? String(bots[name].SteamID) : '');
      if (!sid || sid === '0') { logEvent(name + ': нет SteamID, пропуск'); continue; }
      let res = {};
      try { res = await fetchGames(sid, (priority.length || priorityMode !== 'hours_desc') ? 50000 : 32); }
      catch (e) { logEvent(name + ': ошибка запроса игр (' + e.message + ')'); continue; }

      if (res.needKey || res.error === 'bad_key' || res.error === 'no_api_key') { needKey = true; break; }
      if (res.error === 'private') {
        logEvent(name + ': ' + (res.message || 'игры скрыты приватностью') + ' — пропуск');
        continue;
      }
      if (res.error) {
        logEvent(name + ': ' + (res.message || res.error) + ' — пропуск');
        continue;
      }
      const games = (res.games || []).filter(x => x && x.appID).map(x => ({
        appID: Number(x.appID), hours: Number(x.hours || 0),
      })).filter(x => Number.isFinite(x.appID) && x.appID > 0);
      if (!games.length) {
        logEvent(name + ': в библиотеке нет игр, пропуск');
        continue;
      }
      ownedByBot[name] = games;
      ownedSetByBot[name] = new Set(games.map(x => x.appID));
    }

    if (needKey) {
      toast('Проверьте Steam API ключ', 'err');
      logEvent('Нужен корректный Steam Web API ключ.');
      openApiKeyModal();
      return;
    }

    const usableTargets = targets.filter(n => ownedByBot[n]);
    if (!usableTargets.length) {
      toast('Игры не найдены ни на одном аккаунте', 'err');
      return;
    }

    let popularIDs = [];
    if (priorityMode === 'popular') {
      try {
        popularIDs = (await fetchPopularGames()).map(x => Number(x.appID)).filter(x => Number.isFinite(x) && x > 0);
      } catch (e) {
        logEvent(t('popular_unavailable'));
        toast(t('popular_unavailable'), 'err');
      }
    }

    let done = 0;
    const assignedPopular = new Set();
    for (const name of usableTargets) {
      // Explicit AppIDs remain per-account priorities in every ordering mode.
      const ownedSet = ownedSetByBot[name];
      const maxGames = hourFarmMaxForBot(name);
      const priorityOwned = priority.filter(appid => ownedSet.has(appid)).slice(0, maxGames);
      const selected = [...priorityOwned];
      const selectedSet = new Set(selected);
      const orderedOwned = ownedByBot[name].slice().sort((a, b) => {
        if (priorityMode === 'hours_asc') return a.hours - b.hours || a.appID - b.appID;
        return b.hours - a.hours || a.appID - b.appID;
      }).map(x => x.appID);
      // Popular mode takes ranked Steam games first. Each following account gets
      // the next still unused list; only then does it fall back to its hour order.
      const candidates = priorityMode === 'popular' && popularIDs.length
        ? popularIDs.filter(appid => ownedSet.has(appid) && !assignedPopular.has(appid)).concat(orderedOwned)
        : orderedOwned;

      for (const appid of candidates) {
        if (selected.length >= maxGames) break;
        if (selectedSet.has(appid)) continue;
        selected.push(appid);
        selectedSet.add(appid);
        if (priorityMode === 'popular' && popularIDs.includes(appid)) assignedPopular.add(appid);
      }

      if (!selected.length) {
        logEvent(name + ': нет игр для запуска, пропуск');
        continue;
      }
      try {
        await api('/Api/Command', {
          method: 'POST',
          body: JSON.stringify({ Command: 'play ' + name + ' ' + selected.join(',') }),
        });
        done++;
        _autoHourBoosted.add(name);
        _hourReapplyAt.set(name, Date.now() + 10 * 60 * 1000);
        if (priority.length) {
          const missing = priority.filter(appid => !ownedSet.has(appid));
          if (missing.length) logEvent(name + ': нет приоритетных игр ' + missing.join(', ') + ' — пропуск для этого аккаунта');
        }
        logEvent(name + ': запущено ' + selected.length + ' игр' + (priorityOwned.length ? ' (приоритетных: ' + priorityOwned.length + ')' : ''));
      } catch (e) { logEvent(name + ': ошибка play (' + e.message + ')'); }
    }

    toast(done ? ('Запущено на ' + done + ' акк.') : 'Игры не запущены (см. Журнал)', done ? 'ok' : 'err');
  } catch (e) {
    toast(e.message, 'err');
  } finally {
    _boosting = false;
    fab.classList.remove('busy');
    setTimeout(refresh, 1500);
  }
}

function botInitState(bots) {
  const names = Object.keys(bots || {}).filter(n => isBotEnabled(bots[n]));
  const pending = [];
  const failed = [];
  const ready = [];
  for (const n of names) {
    const b = bots[n];
    if (b.RequiredInput) failed.push(n);
    else if (b.IsConnectedAndLoggedOn) ready.push(n);
    else pending.push(n);
  }
  return { names, pending, failed, ready };
}

function maybeStartHourFarmOnLaunch(bots) {
  if (!START_HOUR_FARM || _startupHourDone || _boosting || !bots) return;
  const st = botInitState(bots);
  if (!_startupWaitStarted) _startupWaitStarted = Date.now();
  const waited = Date.now() - _startupWaitStarted;
  const timeoutMs = 180000;

  if (st.failed.length) {
    for (const n of st.failed) logEvent('Фарм часов при запуске: ' + n + ' пропущен, вход не завершён.');
  }

  if (st.pending.length && waited < timeoutMs) {
    if (Date.now() - _lastStartupWaitLog > 15000) {
      _lastStartupWaitLog = Date.now();
      logEvent('Фарм часов при запуске: жду инициализацию ботов (' + st.pending.join(', ') + ')');
    }
    return;
  }

  _startupHourDone = true;
  const targets = st.ready.filter(n => isFarmedIdle(bots[n]));
  if (!targets.length) {
    logEvent('Фарм часов при запуске: подходящих аккаунтов нет.');
    return;
  }
  targets.forEach(n => {
    _autoHourBoosted.add(n);
    _hourReapplyAt.set(n, Date.now() + 10 * 60 * 1000);
  });
  logEvent('Фарм часов при запуске: аккаунтов ' + targets.length);
  setTimeout(() => boostHours({ targets, startup: true }), 700);
}


function maybeAutoHourFarmAfterCards(bots) {
  if (!AUTO_HOUR_FARM || _boosting || !bots) return;
  const names = Object.keys(bots);

  // First pass only arms the automation. BetterASF will not start hour boosting
  // immediately on startup if accounts were already farmed before UI launch.
  if (!_autoHourInitialized) {
    for (const n of names) {
      if (hasCardWork(bots[n])) _autoHourSeenCardWork.add(n);
      else if (isFarmedIdle(bots[n])) _autoHourBoosted.add(n);
    }
    _autoHourInitialized = true;
    return;
  }

  for (const n of names) {
    if (hasCardWork(bots[n])) {
      _autoHourSeenCardWork.add(n);
      _autoHourBoosted.delete(n);
    }
  }

  const ready = names.filter(n => isFarmedIdle(bots[n]) && _autoHourSeenCardWork.has(n) && !_autoHourBoosted.has(n));
  if (!ready.length) return;

  ready.forEach(n => _autoHourBoosted.add(n));
  logEvent('Автофарм часов: обычный фарм закончился для ' + ready.join(', '));
  toast('Обычный фарм завершён, запускаю фарм часов', 'ok');
  setTimeout(() => boostHours({ targets: ready, auto: true }), 500);
}

function maybeReapplyHourFarmAfterReconnect(bots) {
  if ((!START_HOUR_FARM && !AUTO_HOUR_FARM) || _boosting || !bots) return;
  const now = Date.now();
  const ready = [];
  for (const n of Object.keys(bots)) {
    if (!isFarmedIdle(bots[n])) continue;
    if (!_autoHourBoosted.has(n)) continue;
    const next = _hourReapplyAt.get(n) || 0;
    if (now < next) continue;
    ready.push(n);
    _hourReapplyAt.set(n, now + 10 * 60 * 1000);
  }
  if (!ready.length) return;
  logEvent('Проверка фарма часов после восстановления связи: ' + ready.join(', '));
  setTimeout(() => boostHours({ targets: ready, reapply: true }), 500);
}

function openApiKeyModal() {
  $('#apikey-input').value = '';
  $('#apikey-modal').classList.add('show');
  setTimeout(() => $('#apikey-input').focus(), 50);
}
function closeApiKeyModal() { $('#apikey-modal').classList.remove('show'); }
async function saveApiKey() {
  const key = $('#apikey-input').value.trim();
  if (!/^[A-Fa-f0-9]{32}$/.test(key)) { toast('Ключ должен быть 32 hex-символа', 'err'); return; }
  const a = bridge();
  try {
    if (a && a.set_api_key) await a.set_api_key(key);
    else await localSettings({ steam_api_key: key });
  } catch (e) { toast('Не удалось сохранить ключ: ' + e.message, 'err'); return; }
  toast('Ключ сохранён', 'ok');
  closeApiKeyModal();
  setTimeout(boostHours, 400);
}

let _refreshing = false;
let _wasConnected = null;
async function refresh() {
  if (_refreshing) return;
  _refreshing = true;
  try {
    const st = await getAppState().catch(() => null);
    if (st && st.asf_status && st.asf_status !== 'online') {
      if (st.asf_status === 'recovering') {
        setConnRecovering();
        if (_wasConnected !== 'recovering') {
          logEvent('ASF восстанавливается: ' + (st.asf_status_message || 'ожидание'));
          _wasConnected = 'recovering';
        }
      } else if (st.asf_status === 'starting') {
        setConnStarting();
        if (_wasConnected !== 'starting') {
          logEvent('ASF запускается в фоне. Интерфейс уже доступен.');
          _wasConnected = 'starting';
        }
      } else {
        setConn(false);
      }
      await refreshAppStats(0);
      return;
    }

    await refreshBots();
    await refreshASF();
    setConn(true);
    if (_wasConnected !== true) { logEvent('Связь с ASF установлена.'); _wasConnected = true; }
  } catch (e) {
    const st = await getAppState().catch(() => null);
    if (st && st.asf_status === 'recovering') {
      setConnRecovering();
      if (_wasConnected !== 'recovering') {
        logEvent('ASF восстанавливается: ' + (st.asf_status_message || e.message));
        _wasConnected = 'recovering';
      }
    } else if (st && st.asf_status === 'starting') {
      setConnStarting();
      if (_wasConnected !== 'starting') {
        logEvent('ASF запускается в фоне.');
        _wasConnected = 'starting';
      }
    } else {
      setConn(false);
      if (_wasConnected !== false &&
          !String(e.message).includes('401') && !String(e.message).includes('abort')) {
        logEvent('Нет связи с ASF (ожидание запуска): ' + e.message);
        _wasConnected = false;
      }
    }
  } finally {
    _refreshing = false;
  }
}

async function sendCommand(cmd) {
  if (!cmd.trim()) return;
  const out = $('#cmd-output');
  out.textContent = `> ${cmd}\nВыполняется…`;
  try {
    const r = await api('/Api/Command', { method: 'POST', body: JSON.stringify({ Command: cmd }) });
    out.textContent = `> ${cmd}\n\n${(r && r.Result) ? r.Result : '(нет ответа)'}`;
    logEvent(`Команда: ${cmd}`);
  } catch (e) {
    out.textContent = `> ${cmd}\n\nОшибка: ${e.message}`;
    toast(e.message, 'err');
  }
}

function showAuthModal() { $('#auth-modal').classList.add('show'); $('#auth-input').focus(); }
function hideAuthModal() { $('#auth-modal').classList.remove('show'); }

function switchView(name) {
  $$('.nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('data-view') === name));
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
  if (name === 'plugins') loadPlugins();
}

let ACTIVE_PLUGIN_TAB = 'library';
let _pluginToRemove = null;

function formatBytes(value) {
  const n = Number(value || 0);
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
}

function selectPluginTab(tab) {
  ACTIVE_PLUGIN_TAB = tab === 'store' ? 'store' : 'library';
  $$('.plugin-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.pluginTab === ACTIVE_PLUGIN_TAB));
  $('#plugins-library-pane').classList.toggle('active', ACTIVE_PLUGIN_TAB === 'library');
  $('#plugins-store-pane').classList.toggle('active', ACTIVE_PLUGIN_TAB === 'store');
  if (ACTIVE_PLUGIN_TAB === 'library') loadPluginLibrary();
  else loadPluginStore();
}

async function pluginRequest(path, payload) {
  const r = await fetch(path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload || {}),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.ok) throw new Error(d.message || ('HTTP ' + r.status));
  return d;
}

function pluginIdentity(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function asfPluginName(plugin) {
  return String((plugin && (plugin.Name || plugin.name || plugin.PluginName || plugin.pluginName)) || '');
}

function asfPluginVersion(plugin) {
  return plugin && (plugin.Version || plugin.version || null);
}

function mergeLoadedPluginNames(items, loaded) {
  const active = Array.isArray(loaded) ? loaded : [];
  return (items || []).map(item => {
    const signatures = [item.directory, item.name].concat(item.assemblyNames || [])
      .map(value => pluginIdentity(String(value).replace(/\.dll$/i, '')))
      .filter(Boolean);
    const match = active.find(plugin => {
      const actual = pluginIdentity(asfPluginName(plugin));
      return actual && signatures.some(value => actual === value || actual.includes(value) || value.includes(actual));
    });
    // ASF's IPlugin.Name is authoritative. The Python backend provides a
    // well-known assembly-name fallback for bundled official plugins.
    return Object.assign({}, item, {
      displayName: asfPluginName(match) || item.name || t('plugin_unknown'),
      loadedVersion: asfPluginVersion(match),
      isLoaded: !!match,
    });
  });
}

function pluginVersionText(value) {
  if (!value) return '';
  if (typeof value === 'object') {
    return [value.Major, value.Minor, value.Build, value.Revision].filter(v => v !== undefined && v !== null && v >= 0).join('.');
  }
  return String(value);
}

function renderPluginLibrary(items) {
  const box = $('#plugins-list');
  if (!items.length) { box.innerHTML = `<div class="empty">${t('plugin_empty')}</div>`; return; }
  box.innerHTML = items.map(p => `<div class="plugin-card plugin-card--library">
    <div class="plugin-card-top"><div class="plugin-name"><span class="dot ${p.isLoaded ? 'online' : 'offline'}"></span>${escapeHtml(p.displayName || p.name || t('plugin_unknown'))}</div></div>
    <div class="plugin-ver">${p.loadedVersion ? `${t('plugin_version')}: ${escapeHtml(pluginVersionText(p.loadedVersion))} · ` : ''}${t('plugin_files')}: ${Number(p.files || 0)} · ${t('plugin_size')}: ${formatBytes(p.size)}</div>
    <div class="plugin-actions"><button class="btn sm danger plugin-remove-btn" type="button" data-plugin-directory="${escapeHtml(p.directory)}" data-plugin-name="${escapeHtml(p.displayName || p.name || p.directory)}">${t('remove')}</button></div>
  </div>`).join('');
  $$('.plugin-remove-btn', box).forEach(btn => btn.onclick = () => openPluginRemove(btn.dataset.pluginDirectory, btn.dataset.pluginName));
}

async function loadPluginLibrary() {
  const box = $('#plugins-list');
  if (!box) return;
  box.innerHTML = `<div class="empty">${t('plugin_library_loading')}</div>`;
  try {
    const r = await fetch('/__plugins/library', { cache: 'no-store' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) throw new Error(d.message || ('HTTP ' + r.status));
    let loaded = [];
    try {
      const asf = await api('/Api/Plugins?official=true&custom=true');
      loaded = asf && Array.isArray(asf.Result) ? asf.Result : [];
    } catch (e) {
      // The filesystem library remains available while ASF starts or restarts.
    }
    renderPluginLibrary(mergeLoadedPluginNames(d.items || [], loaded));
  } catch (e) {
    box.innerHTML = `<div class="empty">${t('plugins_failed')}: ${escapeHtml(e.message)}</div>`;
  }
}

function renderPluginStore(items) {
  const box = $('#plugins-store-list');
  box.innerHTML = items.map(p => `<div class="plugin-card plugin-card--store">
    <div class="plugin-card-top"><div class="plugin-name"><span class="dot online"></span>${escapeHtml(p.name || 'Plugin')}</div><span class="plugin-badge">GitHub</span></div>
    <p class="plugin-description">${escapeHtml(p.description || '')}</p>
    <div class="plugin-meta">${t('plugin_version')}: ${escapeHtml(String(p.version || '—'))} · ${t('plugin_author')}: ${escapeHtml(p.author || '—')}</div>
    <div class="plugin-actions"><a class="btn sm ghost plugin-source-link" href="${escapeHtml(p.repositoryUrl || '#')}" target="_blank" rel="noopener">${t('plugin_source')}</a>
    <button class="btn sm primary plugin-install-btn" type="button" data-plugin-id="${escapeHtml(p.id)}" ${p.available ? '' : 'disabled'}>${p.available ? t('install') : t('plugin_unavailable')}</button></div>
  </div>`).join('') || `<div class="empty">${t('plugin_store_failed')}</div>`;
  $$('.plugin-install-btn', box).forEach(btn => btn.onclick = () => installPlugin(btn.dataset.pluginId, btn));
}

async function loadPluginStore(force = false) {
  const box = $('#plugins-store-list');
  if (!box) return;
  box.innerHTML = `<div class="empty">${t('plugin_store_loading')}</div>`;
  try {
    const r = await fetch('/__plugins/store' + (force ? '?refresh=1' : ''), { cache: 'no-store' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) throw new Error(d.message || ('HTTP ' + r.status));
    renderPluginStore(d.items || []);
    if (d.warning) logEvent('GitHub plugins: ' + d.warning);
  } catch (e) {
    box.innerHTML = `<div class="empty">${t('plugin_store_failed')}: ${escapeHtml(e.message)}</div>`;
  }
}

async function installPlugin(id, btn) {
  if (!id || !btn || btn.disabled) return;
  const old = btn.textContent;
  btn.disabled = true; btn.textContent = t('installing');
  try {
    const d = await pluginRequest('/__plugins/install', { id });
    toast(t('plugin_installed') + '. ' + t('plugin_restart'), 'ok');
    logEvent('Plugin: ' + (d.message || t('plugin_installed')));
    setTimeout(() => { loadPluginLibrary(); refresh(); }, 1500);
  } catch (e) {
    toast(t('plugins_failed') + ': ' + e.message, 'err');
    logEvent('Plugin install error: ' + e.message);
    btn.disabled = false; btn.textContent = old;
  }
}

function openPluginRemove(directory, displayName = '') {
  _pluginToRemove = directory || null;
  if (!_pluginToRemove) return;
  $('#plugin-remove-name').textContent = displayName || _pluginToRemove;
  $('#plugin-remove-modal').classList.add('show');
  $('#plugin-remove-modal').setAttribute('aria-hidden', 'false');
}

function closePluginRemove() {
  $('#plugin-remove-modal').classList.remove('show');
  $('#plugin-remove-modal').setAttribute('aria-hidden', 'true');
  _pluginToRemove = null;
}

async function confirmPluginRemove() {
  if (!_pluginToRemove) return;
  const btn = $('#plugin-remove-confirm');
  btn.disabled = true; btn.textContent = t('removing');
  try {
    const d = await pluginRequest('/__plugins/remove', { directory: _pluginToRemove });
    toast(t('plugin_removed') + '. ' + t('plugin_restart'), 'ok');
    logEvent('Plugin: ' + (d.message || t('plugin_removed')));
    closePluginRemove();
    setTimeout(() => { loadPluginLibrary(); refresh(); }, 1500);
  } catch (e) {
    toast(t('plugins_failed') + ': ' + e.message, 'err');
    logEvent('Plugin removal error: ' + e.message);
  } finally {
    btn.disabled = false; btn.textContent = t('remove');
  }
}

async function loadPlugins() {
  selectPluginTab(ACTIVE_PLUGIN_TAB);
}


async function customThemeRequest(payload) {
  const options = payload === undefined
    ? { method: 'GET', cache: 'no-store' }
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) };
  const response = await fetch('/__custom_theme', options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.message || ('HTTP ' + response.status));
  return data;
}

function setCustomThemePreview(url) {
  const preview = $('#custom-theme-preview');
  if (!preview) return;
  if (url) {
    preview.style.backgroundImage = `url("${String(url).replace(/"/g, '%22')}")`;
    preview.classList.add('show');
    preview.setAttribute('aria-hidden', 'false');
  } else {
    preview.style.backgroundImage = '';
    preview.classList.remove('show');
    preview.setAttribute('aria-hidden', 'true');
  }
}

function applyFullTheme(theme) {
  const isCustom = theme === 'custom';
  const isDark = isCustom ? CUSTOM_THEME.base !== 'light' : (theme === 'dark' || theme === 'dark-img');
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  if (theme === 'dark-img') {
    document.documentElement.setAttribute('data-bg-theme', 'dark-img');
  } else if (theme === 'light-img') {
    document.documentElement.setAttribute('data-bg-theme', 'light-img');
  } else if (isCustom && CUSTOM_THEME.imageUrl) {
    document.documentElement.setAttribute('data-bg-theme', 'custom-img');
    document.documentElement.style.setProperty('--custom-theme-image', `url("${String(CUSTOM_THEME.imageUrl).replace(/"/g, '%22')}")`);
  } else {
    document.documentElement.removeAttribute('data-bg-theme');
    document.documentElement.style.removeProperty('--custom-theme-image');
  }

  if (isCustom && CUSTOM_THEME.transparent) document.documentElement.setAttribute('data-custom-transparent', '1');
  else document.documentElement.removeAttribute('data-custom-transparent');

  const moon = $('.ico-moon');
  if (moon) moon.style.display = isDark ? 'none' : 'inline';
  const sun = $('.ico-sun');
  if (sun) sun.style.display = isDark ? 'inline' : 'none';

  localStorage.setItem('asf_full_theme', theme);
  localStorage.setItem('asf_theme', isDark ? 'dark' : 'light');

  $$('.theme-option-card').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-theme-val') === theme);
  });

  const select = $('#settings-theme-select');
  if (select) select.value = theme;

  if (window.pywebview && window.pywebview.api && window.pywebview.api.set_theme) {
    try { window.pywebview.api.set_theme(isDark ? 'dark' : 'light'); } catch (e) {}
  }
}

async function loadCustomTheme() {
  try {
    const state = await customThemeRequest();
    CUSTOM_THEME = {
      base: state.base === 'light' ? 'light' : 'dark',
      transparent: !!state.transparent,
      imageUrl: state.imageUrl || '',
      hasImage: !!state.hasImage,
    };
    if ((localStorage.getItem('asf_full_theme') || '') === 'custom') applyFullTheme('custom');
    return CUSTOM_THEME;
  } catch (e) {
    return CUSTOM_THEME;
  }
}

async function openCustomThemeModal() {
  CUSTOM_THEME_PREVIOUS_SELECTION = localStorage.getItem('asf_full_theme') || 'dark';
  await loadCustomTheme();
  CUSTOM_THEME_PENDING_IMAGE = '';
  CUSTOM_THEME_REMOVE_IMAGE = false;
  const base = CUSTOM_THEME.base === 'light' ? 'light' : 'dark';
  const radio = $(`input[name="custom-theme-base"][value="${base}"]`);
  if (radio) radio.checked = true;
  $('#custom-theme-transparent').checked = !!CUSTOM_THEME.transparent;
  $('#custom-theme-file').value = '';
  setCustomThemePreview(CUSTOM_THEME.imageUrl);
  $('#custom-theme-modal').classList.add('show');
  $('#custom-theme-modal').setAttribute('aria-hidden', 'false');
}

function closeCustomThemeModal(restoreSelection = true) {
  $('#custom-theme-modal').classList.remove('show');
  if (restoreSelection) {
    const select = $('#settings-theme-select');
    if (select) select.value = CUSTOM_THEME_PREVIOUS_SELECTION;
  }
  $('#custom-theme-modal').setAttribute('aria-hidden', 'true');
  CUSTOM_THEME_PENDING_IMAGE = '';
  CUSTOM_THEME_REMOVE_IMAGE = false;
}

function readCustomThemeImage(file) {
  if (!file) return;
  if (file.size > 12 * 1024 * 1024) {
    toast(t('custom_theme_image_too_large'), 'err');
    $('#custom-theme-file').value = '';
    return;
  }
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    toast(t('custom_theme_image_invalid'), 'err');
    $('#custom-theme-file').value = '';
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => toast(t('custom_theme_image_invalid'), 'err');
  reader.onload = () => {
    CUSTOM_THEME_PENDING_IMAGE = String(reader.result || '');
    CUSTOM_THEME_REMOVE_IMAGE = false;
    setCustomThemePreview(CUSTOM_THEME_PENDING_IMAGE);
    $('#custom-theme-file-note').textContent = t('custom_theme_image_loaded') + ': ' + file.name;
  };
  reader.readAsDataURL(file);
}

async function saveCustomTheme() {
  const button = $('#custom-theme-save');
  const base = ($('input[name="custom-theme-base"]:checked') || {}).value === 'light' ? 'light' : 'dark';
  const payload = {
    base,
    transparent: !!$('#custom-theme-transparent').checked,
    removeImage: CUSTOM_THEME_REMOVE_IMAGE,
  };
  if (CUSTOM_THEME_PENDING_IMAGE) payload.imageData = CUSTOM_THEME_PENDING_IMAGE;
  button.disabled = true;
  try {
    const state = await customThemeRequest(payload);
    CUSTOM_THEME = {
      base: state.base === 'light' ? 'light' : 'dark',
      transparent: !!state.transparent,
      imageUrl: state.imageUrl || '',
      hasImage: !!state.hasImage,
    };
    applyFullTheme('custom');
    closeCustomThemeModal(false);
    toast(t('custom_theme_saved'), 'ok');
  } catch (e) {
    toast(t('custom_theme_error') + ': ' + e.message, 'err');
  } finally {
    button.disabled = false;
  }
}

function bridge() { return (window.pywebview && window.pywebview.api) ? window.pywebview.api : null; }

async function localSettings(patch) {
  const opts = patch === undefined
    ? { method: 'GET', cache: 'no-store' }
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) };
  const r = await fetch('/__settings', opts);
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.ok === false) throw new Error(d.message || ('HTTP ' + r.status));
  return d;
}

function setRefreshInterval() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  pollTimer = setInterval(refresh, ECONOMY_MODE ? 15000 : 5000);
}

function applyEconomyMode(enabled, rerender = true) {
  ECONOMY_MODE = !!enabled;
  document.documentElement.setAttribute('data-economy', ECONOMY_MODE ? '1' : '0');
  localStorage.setItem('asf_economy_mode', ECONOMY_MODE ? '1' : '0');
  const toggle = $('#set-economy-mode');
  if (toggle) toggle.checked = ECONOMY_MODE;
  setRefreshInterval();
  if (rerender && BOTS) renderBots(BOTS);
}

async function loadAppSettings() {
  const a = bridge();
  let st = {};
  if (a && a.get_settings) {
    try { st = await a.get_settings(); } catch (e) {}
  } else {
    try { st = await localSettings(); } catch (e) {}
  }
  const tray = $('#set-minimize-tray');
  const auto = $('#set-autostart');
  const autoHour = $('#set-auto-hour-farm');
  const startHour = $('#set-start-hour-farm');
  const priorityInput = $('#set-priority-hour-games');
  const language = $('#set-language');
  const priorityMode = $('#set-hour-farm-priority-mode');
  const launchMin = $('#set-launch-minimized');
  if (tray) tray.checked = !!st.minimize_to_tray;
  if (auto) auto.checked = !!st.autostart;
  if (autoHour) {
    AUTO_HOUR_FARM = !!st.auto_hour_farm_after_cards;
    autoHour.checked = AUTO_HOUR_FARM;
    localStorage.setItem('asf_auto_hour_farm_after_cards', AUTO_HOUR_FARM ? '1' : '0');
  }
  if (startHour) {
    START_HOUR_FARM = !!st.start_hour_farm_on_launch;
    startHour.checked = START_HOUR_FARM;
    localStorage.setItem('asf_start_hour_farm_on_launch', START_HOUR_FARM ? '1' : '0');
  }
  if (st.hour_farm_max_games_by_bot && typeof st.hour_farm_max_games_by_bot === 'object') {
    HOUR_FARM_MAX_BY_BOT = st.hour_farm_max_games_by_bot;
    localStorage.setItem('asf_hour_farm_max_by_bot', JSON.stringify(HOUR_FARM_MAX_BY_BOT));
  }
  if (priorityInput) {
    PRIORITY_HOUR_APPIDS = st.priority_hour_farm_appids || localStorage.getItem('asf_priority_hour_farm_appids') || '';
    PRIORITY_HOUR_APPIDS = normalizeAppIDsText(PRIORITY_HOUR_APPIDS);
    priorityInput.value = PRIORITY_HOUR_APPIDS;
    localStorage.setItem('asf_priority_hour_farm_appids', PRIORITY_HOUR_APPIDS);
  }
  if (language) {
    const savedLanguage = ['ru', 'en', 'uk'].includes(st.language) ? st.language : UI_LANGUAGE;
    applyLanguage(savedLanguage, true);
    language.value = savedLanguage;
  }
  if (priorityMode) {
    HOUR_FARM_PRIORITY_MODE = ['hours_asc', 'hours_desc', 'popular'].includes(st.hour_farm_priority_mode) ? st.hour_farm_priority_mode : HOUR_FARM_PRIORITY_MODE;
    priorityMode.value = HOUR_FARM_PRIORITY_MODE;
    localStorage.setItem('asf_hour_farm_priority_mode', HOUR_FARM_PRIORITY_MODE);
  }
  if (launchMin) launchMin.checked = !!st.launch_minimized;
  if (Object.prototype.hasOwnProperty.call(st, 'economy_mode')) {
    applyEconomyMode(!!st.economy_mode, true);
  }
}

async function saveAppSetting(key, value) {
  const a = bridge();
  try {
    let ok = true;
    if (a && a.set_app_setting) {
      ok = await a.set_app_setting(key, !!value);
    } else {
      const r = await localSettings({ [key]: !!value });
      ok = r.ok !== false;
    }
    if (ok && key === 'economy_mode') applyEconomyMode(!!value, true);
    toast(ok ? t('setting_saved') : t('settings_error'), ok ? 'ok' : 'err');
    return !!ok;
  } catch (e) {
    toast(t('settings_error') + ': ' + e.message, 'err');
    return false;
  }
}

async function savePriorityHourGames() {
  const input = $('#set-priority-hour-games');
  if (!input) return true;
  const normalized = normalizeAppIDsText(input.value);
  input.value = normalized;
  PRIORITY_HOUR_APPIDS = normalized;
  localStorage.setItem('asf_priority_hour_farm_appids', normalized);
  try {
    const r = await localSettings({ priority_hour_farm_appids: normalized });
    const ok = r.ok !== false;
    toast(ok ? 'Приоритетные игры сохранены' : 'Не удалось сохранить AppID', ok ? 'ok' : 'err');
    return ok;
  } catch (e) {
    toast('Ошибка сохранения AppID: ' + e.message, 'err');
    return false;
  }
}

async function runAsfActionButton(btn, command, label) {
  btn.disabled = true;
  btn.classList.add('busy');
  try {
    await api('/Api/Command', { method: 'POST', body: JSON.stringify({ Command: command }) });
    toast(label + ': команда отправлена', 'ok');
    logEvent(label + ': команда ASF "' + command + '" отправлена.');
  } catch (e) {
    toast(label + ': ' + e.message, 'err');
    logEvent(label + ': ошибка (' + e.message + ')');
  } finally {
    setTimeout(() => { btn.disabled = false; btn.classList.remove('busy'); }, 900);
  }
}

function initContextMenu() {
  const menu = $('#context-menu');
  if (!menu) return;
  const hide = () => { menu.classList.remove('show'); menu.setAttribute('aria-hidden', 'true'); };
  document.addEventListener('click', hide);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  document.addEventListener('scroll', hide, true);

  document.addEventListener('contextmenu', e => {
    const card = e.target.closest('.bot-card[data-bot]');
    if (!card || card.classList.contains('is-add')) return;
    e.preventDefault();
    const name = card.getAttribute('data-bot');
    const bot = BOTS[name] || {};
    const running = !!bot.KeepRunning;
    const paused = isPaused(bot);
    const items = [
      { label: t('bot_settings'), act: 'edit' },
      { label: running ? t('stop_bot') : t('start_bot'), act: running ? 'stop' : 'start' },
    ];
    if (running) items.push({ label: paused ? t('resume_farm') : t('pause_farm'), act: paused ? 'resume' : 'pause' });
    menu.innerHTML = `<div class="context-title">${escapeHtml(name)}</div>` +
      items.map(it => `<button class="context-item" data-act="${it.act}" data-bot="${escapeHtml(name)}">${it.label}</button>`).join('');
    menu.querySelectorAll('.context-item').forEach(btn => btn.onclick = async ev => {
      ev.stopPropagation();
      hide();
      const act = btn.getAttribute('data-act');
      if (act === 'edit') return editBot(name);
      if (act === 'start') return startBot(name);
      if (act === 'stop') return stopBot(name);
      if (act === 'pause') return pauseBot(name);
      if (act === 'resume') return resumeBot(name);
    });
    const pad = 8;
    menu.style.left = Math.min(e.clientX, window.innerWidth - 230 - pad) + 'px';
    menu.style.top = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - pad) + 'px';
    menu.classList.add('show');
    menu.setAttribute('aria-hidden', 'false');
  });
}

function init() {
  if (CFG.appName) {
    document.title = CFG.appName;
    const tb = $('.tb-title');
    if (tb) tb.textContent = CFG.appName;
  }
  if (!CFG.frameless) {
    const wc = $('.win-controls');
    if (wc) wc.style.display = 'none';
    const tl = $('.tb-left');
    if (tl) tl.classList.remove('pywebview-drag-region');
  }

  applyLanguage(UI_LANGUAGE, false);
  const initialTheme = localStorage.getItem('asf_full_theme') || CFG.theme || localStorage.getItem('asf_theme') || 'dark';
  applyFullTheme(initialTheme);
  applyEconomyMode(ECONOMY_MODE, false);

  const themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.onclick = () => {
      const cur = localStorage.getItem('asf_full_theme') || 'dark';
      let next = 'dark';
      if (cur === 'dark') next = 'light';
      else if (cur === 'light') next = 'dark-img';
      else if (cur === 'dark-img') next = 'light-img';
      else if (cur === 'light-img') next = 'dark';
      applyFullTheme(next);
      themeBtn.classList.add('theme-spin');
      setTimeout(() => themeBtn.classList.remove('theme-spin'), 400);
    };
  }

  $$('.theme-option-card').forEach(card => {
    card.onclick = () => {
      const val = card.getAttribute('data-theme-val');
      applyFullTheme(val);
    };
  });

  const themeSelect = $('#settings-theme-select');
  if (themeSelect) {
    themeSelect.onchange = (e) => {
      if (e.target.value === 'custom') openCustomThemeModal();
      else applyFullTheme(e.target.value);
    };
  }
  $('#custom-theme-add').onclick = openCustomThemeModal;
  $('#custom-theme-cancel').onclick = closeCustomThemeModal;
  $('#custom-theme-save').onclick = saveCustomTheme;
  $('#custom-theme-file').onchange = e => readCustomThemeImage(e.target.files && e.target.files[0]);
  $('#custom-theme-remove-image').onclick = () => {
    CUSTOM_THEME_PENDING_IMAGE = '';
    CUSTOM_THEME_REMOVE_IMAGE = true;
    $('#custom-theme-file').value = '';
    setCustomThemePreview('');
    $('#custom-theme-file-note').textContent = t('custom_theme_remove_image');
  };

  loadCustomTheme();
  loadAppSettings();
  const languageSelect = $('#set-language');
  if (languageSelect) languageSelect.onchange = async e => {
    const next = ['ru', 'en', 'uk'].includes(e.target.value) ? e.target.value : 'ru';
    const previous = UI_LANGUAGE;
    applyLanguage(next, true);
    try {
      const r = await localSettings({ language: next });
      if (r.ok === false) throw new Error('save failed');
      toast(t('language_saved'), 'ok');
    } catch (err) {
      applyLanguage(previous, true);
      toast(t('settings_error') + ': ' + err.message, 'err');
    }
  };
  const priorityModeSelect = $('#set-hour-farm-priority-mode');
  if (priorityModeSelect) priorityModeSelect.onchange = async e => {
    const value = ['hours_asc', 'hours_desc', 'popular'].includes(e.target.value) ? e.target.value : 'hours_desc';
    const previous = HOUR_FARM_PRIORITY_MODE;
    HOUR_FARM_PRIORITY_MODE = value;
    localStorage.setItem('asf_hour_farm_priority_mode', value);
    try {
      const r = await localSettings({ hour_farm_priority_mode: value });
      if (r.ok === false) throw new Error('save failed');
      toast(t('priority_mode_saved'), 'ok');
    } catch (err) {
      HOUR_FARM_PRIORITY_MODE = previous;
      priorityModeSelect.value = previous;
      localStorage.setItem('asf_hour_farm_priority_mode', previous);
      toast(t('settings_error') + ': ' + err.message, 'err');
    }
  };
  const trayToggle = $('#set-minimize-tray');
  if (trayToggle) trayToggle.onchange = e => saveAppSetting('minimize_to_tray', e.target.checked);
  const autoToggle = $('#set-autostart');
  if (autoToggle) autoToggle.onchange = async e => {
    const ok = await saveAppSetting('autostart', e.target.checked);
    if (!ok) e.target.checked = !e.target.checked;
  };
  const economyToggle = $('#set-economy-mode');
  if (economyToggle) economyToggle.onchange = async e => {
    const prev = ECONOMY_MODE;
    applyEconomyMode(e.target.checked, true);
    const ok = await saveAppSetting('economy_mode', e.target.checked);
    if (!ok) applyEconomyMode(prev, true);
  };
  const autoHourToggle = $('#set-auto-hour-farm');
  if (autoHourToggle) autoHourToggle.onchange = async e => {
    const prev = AUTO_HOUR_FARM;
    AUTO_HOUR_FARM = !!e.target.checked;
    localStorage.setItem('asf_auto_hour_farm_after_cards', AUTO_HOUR_FARM ? '1' : '0');
    _autoHourInitialized = false;
    const ok = await saveAppSetting('auto_hour_farm_after_cards', AUTO_HOUR_FARM);
    if (!ok) {
      AUTO_HOUR_FARM = prev;
      e.target.checked = prev;
      localStorage.setItem('asf_auto_hour_farm_after_cards', prev ? '1' : '0');
    }
  };
  const startHourToggle = $('#set-start-hour-farm');
  if (startHourToggle) startHourToggle.onchange = async e => {
    const prev = START_HOUR_FARM;
    START_HOUR_FARM = !!e.target.checked;
    _startupHourDone = false;
    localStorage.setItem('asf_start_hour_farm_on_launch', START_HOUR_FARM ? '1' : '0');
    const ok = await saveAppSetting('start_hour_farm_on_launch', START_HOUR_FARM);
    if (!ok) {
      START_HOUR_FARM = prev;
      e.target.checked = prev;
      localStorage.setItem('asf_start_hour_farm_on_launch', prev ? '1' : '0');
    }
  };
  const priorityInput = $('#set-priority-hour-games');
  const prioritySave = $('#save-priority-hour-games');
  if (prioritySave) prioritySave.onclick = savePriorityHourGames;
  if (priorityInput) {
    priorityInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); savePriorityHourGames(); } });
    priorityInput.addEventListener('blur', () => { if (priorityInput.value !== PRIORITY_HOUR_APPIDS) savePriorityHourGames(); });
  }
  const launchMinToggle = $('#set-launch-minimized');
  if (launchMinToggle) launchMinToggle.onchange = async e => {
    const ok = await saveAppSetting('launch_minimized', e.target.checked);
    if (!ok) e.target.checked = !e.target.checked;
  };
  const restartBtn = $('#asf-restart-action');
  if (restartBtn) restartBtn.onclick = e => runAsfActionButton(e.currentTarget, 'restart', t('asf_restart'));
  const updateBtn = $('#asf-update-action');
  if (updateBtn) updateBtn.onclick = e => runAsfActionButton(e.currentTarget, 'update', t('asf_update_check'));
  initContextMenu();

  $('#minBtn').onclick = () => { const a = bridge(); if (a) a.minimize(); };
  $('#maxBtn').onclick = () => { const a = bridge(); if (a) a.toggle_maximize(); };
  $('#closeBtn').onclick = () => { const a = bridge(); if (a) a.close(); else window.close(); };

  $$('.nav-link').forEach(l => l.onclick = () => switchView(l.getAttribute('data-view')));

  $('#cmd-send').onclick = () => sendCommand($('#cmd-input').value);
  $('#cmd-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendCommand(e.target.value); });
  $$('.chip').forEach(c => c.onclick = () => { $('#cmd-input').value = c.getAttribute('data-cmd'); sendCommand(c.getAttribute('data-cmd')); });

  $('#refreshBtn').onclick = refresh;
  $('#pluginsRefresh').onclick = () => {
    if (ACTIVE_PLUGIN_TAB === 'store') loadPluginStore(); else loadPluginLibrary();
  };
  $$('.plugin-tab').forEach(btn => btn.onclick = () => selectPluginTab(btn.dataset.pluginTab));
  $('#plugin-remove-cancel').onclick = closePluginRemove;
  $('#plugin-remove-confirm').onclick = confirmPluginRemove;
  $('#logClear').onclick = () => { $('#log-output').textContent = ''; };

  $('#auth-save').onclick = () => {
    IPC_PASSWORD = $('#auth-input').value;
    localStorage.setItem('asf_ipc_password', IPC_PASSWORD);
    hideAuthModal();
    refresh();
  };
  $('#auth-input').addEventListener('keydown', e => { if (e.key === 'Enter') $('#auth-save').click(); });

  $('#ab-cancel').onclick = closeAddBot;
  $('#ab-save').onclick = saveBot;
  $('#ab-delete').onclick = deleteBot;
  $('#ab-pass').addEventListener('keydown', e => { if (e.key === 'Enter') saveBot(); });
  $('#ab-adv-toggle').onclick = () => showAdvanced($('#ab-adv').style.display === 'none');

  $('#guard-cancel').onclick = deferGuard;
  $('#guard-send').onclick = sendGuard;
  $('#guard-bycode').onclick = guardByCode;
  $('#guard-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendGuard(); });

  $('#boost-fab').onclick = boostHours;
  $('#pending-input-nav').onclick = e => { e.preventDefault(); openDeferredGuard(); };

  $('#apikey-cancel').onclick = closeApiKeyModal;
  $('#apikey-save').onclick = saveApiKey;
  $('#apikey-input').addEventListener('keydown', e => { if (e.key === 'Enter') saveApiKey(); });

  logEvent('Интерфейс запущен. База API: "' + API_BASE + '" (прокси)');

  setConnStarting();
  logEvent('Интерфейс готов. ASF запускается в фоне.');

  setTimeout(() => {
    fetch('/__health').then(r => r.json()).then(h => {
      logEvent('Диагностика связи: ' + JSON.stringify(h.hosts));
      if (h.good_host) logEvent('Рабочий хост ASF: ' + h.good_host);
    }).catch(() => logEvent('Прокси /__health не ответил.'));
  }, 6000);

  setTimeout(() => checkBetterASFUpdate(false), 2500);

  setTimeout(refresh, 300);
  setRefreshInterval();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
