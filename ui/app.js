
'use strict';

const CFG = window.ASF_CONFIG || {};

const API_CANDIDATES = (() => {
  if (CFG.apiBase) return [CFG.apiBase.replace(/\/+$/, '')];

  return [''];
})();
let API_BASE = API_CANDIDATES[0] || '';
let IPC_PASSWORD = CFG.password || localStorage.getItem('asf_ipc_password') || '';
let pollTimer = null;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function logEvent(msg) {
  const el = $('#log-output');
  if (!el) return;
  const t = new Date().toLocaleTimeString();
  el.textContent += `[${t}] ${msg}\n`;
  el.scrollTop = el.scrollHeight;
}

function toast(msg, type = '') {
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'toast ' + type; }, 2600);
}

function setConn(ok) {
  const c = $('#conn');
  if (ok) { c.textContent = 'подключено'; c.className = 'tb-conn tb-conn--on'; }
  else { c.textContent = 'нет связи'; c.className = 'tb-conn tb-conn--off'; }
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
  if (!bot.KeepRunning) return { key: 'offline', label: 'Отключён' };
  if (!bot.IsConnectedAndLoggedOn) return { key: 'offline', label: 'Не в сети' };
  const cf = bot.CardsFarmer || {};
  if (cf.Paused) return { key: 'online', label: 'Пауза' };
  if (cf.NowFarming) return { key: 'farming', label: 'Фармит' };
  return { key: 'online', label: 'В сети' };
}

function isPaused(bot) {
  return !!(bot.CardsFarmer && bot.CardsFarmer.Paused);
}

