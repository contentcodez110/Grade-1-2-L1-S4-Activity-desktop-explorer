(function () {
  'use strict';

  var APPS = {
    paint: {
      name: 'Paint', color: '#f45b06',
      icon: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2 0-.6-.3-1-.6-1.3-.3-.4-.5-.7-.5-1.2 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z"/><circle cx="7.5" cy="11" r="1.5" fill="#f45b06"/><circle cx="10" cy="7" r="1.5" fill="#44c3c6"/><circle cx="14.5" cy="7" r="1.5" fill="#132439"/><circle cx="17" cy="11" r="1.5" fill="#ffc531"/></svg>',
      body: '<svg viewBox="0 0 300 180"><rect width="300" height="180" fill="#fff"/><rect x="0" y="0" width="300" height="26" fill="#f1f4f7"/><circle cx="16" cy="13" r="7" fill="#f45b06"/><circle cx="34" cy="13" r="7" fill="#44c3c6"/><circle cx="52" cy="13" r="7" fill="#132439"/><circle cx="70" cy="13" r="7" fill="#ffc531"/><circle cx="88" cy="13" r="7" fill="#4caf50"/><circle cx="240" cy="55" r="18" fill="#ffc531"/><rect x="95" y="90" width="90" height="65" fill="#44c3c6"/><polygon points="85,92 140,50 195,92" fill="#f45b06"/><rect x="128" y="118" width="24" height="37" fill="#132439"/><rect x="0" y="155" width="300" height="25" fill="#7ccf6b"/></svg>'
    },
    music: {
      name: 'Music', color: '#44c3c6',
      icon: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M9 17.5A2.5 2.5 0 1 1 7 15V5l12-2v11.5A2.5 2.5 0 1 1 17 12V6.3L9 7.6v9.9Z"/></svg>',
      body: '<svg viewBox="0 0 300 180"><rect width="300" height="180" fill="#eefcfc"/><circle cx="150" cy="80" r="40" fill="#44c3c6"/><polygon points="138,62 138,98 168,80" fill="#fff"/><rect x="60" y="140" width="180" height="8" rx="4" fill="#d5dde5"/><rect x="60" y="140" width="70" height="8" rx="4" fill="#f45b06"/><text x="150" y="172" font-size="14" text-anchor="middle" fill="#132439" font-family="sans-serif">Happy Song</text></svg>'
    },
    photos: {
      name: 'Photos', color: '#132439',
      icon: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="#fff"/><circle cx="9" cy="10" r="2" fill="#ffc531"/><path d="M4 18l5-5 3 3 3-4 5 6Z" fill="#44c3c6"/></svg>',
      body: ''
    },
    games: {
      name: 'Games', color: '#7a4fd6',
      icon: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="5" fill="#fff"/><rect x="6" y="10.5" width="5" height="1.8" fill="#7a4fd6"/><rect x="7.6" y="9" width="1.8" height="5" fill="#7a4fd6"/><circle cx="16" cy="11" r="1.3" fill="#f45b06"/><circle cx="18" cy="13.4" r="1.3" fill="#44c3c6"/></svg>',
      body: ''
    }
  };
  var ORDER = ['paint', 'music', 'photos', 'games'];

  // need: what the student must do. app: which app it is about.
  var MISSIONS = [
    { need: 'open', app: 'paint', text: 'Double-click the Paint icon to open it.' },
    { need: 'max', text: 'Make the window BIG. Click Maximize ▢.' },
    { need: 'restore', text: 'Make it small again. Click the same square button ▢.' },
    { need: 'min', text: 'Hide the window. Click Minimize —.' },
    { need: 'task', text: 'Bring Paint back! Click Paint on the taskbar at the bottom.' },
    { need: 'close', text: 'Close Paint. Click Close ✕.' },
    { need: 'open', app: 'music', text: 'Open the app that plays songs. Double-click it!' },
    { need: 'close', text: 'Great! Now close the Music window. Click ✕.' }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var step = 0, openApp = null, isMax = false, isMin = false;
  var lastClick = { id: null, t: 0 }, hintTimer = null;

  function buildStars(el, count) {
    el.innerHTML = '';
    for (var i = 0; i < MISSIONS.length; i++) {
      var s = document.createElement('span');
      s.textContent = '⭐';
      if (i < count) s.className = 'on';
      el.appendChild(s);
    }
  }

  function buildIcons() {
    var box = $('icons');
    box.innerHTML = '';
    ORDER.forEach(function (id) {
      var a = APPS[id];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'icon';
      b.dataset.app = id;
      b.setAttribute('aria-label', a.name + ' icon');
      b.innerHTML = '<span class="pic" style="background:' + a.color + '">' + a.icon + '</span><span>' + a.name + '</span>';
      b.addEventListener('click', function () { iconClick(id, b); });
      box.appendChild(b);
    });
  }

  function say(msg, kind) {
    var f = $('feedback');
    f.textContent = msg;
    f.className = 'feedback ' + (kind || '');
  }

  function showMission() {
    $('missionNum').textContent = 'Mission ' + (step + 1) + ' of ' + MISSIONS.length;
    $('missionText').textContent = MISSIONS[step].text;
    buildStars($('stars'), step);
    $('taskApps').querySelectorAll('.tapp').forEach(function (t) {
      t.classList.toggle('glow', MISSIONS[step].need === 'task');
    });
  }

  function done(msg) {
    step++;
    if (step >= MISSIONS.length) { finish(); return; }
    say(msg || 'برافو! ⭐', 'good');
    showMission();
  }

  function wrong(msg, el) {
    say(msg, 'bad');
    if (el) {
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
    }
  }

  function iconClick(id, el) {
    clearTimeout(hintTimer);
    document.querySelectorAll('.icon').forEach(function (i) { i.classList.remove('sel'); });
    el.classList.add('sel');
    var now = Date.now();
    var isDouble = lastClick.id === id && now - lastClick.t < 550;
    lastClick = { id: id, t: now };
    var m = MISSIONS[step];

    if (!isDouble) {
      if (m.need === 'open' && !openApp) {
        hintTimer = setTimeout(function () {
          say('ضغطة واحدة بتختار الأيقونة بس. اضغط مرتين بسرعة!', 'bad');
        }, 650);
      }
      return;
    }
    lastClick = { id: null, t: 0 };

    if (openApp) { wrong('خلّص المهمة الأول مع النافذة المفتوحة.', $('win')); return; }
    if (m.need !== 'open') return;
    if (id !== m.app) {
      wrong('دي أيقونة ' + APPS[id].name + '. ' + (m.app === 'music' ? 'دوّر على البرنامج اللي بيشغّل الأغاني!' : 'دوّر على ' + APPS[m.app].name + '!'), el);
      return;
    }
    openWindow(id);
    el.classList.remove('sel');
    done('برافو! نافذة ' + APPS[id].name + ' اتفتحت ⭐');
  }

  function openWindow(id) {
    var a = APPS[id];
    openApp = id; isMax = false; isMin = false;
    $('wName').textContent = a.name;
    $('wIcon').style.background = a.color;
    $('wIcon').innerHTML = a.icon;
    $('wBody').innerHTML = a.body;
    var w = $('win');
    w.classList.remove('max');
    w.hidden = false;
    var t = document.createElement('button');
    t.type = 'button';
    t.className = 'tapp';
    t.setAttribute('aria-label', a.name + ' on the taskbar');
    t.innerHTML = '<span class="pic" style="background:' + a.color + '">' + a.icon + '</span>';
    t.addEventListener('click', taskClick);
    $('taskApps').innerHTML = '';
    $('taskApps').appendChild(t);
  }

  function closeWindow() {
    $('win').hidden = true;
    $('win').classList.remove('max');
    $('taskApps').innerHTML = '';
    openApp = null; isMax = false; isMin = false;
  }

  var NAMES = { min: 'Minimize —', max: 'Maximize ▢', close: 'Close ✕' };

  function winButton(act, btn) {
    var need = MISSIONS[step].need;
    var want = need === 'restore' ? 'max' : need;
    if (act !== want) {
      var hint = { min: 'الشَرطة —', max: 'المربع ▢', close: 'علامة ✕' }[want];
      wrong('ده زرار ' + NAMES[act] + '. دوّر على ' + (hint || 'الزرار الصح') + '.', btn);
      return;
    }
    if (act === 'max') {
      isMax = !isMax;
      $('win').classList.toggle('max', isMax);
      done(isMax ? 'واو! النافذة كبرت ⭐' : 'برافو! النافذة رجعت لحجمها ⭐');
    } else if (act === 'min') {
      isMin = true;
      $('win').hidden = true;
      done('النافذة استخبّت في الـ Taskbar ⭐');
    } else if (act === 'close') {
      closeWindow();
      done('برافو! النافذة اتقفلت ⭐');
    }
  }

  function taskClick(e) {
    if (MISSIONS[step].need !== 'task') {
      wrong('النافذة مفتوحة أصلًا. اقرأ المهمة تاني.', e.currentTarget);
      return;
    }
    isMin = false;
    $('win').hidden = false;
    done('برافو! Paint رجع تاني ⭐');
  }

  function finish() {
    $('game').hidden = true;
    $('success').hidden = false;
    buildStars($('finalStars'), MISSIONS.length);
    window.parent.postMessage(
      { type: 'codez-learning-activity', version: 1, event: 'completed' },
      window.location.origin
    );
  }

  function startGame() {
    step = 0;
    closeWindow();
    buildIcons();
    say('');
    $('start').hidden = true;
    $('success').hidden = true;
    $('game').hidden = false;
    showMission();
  }

  document.querySelectorAll('.wbtn').forEach(function (b) {
    b.addEventListener('click', function () { winButton(b.dataset.act, b); });
  });
  $('startBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', function () {
    // Practice again; the finish was already reported once.
    finish = function () {
      $('game').hidden = true;
      $('success').hidden = false;
      buildStars($('finalStars'), MISSIONS.length);
    };
    startGame();
  });
})();
