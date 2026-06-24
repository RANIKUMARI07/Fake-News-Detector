// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// Animate signal bars on scroll
const signalBars = document.querySelectorAll('.signal-fill');
const signalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target.getAttribute('data-width');
      entry.target.style.width = target;
    }
  });
}, { threshold: 0.3 });
signalBars.forEach(bar => {
  bar.style.width = '0%';
  signalObserver.observe(bar);
});

// Counter animation for hero stats
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(c => {
        animateCounter(c, parseFloat(c.dataset.count), c.dataset.suffix || '');
      });
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .metrics-grid').forEach(el => statsObserver.observe(el));

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('veritasai-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('veritasai-theme', next);
});

// ===== AUTH MODALS =====
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotForm = document.getElementById('forgotForm');

function showAuthForm(form) {
  [loginForm, signupForm, forgotForm].forEach(f => f.style.display = 'none');
  form.style.display = 'block';
  authModal.classList.add('active');
}

document.getElementById('loginBtn').addEventListener('click', () => showAuthForm(loginForm));
document.getElementById('signupBtn').addEventListener('click', () => showAuthForm(signupForm));
document.getElementById('modalClose').addEventListener('click', () => authModal.classList.remove('active'));
authModal.addEventListener('click', e => { if (e.target === authModal) authModal.classList.remove('active'); });
document.getElementById('showForgot').addEventListener('click', e => { e.preventDefault(); showAuthForm(forgotForm); });
document.getElementById('showSignupFromLogin').addEventListener('click', e => { e.preventDefault(); showAuthForm(signupForm); });
document.getElementById('showLoginFromSignup').addEventListener('click', e => { e.preventDefault(); showAuthForm(loginForm); });
document.getElementById('showLoginFromForgot').addEventListener('click', e => { e.preventDefault(); showAuthForm(loginForm); });

// Auth form submit handlers
document.querySelectorAll('.auth-submit').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const form = btn.closest('.auth-form');
    const inputs = form.querySelectorAll('input');
    let valid = true;
    inputs.forEach(inp => { if (!inp.value.trim()) { inp.style.borderColor = '#ef4444'; valid = false; } else { inp.style.borderColor = ''; } });
    if (valid) {
      btn.textContent = '✓ Success!';
      btn.style.opacity = '0.7';
      setTimeout(() => { authModal.classList.remove('active'); btn.textContent = btn.dataset.originalText || btn.textContent; btn.style.opacity = ''; }, 1500);
    }
  });
});
document.querySelectorAll('.auth-submit').forEach(btn => { btn.dataset.originalText = btn.textContent; });

// ===== DETECTOR TABS =====
document.querySelectorAll('.det-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.det-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.det-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    document.getElementById('detResult').style.display = 'none';
  });
});

