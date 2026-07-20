
'use strict';

const CFG = window.ASF_CONFIG || {};

const API_CANDIDATES = (() => {
  if (CFG.apiBase) return [CFG.apiBase.replace(/\/+$/, '')];

  return [''];
})();
let API_BASE = API_CANDIDATES[0] || '';
let IPC_PASSWORD = CFG.password || localStorage.getItem('asf_ipc_password') || '';
let pollTimer = null;
let ECONOMY_MODE = localStorage.getItem('asf_economy_mode') === '1';

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

function hideUpdateBanner(id = '') {
  const b = $('#update-banner');
  if (b) { b.classList.remove('show'); b.setAttribute('aria-hidden', 'true'); }
  if (id) localStorage.setItem('betterasf_update_dismissed', id);
}

async function installBetterASFUpdate(btn) {
  if (btn) { btn.disabled = true; btn.textContent = 'Загрузка…'; }
  try {
    const r = await fetch('/__install_update', { method: 'POST', cache: 'no-store' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) throw new Error(d.message || ('HTTP ' + r.status));
    toast('Обновление запущено, BetterASF закроется', 'ok');
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
    toast('Не удалось обновить: ' + e.message, 'err');
    logEvent('Updater error: ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Обновить'; }
  }
}

async function checkBetterASFUpdate(manual = false) {
  try {
    const r = await fetch('/__check_update', { cache: 'no-store' });
    const d = await r.json();
    if (!d || !d.ok) {
      if (manual) toast((d && d.message) || 'Не удалось проверить обновления', 'err');
      return;
    }
    const updateId = d.latestVersion || d.latestCommit || d.downloadUrl || d.url || 'unknown';
    if (!d.update) {
      if (manual) toast(d.message || 'Обновлений нет', 'ok');
      return;
    }
    if (!manual && localStorage.getItem('betterasf_update_dismissed') === updateId) return;

    const b = $('#update-banner');
    const text = $('#update-banner-text');
    const link = $('#update-banner-link');
    const ok = $('#update-banner-ok');
    if (!b || !text || !link || !ok) return;
    text.textContent = d.message || 'Доступно обновление BetterASF';
    link.textContent = 'Обновить';
    link.onclick = () => installBetterASFUpdate(link);
    ok.textContent = '×';
    ok.onclick = () => hideUpdateBanner(updateId);
    b.classList.add('show');
    b.setAttribute('aria-hidden', 'false');
    logEvent('GitHub: ' + text.textContent);
  } catch (e) {
    if (manual) toast('Ошибка проверки обновлений: ' + e.message, 'err');
  }
}

function setConn(ok) {
  const c = $('#conn');
  if (ok) { c.textContent = 'подключено'; c.className = 'tb-conn tb-conn--on'; }
  else { c.textContent = 'нет связи'; c.className = 'tb-conn tb-conn--off'; }
}

function setConnRecovering() {
  const c = $('#conn');
  if (!c) return;
  c.textContent = 'восстановление';
  c.className = 'tb-conn tb-conn--recover';
}

function setConnStarting() {
  const c = $('#conn');
  if (!c) return;
  c.textContent = 'запуск ASF';
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
  1: { title: 'Логин Steam', label: 'логин', ph: 'Steam логин', upper: false, confirm: false },
  2: { title: 'Пароль Steam', label: 'пароль', ph: 'Пароль', upper: false, confirm: false },
  3: { title: 'Steam Guard', label: 'код Steam Guard (из e-mail)', ph: 'XXXXX', upper: true, confirm: false },
  4: { title: 'Родительский код', label: 'родительский код Steam', ph: 'Код', upper: false, confirm: false },
  5: { title: 'Двухфакторный код (2FA)', label: 'код аутентификатора', ph: '00000', upper: true, confirm: false },
  7: { title: 'Подтверждение входа', label: 'подтверждение', ph: '', upper: false, confirm: true },
};

let _guardActive = null;

function checkRequiredInput(bots) {
  for (const name of Object.keys(bots || {})) {
    const type = bots[name].RequiredInput;
    if (type && INPUT_TYPES[type]) {
      const key = name + ':' + type;
      if (!_inputLogged.has(key)) {
        _inputLogged.add(key);
        logEvent('Вход не завершён для ' + name + ': требуется ' + INPUT_TYPES[type].label);
      }
    }
  }
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
let AUTO_HOUR_FARM = localStorage.getItem('asf_auto_hour_farm_after_cards') === '1';
let START_HOUR_FARM = localStorage.getItem('asf_start_hour_farm_on_launch') === '1';
let PRIORITY_HOUR_APPIDS = localStorage.getItem('asf_priority_hour_farm_appids') || '';
let _startupHourDone = false;
let _startupWaitStarted = 0;
let _lastStartupWaitLog = 0;
let _autoHourInitialized = false;
const _autoHourSeenCardWork = new Set();
const _autoHourBoosted = new Set();
const _inputLogged = new Set();
const _hourReapplyAt = new Map();

function hasCardWork(bot) {
  if (!bot || !bot.KeepRunning || !bot.IsConnectedAndLoggedOn) return false;
  const cf = bot.CardsFarmer || {};
  return !!(cf.NowFarming ||
    (Array.isArray(cf.CurrentGamesFarming) && cf.CurrentGamesFarming.length > 0) ||
    (Array.isArray(cf.GamesToFarm) && cf.GamesToFarm.length > 0));
}

function isFarmedIdle(bot) {
  if (!bot.KeepRunning || !bot.IsConnectedAndLoggedOn) return false;
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
    if (priority.length) logEvent('Буст часов: приоритетные AppID: ' + priority.join(', '));

    let needKey = false;
    const ownedByBot = {};
    const ownedSetByBot = {};

    for (const name of targets) {
      const sid = bots[name].s_SteamID || (bots[name].SteamID != null ? String(bots[name].SteamID) : '');
      if (!sid || sid === '0') { logEvent(name + ': нет SteamID, пропуск'); continue; }
      let res = {};
      try { res = await fetchGames(sid, priority.length ? 50000 : 32); }
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
      const games = (res.games || []).map(x => x.appID).filter(Boolean);
      if (!games.length) {
        logEvent(name + ': в библиотеке нет игр, пропуск');
        continue;
      }
      ownedByBot[name] = games;
      ownedSetByBot[name] = new Set(games);
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

    let done = 0;
    for (const name of usableTargets) {
      // Priority AppIDs apply to every account independently:
      // if the account owns 3 priority games, start all 3; if it owns 2, start those 2.
      const ownedSet = ownedSetByBot[name];
      const priorityOwned = priority.filter(appid => ownedSet.has(appid)).slice(0, 32);
      const selected = [...priorityOwned];
      const selectedSet = new Set(selected);

      for (const appid of ownedByBot[name]) {
        if (selected.length >= 32) break;
        if (selectedSet.has(appid)) continue;
        selected.push(appid);
        selectedSet.add(appid);
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
  const names = Object.keys(bots || {}).filter(n => bots[n] && bots[n].KeepRunning);
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

function applyFullTheme(t) {
  if (t === 'dark' || t === 'dark-img') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  if (t === 'dark-img') {
    document.documentElement.setAttribute('data-bg-theme', 'dark-img');
  } else if (t === 'light-img') {
    document.documentElement.setAttribute('data-bg-theme', 'light-img');
  } else {
    document.documentElement.removeAttribute('data-bg-theme');
  }
  
  const isDark = (t === 'dark' || t === 'dark-img');
  const moon = $('.ico-moon');
  if (moon) moon.style.display = isDark ? 'none' : 'inline';
  const sun = $('.ico-sun');
  if (sun) sun.style.display = isDark ? 'inline' : 'none';
  
  localStorage.setItem('asf_full_theme', t);
  localStorage.setItem('asf_theme', isDark ? 'dark' : 'light');
  
  $$('.theme-option-card').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-theme-val') === t);
  });
  
  const select = $('#settings-theme-select');
  if (select) {
    select.value = t;
  }
  
  if (window.pywebview && window.pywebview.api && window.pywebview.api.set_theme) {
    try { window.pywebview.api.set_theme(isDark ? 'dark' : 'light'); } catch (e) {}
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
  if (priorityInput) {
    PRIORITY_HOUR_APPIDS = st.priority_hour_farm_appids || localStorage.getItem('asf_priority_hour_farm_appids') || '';
    PRIORITY_HOUR_APPIDS = normalizeAppIDsText(PRIORITY_HOUR_APPIDS);
    priorityInput.value = PRIORITY_HOUR_APPIDS;
    localStorage.setItem('asf_priority_hour_farm_appids', PRIORITY_HOUR_APPIDS);
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
    toast(ok ? 'Настройка сохранена' : 'Не удалось применить настройку', ok ? 'ok' : 'err');
    return !!ok;
  } catch (e) {
    toast('Ошибка настройки: ' + e.message, 'err');
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
      { label: 'Настройки бота', act: 'edit' },
      { label: running ? 'Остановить бота' : 'Запустить бота', act: running ? 'stop' : 'start' },
    ];
    if (running) items.push({ label: paused ? 'Продолжить фарм' : 'Пауза фарма', act: paused ? 'resume' : 'pause' });
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
      applyFullTheme(e.target.value);
    };
  }

  loadAppSettings();
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
  if (restartBtn) restartBtn.onclick = e => runAsfActionButton(e.currentTarget, 'restart', 'Перезагрузка ASF');
  const updateBtn = $('#asf-update-action');
  if (updateBtn) updateBtn.onclick = e => runAsfActionButton(e.currentTarget, 'update', 'Проверка обновления ASF');
  initContextMenu();

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
