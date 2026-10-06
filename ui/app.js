
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
    custom_theme: 'Кастомная тема', custom_theme_title: 'Кастомная тема', custom_theme_sub: 'Выберите светлую или тёмную основу, загрузите своё изображение и при необходимости сделайте элементы прозрачными.', custom_theme_base: 'Основа темы', custom_theme_dark: 'Тёмная', custom_theme_light: 'Светлая', custom_theme_image: 'Свой медиафон', custom_theme_image_hint: 'PNG, JPG, WebP, GIF, MP4 или WebM. Изображение до 12 МБ, видео до 50 МБ.', custom_theme_transparent: 'Включить прозрачность элементов', custom_theme_remove_image: 'Убрать картинку', custom_theme_saved: 'Своя тема сохранена', custom_theme_error: 'Не удалось сохранить свою тему', custom_theme_image_too_large: 'Изображение до 12 МБ, видео до 50 МБ', custom_theme_image_invalid: 'Выберите PNG, JPG, WebP, GIF, MP4 или WebM', custom_theme_image_loaded: 'Медиафон выбран',
    kpi_games: 'Игр осталось', kpi_time: 'Времени осталось', kpi_cards: 'Карт осталось', dashboard_refresh: 'Обновить', commands_hint: 'Подсказки:', command_placeholder: 'Введите команду, напр. status ASF', command_output: 'Вывод команды появится здесь…',
    appearance_sub: 'Выберите цветовую схему и фоновое изображение для интерфейса BetterASF.', behavior_sub: 'Настройки самого BetterASF. Они сохраняются в Documents\BetterASF\settings.json.',
    tray_title: 'Сворачивание в трей', tray_sub: 'Кнопка закрытия будет сворачивать BetterASF, не завершая ASF.', minimized_title: 'Запуск в минимизированном состоянии', minimized_sub: 'После открытия BetterASF сразу свернётся; если включён трей — спрячется в трей.', autostart_title: 'Запуск вместе с системой', autostart_sub: 'Добавляет BetterASF в автозагрузку текущего пользователя Windows.', economy_title: 'Экономичный режим интерфейса', economy_sub: 'Отключает фоновые картинки, blur/тяжёлые тени, аватарки и реже обновляет данные.',
    auto_hours_title: 'Запуск фарма часов после карточек', auto_hours_sub: 'Когда обычный фарм карточек закончится, BetterASF автоматически запустит топ-32 игр по часам.', start_hours_title: 'Фарм часов при запуске BetterASF', start_hours_sub: 'При старте интерфейса сразу запускает топ-32 игр на аккаунтах без оставшихся карточек.', priority_hint: 'Эти AppID применяются к каждому аккаунту отдельно: если игра есть в библиотеке — она запускается, если нет — пропускается. После них список дополняется играми по часам.',
    plugins_library: 'Библиотека', plugins_store: 'Магазин плагинов', plugins_library_note: 'Установленные плагины ASF. После изменения ASF перезапускается автоматически.', plugins_store_note: 'Каталог и ZIP-релизы проверяются напрямую на GitHub. Устанавливайте только плагины, которым доверяете.',
    plugin_remove_title: 'Удалить плагин?', plugin_remove_text: 'Плагин будет удалён из ASF:', plugin_remove_restart: 'ASF будет автоматически перезапущен. Это действие нельзя отменить.',
    plugin_empty: 'Установленных плагинов нет.', plugin_loaded: 'Загружен ASF', plugin_not_loaded: 'Ожидает перезапуска', plugin_unknown: 'Плагин', plugin_store_loading: 'Загрузка каталога GitHub…', plugin_library_loading: 'Загрузка библиотеки…', plugin_files: 'DLL-файлов', plugin_size: 'Размер', plugin_source: 'Источник', plugin_version: 'Версия', plugin_author: 'Автор', plugin_unavailable: 'В GitHub нет ZIP-релиза', plugin_restart: 'ASF перезапускается для применения изменения.',
    hour_priority_mode: 'Режим приоритетного фарма часов', experimental: 'Экспериментальная функция', hours_asc: 'По возрастанию часов', hours_desc: 'По убыванию часов', hours_popular: 'Популярные — списки из топа по онлайну', hour_priority_mode_hint: 'В режиме «Популярные» BetterASF берёт актуальный топ Steam по онлайну и выдаёт следующим аккаунтам разные списки игр.', hour_cards_take_over: 'Для {bot} найдены игры с карточками: возвращаю ASF к фарму карточек.', hour_cards_switched: 'Фарм часов остановлен: карточки появились на {count} акк.', hour_cards_reset_failed: 'Не удалось переключить {bot} на фарм карточек', hour_service_started: '{bot}: запущено {count} игр для фарма часов', hour_service_no_targets: 'Нет аккаунтов, готовых к фарму часов', hour_service_no_games: 'Подходящие игры не найдены', hour_service_need_api_key: 'Нужен Steam Web API ключ для фарма часов', hour_service_cards_take_over: '{bot}: карточки получили приоритет над фармом часов', hour_service_reset_error: 'Не удалось вернуть {bot} к фарму карточек', hour_service_games_error: '{bot}: ошибка получения библиотеки игр', hour_service_private_games: '{bot}: библиотека игр недоступна', hour_service_play_error: '{bot}: не удалось запустить игры', hour_service_asf_unavailable: 'ASF недоступен для фарма часов', hour_service_poll_error: 'Ошибка фоновой проверки фарма часов',
    setting_saved: 'Настройка сохранена', settings_error: 'Не удалось применить настройку', language_saved: 'Язык интерфейса изменён', priority_mode_saved: 'Режим приоритетного фарма сохранён',
    bot_disabled: 'Отключён', bot_offline: 'Не в сети', bot_paused: 'Пауза', bot_farming: 'Фармит', bot_online: 'В сети', bot_settings: 'Настройки бота', start_bot: 'Запустить бота', stop_bot: 'Остановить бота', resume_farm: 'Продолжить фарм', pause_farm: 'Пауза фарма', new_bot: 'Новый бот', save_bot: 'Сохранить', create_bot: 'Создать', keep_password: '(оставьте пустым, чтобы не менять)', bot_details: 'Профиль бота', bot_actions: 'Действия', bot_enable: 'Включить', bot_disable: 'Отключить', bot_games: 'Запущенные игры', bot_no_games: 'Сейчас игры не запущены', bot_game_loading: 'Загрузка игры…', bot_game_unknown: 'Игра недоступна', bot_enabled: 'Бот включён', bot_disabled_message: 'Бот отключён', bot_control_error: 'Не удалось выполнить действие для бота', bots_empty: 'Боты не найдены. Добавьте бота в ASF.', bots_not_found: 'Поиск не дал результатов', sidebar_expand: 'Развернуть меню', service_data: 'Данные и диагностика', diagnostics: 'Диагностика', clear_covers: 'Очистить обложки', clear_names: 'Очистить названия', clear_history: 'Очистить историю', updates_status: 'Статус обновлений', cache_cleared: 'Кэш очищен', bots_search: 'Поиск бота', bot_online_time: 'В сети', bot_running_time: 'Работает',
    plugins_failed: 'Не удалось получить плагины', plugin_store_failed: 'Не удалось загрузить каталог GitHub', plugin_installed: 'Плагин установлен', plugin_removed: 'Плагин удалён',
    input_login_title: 'Логин Steam', input_login_label: 'логин', input_login_placeholder: 'Steam логин', input_password_title: 'Пароль Steam', input_password_label: 'пароль', input_password_placeholder: 'Пароль', input_guard_title: 'Steam Guard', input_guard_label: 'код Steam Guard (из e-mail)', input_parental_title: 'Родительский код', input_parental_label: 'родительский код Steam', input_parental_placeholder: 'Код', input_2fa_title: 'Двухфакторный код (2FA)', input_2fa_label: 'код аутентификатора', input_confirm_title: 'Подтверждение входа', input_confirm_label: 'подтверждение', input_request_for: 'Запрос на вход для аккаунта:', input_enter_for: 'Введите {value} для аккаунта:', input_required_for: 'Вход не завершён для {bot}: требуется {value}', input_required: 'Требуется {value} для бота {bot}', input_value_required: 'Введите значение', input_sent: 'Отправлено для {bot}', input_later: 'Запрос входа отложен', input_alert: 'Есть запросы на вход. Нажмите, чтобы открыть.', login_request_new: 'Требуется {value} для бота {bot}', login_request_resolved: 'Запрос входа завершён для {bot}', login_request_poll_error: 'Ошибка фоновой проверки запросов входа',
    popular_loading: 'получаю глобальный топ Steam по онлайну', popular_unavailable: 'Глобальный топ Steam недоступен; использую порядок по часам.', update_downloading: 'Загрузка…', update_started: 'Обновление запущено, BetterASF закроется', update_failed: 'Не удалось обновить', update_check_failed: 'Не удалось проверить обновления', update_none: 'Обновлений нет', update_available: 'Доступна новая версия BetterASF {version}', update_button: 'Обновить', asf_restart: 'Перезагрузка ASF', asf_update_check: 'Проверка обновления ASF',
  },
  en: {
    not_connected: 'not connected', connected: 'connected', no_connection: 'no connection', recovering: 'recovering', starting_asf: 'starting ASF',
    nav_control: 'Control', nav_dashboard: 'Dashboard', nav_bots: 'Bots', nav_commands: 'Commands', nav_plugins: 'Plugins', nav_log: 'Log', nav_settings: 'Settings', login_requests: 'Login requests', nav_stats: 'Statistics',
    stat_farming: 'Farming', stat_online: 'Online', stat_offline: 'Offline', stat_total: 'Total', sys_memory_total: 'Total memory', sys_uptime: 'Uptime', sys_version: 'Version',
    dashboard_title: 'Dashboard', bots_title: 'Bots', commands_title: 'Commands', plugins_title: 'Plugins', log_title: 'Log', settings_title: 'Settings',
    refresh: 'Refresh', execute: 'Run', clear: 'Clear', save: 'Save', cancel: 'Cancel', remove: 'Remove', install: 'Install', installing: 'Installing…', removing: 'Removing…',
    appearance_title: 'Appearance and themes', behavior_title: 'Application behavior', priority_games: 'Priority games for hour farming', language_label: 'Interface language',
    custom_theme: 'Custom theme', custom_theme_title: 'Custom theme', custom_theme_sub: 'Choose a light or dark base, upload your own image and optionally make interface elements transparent.', custom_theme_base: 'Theme base', custom_theme_dark: 'Dark', custom_theme_light: 'Light', custom_theme_image: 'Custom media background', custom_theme_image_hint: 'PNG, JPG, WebP, GIF, MP4 or WebM. Images up to 12 MB, videos up to 50 MB.', custom_theme_transparent: 'Enable transparent elements', custom_theme_remove_image: 'Remove image', custom_theme_saved: 'Custom theme saved', custom_theme_error: 'Could not save custom theme', custom_theme_image_too_large: 'Images are limited to 12 MB and videos to 50 MB', custom_theme_image_invalid: 'Select PNG, JPG, WebP, GIF, MP4 or WebM', custom_theme_image_loaded: 'Media background selected',
    kpi_games: 'Games remaining', kpi_time: 'Time remaining', kpi_cards: 'Cards remaining', dashboard_refresh: 'Refresh', commands_hint: 'Hints:', command_placeholder: 'Enter a command, e.g. status ASF', command_output: 'Command output will appear here…',
    appearance_sub: 'Choose the colour scheme and background image for the BetterASF interface.', behavior_sub: 'BetterASF settings. They are saved in Documents\BetterASF\settings.json.',
    tray_title: 'Minimize to tray', tray_sub: 'The Close button minimizes BetterASF without closing ASF.', minimized_title: 'Start minimized', minimized_sub: 'BetterASF minimizes immediately after opening; if tray is enabled, it hides in the tray.', autostart_title: 'Start with Windows', autostart_sub: 'Adds BetterASF to the current Windows user’s startup.', economy_title: 'Economy interface mode', economy_sub: 'Disables background images, blur/heavy shadows and avatars, and refreshes data less often.',
    auto_hours_title: 'Start hour farming after cards', auto_hours_sub: 'After normal card farming is finished, BetterASF starts the top 32 games by playtime.', start_hours_title: 'Hour farming on BetterASF startup', start_hours_sub: 'On interface startup, starts the top 32 games for accounts with no cards remaining.', priority_hint: 'These AppIDs apply to every account individually: a game is started only if the account owns it. The list is then filled with games selected by the chosen order.',
    plugins_library: 'Library', plugins_store: 'Plugin store', plugins_library_note: 'Installed ASF plugins. ASF restarts automatically after a change.', plugins_store_note: 'The catalogue and ZIP releases are checked directly on GitHub. Install only plugins you trust.',
    plugin_remove_title: 'Remove plugin?', plugin_remove_text: 'This plugin will be removed from ASF:', plugin_remove_restart: 'ASF will restart automatically. This action cannot be undone.',
    plugin_empty: 'No installed plugins.', plugin_loaded: 'Loaded by ASF', plugin_not_loaded: 'Waiting for restart', plugin_unknown: 'Plugin', plugin_store_loading: 'Loading GitHub catalogue…', plugin_library_loading: 'Loading library…', plugin_files: 'DLL files', plugin_size: 'Size', plugin_source: 'Source', plugin_version: 'Version', plugin_author: 'Author', plugin_unavailable: 'No ZIP release on GitHub', plugin_restart: 'ASF is restarting to apply the change.',
    hour_priority_mode: 'Priority hour-farming mode', experimental: 'Experimental feature', hours_asc: 'Hours ascending', hours_desc: 'Hours descending', hours_popular: 'Popular — consecutive lists from online top', hour_priority_mode_hint: 'In Popular mode, BetterASF gets Steam’s current online leaderboard and gives subsequent accounts different game lists.', hour_cards_take_over: 'Games with card drops were found for {bot}: returning ASF to card farming.', hour_cards_switched: 'Hour farming stopped: cards appeared on {count} account(s).', hour_cards_reset_failed: 'Could not switch {bot} back to card farming', hour_service_started: '{bot}: started {count} games for hour farming', hour_service_no_targets: 'No accounts are ready for hour farming', hour_service_no_games: 'No suitable games were found', hour_service_need_api_key: 'A Steam Web API key is required for hour farming', hour_service_cards_take_over: '{bot}: card farming took priority over hour farming', hour_service_reset_error: 'Could not return {bot} to card farming', hour_service_games_error: '{bot}: could not fetch the owned-games library', hour_service_private_games: '{bot}: games library is unavailable', hour_service_play_error: '{bot}: could not start games', hour_service_asf_unavailable: 'ASF is unavailable for hour farming', hour_service_poll_error: 'Background hour-farming check failed',
    setting_saved: 'Setting saved', settings_error: 'Could not apply setting', language_saved: 'Interface language changed', priority_mode_saved: 'Priority farming mode saved',
    bot_disabled: 'Disabled', bot_offline: 'Offline', bot_paused: 'Paused', bot_farming: 'Farming', bot_online: 'Online', bot_settings: 'Bot settings', start_bot: 'Start bot', stop_bot: 'Stop bot', resume_farm: 'Resume farming', pause_farm: 'Pause farming', new_bot: 'New bot', save_bot: 'Save', create_bot: 'Create', keep_password: '(leave empty to keep unchanged)', bot_details: 'Bot profile', bot_actions: 'Actions', bot_enable: 'Enable', bot_disable: 'Disable', bot_games: 'Running games', bot_no_games: 'No games are currently running', bot_game_loading: 'Loading game…', bot_game_unknown: 'Game unavailable', bot_enabled: 'Bot enabled', bot_disabled_message: 'Bot disabled', bot_control_error: 'Could not perform the bot action', bots_empty: 'No bots found. Add a bot in ASF.', bots_not_found: 'No bots match the search', sidebar_expand: 'Expand menu', service_data: 'Data and diagnostics', diagnostics: 'Diagnostics', clear_covers: 'Clear covers', clear_names: 'Clear names', clear_history: 'Clear history', updates_status: 'Update status', cache_cleared: 'Cache cleared', bots_search: 'Search bots', bot_online_time: 'Online', bot_running_time: 'Running',
    plugins_failed: 'Could not load plugins', plugin_store_failed: 'Could not load GitHub catalogue', plugin_installed: 'Plugin installed', plugin_removed: 'Plugin removed',
    input_login_title: 'Steam login', input_login_label: 'login', input_login_placeholder: 'Steam login', input_password_title: 'Steam password', input_password_label: 'password', input_password_placeholder: 'Password', input_guard_title: 'Steam Guard', input_guard_label: 'Steam Guard code (from e-mail)', input_parental_title: 'Parental code', input_parental_label: 'Steam parental code', input_parental_placeholder: 'Code', input_2fa_title: 'Two-factor code (2FA)', input_2fa_label: 'authenticator code', input_confirm_title: 'Login confirmation', input_confirm_label: 'confirmation', input_request_for: 'Login request for account:', input_enter_for: 'Enter {value} for the account:', input_required_for: 'Login is not complete for {bot}: {value} is required', input_required: '{value} is required for bot {bot}', input_value_required: 'Enter a value', input_sent: 'Sent for {bot}', input_later: 'Login request deferred', input_alert: 'There are pending login requests. Click to open.', login_request_new: '{value} is required for bot {bot}', login_request_resolved: 'Login request completed for {bot}', login_request_poll_error: 'Background login-request check failed',
    popular_loading: 'getting Steam’s global online leaderboard', popular_unavailable: 'Steam’s global leaderboard is unavailable; using the hours order.', update_downloading: 'Downloading…', update_started: 'Update started, BetterASF will close', update_failed: 'Could not update', update_check_failed: 'Could not check for updates', update_none: 'No updates available', update_available: 'A new BetterASF version {version} is available', update_button: 'Update', asf_restart: 'Restart ASF', asf_update_check: 'Check ASF update',
  },
  uk: {
    not_connected: 'не підключено', connected: 'підключено', no_connection: 'немає зв’язку', recovering: 'відновлення', starting_asf: 'запуск ASF',
    nav_control: 'Керування', nav_dashboard: 'Головна', nav_bots: 'Боти', nav_commands: 'Команди', nav_plugins: 'Плагіни', nav_log: 'Журнал', nav_settings: 'Налаштування', login_requests: 'Запити на вхід', nav_stats: 'Статистика',
    stat_farming: 'Фарм', stat_online: 'У мережі', stat_offline: 'Не в мережі', stat_total: 'Усього', sys_memory_total: 'Уся пам’ять', sys_uptime: 'Аптайм', sys_version: 'Версія',
    dashboard_title: 'Головна', bots_title: 'Боти', commands_title: 'Команди', plugins_title: 'Плагіни', log_title: 'Журнал', settings_title: 'Налаштування',
    refresh: 'Оновити', execute: 'Виконати', clear: 'Очистити', save: 'Зберегти', cancel: 'Скасувати', remove: 'Видалити', install: 'Встановити', installing: 'Встановлення…', removing: 'Видалення…',
    appearance_title: 'Оформлення та теми', behavior_title: 'Поведінка програми', priority_games: 'Пріоритетні ігри для фарму годин', language_label: 'Мова інтерфейсу',
    custom_theme: 'Власна тема', custom_theme_title: 'Власна тема', custom_theme_sub: 'Виберіть світлу або темну основу, завантажте своє зображення та за потреби зробіть елементи прозорими.', custom_theme_base: 'Основа теми', custom_theme_dark: 'Темна', custom_theme_light: 'Світла', custom_theme_image: 'Власний медіафон', custom_theme_image_hint: 'PNG, JPG, WebP, GIF, MP4 або WebM. Зображення до 12 МБ, відео до 50 МБ.', custom_theme_transparent: 'Увімкнути прозорість елементів', custom_theme_remove_image: 'Прибрати картинку', custom_theme_saved: 'Власну тему збережено', custom_theme_error: 'Не вдалося зберегти власну тему', custom_theme_image_too_large: 'Зображення до 12 МБ, відео до 50 МБ', custom_theme_image_invalid: 'Виберіть PNG, JPG, WebP, GIF, MP4 або WebM', custom_theme_image_loaded: 'Медіафон вибрано',
    kpi_games: 'Ігор залишилося', kpi_time: 'Часу залишилося', kpi_cards: 'Карток залишилося', dashboard_refresh: 'Оновити', commands_hint: 'Підказки:', command_placeholder: 'Введіть команду, напр. status ASF', command_output: 'Вивід команди з’явиться тут…',
    appearance_sub: 'Виберіть кольорову схему та фонове зображення для інтерфейсу BetterASF.', behavior_sub: 'Налаштування самого BetterASF. Вони зберігаються в Documents\BetterASF\settings.json.',
    tray_title: 'Згортання в трей', tray_sub: 'Кнопка закриття згортатиме BetterASF, не завершуючи ASF.', minimized_title: 'Запуск у згорнутому стані', minimized_sub: 'Після відкриття BetterASF одразу згорнеться; якщо ввімкнений трей — сховається в трей.', autostart_title: 'Запуск разом із системою', autostart_sub: 'Додає BetterASF до автозавантаження поточного користувача Windows.', economy_title: 'Економний режим інтерфейсу', economy_sub: 'Вимикає фонові картинки, blur/важкі тіні, аватарки та рідше оновлює дані.',
    auto_hours_title: 'Запуск фарму годин після карток', auto_hours_sub: 'Коли звичайний фарм карток завершиться, BetterASF автоматично запустить топ-32 ігор за годинами.', start_hours_title: 'Фарм годин під час запуску BetterASF', start_hours_sub: 'Під час запуску інтерфейсу одразу запускає топ-32 ігор на акаунтах без карток, що залишилися.', priority_hint: 'Ці AppID застосовуються до кожного акаунта окремо: гра запускається, якщо вона є в бібліотеці. Після них список доповнюється іграми за вибраним порядком.',
    plugins_library: 'Бібліотека', plugins_store: 'Магазин плагінів', plugins_library_note: 'Встановлені плагіни ASF. Після зміни ASF перезапускається автоматично.', plugins_store_note: 'Каталог і ZIP-релізи перевіряються безпосередньо на GitHub. Встановлюйте лише плагіни, яким довіряєте.',
    plugin_remove_title: 'Видалити плагін?', plugin_remove_text: 'Плагін буде видалено з ASF:', plugin_remove_restart: 'ASF буде автоматично перезапущено. Цю дію не можна скасувати.',
    plugin_empty: 'Встановлених плагінів немає.', plugin_loaded: 'Завантажено ASF', plugin_not_loaded: 'Очікує перезапуску', plugin_unknown: 'Плагін', plugin_store_loading: 'Завантаження каталогу GitHub…', plugin_library_loading: 'Завантаження бібліотеки…', plugin_files: 'DLL-файлів', plugin_size: 'Розмір', plugin_source: 'Джерело', plugin_version: 'Версія', plugin_author: 'Автор', plugin_unavailable: 'У GitHub немає ZIP-релізу', plugin_restart: 'ASF перезапускається для застосування зміни.',
    hour_priority_mode: 'Режим пріоритетного фарму годин', experimental: 'Експериментальна функція', hours_asc: 'За зростанням годин', hours_desc: 'За спаданням годин', hours_popular: 'Популярні — послідовні списки з топу онлайну', hour_priority_mode_hint: 'У режимі «Популярні» BetterASF бере актуальний топ Steam за онлайном і видає наступним акаунтам різні списки ігор.', hour_cards_take_over: 'Для {bot} знайдено ігри з картками: повертаю ASF до фарму карток.', hour_cards_switched: 'Фарм годин зупинено: картки з’явилися на {count} акаунті(ах).', hour_cards_reset_failed: 'Не вдалося переключити {bot} на фарм карток', hour_service_started: '{bot}: запущено {count} ігор для фарму годин', hour_service_no_targets: 'Немає акаунтів, готових до фарму годин', hour_service_no_games: 'Відповідних ігор не знайдено', hour_service_need_api_key: 'Для фарму годин потрібен ключ Steam Web API', hour_service_cards_take_over: '{bot}: фарм карток отримав пріоритет над фармом годин', hour_service_reset_error: 'Не вдалося повернути {bot} до фарму карток', hour_service_games_error: '{bot}: не вдалося отримати бібліотеку ігор', hour_service_private_games: '{bot}: бібліотека ігор недоступна', hour_service_play_error: '{bot}: не вдалося запустити ігри', hour_service_asf_unavailable: 'ASF недоступний для фарму годин', hour_service_poll_error: 'Помилка фонової перевірки фарму годин',
    setting_saved: 'Налаштування збережено', settings_error: 'Не вдалося застосувати налаштування', language_saved: 'Мову інтерфейсу змінено', priority_mode_saved: 'Режим пріоритетного фарму збережено',
    bot_disabled: 'Вимкнено', bot_offline: 'Не в мережі', bot_paused: 'Пауза', bot_farming: 'Фармить', bot_online: 'У мережі', bot_settings: 'Налаштування бота', start_bot: 'Запустити бота', stop_bot: 'Зупинити бота', resume_farm: 'Продовжити фарм', pause_farm: 'Пауза фарму', new_bot: 'Новий бот', save_bot: 'Зберегти', create_bot: 'Створити', keep_password: '(залиште порожнім, щоб не змінювати)', bot_details: 'Профіль бота', bot_actions: 'Дії', bot_enable: 'Увімкнути', bot_disable: 'Вимкнути', bot_games: 'Запущені ігри', bot_no_games: 'Зараз ігри не запущені', bot_game_loading: 'Завантаження гри…', bot_game_unknown: 'Гра недоступна', bot_enabled: 'Бота увімкнено', bot_disabled_message: 'Бота вимкнено', bot_control_error: 'Не вдалося виконати дію для бота', bots_empty: 'Ботів не знайдено. Додайте бота в ASF.', bots_not_found: 'Пошук не дав результатів', sidebar_expand: 'Розгорнути меню', service_data: 'Дані й діагностика', diagnostics: 'Діагностика', clear_covers: 'Очистити обкладинки', clear_names: 'Очистити назви', clear_history: 'Очистити історію', updates_status: 'Статус оновлень', cache_cleared: 'Кеш очищено', bots_search: 'Пошук ботів', bot_online_time: 'У мережі', bot_running_time: 'Працює',
    plugins_failed: 'Не вдалося отримати плагіни', plugin_store_failed: 'Не вдалося завантажити каталог GitHub', plugin_installed: 'Плагін установлено', plugin_removed: 'Плагін видалено',
    input_login_title: 'Логін Steam', input_login_label: 'логін', input_login_placeholder: 'Логін Steam', input_password_title: 'Пароль Steam', input_password_label: 'пароль', input_password_placeholder: 'Пароль', input_guard_title: 'Steam Guard', input_guard_label: 'код Steam Guard (з e-mail)', input_parental_title: 'Батьківський код', input_parental_label: 'батьківський код Steam', input_parental_placeholder: 'Код', input_2fa_title: 'Двофакторний код (2FA)', input_2fa_label: 'код автентифікатора', input_confirm_title: 'Підтвердження входу', input_confirm_label: 'підтвердження', input_request_for: 'Запит на вхід для акаунта:', input_enter_for: 'Введіть {value} для акаунта:', input_required_for: 'Вхід не завершено для {bot}: потрібен {value}', input_required: 'Потрібно {value} для бота {bot}', input_value_required: 'Введіть значення', input_sent: 'Надіслано для {bot}', input_later: 'Запит на вхід відкладено', input_alert: 'Є запити на вхід. Натисніть, щоб відкрити.', login_request_new: 'Для бота {bot} потрібен {value}', login_request_resolved: 'Запит на вхід завершено для {bot}', login_request_poll_error: 'Помилка фонової перевірки запитів входу',
    popular_loading: 'отримую глобальний топ Steam за онлайном', popular_unavailable: 'Глобальний топ Steam недоступний; використовую порядок за годинами.', update_downloading: 'Завантаження…', update_started: 'Оновлення запущено, BetterASF закриється', update_failed: 'Не вдалося оновити', update_check_failed: 'Не вдалося перевірити оновлення', update_none: 'Оновлень немає', update_available: 'Доступна нова версія BetterASF {version}', update_button: 'Оновити', asf_restart: 'Перезапуск ASF', asf_update_check: 'Перевірка оновлення ASF',
  }
};
let UI_LANGUAGE = 'ru';
if (!I18N[UI_LANGUAGE]) UI_LANGUAGE = 'ru';