// ===== FAKE NEWS ANALYSIS =====
function simulateAnalysis(isUrl, inputValue) {
  const loading = document.getElementById('detLoading');
  const result = document.getElementById('detResult');
  result.style.display = 'none';
  loading.style.display = 'block';

  setTimeout(() => {
    loading.style.display = 'none';
    const text = inputValue.toLowerCase();
    // Simple heuristic simulation
    let score, verdict, verdictClass, icon, signals, explanation;
    const fakeIndicators = ['shocking', 'you won\'t believe', 'miracle', 'cure', 'secret', 'banned', 'doctors hate', 'they don\'t want you', 'breaking', 'anonymous source', 'unnamed', 'immortality', 'conspiracy'];
    const fakeCount = fakeIndicators.filter(w => text.includes(w)).length;
    const hasExclamation = (text.match(/!/g) || []).length > 2;
    const allCaps = (text.match(/[A-Z]{4,}/g) || []).length > 1;
    const suspicion = fakeCount * 15 + (hasExclamation ? 10 : 0) + (allCaps ? 10 : 0) + Math.random() * 15;

    if (suspicion > 40 || text.length < 30) {
      score = Math.max(10, Math.min(35, 100 - Math.floor(suspicion)));
      verdict = '⚠️ Likely Fake News'; verdictClass = 'fake';
      explanation = '<strong>AI Analysis:</strong> Multiple credibility red flags detected. The text contains sensationalist language, unverified claims, and/or lacks credible source attribution. We recommend cross-referencing with established news sources.';
    } else if (suspicion > 20) {
      score = Math.max(40, Math.min(65, 100 - Math.floor(suspicion)));
      verdict = '⚡ Potentially Misleading'; verdictClass = 'misleading';
      explanation = '<strong>AI Analysis:</strong> Some claims could not be fully verified. The article contains partially accurate information mixed with unsubstantiated assertions. Exercise caution and verify key claims.';
    } else {
      score = Math.max(70, Math.min(95, 100 - Math.floor(suspicion)));
      verdict = '✅ Likely Real News'; verdictClass = 'real';
      explanation = '<strong>AI Analysis:</strong> The text exhibits characteristics consistent with credible reporting — neutral tone, specific attribution, and verifiable claims. Confidence is moderate to high.';
    }

    signals = [
      { label: 'Source Reputation', value: Math.min(95, score + Math.floor(Math.random() * 10 - 5)), color: '#8b5cf6' },
      { label: 'Linguistic Analysis', value: Math.min(95, score + Math.floor(Math.random() * 15 - 7)), color: '#4f8fff' },
      { label: 'Claim Verification', value: Math.min(95, score + Math.floor(Math.random() * 10 - 5)), color: '#06d6a0' },
      { label: 'Sentiment Bias', value: Math.min(95, 100 - score + Math.floor(Math.random() * 20)), color: '#ec4899' }
    ];

    // Render result
    const verdictEl = document.getElementById('detVerdict');
    verdictEl.className = 'det-verdict ' + verdictClass;
    verdictEl.textContent = verdict;

    // Score circle
    const circumference = 2 * Math.PI * 28;
    const offset = circumference - (score / 100) * circumference;
    const scoreColor = score > 65 ? '#06d6a0' : score > 40 ? '#f59e0b' : '#ef4444';
    document.getElementById('detScore').innerHTML = `<svg viewBox="0 0 64 64"><circle class="bg" cx="32" cy="32" r="28"/><circle class="fill" cx="32" cy="32" r="28" stroke="${scoreColor}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/></svg><div class="score-text" style="color:${scoreColor}">${score}</div>`;

    // Source info for URL analysis
    const sourceInfo = document.getElementById('detSourceInfo');
    if (isUrl) {
      try {
        const url = new URL(inputValue);
        sourceInfo.style.display = 'block';
        sourceInfo.innerHTML = `<h4>🔗 Source Information</h4><p><strong>Domain:</strong> ${url.hostname}</p><p><strong>Protocol:</strong> ${url.protocol.replace(':', '').toUpperCase()}</p><p><strong>Path:</strong> ${url.pathname}</p><p><strong>Domain Age:</strong> ${Math.floor(Math.random() * 15) + 1} years</p><p><strong>HTTPS:</strong> ${url.protocol === 'https:' ? '✅ Secure' : '⚠️ Not Secure'}</p>`;
      } catch (e) {
        sourceInfo.style.display = 'block';
        sourceInfo.innerHTML = `<h4>🔗 Source Information</h4><p>⚠️ Could not parse URL. Please enter a valid URL.</p>`;
      }
    } else {
      sourceInfo.style.display = 'none';
    }

    // Signals
    document.getElementById('detSignals').innerHTML = signals.map(s =>
      `<div class="det-signal-item"><div class="sig-label">${s.label}</div><div class="sig-bar"><div class="sig-fill" style="width:${s.value}%;background:${s.color}"></div></div></div>`
    ).join('');

    document.getElementById('detExplanation').innerHTML = explanation;
    result.style.display = 'block';
  }, 1800);
}

document.getElementById('analyzeTextBtn').addEventListener('click', () => {
  const val = document.getElementById('newsInput').value.trim();
  if (!val) { document.getElementById('newsInput').style.borderColor = '#ef4444'; return; }
  document.getElementById('newsInput').style.borderColor = '';
  simulateAnalysis(false, val);
});

document.getElementById('analyzeUrlBtn').addEventListener('click', () => {
  const val = document.getElementById('newsUrl').value.trim();
  if (!val) { document.getElementById('newsUrl').parentElement.style.borderColor = '#ef4444'; return; }
  document.getElementById('newsUrl').parentElement.style.borderColor = '';
  simulateAnalysis(true, val);
});

// ===== CONTACT FORM =====
const starRating = document.getElementById('starRating');
let selectedRating = 0;
starRating.querySelectorAll('span').forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.star);
    starRating.querySelectorAll('span').forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.star) <= selectedRating);
    });
  });
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.star);
    starRating.querySelectorAll('span').forEach(s => {
      s.style.color = parseInt(s.dataset.star) <= val ? 'var(--accent-orange)' : '';
    });
  });
  star.addEventListener('mouseleave', () => {
    starRating.querySelectorAll('span').forEach(s => {
      s.style.color = s.classList.contains('active') ? 'var(--accent-orange)' : '';
    });
  });
});

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('contactSuccess').style.display = 'block';
  document.getElementById('contactSuccess').style.animation = 'fadeInUp 0.5s ease';
});
