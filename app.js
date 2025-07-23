// Hamburger menu drawer logic
function toggleDrawer() {
  const drawer = document.getElementById('drawerMenu');
  const overlay = document.getElementById('drawerOverlay');
  const isOpen = drawer.classList.contains('open');
  if (isOpen) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
// Sidebar menu navigation
function switchFeature(feature) {
  document.querySelectorAll('.feature-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
  const section = document.getElementById('feature-' + feature);
  if (section) section.classList.add('active');
  // Highlight menu button
  const btns = Array.from(document.querySelectorAll('.sidebar button'));
  const idx = [
    'stress','interests','recommend','dnd','quote','tips','activity','breath','gratitude','challenge'
  ].indexOf(feature);
  if (btns[idx]) btns[idx].classList.add('active');
}

// Set default activity based on selected interest
function updateDefaultActivity() {
  const interests = getSelectedInterests();
  const area = document.getElementById('activityContent');
  if (interests.length === 1) {
    if (interests[0] === 'math') {
      startMathActivity();
    } else if (interests[0] === 'history') {
      startHistoryActivity();
    }
  } else {
    area.innerHTML = '';
  }
}
// Breathing exercise
let breathInterval = null;
function startBreathing() {
  const area = document.getElementById('breathContent');
  area.innerHTML = '<div class="breath-anim"></div><div id="breathText">Breathe In</div>';
  let phase = 0;
  clearInterval(breathInterval);
  breathInterval = setInterval(() => {
    phase = (phase + 1) % 4;
    const text = document.getElementById('breathText');
    if (!text) return clearInterval(breathInterval);
    if (phase === 0) text.textContent = 'Breathe In';
    else if (phase === 1) text.textContent = 'Hold';
    else if (phase === 2) text.textContent = 'Breathe Out';
    else if (phase === 3) text.textContent = 'Hold';
  }, 2000);
}

// Gratitude journal
function addGratitude() {
  const input = document.getElementById('gratitudeInput');
  const list = document.getElementById('gratitudeList');
  if (input.value.trim()) {
    const li = document.createElement('li');
    li.textContent = input.value.trim();
    list.appendChild(li);
    input.value = '';
  }
}

// Daily challenge
const challenges = [
  'Smile at yourself in the mirror.',
  'Write down 3 things you are grateful for.',
  'Take a 5-minute walk.',
  'Compliment someone today.',
  'Drink a glass of water mindfully.',
  'Try a new breathing exercise.',
  'Spend 10 minutes reading.',
  'Organize your workspace.',
  'Listen to your favorite song.',
  'Do a random act of kindness.'
];
function newChallenge() {
  document.getElementById('dailyChallenge').textContent = challenges[Math.floor(Math.random()*challenges.length)];
}

// Show a challenge and default feature on home load
const oldShowPage = showPage;
showPage = function(page) {
  oldShowPage(page);
  if (page === 'home') {
    setTimeout(() => {
      if (document.getElementById('dailyChallenge').textContent === '') newChallenge();
      switchFeature('stress');
    }, 100);
  }
};


// Animate page transitions (fix: always show next page, don't hide if already active)
function showPage(page) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => {
    if (p.id === page) {
      p.style.display = 'flex';
      setTimeout(() => p.classList.add('active'), 10);
    } else {
      p.classList.remove('active');
      setTimeout(() => (p.style.display = 'none'), 400);
    }
  });
  // If home page, ensure all dynamic content is filled
  if (page === 'home') {
    setTimeout(() => {
      document.getElementById('motivationQuote').textContent = getRandomQuote();
      updateStressLevel();
      updateActivityRecommendations();
    }, 50);
  }
}


// Allowed accounts
const allowedAccounts = [
  { username: 'user1', password: 'stress1' },
  { username: 'user2', password: 'stress2' },
  { username: 'demo', password: 'demo' }
];

function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('loginError');
  if (errorMsg) errorMsg.remove();
  const found = allowedAccounts.find(acc => acc.username === username && acc.password === password);
  if (!found) {
    const form = document.querySelector('#login form');
    const err = document.createElement('div');
    err.id = 'loginError';
    err.textContent = 'Invalid username or password.';
    err.style.color = '#a0522d';
    err.style.marginTop = '8px';
    err.style.fontWeight = 'bold';
    form.parentNode.insertBefore(err, form.nextSibling);
    return false;
  }
  document.getElementById('userDisplay').textContent = username;
  showPage('home');
  setTimeout(() => {
    document.getElementById('motivationQuote').textContent = getRandomQuote();
    updateStressLevel();
    updateActivityRecommendations();
  }, 400);
  return false;
}

// Password show/hide
function togglePassword() {
  const pw = document.getElementById('password');
  pw.type = pw.type === 'password' ? 'text' : 'password';
}