function t(key) {
  return (I18N[UI_LANGUAGE] && I18N[UI_LANGUAGE][key]) || I18N.ru[key] || key;
}

function tf(key, values = {}) {
  return t(key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
}
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

  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', t(el.dataset.i18nTitle)); });
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
let ECONOMY_MODE = false;
let CUSTOM_THEME = { base: 'dark', transparent: false, mediaUrl: '', mediaType: '', hasMedia: false };
let CUSTOM_THEME_PENDING_MEDIA = '';
let CUSTOM_THEME_PENDING_MEDIA_TYPE = '';
let CUSTOM_THEME_REMOVE_MEDIA = false;
let CURRENT_FULL_THEME = CFG.theme || 'dark';

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

let _eventLogLastId = 0;
function logEvent(msg, persist = true) {
  const el = $('#log-output');
  const locale = UI_LANGUAGE === 'uk' ? 'uk-UA' : UI_LANGUAGE === 'en' ? 'en-US' : 'ru-RU';
  const now = new Date().toLocaleTimeString(locale);
  const message = localizeLogText(msg);
  if (el) {
    el.textContent += `[${now}] ${message}\n`;
    el.scrollTop = el.scrollHeight;
  }
  if (persist) {
    fetch('/__events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, source: 'ui', language: UI_LANGUAGE }) }).catch(() => {});
  }
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

function botEnabledInConfig(bot) {
  if (!bot) return false;
  if (bot.BotConfig && Object.prototype.hasOwnProperty.call(bot.BotConfig, 'Enabled')) return bot.BotConfig.Enabled !== false;
  return bot.Enabled !== false;
}

function botActionIcon(action, label, active = false) {
  const icons = {
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    start: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 5 11 7-11 7V5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 5v14M16 5v14"/></svg>',
    resume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 5 11 7-11 7V5z"/></svg>',
    enable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/></svg>',
    disable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/><path d="m4 4 16 16"/></svg>',
  };
  return `<button class="bot-icon-action${active ? ' bot-icon-action--danger' : ''}" type="button" data-profile-act="${action}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">${icons[action] || ''}</button>`;
}

function botActionButtons(name, bot) {
  const running = !!bot.KeepRunning;
  const playingAction = !running ? 'start' : (isPaused(bot) ? 'resume' : 'pause');
  const playingLabel = !running ? t('start_bot') : (isPaused(bot) ? t('resume_farm') : t('pause_farm'));
  const enabled = botEnabledInConfig(bot);
  return `${botActionIcon('settings', t('bot_settings'))}${botActionIcon(playingAction, playingLabel)}${botActionIcon(enabled ? 'disable' : 'enable', enabled ? t('bot_disable') : t('bot_enable'), enabled)}`;
}

function profileBotCardHTML(name, bot) {
  const state = botState(bot);
  const avatar = botAvatar(bot);
  const avatarHtml = avatar ? `<img class="bot-profile-avatar" src="${avatar}" alt="" onerror="this.style.visibility='hidden'">` : `<div class="bot-profile-avatar"></div>`;
  return `<article class="bot-profile-card" data-bot-open="${escapeHtml(name)}">
    <div class="bot-profile-main">${avatarHtml}<div class="bot-profile-identity"><div class="bot-name"><span class="dot ${state.key}"></span>${escapeHtml(bot.Nickname || name)}</div></div></div>
  </article>`;
}

let _openBotDetails = null;
const GAME_META = new Map();

function gameAppID(game) {
  const value = (typeof game === 'number' || typeof game === 'string')
    ? game
    : game && (game.AppID ?? game.appID ?? game.appid ?? game.Id ?? game.id);
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : 0;
}

function activeBotGames(bot, botName = '') {
  if (!bot || !bot.KeepRunning || !bot.IsConnectedAndLoggedOn) return [];
  const farmer = bot.CardsFarmer || {};
  const seen = new Set();
  const games = [];
  for (const game of Array.isArray(farmer.CurrentGamesFarming) ? farmer.CurrentGamesFarming : []) {
    const appID = gameAppID(game);
    if (appID && !seen.has(appID)) { seen.add(appID); games.push(game); }
  }
  for (const appID of _hourFarmGamesByBot.get(botName) || []) {
    if (!seen.has(appID)) { seen.add(appID); games.push({ AppID: appID }); }
  }
  return games;
}

function gameTitle(game) {
  const appID = gameAppID(game);
  const supplied = game && (game.GameName || game.Name || game.name || game.Title || game.title);
  if (supplied) return supplied;
  if (GAME_META.has(appID)) return (GAME_META.get(appID) || {}).name || t('bot_game_unknown');
  return t('bot_game_loading');
}

function steamHeader(appID) {
  return `/__steam/cover/${appID}`;
}

function formatBotDuration(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function renderBotDetails() {
  if (!_openBotDetails) return;
  const bot = BOTS[_openBotDetails];
  if (!bot) { closeBotDetails(); return; }
  const state = botState(bot);
  const avatar = botAvatar(bot);
  const avatarHtml = avatar ? `<img class="bot-detail-avatar" src="${avatar}" alt="" onerror="this.style.visibility='hidden'">` : `<div class="bot-detail-avatar"></div>`;
  $('#bot-details-profile').innerHTML = `${avatarHtml}<div class="bot-detail-identity"><div class="bot-name"><span class="dot ${state.key}"></span>${escapeHtml(bot.Nickname || _openBotDetails)}</div><div class="bot-status">${state.label}</div></div>`;
  $('#bot-details-actions').setAttribute('data-bot', _openBotDetails);
  $('#bot-details-actions').innerHTML = botActionButtons(_openBotDetails, bot);
  $('#bot-details-timing').innerHTML = `<div><span>${t('bot_running_time')}</span><b>${formatBotDuration(bot.BetterASFRunningSeconds)}</b></div><div><span>${t('bot_online_time')}</span><b>${formatBotDuration(bot.BetterASFOnlineSeconds)}</b></div>`;
  const games = activeBotGames(bot, _openBotDetails);
  $('#bot-details-games').innerHTML = games.length ? games.map(game => {
    const appID = gameAppID(game);
    return `<div class="bot-game-row"><img src="${steamHeader(appID)}" alt="" loading="lazy" onerror="this.classList.add('failed')"><span>${escapeHtml(gameTitle(game))}</span></div>`;
  }).join('') : `<div class="bot-games-empty">${t('bot_no_games')}</div>`;
  bindProfileActions();
}

async function fetchBotGameMetadata(bot) {
  const ids = activeBotGames(bot, _openBotDetails).map(gameAppID).filter(id => id && !GAME_META.has(id));
  if (!ids.length) return;
  const lang = UI_LANGUAGE === 'ru' ? 'russian' : UI_LANGUAGE === 'uk' ? 'ukrainian' : 'english';
  try {
    const steamID = bot && (bot.s_SteamID || bot.SteamID || '');
    const response = await fetch('/__game_meta?appids=' + encodeURIComponent(ids.join(',')) + '&lang=' + lang + '&steamid=' + encodeURIComponent(String(steamID)), { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) return;
    for (const [appID, meta] of Object.entries(data.items || {})) GAME_META.set(Number(appID), meta || {});
    if (_openBotDetails && BOTS[_openBotDetails] === bot) renderBotDetails();
  } catch (e) {}
}

function openBotDetails(name) {
  if (!BOTS[name]) return;
  _openBotDetails = name;
  $('#bot-details-title').textContent = t('bot_games');
  $('#bot-details-modal').classList.add('show');
  $('#bot-details-modal').setAttribute('aria-hidden', 'false');
  renderBotDetails();
  fetchBotGameMetadata(BOTS[name]);
}

function closeBotDetails() {
  $('#bot-details-modal').classList.remove('show');
  $('#bot-details-modal').setAttribute('aria-hidden', 'true');
  _openBotDetails = null;
}

async function botServiceAction(name, action) {
  const response = await fetch('/__bots/' + encodeURIComponent(name) + '/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
  return data;
}

async function runProfileAction(name, action) {
  const bot = BOTS[name];
  if (!bot) return;
  try {
    if (action === 'settings') { openEditBot(name); return; }
    await botServiceAction(name, action);
    if (action === 'enable' || action === 'disable') toast(action === 'enable' ? t('bot_enabled') : t('bot_disabled_message'), 'ok');
    logEvent('Bot ' + name + ': ' + action);
    setTimeout(refresh, 700);
  } catch (e) {
    toast(t('bot_control_error') + ': ' + e.message, 'err');
    logEvent(t('bot_control_error') + ': ' + e.message);
  }
}

function bindProfileActions() {
  $$('[data-profile-act]').forEach(button => button.onclick = event => {
    event.stopPropagation();
    const parent = button.closest('[data-bot]');
    runProfileAction(parent && parent.dataset.bot, button.dataset.profileAct);
  });
  $$('[data-bot-open]').forEach(card => card.onclick = event => {
    if (event.target.closest('button')) return;
    openBotDetails(card.dataset.botOpen);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

let BOTS = {};
let BOT_SEARCH_QUERY = '';
let SIDEBAR_COLLAPSED = false;
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

  const dashboardCards = names.length
    ? names.map(n => botCardHTML(n, bots[n])).join('')
    : `<div class="empty">${t('bots_empty')}</div>`;
  const search = BOT_SEARCH_QUERY.trim().toLowerCase();
  const profileNames = names.filter(name => !search || name.toLowerCase().includes(search) || String(bots[name].Nickname || '').toLowerCase().includes(search));
  const profileCards = profileNames.length
    ? profileNames.map(n => profileBotCardHTML(n, bots[n])).join('')
    : `<div class="empty">${search ? t('bots_not_found') : t('bots_empty')}</div>`;

  $('#dash-bots').innerHTML = dashboardCards +
    `<div class="bot-card is-add" id="addBotDash">＋ ${t('create_bot')}</div>`;
  $('#bots-list').innerHTML = profileCards +
    `<div class="bot-profile-card bot-profile-card--add" id="addBotList">＋ ${t('create_bot')}</div>`;

  bindBotActions();
  bindProfileActions();
  if (_openBotDetails) renderBotDetails();
}

function bindBotActions() {
  $$('[data-act]').forEach(btn => {
    btn.onclick = async () => {
      const bot = btn.getAttribute('data-bot');
      const act = btn.getAttribute('data-act');
      if (act === 'edit') { openEditBot(bot); return; }
      try {
        await botServiceAction(bot, act);
        logEvent('Bot ' + bot + ': ' + act);
        setTimeout(refresh, 700);
      } catch (e) { toast(e.message, 'err'); logEvent(e.message); }
    };
  });
  $$('[data-edit]').forEach(el => { el.onclick = () => openEditBot(el.getAttribute('data-edit')); });
  const a1 = $('#addBotDash'), a2 = $('#addBotList');
  if (a1) a1.onclick = openAddBot;
  if (a2) a2.onclick = openAddBot;
}

let _editingBot = null;

function setChk(id, value) {
  const element = $('#' + id);
  if (element) element.checked = !!value;
}

function getChk(id) {
  const element = $('#' + id);
  return !!(element && element.checked);
}

function showAdvanced(open) {
  $('#ab-adv').style.display = open ? 'block' : 'none';
  $('#ab-adv-toggle').classList.toggle('open', open);
}

function fillForm(form = {}) {
  $('#ab-login').value = form.steam_login || '';
  $('#ab-pass').value = '';
  $('#ab-enabled').checked = form.enabled !== false;
  $('#ab-online').value = String(form.online_status != null ? form.online_status : 1);
  $('#ab-hours').value = form.hours_until_cards != null ? form.hours_until_cards : 3;
  $('#ab-hour-max-games').value = String(form.hour_max != null ? form.hour_max : 32);
  setChk('ab-paused', form.farm_paused);
  setChk('ab-shutdown', form.shutdown_after_farm);
  setChk('ab-priorityonly', form.priority_only);
  setChk('ab-skipunplayed', form.skip_unplayed);
  setChk('ab-matcher', form.matcher);
  setChk('ab-matchall', form.match_all);
  setChk('ab-donations', form.accept_donations);
  setChk('ab-gifts', form.accept_gifts);
  setChk('ab-matchactively', form.match_actively);
  setChk('ab-nobottrades', form.no_bot_trades);
  setChk('ab-rejtrades', form.reject_trades);
  setChk('ab-rejfriends', form.reject_friends);
  setChk('ab-rejgroups', form.reject_groups);
  setChk('ab-dismissnotif', form.dismiss_notifications);
  setChk('ab-markread', form.mark_read);
  setChk('ab-markself', form.mark_self);
  setChk('ab-noincoming', form.no_incoming_trades);
  setChk('ab-forwarding', form.forwarding);
  setChk('ab-distributing', form.distributing);
  setChk('ab-keepmissing', form.keep_missing);
  setChk('ab-assumewallet', form.assume_wallet);
  $('#ab-farmorder').value = String(form.farm_order != null ? form.farm_order : 0);
  $('#ab-uimode').value = String(form.ui_mode != null ? form.ui_mode : 0);
  $('#ab-device').value = String(form.device != null ? form.device : 1);
  $('#ab-tradecheck').value = form.trade_check != null ? form.trade_check : 60;
  $('#ab-sendtrade').value = form.send_trade != null ? form.send_trade : 0;
  $('#ab-tradetoken').value = form.trade_token || '';
  $('#ab-machine').value = form.machine || '';
  $('#ab-custfarm').value = form.custom_farm || '';
  $('#ab-custidle').value = form.custom_idle || '';
  $('#ab-idlegames').value = (form.idle_games || []).join(',');
  $('#ab-parental').value = form.parental_code || '';
  setChk('ab-loginkeys', form.use_login_keys !== false);
}

function openAddBot() {
  _editingBot = null;
  $('#ab-title').textContent = t('new_bot');
  $('#ab-save').textContent = t('create_bot');
  $('#ab-delete').style.display = 'none';
  $('#ab-name').disabled = false;
  $('#ab-name').value = '';
  $('#ab-pass-hint').textContent = '';
  fillForm({ enabled: true, online_status: 1, hours_until_cards: 3, hour_max: 32, use_login_keys: true });
  showAdvanced(false);
  $('#addbot-modal').classList.add('show');
  $('#ab-name').focus();
}

async function openEditBot(name) {
  _editingBot = name;
  $('#ab-title').textContent = t('bot_settings');
  $('#ab-save').textContent = t('save_bot');
  $('#ab-delete').style.display = 'inline-flex';
  $('#ab-name').disabled = true;
  $('#ab-name').value = name;
  $('#ab-pass-hint').textContent = t('keep_password');
  showAdvanced(false);
  $('#addbot-modal').classList.add('show');
  try {
    const response = await fetch('/__botconfigs/' + encodeURIComponent(name), { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
    fillForm(data.form || {});
  } catch (e) {
    toast(e.message, 'err');
    closeAddBot();
  }
}

function closeAddBot() {
  $('#addbot-modal').classList.remove('show');
  _editingBot = null;
}

function botFormFields(name) {
  return {
    name,
    steam_login: $('#ab-login').value.trim(),
    steam_password: $('#ab-pass').value,
    enabled: getChk('ab-enabled'),
    online_status: parseInt($('#ab-online').value, 10),
    hours_until_cards: parseInt($('#ab-hours').value, 10),
    hour_max: parseInt($('#ab-hour-max-games').value, 10),
    farm_paused: getChk('ab-paused'),
    shutdown_after_farm: getChk('ab-shutdown'),
    priority_only: getChk('ab-priorityonly'),
    skip_unplayed: getChk('ab-skipunplayed'),
    matcher: getChk('ab-matcher'),
    match_all: getChk('ab-matchall'),
    accept_donations: getChk('ab-donations'),
    accept_gifts: getChk('ab-gifts'),
    match_actively: getChk('ab-matchactively'),
    no_bot_trades: getChk('ab-nobottrades'),
    reject_trades: getChk('ab-rejtrades'),
    reject_friends: getChk('ab-rejfriends'),
    reject_groups: getChk('ab-rejgroups'),
    dismiss_notifications: getChk('ab-dismissnotif'),
    mark_read: getChk('ab-markread'),
    mark_self: getChk('ab-markself'),
    no_incoming_trades: getChk('ab-noincoming'),
    forwarding: getChk('ab-forwarding'),
    distributing: getChk('ab-distributing'),
    keep_missing: getChk('ab-keepmissing'),
    assume_wallet: getChk('ab-assumewallet'),
    farm_order: parseInt($('#ab-farmorder').value, 10),
    ui_mode: parseInt($('#ab-uimode').value, 10),
    device: parseInt($('#ab-device').value, 10),
    trade_check: parseInt($('#ab-tradecheck').value, 10),
    send_trade: parseInt($('#ab-sendtrade').value, 10),
    trade_token: $('#ab-tradetoken').value.trim(),
    machine: $('#ab-machine').value.trim(),
    custom_farm: $('#ab-custfarm').value.trim(),
    custom_idle: $('#ab-custidle').value.trim(),
    idle_games: $('#ab-idlegames').value.split(',').map(value => parseInt(value.trim(), 10)).filter(value => Number.isFinite(value) && value > 0),
    parental_code: $('#ab-parental').value.trim(),
    use_login_keys: getChk('ab-loginkeys'),
  };
}

async function saveBot() {
  const name = $('#ab-name').value.trim();
  if (!name) { toast('Введите имя бота', 'err'); return; }
  try {
    const response = await fetch('/__botconfigs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: botFormFields(name) }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
    const hourMax = Math.max(1, Math.min(32, parseInt($('#ab-hour-max-games').value, 10) || 32));
    HOUR_FARM_MAX_BY_BOT[name] = hourMax;
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
    const response = await fetch('/__botconfigs/' + encodeURIComponent(_editingBot), { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
    delete HOUR_FARM_MAX_BY_BOT[_editingBot];
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
  const response = await fetch('/__bots', { cache: 'no-store' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
  renderBots(data.bots || {});
  await syncLoginRequests();
  await syncHourFarmState();
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
let LOGIN_REQUESTS = [];
let _loginRequestLastEvent = 0;

function guardKey(bot, type) {
  return String(bot) + ':' + String(type);
}

function pendingGuards() {
  return LOGIN_REQUESTS.slice();
}

function updateDeferredGuardButton() {
  const button = $('#pending-input-nav');
  if (!button) return;
  const pending = pendingGuards();
  const visible = pending.length > 0;
  button.classList.toggle('show', visible);
  button.setAttribute('aria-hidden', visible ? 'false' : 'true');
  button.title = t('input_alert');
  button.setAttribute('aria-label', t('input_alert'));
  const count = $('#pending-input-count');
  if (count) count.textContent = String(pending.length);
}

function loginEventText(event) {
  const key = event && event.key ? event.key : '';
  const data = event && event.data ? event.data : {};
  if (key === 'login_request_new') {
    const info = inputInfo(data.input_type);
    return tf(key, { bot: data.bot, value: info ? info.label : '' });
  }
  const text = t(key);
  return text === key ? (data.error || key) : tf(key, data) + (data.error ? ': ' + data.error : '');
}

async function syncLoginRequests() {
  try {
    const response = await fetch('/__login_requests/status?since=' + encodeURIComponent(String(_loginRequestLastEvent)), { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) return;
    LOGIN_REQUESTS = Array.isArray(data.requests) ? data.requests : [];
    updateDeferredGuardButton();
    for (const event of data.events || []) {
      if (event.id > _loginRequestLastEvent) {
        _loginRequestLastEvent = event.id;
        logEvent(loginEventText(event));
      }
    }
    if (data.lastEventId > _loginRequestLastEvent) _loginRequestLastEvent = data.lastEventId;
    if (_guardActive) return;
    const next = LOGIN_REQUESTS.find(item => !item.deferred);
    if (next) openGuard(next.bot, next.type);
  } catch (e) {}
}

function openGuard(botName, type) {
  const info = inputInfo(type);
  if (!info) return;
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
  updateDeferredGuardButton();
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
  const input = $('#guard-input');
  input.value = '';
  input.type = (type === 2 || type === 4) ? 'password' : 'text';
  input.placeholder = info.ph;
  input.style.textTransform = info.upper ? 'uppercase' : 'none';
  setTimeout(() => input.focus(), 50);
}

function guardByCode() {
  showGuardCode(5);
}

async function deferGuard() {
  try {
    const response = await fetch('/__login_requests/defer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
    LOGIN_REQUESTS = data.requests || LOGIN_REQUESTS;
    closeGuard();
    updateDeferredGuardButton();
    toast(t('input_later'), 'ok');
  } catch (e) {
    toast(e.message, 'err');
  }
}

function openDeferredGuard() {
  if (_guardActive) return;
  const next = LOGIN_REQUESTS.find(item => item.deferred) || LOGIN_REQUESTS[0];
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
  let value = $('#guard-input').value.trim();
  if (info.upper) value = value.toUpperCase();
  if (!value) { toast(t('input_value_required'), 'err'); return; }
  try {
    const response = await fetch('/__login_requests/input', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bot: active.bot, type: active.type, value }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
    toast(tf('input_sent', { bot: active.bot }), 'ok');
    logEvent(tf('input_sent', { bot: active.bot }));
    closeGuard();
    setTimeout(refresh, 900);
  } catch (e) {
    toast(e.message, 'err');
  }
}

let AUTO_HOUR_FARM = false;
let START_HOUR_FARM = false;
let PRIORITY_HOUR_APPIDS = '';
let HOUR_FARM_PRIORITY_MODE = 'hours_desc';
if (!['hours_asc', 'hours_desc', 'popular'].includes(HOUR_FARM_PRIORITY_MODE)) HOUR_FARM_PRIORITY_MODE = 'hours_desc';
let HOUR_FARM_MAX_BY_BOT = {};
const _hourFarmGamesByBot = new Map();
let _hourFarmLastEvent = 0;

function hourFarmMaxForBot(name) {
  const value = parseInt(HOUR_FARM_MAX_BY_BOT[name], 10);
  return Number.isFinite(value) ? Math.max(1, Math.min(32, value)) : 32;
}


function parseAppIDsText(text) {
  const seen = new Set();
  const result = [];
  String(text || '').split(/[^0-9]+/).forEach(value => {
    const appid = parseInt(value, 10);
    if (Number.isFinite(appid) && appid > 0 && !seen.has(appid)) {
      seen.add(appid);
      result.push(appid);
    }
  });
  return result;
}

function normalizeAppIDsText(text) {
  return parseAppIDsText(text).join(', ');
}

function hourFarmEventText(event) {
  const data = event && event.data ? event.data : {};
  const key = event && event.key ? event.key : '';
  const text = t(key);
  if (text !== key) return tf(key, data) + (data.error ? ': ' + data.error : '');
  return data.error || key;
}

async function syncHourFarmState() {
  try {
    const response = await fetch('/__hourfarm/status?since=' + encodeURIComponent(String(_hourFarmLastEvent)), { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) return;
    _hourFarmGamesByBot.clear();
    for (const [name, appids] of Object.entries(data.active || {})) {
      if (Array.isArray(appids)) _hourFarmGamesByBot.set(name, appids.map(Number).filter(x => Number.isFinite(x) && x > 0));
    }
    for (const event of data.events || []) {
      if (event.id > _hourFarmLastEvent) {
        _hourFarmLastEvent = event.id;
        logEvent(hourFarmEventText(event));
      }
    }
    if (data.lastEventId > _hourFarmLastEvent) _hourFarmLastEvent = data.lastEventId;
    if (_openBotDetails) renderBotDetails();
  } catch (e) {}
}

async function startHourFarm() {
  const fab = $('#boost-fab');
  fab.classList.add('busy');
  try {
    const response = await fetch('/__hourfarm/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
    await syncHourFarmState();
  } catch (e) {
    toast(e.message, 'err');
    logEvent(e.message);
  } finally {
    fab.classList.remove('busy');
    setTimeout(refresh, 800);
  }
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
  setTimeout(startHourFarm, 400);
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

function pluginTitleHTML(name, dotClass = '') {
  const safe = escapeHtml(name || t('plugin_unknown'));
  return `<div class="plugin-name"><span class="dot ${dotClass}"></span><span class="plugin-title-label" title="${safe}">${safe}</span></div>`;
}

function renderPluginLibrary(items) {
  const box = $('#plugins-list');
  if (!items.length) { box.innerHTML = `<div class="empty">${t('plugin_empty')}</div>`; return; }
  box.innerHTML = items.map(p => `<div class="plugin-card plugin-card--library">
    <div class="plugin-card-top">${pluginTitleHTML(p.displayName || p.name || t('plugin_unknown'), p.isLoaded ? 'online' : 'offline')}</div>
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
    }
    renderPluginLibrary(mergeLoadedPluginNames(d.items || [], loaded));
  } catch (e) {
    box.innerHTML = `<div class="empty">${t('plugins_failed')}: ${escapeHtml(e.message)}</div>`;
  }
}

function renderPluginStore(items) {
  const box = $('#plugins-store-list');
  box.innerHTML = items.map(p => `<div class="plugin-card plugin-card--store">
    <div class="plugin-card-top">${pluginTitleHTML(p.name || t('plugin_unknown'), 'online')}<span class="plugin-badge">GitHub</span></div>
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
  const response = await fetch('/__theme', options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.message || ('HTTP ' + response.status));
  return data;
}

function customThemeMediaType(file) {
  const type = String(file && file.type || '').toLowerCase();
  if (type === 'video/mp4' || type === 'video/webm') return 'video';
  if (['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(type)) return 'image';
  const name = String(file && file.name || '').toLowerCase();
  if (/\.(mp4|webm)$/.test(name)) return 'video';
  if (/\.(png|jpe?g|webp|gif)$/.test(name)) return 'image';
  return '';
}

function setCustomThemePreview(url, mediaType = '') {
  const preview = $('#custom-theme-preview');
  if (!preview) return;
  preview.innerHTML = '';
  preview.style.backgroundImage = '';
  if (!url) {
    preview.classList.remove('show');
    preview.setAttribute('aria-hidden', 'true');
    return;
  }
  if (mediaType === 'video') {
    const video = document.createElement('video');
    video.src = url;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    preview.appendChild(video);
    video.play().catch(() => {});
  } else {
    preview.style.backgroundImage = `url("${String(url).replace(/"/g, '%22')}")`;
  }
  preview.classList.add('show');
  preview.setAttribute('aria-hidden', 'false');
}

function setCustomThemeVideo(url) {
  const video = $('#custom-theme-video');
  if (!video) return;
  if (!url) {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.classList.remove('show');
    return;
  }
  if (video.getAttribute('src') !== url) {
    video.src = url;
    video.load();
  }
  video.classList.add('show');
  video.play().catch(() => {});
}

function applyFullTheme(theme, persist = true) {
  CURRENT_FULL_THEME = theme;
  const isCustom = theme === 'custom';
  const isDark = isCustom ? CUSTOM_THEME.base !== 'light' : (theme === 'dark' || theme === 'dark-img');
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const customVideo = isCustom && CUSTOM_THEME.mediaType === 'video' && CUSTOM_THEME.mediaUrl;
  const customImage = isCustom && CUSTOM_THEME.mediaType !== 'video' && CUSTOM_THEME.mediaUrl;

  if (theme === 'dark-img') {
    document.documentElement.setAttribute('data-bg-theme', 'dark-img');
  } else if (theme === 'light-img') {
    document.documentElement.setAttribute('data-bg-theme', 'light-img');
  } else if (customVideo) {
    document.documentElement.setAttribute('data-bg-theme', 'custom-video');
  } else if (customImage) {
    document.documentElement.setAttribute('data-bg-theme', 'custom-img');
    document.documentElement.style.setProperty('--custom-theme-image', `url("${String(CUSTOM_THEME.mediaUrl).replace(/"/g, '%22')}")`);
  } else {
    document.documentElement.removeAttribute('data-bg-theme');
    document.documentElement.style.removeProperty('--custom-theme-image');
  }

  setCustomThemeVideo(customVideo ? CUSTOM_THEME.mediaUrl : '');
  if (isCustom && CUSTOM_THEME.transparent) document.documentElement.setAttribute('data-custom-transparent', '1');
  else document.documentElement.removeAttribute('data-custom-transparent');

  const moon = $('.ico-moon');
  if (moon) moon.style.display = isDark ? 'none' : 'inline';
  const sun = $('.ico-sun');
  if (sun) sun.style.display = isDark ? 'inline' : 'none';
  $$('.theme-option-card').forEach(card => card.classList.toggle('active', card.getAttribute('data-theme-val') === theme));
  if (window.pywebview && window.pywebview.api && window.pywebview.api.set_theme) {
    try { window.pywebview.api.set_theme(isDark ? 'dark' : 'light'); } catch (e) {}
  }
  if (persist) localSettings({ theme_full: theme }).catch(() => {});
}

async function loadCustomTheme() {
  try {
    const state = await customThemeRequest();
    CUSTOM_THEME = {
      base: state.base === 'light' ? 'light' : 'dark',
      transparent: !!state.transparent,
      mediaUrl: state.mediaUrl || state.imageUrl || '',
      mediaType: state.mediaType || 'image',
      hasMedia: !!(state.hasMedia || state.hasImage),
    };
    if (CURRENT_FULL_THEME === 'custom') applyFullTheme('custom', false);
    return CUSTOM_THEME;
  } catch (e) {
    return CUSTOM_THEME;
  }
}

async function openCustomThemeModal() {
  await loadCustomTheme();
  CUSTOM_THEME_PENDING_MEDIA = '';
  CUSTOM_THEME_PENDING_MEDIA_TYPE = '';
  CUSTOM_THEME_REMOVE_MEDIA = false;
  const base = CUSTOM_THEME.base === 'light' ? 'light' : 'dark';
  const radio = $(`input[name="custom-theme-base"][value="${base}"]`);
  if (radio) radio.checked = true;
  $('#custom-theme-transparent').checked = !!CUSTOM_THEME.transparent;
  $('#custom-theme-file').value = '';
  $('#custom-theme-file-note').textContent = t('custom_theme_image_hint');
  setCustomThemePreview(CUSTOM_THEME.mediaUrl, CUSTOM_THEME.mediaType);
  $('#custom-theme-modal').classList.add('show');
  $('#custom-theme-modal').setAttribute('aria-hidden', 'false');
}

function closeCustomThemeModal() {
  $('#custom-theme-modal').classList.remove('show');
  $('#custom-theme-modal').setAttribute('aria-hidden', 'true');
  CUSTOM_THEME_PENDING_MEDIA = '';
  CUSTOM_THEME_PENDING_MEDIA_TYPE = '';
  CUSTOM_THEME_REMOVE_MEDIA = false;
}

function readCustomThemeImage(file) {
  if (!file) return;
  const mediaType = customThemeMediaType(file);
  const limit = mediaType === 'video' ? 50 * 1024 * 1024 : 12 * 1024 * 1024;
  if (!mediaType) {
    toast(t('custom_theme_image_invalid'), 'err');
    $('#custom-theme-file').value = '';
    return;
  }
  if (file.size > limit) {
    toast(t('custom_theme_image_too_large'), 'err');
    $('#custom-theme-file').value = '';
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => toast(t('custom_theme_image_invalid'), 'err');
  reader.onload = () => {
    CUSTOM_THEME_PENDING_MEDIA = String(reader.result || '');
    CUSTOM_THEME_PENDING_MEDIA_TYPE = mediaType;
    CUSTOM_THEME_REMOVE_MEDIA = false;
    setCustomThemePreview(CUSTOM_THEME_PENDING_MEDIA, mediaType);
    $('#custom-theme-file-note').textContent = t('custom_theme_image_loaded') + ': ' + file.name;
  };
  reader.readAsDataURL(file);
}

async function saveCustomTheme() {
  const button = $('#custom-theme-save');
  const base = ($('input[name="custom-theme-base"]:checked') || {}).value === 'light' ? 'light' : 'dark';
  const payload = { base, transparent: !!$('#custom-theme-transparent').checked, removeImage: CUSTOM_THEME_REMOVE_MEDIA };
  if (CUSTOM_THEME_PENDING_MEDIA) payload.imageData = CUSTOM_THEME_PENDING_MEDIA;
  button.disabled = true;
  try {
    const state = await customThemeRequest(payload);
    CUSTOM_THEME = {
      base: state.base === 'light' ? 'light' : 'dark',
      transparent: !!state.transparent,
      mediaUrl: state.mediaUrl || '',
      mediaType: state.mediaType || 'image',
      hasMedia: !!state.hasMedia,
    };
    applyFullTheme('custom');
    closeCustomThemeModal();
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

function applySidebarCollapsed(collapsed, persist = true) {
  SIDEBAR_COLLAPSED = !!collapsed;
  document.documentElement.setAttribute('data-sidebar', SIDEBAR_COLLAPSED ? 'collapsed' : 'expanded');
  if (persist) localSettings({ sidebar_collapsed: SIDEBAR_COLLAPSED }).catch(() => {});
}

function applyEconomyMode(enabled, rerender = true) {
  ECONOMY_MODE = !!enabled;
  document.documentElement.setAttribute('data-economy', ECONOMY_MODE ? '1' : '0');
  const toggle = $('#set-economy-mode');
  if (toggle) toggle.checked = ECONOMY_MODE;
  setRefreshInterval();
  if (rerender && BOTS) renderBots(BOTS);
}

async function loadAppSettings() {
  let settings = {};
  try { settings = await localSettings(); } catch (e) {}
  const tray = $('#set-minimize-tray');
  const auto = $('#set-autostart');
  const autoHour = $('#set-auto-hour-farm');
  const startHour = $('#set-start-hour-farm');
  const priorityInput = $('#set-priority-hour-games');
  const language = $('#set-language');
  const priorityMode = $('#set-hour-farm-priority-mode');
  const launchMin = $('#set-launch-minimized');
  if (tray) tray.checked = !!settings.minimize_to_tray;
  if (auto) auto.checked = !!settings.autostart;
  AUTO_HOUR_FARM = !!settings.auto_hour_farm_after_cards;
  START_HOUR_FARM = !!settings.start_hour_farm_on_launch;
  if (autoHour) autoHour.checked = AUTO_HOUR_FARM;
  if (startHour) startHour.checked = START_HOUR_FARM;
  if (settings.hour_farm_max_games_by_bot && typeof settings.hour_farm_max_games_by_bot === 'object') HOUR_FARM_MAX_BY_BOT = settings.hour_farm_max_games_by_bot;
  if (priorityInput) {
    PRIORITY_HOUR_APPIDS = normalizeAppIDsText(settings.priority_hour_farm_appids || '');
    priorityInput.value = PRIORITY_HOUR_APPIDS;
  }
  const savedLanguage = ['ru', 'en', 'uk'].includes(settings.language) ? settings.language : 'ru';
  applyLanguage(savedLanguage, false);
  if (language) language.value = savedLanguage;
  HOUR_FARM_PRIORITY_MODE = ['hours_asc', 'hours_desc', 'popular'].includes(settings.hour_farm_priority_mode) ? settings.hour_farm_priority_mode : 'hours_desc';
  if (priorityMode) priorityMode.value = HOUR_FARM_PRIORITY_MODE;
  if (launchMin) launchMin.checked = !!settings.launch_minimized;
  applySidebarCollapsed(!!settings.sidebar_collapsed, false);
  applyEconomyMode(!!settings.economy_mode, true);
  applyFullTheme(settings.theme_full || CFG.theme || 'dark', false);
  loadServiceData();
}

async function saveAppSetting(key, value) {
  try {
    const result = await localSettings({ [key]: value });
    const ok = result.ok !== false;
    if (ok && key === 'economy_mode') applyEconomyMode(!!value, true);
    toast(ok ? t('setting_saved') : t('settings_error'), ok ? 'ok' : 'err');
    return ok;
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

async function loadServiceData() {
  const summary = $('#service-cache-summary');
  if (!summary) return;
  try {
    const response = await fetch('/__cache', { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
    const items = data.items || {};
    summary.textContent = `Steam: ${formatBytes(items.steam_names || 0)} · ${t('clear_covers')}: ${formatBytes(items.steam_covers || 0)} · Events: ${formatBytes(items.events || 0)}`;
  } catch (e) {
    summary.textContent = '—';
  }
}

async function clearServiceCache(name) {
  try {
    const response = await fetch('/__cache', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || ('HTTP ' + response.status));
    if (name === 'events') { $('#log-output').textContent = ''; _eventLogLastId = 0; }
    await loadServiceData();
    toast(t('cache_cleared'), 'ok');
  } catch (e) {
    toast(e.message, 'err');
  }
}

async function openDiagnostics() {
  $('#diagnostics-modal').classList.add('show');
  $('#diagnostics-modal').setAttribute('aria-hidden', 'false');
  const output = $('#diagnostics-output');
  output.textContent = '…';
  try {
    const response = await fetch('/__diagnostics', { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    output.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    output.textContent = e.message;
  }
}

async function loadUpdatesStatus() {
  const output = $('#diagnostics-output');
  output.textContent = '…';
  try {
    const response = await fetch('/__updates/status', { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    output.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    output.textContent = e.message;
  }
}

function closeDiagnostics() {
  $('#diagnostics-modal').classList.remove('show');
  $('#diagnostics-modal').setAttribute('aria-hidden', 'true');
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
  const initialTheme = CFG.theme || 'dark';
  applyFullTheme(initialTheme, false);
  applyEconomyMode(ECONOMY_MODE, false);

  const themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.onclick = () => {
      const cur = CURRENT_FULL_THEME || 'dark';
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

  $('#custom-theme-add').onclick = openCustomThemeModal;
  $('#custom-theme-cancel').onclick = closeCustomThemeModal;
  $('#custom-theme-save').onclick = saveCustomTheme;
  $('#custom-theme-file').onchange = e => readCustomThemeImage(e.target.files && e.target.files[0]);
  $('#custom-theme-remove-image').onclick = () => {
    CUSTOM_THEME_PENDING_MEDIA = '';
    CUSTOM_THEME_PENDING_MEDIA_TYPE = '';
    CUSTOM_THEME_REMOVE_MEDIA = true;
    $('#custom-theme-file').value = '';
    setCustomThemePreview('');
    $('#custom-theme-file-note').textContent = t('custom_theme_remove_image');
  };

  loadCustomTheme();
  loadAppSettings();
  fetch('/__events').then(response => response.json()).then(data => {
    if (!data.ok) return;
    _eventLogLastId = data.lastEventId || 0;
    const output = $('#log-output');
    if (output) {
      output.textContent = Array.isArray(data.events) && data.events.length
        ? data.events.map(event => `[${new Date((event.time || 0) * 1000).toLocaleTimeString(UI_LANGUAGE === 'uk' ? 'uk-UA' : UI_LANGUAGE === 'en' ? 'en-US' : 'ru-RU')}] ${event.message}`).join('\n') + '\n'
        : '';
      output.scrollTop = output.scrollHeight;
    }
  }).catch(() => {});
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
    try {
      const r = await localSettings({ hour_farm_priority_mode: value });
      if (r.ok === false) throw new Error('save failed');
      toast(t('priority_mode_saved'), 'ok');
    } catch (err) {
      HOUR_FARM_PRIORITY_MODE = previous;
      priorityModeSelect.value = previous;
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
    const ok = await saveAppSetting('auto_hour_farm_after_cards', AUTO_HOUR_FARM);
    if (!ok) {
      AUTO_HOUR_FARM = prev;
      e.target.checked = prev;
    }
  };
  const startHourToggle = $('#set-start-hour-farm');
  if (startHourToggle) startHourToggle.onchange = async e => {
    const prev = START_HOUR_FARM;
    START_HOUR_FARM = !!e.target.checked;
    const ok = await saveAppSetting('start_hour_farm_on_launch', START_HOUR_FARM);
    if (!ok) {
      START_HOUR_FARM = prev;
      e.target.checked = prev;
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

  const sidebar = $('.sidebar');
  if (sidebar) sidebar.ondblclick = event => {
    if (!event.target.closest('#sidebar-expand')) applySidebarCollapsed(true);
  };
  $('#sidebar-expand').onclick = () => applySidebarCollapsed(false);
  const botsSearch = $('#bots-search');
  if (botsSearch) botsSearch.oninput = e => {
    BOT_SEARCH_QUERY = e.target.value || '';
    renderBots(BOTS);
  };
  $('#refreshBtn').onclick = refresh;
  $('#pluginsRefresh').onclick = () => {
    if (ACTIVE_PLUGIN_TAB === 'store') loadPluginStore(); else loadPluginLibrary();
  };
  $$('.plugin-tab').forEach(btn => btn.onclick = () => selectPluginTab(btn.dataset.pluginTab));
  $('#plugin-remove-cancel').onclick = closePluginRemove;
  $('#plugin-remove-confirm').onclick = confirmPluginRemove;
  $('#bot-details-close').onclick = closeBotDetails;
  $('#diagnostics-open').onclick = openDiagnostics;
  $('#diagnostics-close').onclick = closeDiagnostics;
  $('#updates-status').onclick = loadUpdatesStatus;
  $('#cache-clear-covers').onclick = () => clearServiceCache('steam_covers');
  $('#cache-clear-names').onclick = () => clearServiceCache('steam_names');
  $('#cache-clear-events').onclick = () => clearServiceCache('events');
  $('#logClear').onclick = () => { $('#log-output').textContent = ''; _eventLogLastId = 0; fetch('/__events/clear', { method: 'POST' }).catch(() => {}); };

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

  $('#boost-fab').onclick = startHourFarm;
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