function botAvatar(bot) {
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
  const powerTitle = running ? 'Остановить' : 'Запустить';
  const powerAct = running ? 'stop' : 'start';
  return `
    <div class="bot-card" data-bot="${name}">
      ${avHtml}
      <div class="bot-info bot-edit" data-edit="${name}" title="Настроить бота">
        <div class="bot-name"><span class="dot ${st.key}"></span>${escapeHtml(bot.Nickname || name)}</div>
        <div class="bot-status">${st.label}</div>
      </div>
      <div class="bot-actions">
        <button class="btn icon" title="Настройки" data-act="edit" data-bot="${name}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
        ${running ? (isPaused(bot)
          ? `<button class="btn icon" title="Продолжить фарм" data-act="resume" data-bot="${name}">
               <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l14 8-14 8z"/></svg></button>`
          : `<button class="btn icon" title="Пауза фарма" data-act="pause" data-bot="${name}">
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

  let games = 0, cards = 0, timeMin = 0, hasData = false;
  for (const n of names) {
    const cf = bots[n].CardsFarmer;
    if (cf) {
      if (Array.isArray(cf.GamesToFarm)) { games += cf.GamesToFarm.length; hasData = true; }
      if (typeof cf.TimeRemaining === 'string') {  }
    }
  }
  $('#kpi-games').textContent = hasData ? games : '—';
  $('#kpi-cards').textContent = '—';
  $('#kpi-time').textContent = '—';

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
  $('#ab-title').textContent = 'Новый бот';
  $('#ab-save').textContent = 'Создать';
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
  $('#ab-title').textContent = 'Настройки бота';
  $('#ab-save').textContent = 'Сохранить';
  $('#ab-delete').style.display = 'inline-flex';
  $('#ab-name').disabled = true;
  $('#ab-name').value = name;
  $('#ab-pass-hint').textContent = '(оставьте пустым, чтобы не менять)';
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
    RemoteCommunication: 3,
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

async function refreshASF() {
  try {
    const r = await api('/Api/ASF');
    const d = r && r.Result ? r.Result : {};
    $('#sys-mem').textContent = fmtMem(d.MemoryUsage);
    $('#sys-up').textContent = fmtUptime(d.ProcessStartTime || d.StartTime);
    $('#sys-ver').textContent = d.Version ? ('v' + (d.Version.Major !== undefined ?
      `${d.Version.Major}.${d.Version.Minor}.${d.Version.Build}` : d.Version)) : '—';
  } catch (e) {  }
}

async function refreshBots() {
  const r = await api('/Api/Bot/ASF');
  const bots = r && r.Result ? r.Result : {};
  renderBots(bots);
  checkRequiredInput(bots);
}

const INPUT_TYPES = {
  1: { title: 'Логин Steam', label: 'логин', ph: 'Steam логин', upper: false, confirm: false },
  2: { title: 'Пароль Steam', label: 'пароль', ph: 'Пароль', upper: false, confirm: false },
  3: { title: 'Steam Guard', label: 'код Steam Guard (из e-mail)', ph: 'XXXXX', upper: true, confirm: false },
  4: { title: 'Родительский код', label: 'родительский код Steam', ph: 'Код', upper: false, confirm: false },
  5: { title: 'Двухфакторный код (2FA)', label: 'код аутентификатора', ph: '00000', upper: true, confirm: false },
  7: { title: 'Подтверждение входа', label: 'подтверждение', ph: '', upper: false, confirm: true },
};

let _guardActive = null;

function checkRequiredInput(bots) {
  if (_guardActive) return;
  for (const name of Object.keys(bots || {})) {
    const type = bots[name].RequiredInput;
    if (type && INPUT_TYPES[type]) {
      openGuard(name, type);
      return;
    }
  }
}

function openGuard(botName, type) {
  const info = INPUT_TYPES[type];
  _guardActive = { bot: botName, type };
  $('#guard-acc').textContent = botName;
  $('#guard-title').textContent = info.title;

  if (info.confirm) {
    $('#guard-sub').textContent = 'Запрос на вход для аккаунта:';
    $('#guard-confirm-view').style.display = 'block';
    $('#guard-code-view').style.display = 'none';
    $('#guard-send').style.display = 'none';
    $('#guard-bycode').style.display = 'inline-flex';
  } else {
    showGuardCode(type);
  }
  $('#guard-modal').classList.add('show');
  logEvent('Требуется ' + (info.confirm ? 'подтверждение входа' : info.label) + ' для бота ' + botName);
}

function showGuardCode(type) {
  const info = INPUT_TYPES[type];
  _guardActive.type = type;
  $('#guard-title').textContent = info.title;
  $('#guard-sub').textContent = 'Введите ' + info.label + ' для аккаунта:';
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

function closeGuard() {
  $('#guard-modal').classList.remove('show');
  _guardActive = null;
}

async function sendGuard() {
  if (!_guardActive) return;
  const info = INPUT_TYPES[_guardActive.type] || {};
  let val = $('#guard-input').value.trim();
  if (info.upper) val = val.toUpperCase();
  if (!val) { toast('Введите значение', 'err'); return; }
  try {
    await api('/Api/Bot/' + encodeURIComponent(_guardActive.bot) + '/Input', {
      method: 'POST',
      body: JSON.stringify({ Type: _guardActive.type, Value: val }),
    });
    toast('Отправлено для ' + _guardActive.bot, 'ok');
    logEvent('Код отправлен для ' + _guardActive.bot);
    closeGuard();
    setTimeout(refresh, 1200);
  } catch (e) {
    toast(e.message, 'err');
  }
}

let _boosting = false;

function isFarmedIdle(bot) {
  if (!bot.KeepRunning || !bot.IsConnectedAndLoggedOn) return false;
  const cf = bot.CardsFarmer || {};
  const farming = (cf.CurrentGamesFarming || []).length > 0;
  const toFarm = Array.isArray(cf.GamesToFarm) ? cf.GamesToFarm.length : 0;
  return !farming && toFarm === 0;
}

async function fetchGames(steamid) {
  const g = await api('/__games?steamid=' + steamid + '&limit=32', { timeout: 20000 });
  return g || {};
}

async function boostHours() {
  if (_boosting) return;
  _boosting = true;
  const fab = $('#boost-fab');
  fab.classList.add('busy');
  try {
    const r = await api('/Api/Bot/ASF');
    const bots = r && r.Result ? r.Result : {};
    const targets = Object.keys(bots).filter(n => isFarmedIdle(bots[n]));
    if (!targets.length) {
      toast('Нет аккаунтов с отфармленными карточками', 'err');
      logEvent('Буст часов: подходящих аккаунтов нет.');
      return;
    }
    logEvent('Буст часов: аккаунтов ' + targets.length);
    let done = 0, needKey = false;
    for (const name of targets) {
      const sid = bots[name].s_SteamID || (bots[name].SteamID != null ? String(bots[name].SteamID) : '');
      if (!sid || sid === '0') { logEvent(name + ': нет SteamID, пропуск'); continue; }
      let res = {};
      try { res = await fetchGames(sid); }
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
      const games = (res.games || []).map(x => x.appID);
      if (!games.length) {
        logEvent(name + ': в библиотеке нет игр, пропуск');
        continue;
      }
      try {
        await api('/Api/Command', {
          method: 'POST',
          body: JSON.stringify({ Command: 'play ' + name + ' ' + games.join(',') }),
        });
        done++;
        logEvent(name + ': запущено ' + games.length + ' игр (топ по часам)');
      } catch (e) { logEvent(name + ': ошибка play (' + e.message + ')'); }
    }

    if (needKey) {
      toast('Проверьте Steam API ключ', 'err');
      logEvent('Нужен корректный Steam Web API ключ.');
      openApiKeyModal();
      return;
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
  if (a && a.set_api_key) { try { await a.set_api_key(key); } catch (e) {} }
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
    await refreshBots();
    await refreshASF();
    setConn(true);
    if (_wasConnected !== true) { logEvent('Связь с ASF установлена.'); _wasConnected = true; }
  } catch (e) {
    setConn(false);
    if (_wasConnected !== false &&
        !String(e.message).includes('401') && !String(e.message).includes('abort')) {
      logEvent('Нет связи с ASF (ожидание запуска): ' + e.message);
      _wasConnected = false;
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

async function loadPlugins() {
  const box = $('#plugins-list');
  box.innerHTML = '<div class="empty">Загрузка…</div>';
  try {
    const r = await api('/Api/Plugins?official=true&custom=true');
    const list = (r && r.Result) ? r.Result : [];
    if (!list.length) { box.innerHTML = '<div class="empty">Активных плагинов нет.</div>'; return; }
    box.innerHTML = list.map(p => {
      const name = escapeHtml(p.Name || 'Plugin');
      const ver = p.Version ? (typeof p.Version === 'object'
        ? `${p.Version.Major}.${p.Version.Minor}.${p.Version.Build}` : p.Version) : '—';
      return `<div class="plugin-card">
        <div class="plugin-name"><span class="dot online"></span>${name}</div>
        <div class="plugin-ver">Версия: ${escapeHtml(String(ver))}</div>
      </div>`;
    }).join('');
  } catch (e) {
    box.innerHTML = '<div class="empty">Не удалось получить плагины: ' + escapeHtml(e.message) + '</div>';
  }
}

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  $('.ico-moon').style.display = t === 'dark' ? 'none' : 'inline';
  $('.ico-sun').style.display = t === 'dark' ? 'inline' : 'none';
  localStorage.setItem('asf_theme', t);
  if (window.pywebview && window.pywebview.api && window.pywebview.api.set_theme) {
    try { window.pywebview.api.set_theme(t); } catch (e) {}
  }
}

function bridge() { return (window.pywebview && window.pywebview.api) ? window.pywebview.api : null; }

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
  applyTheme(CFG.theme || localStorage.getItem('asf_theme') || 'dark');
  $('#themeBtn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
    $('#themeBtn').classList.add('theme-spin');
    setTimeout(() => $('#themeBtn').classList.remove('theme-spin'), 400);
  };

  $('#minBtn').onclick = () => { const a = bridge(); if (a) a.minimize(); };
  $('#maxBtn').onclick = () => { const a = bridge(); if (a) a.toggle_maximize(); };
  $('#closeBtn').onclick = () => { const a = bridge(); if (a) a.close(); else window.close(); };

  $$('.nav-link').forEach(l => l.onclick = () => switchView(l.getAttribute('data-view')));

  $('#cmd-send').onclick = () => sendCommand($('#cmd-input').value);
  $('#cmd-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendCommand(e.target.value); });
  $$('.chip').forEach(c => c.onclick = () => { $('#cmd-input').value = c.getAttribute('data-cmd'); sendCommand(c.getAttribute('data-cmd')); });

  $('#refreshBtn').onclick = refresh;
  $('#pluginsRefresh').onclick = loadPlugins;
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

  $('#guard-cancel').onclick = closeGuard;
  $('#guard-send').onclick = sendGuard;
  $('#guard-bycode').onclick = guardByCode;
  $('#guard-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendGuard(); });

  $('#boost-fab').onclick = boostHours;

  $('#apikey-cancel').onclick = closeApiKeyModal;
  $('#apikey-save').onclick = saveApiKey;
  $('#apikey-input').addEventListener('keydown', e => { if (e.key === 'Enter') saveApiKey(); });

  logEvent('Интерфейс запущен. База API: "' + API_BASE + '" (прокси)');

  fetch('/__health').then(r => r.json()).then(h => {
    logEvent('Диагностика связи: ' + JSON.stringify(h.hosts));
    if (h.good_host) logEvent('Рабочий хост ASF: ' + h.good_host);
  }).catch(() => logEvent('Прокси /__health не ответил.'));

  refresh();
  pollTimer = setInterval(refresh, 5000);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