// Stress level selector and emoji
function updateStressLevel() {
  const level = document.getElementById('stressLevel').value;
  const emoji = {
    Low: '😌',
    Moderate: '😐',
    High: '😣'
  };
  document.getElementById('stressEmoji').textContent = emoji[level] || '😐';
  updateActivityRecommendations();
}

// Activity recommendations based on stress level and interests
const baseRecommendations = {
  Low: [
    'Maintain your routine',
    'Enjoy a hobby',
    'Connect with a friend',
    'Take a mindful walk',
    'Reflect on your achievements'
  ],
  Moderate: [
    'Try a 5-minute breathing exercise',
    'Write down your thoughts',
    'Listen to calming music',
    'Take a short break from screens',
    'Drink a glass of water'
  ],
  High: [
    'Pause and take 10 deep breaths',
    'Go for a brisk walk',
    'Talk to someone you trust',
    'Try a short guided meditation',
    'Limit social media for 1 hour'
  ]
};
const interestRecommendations = {
  math: {
    Low: ['Solve a fun math puzzle'],
    Moderate: ['Try a quick math riddle'],
    High: ['Distract yourself with a simple math game']
  },
  history: {
    Low: ['Read a short historical fact'],
    Moderate: ['Recall a favorite history story'],
    High: ['Watch a calming history video']
  },
  nature: {
    Low: ['Take a walk in nature'],
    Moderate: ['Look at nature photos'],
    High: ['Listen to nature sounds']
  },
  art: {
    Low: ['Sketch something you like'],
    Moderate: ['Color a simple drawing'],
    High: ['Look at calming art online']
  }
};
function getSelectedInterests() {
  return Array.from(document.querySelectorAll('.interests-selector input[type=checkbox]:checked')).map(cb => cb.value);
}
function updateActivityRecommendations() {
  const level = document.getElementById('stressLevel').value;
  const list = document.getElementById('activityList');
  list.innerHTML = '';
  // Base recs
  (baseRecommendations[level] || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  // Interest recs
  const interests = getSelectedInterests();
  interests.forEach(interest => {
    const recs = interestRecommendations[interest] && interestRecommendations[interest][level];
    if (recs) {
      recs.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.style.fontStyle = 'italic';
        list.appendChild(li);
      });
    }
  });
}

// Do Not Disturb toggle
let dndEnabled = false;
function toggleDND() {
  dndEnabled = !dndEnabled;
  const btn = document.getElementById('dndBtn');
  const status = document.getElementById('dndStatus');
  if (dndEnabled) {
    btn.textContent = 'Disable DND';
    btn.classList.add('active');
    status.textContent = 'Notifications are OFF';
    status.style.color = '#7c3f1c';
  } else {
    btn.textContent = 'Enable DND';
    btn.classList.remove('active');
    status.textContent = 'Notifications are ON';
    status.style.color = '#a0522d';
  }
}

// Interactive activities
function startMathActivity() {
  const a = Math.floor(Math.random()*10+1), b = Math.floor(Math.random()*10+1);
  const answer = a + b;
  const area = document.getElementById('activityContent');
  area.innerHTML = `What is <b>${a} + ${b}</b>? <input id='mathAns' type='number' style='width:60px'> <button onclick='checkMathAnswer(${answer})'>Check</button>`;
}
function checkMathAnswer(ans) {
  const val = Number(document.getElementById('mathAns').value);
  const area = document.getElementById('activityContent');
  if (val === ans) {
    area.innerHTML = '<span style="color:green">Correct! 🎉</span>';
  } else {
    area.innerHTML += '<div style="color:#a0522d">Try again!</div>';
  }
}
function startHistoryActivity() {
  const facts = [
    'The Great Wall of China is over 13,000 miles long.',
    'The first Olympic Games were held in 776 BC.',
    'Leonardo da Vinci could write with one hand and draw with the other at the same time.',
    'The world’s oldest known city is Jericho.'
  ];
  const area = document.getElementById('activityContent');
  area.innerHTML = `<b>Did you know?</b> ${facts[Math.floor(Math.random()*facts.length)]}`;
}

// Motivational quotes
const quotes = [
  "You are stronger than you think.",
  "Every day is a fresh start.",
  "Breathe in calm, breathe out stress.",
  "You’ve got this!",
  "Progress, not perfection.",
  "Small steps every day.",
  "Your mind is your superpower.",
  "Rest is productive, too.",
  "Be kind to yourself."
];
function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
function newQuote() {
  document.getElementById('motivationQuote').textContent = getRandomQuote();
}

// On load, show login as default
window.onload = function() {
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
    p.classList.remove('active');
  });
  const login = document.getElementById('login');
  login.style.display = 'flex';
  setTimeout(() => login.classList.add('active'), 10);
};
