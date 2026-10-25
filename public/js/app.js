// SWEVENS Client Application Logic - Coquette Edition 🎀
// Full Features: Dual Theme (Light/Night), My Account Member Dashboard, Saldo Wallet & Cash In,
// Loyalty Points Redemption, Affiliate Leaderboard, Saved Game Profiles, and Instant Checkout.

const AppState = {
  currentView: 'home',
  theme: 'light', // Coquette Light Mode by default
  accountSubTab: 'overview',
  leaderboardTab: 'monthly',
  activeCategory: 'all',
  searchQuery: '',
  activeGame: null,
  selectedItem: null,
  selectedPayment: null,
  accountData: {},
  appliedVoucher: null,
  userEmail: '',
  currentUser: null,
  orders: [],
  verifiedNick: null,
  isCheckingNick: false,
  spotlightHero: 'obsidia'
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  console.log(
    '%c🎀 SWEVENS.PH — COQUETTE GAME CREDITS PORTAL 🎀\n' +
    '%c♡ Developed & Owned by Cha (@itsme_cha)\n' +
    '%c✨ Watermark ID: CHA-SWEVENS-PH-2026 | All Rights Reserved',
    'color: #ff4785; font-size: 15px; font-weight: 900; text-shadow: 0 2px 8px rgba(255,71,133,0.3); font-family: sans-serif;',
    'color: #ff75a0; font-size: 12px; font-weight: bold; font-family: sans-serif;',
    'color: #9c6081; font-size: 10px; font-family: monospace;'
  );
  initTheme();
  loadSavedState();
  initRouting();
  renderNavigation();
  renderView(AppState.currentView);
  setupGlobalEvents();
  renderTicker();
  initCoquetteLiveElements();
});

// ----------------- THEME SWITCHER (COQUETTE LIGHT / NIGHT) -----------------
function initTheme() {
  const savedTheme = localStorage.getItem('swevens_theme') || 'light';
  setTheme(savedTheme);
}

function setTheme(theme) {
  AppState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('swevens_theme', theme);
  renderThemeToggle();
}

function toggleTheme() {
  const nextTheme = AppState.theme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
  showToast(nextTheme === 'light' ? '🎀 Switched to Coquette Day Mode ♡' : '🌙 Switched to Velvet Night Mode ✨', 'info');
  renderNavigation();
}

function renderThemeToggle() {
  const el = document.getElementById('theme-toggle-container');
  if (!el) return;

  const isLight = AppState.theme === 'light';
  el.innerHTML = `
    <button onclick="toggleTheme()" class="theme-toggle-btn flex items-center space-x-1.5" title="Toggle Coquette Theme">
      <span>${isLight ? '🎀' : '🌙'}</span>
      <span class="text-xs font-bold">${isLight ? 'Coquette Day' : 'Velvet Night'}</span>
    </button>
  `;
}

// ----------------- SAVED STATE & ROUTING -----------------
function loadSavedState() {
  try {
    const savedOrders = localStorage.getItem('swevens_orders') || localStorage.getItem('nexone_orders');
    if (savedOrders) {
      AppState.orders = JSON.parse(savedOrders);
    } else {
      AppState.orders = [
        {
          id: 'SW-892410',
          gameId: 'mobile-legends-ph',
          gameTitle: 'Mobile Legends: Bang Bang',
          itemName: 'Weekly Diamond Pass 🎀',
          amount: 102.00,
          paymentMethod: 'SWEVENS Wallet Saldo',
          accountId: '12345678 (1004)',
          nickname: 'CoquetteAngel_PH 🎀',
          email: 'clara.gamer@swevens.ph',
          status: 'Completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
          txHash: '0x94fa...81c2'
        },
        {
          id: 'SW-671920',
          gameId: 'valorant',
          gameTitle: 'Valorant',
          itemName: '1,375 VP 🎀',
          amount: 535.00,
          paymentMethod: 'GCash',
          accountId: 'TenZ#PH1',
          nickname: 'TenZ#PH1',
          email: 'clara.gamer@swevens.ph',
          status: 'Completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          txHash: '0x32ba...54e1'
        }
      ];
      localStorage.setItem('swevens_orders', JSON.stringify(AppState.orders));
    }

    const savedUser = localStorage.getItem('swevens_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.username === 'itsme_cha' || (parsed.name && parsed.name.includes('Cha'))) {
          AppState.currentUser = parsed;
        } else {
          AppState.currentUser = JSON.parse(JSON.stringify(SWEVENS_DATA.defaultMemberAccount));
          localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
        }
      } catch (err) {
        AppState.currentUser = JSON.parse(JSON.stringify(SWEVENS_DATA.defaultMemberAccount));
        localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
      }
    } else {
      // Seed default active member account so user can test "My Account" immediately!
      AppState.currentUser = JSON.parse(JSON.stringify(SWEVENS_DATA.defaultMemberAccount));
      localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
    }
  } catch (e) {
    console.error('Storage error', e);
  }
}

function initRouting() {
  window.addEventListener('popstate', (e) => {
    const state = e.state;
    if (state && state.view) {
      if (state.view === 'game' && state.gameId) {
        openGamePage(state.gameId, false);
      } else {
        renderView(state.view, false);
      }
    } else {
      renderView('home', false);
    }
  });

  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('game/')) {
    const gameId = hash.replace('game/', '');
    openGamePage(gameId, false);
  } else if (['home', 'order-tracker', 'server-checker', 'price-list', 'affiliate', 'leaderboard', 'account'].includes(hash)) {
    renderView(hash, false);
  }
}

function navigateTo(view, pushState = true) {
  renderView(view, pushState);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openOrNavigateAccount() {
  if (AppState.currentUser) {
    navigateTo('account');
  } else {
    openAuthModal('login');
  }
}

function openAccountSubtab(subTab = 'overview') {
  AppState.accountSubTab = subTab;
  if (!AppState.currentUser) {
    AppState.currentUser = JSON.parse(JSON.stringify(SWEVENS_DATA.defaultMemberAccount));
    try { localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser)); } catch (e) {}
    renderNavigation();
  }
  navigateTo('account');
}

function renderView(viewName, pushState = true) {
  AppState.currentView = viewName;
  if (pushState) {
    window.history.pushState({ view: viewName }, '', `#${viewName}`);
  }

  // Update nav link active states
  document.querySelectorAll('[data-nav]').forEach(el => {
    if (el.dataset.nav === viewName) {
      el.classList.add('text-[var(--accent-pink)]', 'font-bold');
      el.classList.remove('text-[var(--text-muted)]');
    } else {
      el.classList.remove('text-[var(--accent-pink)]', 'font-bold');
      el.classList.add('text-[var(--text-muted)]');
    }
  });

  const mainContainer = document.getElementById('main-content');
  if (!mainContainer) return;

  switch (viewName) {
    case 'home':
      mainContainer.innerHTML = renderHomeView();
      initHomeViewEvents();
      break;
    case 'account':
      mainContainer.innerHTML = renderAccountView();
      initAccountEvents();
      break;
    case 'leaderboard':
      mainContainer.innerHTML = renderLeaderboardView();
      initLeaderboardEvents();
      break;
    case 'order-tracker':
      mainContainer.innerHTML = renderOrderTrackerView();
      initOrderTrackerEvents();
      break;
    case 'server-checker':
      mainContainer.innerHTML = renderServerCheckerView();
      initServerCheckerEvents();
      break;
    case 'price-list':
      mainContainer.innerHTML = renderPriceListView();
      initPriceListEvents();
      break;
    case 'affiliate':
      mainContainer.innerHTML = renderAffiliateView();
      initAffiliateEvents();
      break;
    default:
      mainContainer.innerHTML = renderHomeView();
      initHomeViewEvents();
  }

  lucide.createIcons();
}

function openGamePage(gameId, pushState = true) {
  const game = SWEVENS_DATA.games.find(g => g.id === gameId);
  if (!game) {
    navigateTo('home');
    return;
  }

  const isSwitchingServer = AppState.activeGame && (
    (AppState.activeGame.id.startsWith('mlbb') && game.id.startsWith('mlbb')) ||
    (AppState.activeGame.id.startsWith('mobile-legends') && game.id.startsWith('mlbb')) ||
    (AppState.activeGame.id.startsWith('mlbb') && game.id.startsWith('mobile-legends'))
  );

  AppState.activeGame = game;
  AppState.currentView = 'game';

  // Preserve existing selected item if it belongs to this game
  const hasCurrentItem = AppState.selectedItem && game.itemSections.some(sec => sec.items.some(i => i.id === AppState.selectedItem.id));
  if (!hasCurrentItem) {
    AppState.selectedItem = game.itemSections[0]?.items[0] || null;
  }

  if (!AppState.selectedPayment) {
    AppState.selectedPayment = (AppState.currentUser && AppState.currentUser.walletBalance >= (AppState.selectedItem ? AppState.selectedItem.price : 0)) 
      ? SWEVENS_DATA.paymentMethods[0] 
      : SWEVENS_DATA.paymentMethods[1];
  }
  AppState.appliedVoucher = null;

  if (!isSwitchingServer) {
    AppState.accountData = {};
    AppState.verifiedNick = null;
    AppState.serverMismatch = false;
  }

  if (pushState) {
    window.history.pushState({ view: 'game', gameId }, '', `#game/${gameId}`);
  }

  const mainContainer = document.getElementById('main-content');
  mainContainer.innerHTML = renderGameView(game);
  initGameViewEvents(game);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  lucide.createIcons();
}

// Global Navbars
function renderNavigation() {
  renderThemeToggle();
  const authSection = document.getElementById('nav-auth-section');
  if (authSection) {
    if (AppState.currentUser) {
      authSection.innerHTML = `
        <div class="flex items-center space-x-2">
          <!-- Wallet Balance Pill with Cash In (+) -->
          <button onclick="openDepositModal()" class="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-pink)] text-xs font-bold text-[var(--accent-pink)] shadow-sm transition" title="Active Saldo - Click to Cash In">
            <span>👛 ₱${(AppState.currentUser.walletBalance || 0).toFixed(2)}</span>
            <span class="w-4 h-4 rounded-full bg-[var(--accent-pink)] text-white flex items-center justify-center text-[10px] font-black">+</span>
          </button>

          <!-- My Account Nav Pill -->
          <button onclick="navigateTo('account')" class="flex items-center space-x-1.5 px-3 py-1 rounded-full coquette-badge text-xs font-semibold hover:border-[var(--accent-pink)] transition shadow-sm">
            <span>🎀</span>
            <span class="max-w-[100px] truncate">${AppState.currentUser.name}</span>
          </button>
          
          <button onclick="logoutUser()" class="text-xs text-rose-500 hover:underline font-medium">Log out</button>
        </div>
      `;
    } else {
      authSection.innerHTML = `
        <div class="flex items-center space-x-2">
          <button onclick="openAuthModal('login')" class="px-3.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent-pink)] transition">Log In</button>
          <button onclick="openAuthModal('register')" class="px-4 py-1.5 text-xs font-bold rounded-xl btn-pink">Register 🎀</button>
        </div>
      `;
    }
  }
}

// ----------------- SPOTLIGHT HEROES & ASPIRANTS 5.0 LIVE DATA -----------------
const SPOTLIGHT_HEROES = {
  obsidia: {
    name: 'Obsidia Imperatrix Arashi',
    title: 'Obsidia - The Aspirants 5.0',
    icon: '⚔️',
    badge: 'ASPIRANTS 5.0 LIVE ⚡',
    image: '/images/characters/aspirants-obsidia.jpg',
    packageName: 'Aspirants Draw Pass Bundle',
    packageSub: 'Weekly Pass + 570 Diamonds for 10x Draw',
    discount: '-25% OFF 🎀',
    srp: '₱670.00',
    price: '₱474.00',
    savings: 'Save ₱196.00 (Guaranteed Draw Token ⚡)',
    actionText: 'Draw Obsidia Imperatrix Arashi ⚔️'
  },
  selena: {
    name: 'Selena Silverbolt Raiko',
    title: 'Selena - The Aspirants 5.0',
    icon: '⚡',
    badge: 'CYBER MECHA LIVE 🎀',
    image: '/images/characters/aspirants-selena.jpg',
    packageName: 'Weekly Diamond Pass (Phase 1)',
    packageSub: '210 Diamonds + Aspirants Recharge Task',
    discount: '-21% OFF 🎀',
    srp: '₱130.00',
    price: '₱102.00',
    savings: 'Save ₱28.00 (Instant Task Completion 🌸)',
    actionText: 'Draw Selena Silverbolt Raiko ⚡'
  },
  kagura: {
    name: 'Kagura Cherry Witch',
    title: 'Kagura Cherry Witch',
    icon: '🌸',
    badge: 'COQUETTE FLASH DEAL 🎀',
    image: '/images/characters/mlbb-kagura.jpg',
    packageName: 'Weekly Diamond Pass',
    packageSub: 'Mobile Legends: Bang Bang',
    discount: '-21% OFF 🎀',
    srp: '₱130.00',
    price: '₱102.00',
    savings: 'Save ₱28.00 (Verified Moonton ⚡)',
    actionText: 'Claim Deal & Top Up Kagura 🎀'
  }
};

function getSpotlightHeroData() {
  const key = AppState.spotlightHero || 'obsidia';
  return SPOTLIGHT_HEROES[key] || SPOTLIGHT_HEROES.obsidia;
}

function switchSpotlightHero(heroKey) {
  if (!SPOTLIGHT_HEROES[heroKey]) return;
  AppState.spotlightHero = heroKey;

  const data = SPOTLIGHT_HEROES[heroKey];

  ['obsidia', 'selena', 'kagura'].forEach(k => {
    const tab = document.getElementById(`tab-hero-${k}`);
    if (tab) {
      if (k === heroKey) {
        tab.className = 'px-2.5 py-1 rounded-xl text-[10px] font-black transition bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm';
      } else {
        tab.className = 'px-2.5 py-1 rounded-xl text-[10px] font-black transition text-pink-200/70 hover:text-white bg-white/5';
      }
    }
  });

  const img = document.getElementById('spotlight-hero-img');
  if (img) {
    img.src = data.image;
    img.alt = data.title;
  }
  const badge = document.getElementById('spotlight-hero-badge');
  if (badge) badge.textContent = data.badge;

  const icon = document.getElementById('spotlight-hero-icon');
  if (icon) icon.textContent = data.icon;

  const name = document.getElementById('spotlight-hero-name');
  if (name) name.textContent = data.name;

  const pkgName = document.getElementById('spotlight-package-name');
  if (pkgName) pkgName.textContent = data.packageName;

  const pkgSub = document.getElementById('spotlight-package-sub');
  if (pkgSub) pkgSub.textContent = data.packageSub;

  const disc = document.getElementById('spotlight-discount-badge');
  if (disc) disc.textContent = data.discount;

  const srp = document.getElementById('spotlight-srp');
  if (srp) srp.textContent = data.srp;

  const price = document.getElementById('spotlight-price');
  if (price) price.textContent = data.price;

  const savings = document.getElementById('spotlight-savings');
  if (savings) savings.textContent = data.savings;

  const btn = document.getElementById('spotlight-action-btn');
  if (btn) btn.textContent = data.actionText;
}

function setAspirantsLiveBg(bgKey) {
  const bgEl = document.querySelector('.aspirants-live-bg');
  if (!bgEl) return;

  const map = {
    duo: '/images/characters/aspirants-duo.jpg',
    obsidia: '/images/characters/aspirants-obsidia.jpg',
    selena: '/images/characters/aspirants-selena.jpg'
  };

  const url = map[bgKey] || map.duo;
  bgEl.style.backgroundImage = `url('${url}')`;

  ['duo', 'obsidia', 'selena'].forEach(k => {
    const btn = document.getElementById(`bg-btn-${k}`);
    if (btn) {
      if (k === bgKey) {
        btn.className = 'px-2.5 py-1 rounded-xl text-[10px] font-black transition bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow';
      } else {
        btn.className = 'px-2.5 py-1 rounded-xl text-[10px] font-black transition text-pink-200/80 hover:text-white hover:bg-white/10';
      }
    }
  });

  const names = { duo: 'Obsidia & Selena (Duo)', obsidia: 'Obsidia (Imperatrix Arashi)', selena: 'Selena (Silverbolt Raiko)' };
  showToast(`Live BG: ${names[bgKey]} 🎀`, 'info');
}

// ----------------- HOME VIEW -----------------
function renderHomeView() {
  const heroData = getSpotlightHeroData();

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      <!-- COQUETTE LIVE ASPIRANTS 5.0 HERO BANNER (OBSIDIA & SELENA) 🎀⚡ -->
      <div class="aspirants-hero-container relative p-6 sm:p-10 transition-all duration-700">
        <!-- Live Animated Background: 100% Clear, No Heavy Overlays, Characters 100% Visible -->
        <div class="aspirants-live-bg"></div>
        <div class="aspirants-vignette"></div>

        <!-- Live Character Background Quick Switcher -->
        <div class="absolute top-4 right-4 z-20 flex items-center space-x-1.5 p-1 rounded-2xl bg-black/60 backdrop-blur-md border border-pink-400/50 shadow-lg">
          <span class="text-[10px] font-black text-pink-200 uppercase px-2 flex items-center space-x-1">
            <span>🌸</span>
            <span class="hidden sm:inline">Live BG:</span>
          </span>
          <button type="button" onclick="setAspirantsLiveBg('duo')" id="bg-btn-duo" class="px-2.5 py-1 rounded-xl text-[10px] font-black transition bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow">
            👥 Duo
          </button>
          <button type="button" onclick="setAspirantsLiveBg('obsidia')" id="bg-btn-obsidia" class="px-2.5 py-1 rounded-xl text-[10px] font-black transition text-pink-200/80 hover:text-white hover:bg-white/10">
            ⚔️ Obsidia
          </button>
          <button type="button" onclick="setAspirantsLiveBg('selena')" id="bg-btn-selena" class="px-2.5 py-1 rounded-xl text-[10px] font-black transition text-pink-200/80 hover:text-white hover:bg-white/10">
            ⚡ Selena
          </button>
        </div>

        <!-- Floating Particles Layer -->
        <div class="aspirants-sparks pointer-events-none">
          <div class="aspirants-spark" style="width: 8px; height: 8px; left: 12%; animation-duration: 7s; animation-delay: 0s;"></div>
          <div class="aspirants-spark" style="width: 12px; height: 12px; left: 28%; animation-duration: 9s; animation-delay: 1.5s;"></div>
          <div class="aspirants-spark" style="width: 6px; height: 6px; left: 45%; animation-duration: 6s; animation-delay: 3s;"></div>
          <div class="aspirants-spark" style="width: 10px; height: 10px; left: 62%; animation-duration: 8.5s; animation-delay: 0.8s;"></div>
          <div class="aspirants-spark" style="width: 14px; height: 14px; left: 78%; animation-duration: 10s; animation-delay: 2.2s;"></div>
          <div class="aspirants-spark" style="width: 8px; height: 8px; left: 90%; animation-duration: 7.5s; animation-delay: 4s;"></div>
        </div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 sm:pt-4">
          <div class="lg:col-span-7 bg-black/55 dark:bg-black/65 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-pink-400/30 shadow-2xl space-y-5">
            
            <!-- Live Aspirants Event Pill -->
            <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-pink-400/60 shadow-lg text-xs font-black uppercase tracking-wider text-pink-200 animate-pulse">
              <span class="coquette-bow">⚡</span>
              <span>THE ASPIRANTS 5.0 EVENT • OBSIDIA & SELENA 🎀</span>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Sweet Top-Ups. <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-300 drop-shadow-[0_2px_10px_rgba(255,71,133,0.8)]">Delivered With Love ♡</span>
            </h1>

            <p class="text-sm sm:text-base max-w-xl text-pink-100/90 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed">
              Top up Mobile Legends Diamonds for the brand new <strong class="text-pink-300 underline font-black">Aspirants 5.0</strong> skins: <strong>Obsidia "Imperatrix Arashi"</strong> & <strong>Selena "Silverbolt Raiko"</strong>! Instant 10-30s automated reload with love! 🎀✨
            </p>

            <!-- Quick Action Buttons -->
            <div class="flex flex-wrap gap-3 pt-2">
              <button onclick="openGamePage('mobile-legends-ph')" class="btn-pink px-6 py-3.5 rounded-2xl font-black text-sm flex items-center space-x-2 shadow-2xl shadow-pink-500/40 hover:scale-105 transition">
                <span>🎀</span>
                <span>Top Up Aspirants Diamonds</span>
              </button>
              <button onclick="openOrNavigateAccount()" class="px-5 py-3.5 rounded-2xl border border-pink-300/40 bg-black/50 backdrop-blur-md hover:border-pink-400 text-white font-bold text-sm transition flex items-center space-x-2 shadow-lg">
                <span>🎀</span>
                <span>My Account Dashboard</span>
              </button>
            </div>
            
            <!-- Aspirants Live Trust Badges -->
            <div class="pt-4 grid grid-cols-3 gap-3 border-t border-white/20 text-xs text-pink-200/90 font-medium">
              <div class="flex items-center space-x-1.5">
                <i data-lucide="shield-check" class="w-4 h-4 text-pink-400"></i>
                <span>100% Moonton Authorized</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <i data-lucide="zap" class="w-4 h-4 text-amber-300"></i>
                <span>10-30s Instant Reload</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <i data-lucide="sparkles" class="w-4 h-4 text-pink-400"></i>
                <span>Guaranteed Aspirants Tokens</span>
              </div>
            </div>
          </div>
          
          <!-- Banner Graphic Card - Character Spotlight 🎀 -->
          <div class="lg:col-span-5 hidden lg:flex justify-center relative">
            <div class="w-full max-w-sm rounded-3xl overflow-hidden bg-black/75 backdrop-blur-xl border-2 border-pink-400/60 shadow-2xl shadow-pink-500/30 relative group">
              
              <!-- Character Selector Tabs (Obsidia / Selena / Kagura) -->
              <div class="p-2.5 bg-black/60 border-b border-pink-400/30 flex items-center justify-between text-xs">
                <span class="text-[10px] font-black uppercase text-pink-300 tracking-wider flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Aspirants Spotlight</span>
                </span>
                <div class="flex items-center space-x-1">
                  <button type="button" onclick="switchSpotlightHero('obsidia')" id="tab-hero-obsidia" class="px-2.5 py-1 rounded-xl text-[10px] font-black transition ${AppState.spotlightHero === 'obsidia' || !AppState.spotlightHero ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm' : 'text-pink-200/70 hover:text-white bg-white/5'}">
                    ⚔️ Obsidia
                  </button>
                  <button type="button" onclick="switchSpotlightHero('selena')" id="tab-hero-selena" class="px-2.5 py-1 rounded-xl text-[10px] font-black transition ${AppState.spotlightHero === 'selena' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm' : 'text-pink-200/70 hover:text-white bg-white/5'}">
                    ⚡ Selena
                  </button>
                  <button type="button" onclick="switchSpotlightHero('kagura')" id="tab-hero-kagura" class="px-2.5 py-1 rounded-xl text-[10px] font-black transition ${AppState.spotlightHero === 'kagura' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm' : 'text-pink-200/70 hover:text-white bg-white/5'}">
                    🌸 Kagura
                  </button>
                </div>
              </div>

              <!-- Character Artwork Cover with dynamic image based on switchSpotlightHero -->
              <div class="relative h-48 overflow-hidden bg-pink-950/40" id="spotlight-image-container">
                <img 
                  id="spotlight-hero-img"
                  src="${heroData.image}" 
                  alt="${heroData.title}" 
                  class="w-full h-full object-cover object-top group-hover:scale-108 transition duration-700"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none"></div>
                
                <!-- Badge top-right -->
                <div class="absolute top-3 right-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg pulse-badge flex items-center space-x-1 border border-white/30">
                  <span>🎀</span>
                  <span id="spotlight-hero-badge">${heroData.badge}</span>
                </div>
                
                <!-- Character Badge top-left -->
                <div class="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-pink-400/60 text-pink-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
                  <span id="spotlight-hero-icon">${heroData.icon}</span>
                  <span id="spotlight-hero-name">${heroData.name}</span>
                </div>
              </div>

              <!-- Deal Details -->
              <div class="p-5 pt-3 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 id="spotlight-package-name" class="font-black text-base text-white">${heroData.packageName}</h4>
                    <p id="spotlight-package-sub" class="text-xs text-pink-300 font-bold">${heroData.packageSub}</p>
                  </div>
                  <span id="spotlight-discount-badge" class="text-[10px] font-black px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40">
                    ${heroData.discount}
                  </span>
                </div>

                <div class="space-y-1.5 py-2.5 border-y border-pink-400/20 text-xs">
                  <div class="flex justify-between text-pink-200/60">
                    <span>Moonton SRP:</span>
                    <span id="spotlight-srp" class="line-through">${heroData.srp}</span>
                  </div>
                  <div class="flex justify-between items-center font-bold">
                    <span class="text-pink-100">SWEVENS Member Rate:</span>
                    <span id="spotlight-price" class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">${heroData.price}</span>
                  </div>
                  <div class="flex justify-between text-emerald-400 font-semibold text-[11px]">
                    <span>Instant Savings:</span>
                    <span id="spotlight-savings">${heroData.savings}</span>
                  </div>
                </div>

                <button 
                  onclick="openGamePage('mobile-legends-ph')" 
                  id="spotlight-action-btn"
                  class="w-full py-2.5 rounded-2xl btn-pink text-xs font-black text-center block shadow-lg shadow-pink-500/30 hover:scale-[1.02] transition"
                >
                  ${heroData.actionText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LIVE RECENT SALES TICKER -->
      <div class="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3 flex items-center space-x-3 overflow-hidden shadow-sm">
        <div class="flex items-center space-x-1.5 px-3 py-1 rounded-full coquette-badge text-xs font-bold shrink-0">
          <span class="coquette-bow">🎀</span>
          <span>SWEVENS LIVE</span>
        </div>
        <div class="ticker-wrap flex-1 text-xs text-[var(--text-muted)]">
          <div id="live-sales-ticker" class="ticker-move space-x-8">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>

      <!-- BROWSE BY CATEGORY - PINK COQUETTE PICTURE CARDS 🎀🌸 -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-400 to-pink-500 text-white flex items-center justify-center text-base shadow-md shadow-pink-400/30">
              🎀
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-black text-[var(--text-main)] flex items-center space-x-2">
                <span>Coquette Category Collections</span>
                <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-300 border border-pink-300/60">Pastel Pink 🌸</span>
              </h2>
              <p class="text-xs text-[var(--text-muted)]">Select a pink collection to quickly filter sweet top-up items ♡</p>
            </div>
          </div>
          <div class="hidden sm:flex items-center space-x-2 text-xs font-semibold text-[var(--accent-pink)]">
            <span class="coquette-bow">✨</span>
            <span>10-30s Automated Delivery</span>
          </div>
        </div>

        <!-- 6 Picture Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          ${renderPinkCategoryCards()}
        </div>
      </div>

      <!-- SCALLOPED LACE RIBBON DIVIDER -->
      <div class="coquette-lace-divider">
        <span class="coquette-lace-bow">🎀</span>
      </div>

      <!-- SEARCH & CATEGORY FILTER -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <!-- Search input -->
          <div class="relative flex-1 max-w-md">
            <i data-lucide="search" class="w-4 h-4 text-[var(--text-dim)] absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="game-search-input" 
              placeholder="Search 50+ games, diamonds, vouchers 🎀..." 
              value="${AppState.searchQuery}"
              class="theme-input w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm transition"
            />
          </div>

          <!-- Feature Quick Shortcuts -->
          <div class="flex items-center space-x-2 text-xs">
            <button onclick="navigateTo('leaderboard')" class="px-3.5 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-pink)] text-[var(--text-muted)] hover:text-[var(--accent-pink)] transition flex items-center space-x-1.5 font-medium shadow-sm">
              <i data-lucide="trophy" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>Leaderboard 🏆</span>
            </button>
            <button onclick="navigateTo('server-checker')" class="px-3.5 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-pink)] text-[var(--text-muted)] hover:text-[var(--accent-pink)] transition flex items-center space-x-1.5 font-medium shadow-sm">
              <span>🎀</span>
              <span>Server Checker</span>
            </button>
            <button onclick="navigateTo('price-list')" class="px-3.5 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-pink)] text-[var(--text-muted)] hover:text-[var(--accent-pink)] transition flex items-center space-x-1.5 font-medium shadow-sm">
              <i data-lucide="list" class="w-3.5 h-3.5 text-[var(--accent-pink)]"></i>
              <span>Price List</span>
            </button>
          </div>
        </div>

        <!-- Category Pills -->
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button 
            onclick="filterCategory('all')"
            class="category-pill px-4 py-2 rounded-2xl text-xs font-semibold flex items-center space-x-2 border ${AppState.activeCategory === 'all' ? 'active' : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--accent-pink)]'}"
          >
            <span>🎀</span>
            <span>All Games 🌸</span>
          </button>
          ${SWEVENS_DATA.categories.map(cat => `
            <button 
              onclick="filterCategory('${cat.id}')"
              class="category-pill px-4 py-2 rounded-2xl text-xs font-semibold flex items-center space-x-2 border ${AppState.activeCategory === cat.id ? 'active' : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--accent-pink)]'}"
            >
              <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
              <span>${cat.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- GAMES GRID -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-[var(--text-main)] flex items-center space-x-2">
            <span class="coquette-bow">🎀</span>
            <span>Available Products</span>
            <span class="text-xs font-normal text-[var(--text-dim)]">(${getFilteredGames().length} titles)</span>
          </h2>
        </div>

        <div id="games-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          ${renderGameCards()}
        </div>
      </div>

      <!-- REVIEWS & TESTIMONIALS SECTION -->
      <div class="glass-panel p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-2xl font-black text-amber-400 flex items-center">
                5.0 <i data-lucide="star" class="w-5 h-5 fill-amber-400 text-amber-400 ml-1"></i>
              </span>
              <span class="text-xs text-[var(--text-muted)] font-semibold">• 1.1M+ Sweet Filipino Gamers ♡</span>
            </div>
            <h3 class="text-lg font-bold text-[var(--text-main)] mt-1">Real-time Verified Customer Reviews 🎀</h3>
          </div>
          <div class="text-xs text-[var(--text-dim)]">Updated 24/7 with verified purchase receipts</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${SWEVENS_DATA.recentReviews.map(r => `
            <div class="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs font-bold text-[var(--text-main)]">${r.user}</div>
                  <div class="text-[11px] text-[var(--accent-pink)] font-semibold">${r.game}</div>
                </div>
                <div class="flex text-amber-400">
                  ${Array(r.rating).fill('<i data-lucide="star" class="w-3 h-3 fill-amber-400"></i>').join('')}
                </div>
              </div>
              <p class="text-xs text-[var(--text-muted)] italic">"${r.comment}"</p>
              <div class="flex justify-between text-[10px] text-[var(--text-dim)] pt-1 border-t border-[var(--border-color)]">
                <span>Item: ${r.item}</span>
                <span>${r.time}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- WHY CHOOSE SWEVENS BANNER -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="glass-panel p-5 space-y-3">
          <div class="w-10 h-10 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-lg">
            ⚡
          </div>
          <h4 class="text-sm font-bold text-[var(--text-main)]">Instant Automated Top-Up</h4>
          <p class="text-xs text-[var(--text-muted)]">SWEVENS bots process transactions in 10 to 60 seconds directly to your player UID.</p>
        </div>
        <div class="glass-panel p-5 space-y-3">
          <div class="w-10 h-10 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-lg">
            💳
          </div>
          <h4 class="text-sm font-bold text-[var(--text-main)]">All PH Payment Channels</h4>
          <p class="text-xs text-[var(--text-muted)]">Pay seamlessly with QR Ph, GCash, Maya, ShopeePay, GrabPay, BPI, or UnionBank.</p>
        </div>
        <div class="glass-panel p-5 space-y-3">
          <div class="w-10 h-10 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-lg">
            🛡️
          </div>
          <h4 class="text-sm font-bold text-[var(--text-main)]">Official & 100% Safe</h4>
          <p class="text-xs text-[var(--text-muted)]">Direct reload using authorized publisher gateways. Zero risk of account penalties.</p>
        </div>
        <div class="glass-panel p-5 space-y-3">
          <div class="w-10 h-10 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-lg">
            🎀
          </div>
          <h4 class="text-sm font-bold text-[var(--text-main)]">Coquette Partner Program</h4>
          <p class="text-xs text-[var(--text-muted)]">Earn passive income by sharing sweet referral links with your friends and communities.</p>
        </div>
      </div>

    </div>
  `;
}

function renderPinkCategoryCards() {
  return SWEVENS_DATA.categories.map(cat => {
    const isActive = AppState.activeCategory === cat.id;
    return `
      <div 
        onclick="filterCategory('${cat.id}')"
        class="category-card-pink group relative overflow-hidden rounded-3xl cursor-pointer p-4 flex flex-col justify-between min-h-[210px] sm:min-h-[235px] transition-all duration-500 border-2 ${isActive ? 'active border-pink-500 ring-4 ring-pink-500/50 shadow-2xl shadow-pink-500/40 scale-[1.02]' : 'border-pink-300/40 dark:border-pink-800/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-pink-500/30'}"
      >
        <!-- Background: Character Artwork of That Game -->
        <div class="absolute inset-0 z-0 overflow-hidden bg-pink-950/20">
          <img 
            src="${cat.image}" 
            alt="${cat.characterName || cat.name} - ${cat.gameName || cat.name}" 
            class="w-full h-full object-cover object-top group-hover:scale-110 transition duration-700 filter brightness-100 contrast-105"
            loading="eager"
          />
          <!-- Gentle Bottom & Top Vignette (Character artwork is 100% visible and vivid) -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none"></div>
        </div>

        <!-- Top Bar: Character Name Tag -->
        <div class="relative z-10 flex items-center justify-between w-full">
          <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-pink-200 border border-pink-400/50 shadow-md flex items-center space-x-1">
            <span>🌸</span>
            <span class="truncate max-w-[110px]">${cat.characterName || 'Hero'}</span>
          </span>
          ${isActive ? `
            <span class="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-pink-500/50 animate-bounce">
              ✓
            </span>
          ` : `
            <span class="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/20 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">
              🎀
            </span>
          `}
        </div>

        <!-- CENTER (SA GITNA): NAME OF THE GAME PROMINENTLY DISPLAYED -->
        <div class="relative z-10 my-auto py-2 flex flex-col items-center justify-center text-center w-full">
          <div class="w-[94%] px-3 py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-pink-400/60 shadow-2xl shadow-pink-500/40 transform group-hover:scale-105 transition duration-300 text-center">
            <h3 class="font-black text-sm sm:text-base tracking-wider uppercase text-white drop-shadow-[0_2px_8px_rgba(255,71,133,0.9)] leading-tight text-center">
              ${cat.gameName || cat.name}
            </h3>
            <p class="text-[9px] font-bold text-pink-200 mt-0.5 tracking-wide line-clamp-1">${cat.subtitle}</p>
          </div>
        </div>

        <!-- Bottom Bar: Badge & Action -->
        <div class="relative z-10 flex items-center justify-between w-full pt-1">
          <span class="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white shadow-md shadow-pink-500/40 border border-white/30 flex items-center space-x-1">
            <span>✨</span>
            <span>${cat.badge}</span>
          </span>
          <span class="text-[10px] font-bold text-white/95 bg-black/50 px-2 py-0.5 rounded-lg backdrop-blur-sm border border-white/20">
            Top Up ♡
          </span>
        </div>
      </div>
    `;
  }).join('');
}

function getFilteredGames() {
  return SWEVENS_DATA.games.filter(game => {
    let matchesCategory = false;
    if (AppState.activeCategory === 'all') {
      matchesCategory = true;
    } else if (AppState.activeCategory === 'popular') {
      matchesCategory = game.tags.some(t => t.includes('Popular') || t.includes('Best Seller') || t.includes('Hot'));
    } else if (AppState.activeCategory === 'mlbb') {
      matchesCategory = game.category === 'mlbb' || game.id.startsWith('mlbb') || game.id.includes('mobile-legends');
    } else if (AppState.activeCategory === 'valorant') {
      matchesCategory = game.id.includes('valorant');
    } else if (AppState.activeCategory === 'genshin') {
      matchesCategory = game.id.includes('genshin') || game.id.includes('star-rail');
    } else if (AppState.activeCategory === 'roblox') {
      matchesCategory = game.id.includes('roblox');
    } else if (AppState.activeCategory === 'freefire') {
      matchesCategory = game.id.includes('free-fire');
    } else if (AppState.activeCategory === 'codm') {
      matchesCategory = game.id.includes('call-of-duty') || game.category === 'codm';
    } else {
      matchesCategory = game.category === AppState.activeCategory;
    }

    const matchesSearch = !AppState.searchQuery || 
      game.title.toLowerCase().includes(AppState.searchQuery.toLowerCase()) ||
      game.publisher.toLowerCase().includes(AppState.searchQuery.toLowerCase()) ||
      (game.region && game.region.toLowerCase().includes(AppState.searchQuery.toLowerCase())) ||
      (game.characterName && game.characterName.toLowerCase().includes(AppState.searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });
}

function renderGameCards() {
  const games = getFilteredGames();
  if (games.length === 0) {
    return `
      <div class="col-span-full py-12 text-center text-[var(--text-muted)] space-y-2">
        <span class="text-3xl block">🎀</span>
        <p class="text-sm font-semibold">No games found matching your search</p>
        <button onclick="clearSearch()" class="text-xs text-[var(--accent-pink)] hover:underline">Clear search filter</button>
      </div>
    `;
  }

  return games.map(game => `
    <div 
      onclick="openGamePage('${game.id}')"
      class="glass-card rounded-3xl overflow-hidden cursor-pointer group flex flex-col relative border border-[var(--border-color)] hover:border-pink-400 hover:shadow-xl hover:shadow-pink-500/15 transition-all duration-300"
    >
      <div class="relative overflow-hidden aspect-[4/3] bg-pink-900/10 pink-duo-overlay">
        <img 
          src="${game.image}" 
          alt="${game.title} - ${game.characterName || ''}" 
          class="w-full h-full object-cover group-hover:scale-108 transition duration-500"
          loading="eager"
        />
        <!-- Soft Blush/Pink Coquette Tint Gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-pink-500/10 opacity-80 pointer-events-none"></div>
        
        <!-- Top Left Character Tag Badge -->
        <span class="absolute top-2.5 left-2.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-black/70 text-pink-200 border border-pink-400/40 shadow-sm backdrop-blur-md flex items-center space-x-1">
          <span>🎀</span>
          <span>${game.characterName || game.tags[0]}</span>
        </span>

        <!-- Top Right Floating Coquette Bow on Hover -->
        <div class="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-300/40 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300">
          🎀
        </div>

        <!-- Center Server Flag Badge (Per NEXONE screenshot) -->
        ${game.serverFlag ? `
          <div class="absolute inset-x-0 bottom-2.5 flex justify-center z-10 pointer-events-none">
            <div class="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/50 shadow-xl flex items-center space-x-1.5 transform group-hover:scale-110 transition duration-300">
              <span class="text-base leading-none drop-shadow">${game.serverFlag}</span>
              <span class="text-[10px] font-black text-white uppercase tracking-wider">${game.serverName || game.regionCode}</span>
            </div>
          </div>
        ` : ''}

        <!-- Rating -->
        <div class="absolute bottom-2 left-2.5 flex items-center space-x-1 text-[11px] font-bold text-amber-500 bg-[var(--bg-card)]/95 px-2 py-0.5 rounded-lg shadow-sm border border-[var(--border-color)]">
          <i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i>
          <span>${game.rating.toFixed(1)}</span>
          <span class="text-[var(--text-dim)] text-[10px]">(${game.reviewsCount})</span>
        </div>
      </div>

      <div class="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div class="flex items-center justify-between text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider">
            <span>${game.publisher}</span>
            ${game.characterName ? `<span class="text-[9px] font-bold text-[var(--accent-pink)]">🎀 ${game.characterName}</span>` : ''}
          </div>
          <h3 class="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--accent-pink)] transition leading-snug line-clamp-1 mt-0.5">${game.title}</h3>
        </div>

        <div class="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
          <span class="text-[var(--accent-pink)] font-bold group-hover:translate-x-1 transition flex items-center">
            Top Up ♡ <i data-lucide="chevron-right" class="w-3.5 h-3.5 ml-0.5"></i>
          </span>
          <span class="text-[10px] text-[var(--accent-pink)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
            ${game.serverFlag ? game.serverFlag + ' ' : ''}Instant 🎀
          </span>
        </div>
      </div>
    </div>
  `).join('');
}

function initHomeViewEvents() {
  const searchInput = document.getElementById('game-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      const grid = document.getElementById('games-grid');
      if (grid) {
        grid.innerHTML = renderGameCards();
        lucide.createIcons();
      }
    });
  }
}

function filterCategory(catId) {
  AppState.activeCategory = catId;
  const main = document.getElementById('main-content');
  if (AppState.currentView === 'home') {
    renderView('home', false);
  } else {
    navigateTo('home');
  }
}

function clearSearch() {
  AppState.searchQuery = '';
  AppState.activeCategory = 'all';
  renderView('home', false);
}

// ----------------- MY ACCOUNT (MEMBER DASHBOARD) -----------------
function renderAccountView() {
  if (!AppState.currentUser) {
    return `
      <div class="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <span class="text-4xl block">🎀</span>
        <h2 class="text-xl font-bold text-[var(--text-main)]">Sign in to View Your Account</h2>
        <p class="text-xs text-[var(--text-muted)]">Access your wallet saldo, loyalty points, saved profiles, and receipts.</p>
        <button onclick="openAuthModal('login')" class="btn-pink px-6 py-2.5 rounded-2xl text-xs font-bold">Log In ♡</button>
      </div>
    `;
  }

  const u = AppState.currentUser;
  const subTab = AppState.accountSubTab || 'overview';
  const pointsPhpValue = ((u.points || 0) / 100).toFixed(2);

  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <!-- ACCOUNT HERO HEADER CARD -->
      <div class="glass-panel p-6 sm:p-8 relative overflow-hidden border-2 border-[var(--border-color)]" style="background: var(--banner-bg);">
        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] flex items-center justify-center text-3xl shadow-md">
              🎀
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h1 class="text-xl sm:text-2xl font-black text-[var(--text-main)]">${u.name}</h1>
                <span class="px-2.5 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--accent-pink)] border border-[var(--border-color)] text-[10px] font-black uppercase shadow-sm">
                  ${u.tier || 'Silver Reseller'} 👑
                </span>
              </div>
              <div class="text-xs text-[var(--text-muted)] mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>📧 ${u.email}</span>
                <span>📱 ${u.phone || '0917-***-****'}</span>
                <span>🆔 Member #${u.id || 'USR-89241'}</span>
              </div>
            </div>
          </div>

          <!-- Quick Balance Actions -->
          <div class="flex items-center space-x-3 w-full md:w-auto">
            <button onclick="openDepositModal()" class="flex-1 md:flex-none btn-pink px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md">
              <span>👛</span>
              <span>Cash In / Top Up Saldo</span>
            </button>
            <button onclick="logoutUser()" class="px-4 py-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-rose-500 text-xs font-bold transition">
              Log out
            </button>
          </div>
        </div>
      </div>

      <!-- KEY BALANCES & STATS CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- WALLET SALDO -->
        <div class="glass-panel p-5 space-y-2 border-2 border-[var(--border-color)] relative">
          <div class="flex justify-between items-center text-xs text-[var(--text-muted)] font-semibold">
            <span>👛 Wallet Saldo (Active)</span>
            <span class="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300">Ready</span>
          </div>
          <div class="text-2xl font-black text-[var(--accent-pink)]">
            ₱${(u.walletBalance || 0).toFixed(2)}
          </div>
          <div class="pt-2 flex justify-between items-center text-xs border-t border-[var(--border-color)]">
            <span class="text-[10px] text-[var(--text-dim)]">0s Instant Checkout</span>
            <button onclick="openDepositModal()" class="text-xs font-bold text-[var(--accent-pink)] hover:underline flex items-center space-x-1">
              <span>+ Cash In</span>
            </button>
          </div>
        </div>

        <!-- REWARD POINTS -->
        <div class="glass-panel p-5 space-y-2 border-2 border-[var(--border-color)]">
          <div class="flex justify-between items-center text-xs text-[var(--text-muted)] font-semibold">
            <span>✨ Loyalty Points</span>
            <span class="text-[10px] text-[var(--accent-pink)]">100 pts = ₱1.00</span>
          </div>
          <div class="text-2xl font-black text-[var(--text-main)]">
            ${u.points || 0} <span class="text-xs font-semibold text-[var(--text-dim)]">Pts (≈ ₱${pointsPhpValue})</span>
          </div>
          <div class="pt-2 flex justify-between items-center text-xs border-t border-[var(--border-color)]">
            <span class="text-[10px] text-[var(--text-dim)]">Earn on all reloads</span>
            <button onclick="redeemLoyaltyPoints()" class="text-xs font-bold text-[var(--accent-pink)] hover:underline">
              Redeem to Balance ♡
            </button>
          </div>
        </div>

        <!-- RESELLER LEVEL -->
        <div class="glass-panel p-5 space-y-2 border-2 border-[var(--border-color)]">
          <div class="flex justify-between items-center text-xs text-[var(--text-muted)] font-semibold">
            <span>👑 Reseller Tier</span>
            <span class="text-[10px] text-amber-500 font-bold">Wholesale Rates</span>
          </div>
          <div class="text-lg font-black text-[var(--text-main)]">
            ${u.tier || 'Silver Reseller'}
          </div>
          <div class="pt-2 flex justify-between items-center text-xs border-t border-[var(--border-color)]">
            <span class="text-[10px] text-[var(--text-dim)]">Target: Gold at ₱50k</span>
            <button onclick="switchAccountTab('reseller')" class="text-xs font-bold text-[var(--accent-pink)] hover:underline">
              View Perks 🎀
            </button>
          </div>
        </div>

        <!-- AFFILIATE COMMISSIONS -->
        <div class="glass-panel p-5 space-y-2 border-2 border-[var(--border-color)]">
          <div class="flex justify-between items-center text-xs text-[var(--text-muted)] font-semibold">
            <span>💸 Affiliate Earnings</span>
            <span class="text-[10px] text-purple-500 font-bold">Up to 3%</span>
          </div>
          <div class="text-2xl font-black text-[var(--text-main)]">
            ₱${(u.affiliateEarnings || 0).toFixed(2)}
          </div>
          <div class="pt-2 flex justify-between items-center text-xs border-t border-[var(--border-color)]">
            <span class="text-[10px] text-[var(--text-dim)]">${u.totalSalesReferred || 0} referrals</span>
            <button onclick="withdrawAffiliateEarnings()" class="text-xs font-bold text-[var(--accent-pink)] hover:underline">
              Claim to Saldo 🎀
            </button>
          </div>
        </div>

      </div>

      <!-- ACCOUNT SUB-TABS (All Nexone Member Sections) -->
      <div class="space-y-6">
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[var(--border-color)] scrollbar-none text-xs font-bold">
          <button onclick="switchAccountTab('overview')" class="px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${subTab === 'overview' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)] bg-[var(--bg-card)] border border-[var(--border-color)]'}">
            <span>🎀 Overview</span>
          </button>
          <button onclick="switchAccountTab('topup')" class="px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${subTab === 'topup' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)] bg-[var(--bg-card)] border border-[var(--border-color)]'}">
            <span>👛 Cash-In / Topup</span>
          </button>
          <button onclick="switchAccountTab('orders')" class="px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${subTab === 'orders' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)] bg-[var(--bg-card)] border border-[var(--border-color)]'}">
            <span>🛍️ Transaction History (${AppState.orders.length})</span>
          </button>
          <button onclick="switchAccountTab('points')" class="px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${subTab === 'points' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)] bg-[var(--bg-card)] border border-[var(--border-color)]'}">
            <span>✨ Points Center (${u.points || 0} pts)</span>
          </button>
          <button onclick="switchAccountTab('affiliate')" class="px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${subTab === 'affiliate' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)] bg-[var(--bg-card)] border border-[var(--border-color)]'}">
            <span>💌 Affiliate Program</span>
          </button>
          <button onclick="switchAccountTab('withdraw')" class="px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${subTab === 'withdraw' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)] bg-[var(--bg-card)] border border-[var(--border-color)]'}">
            <span>💸 Commission Payout</span>
          </button>
          <button onclick="switchAccountTab('saved')" class="px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${subTab === 'saved' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)] bg-[var(--bg-card)] border border-[var(--border-color)]'}">
            <span>⚡ Saved Game IDs (${(u.savedAccounts || []).length})</span>
          </button>
          <button onclick="switchAccountTab('reseller')" class="px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${subTab === 'reseller' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)] bg-[var(--bg-card)] border border-[var(--border-color)]'}">
            <span>👑 Reseller Tiers</span>
          </button>
          <button onclick="switchAccountTab('settings')" class="px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${subTab === 'settings' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)] bg-[var(--bg-card)] border border-[var(--border-color)]'}">
            <span>⚙️ Account Settings</span>
          </button>
        </div>

        <!-- TAB CONTENT CONTAINER -->
        <div id="account-tab-content">
          ${renderAccountSubTabContent(subTab)}
        </div>
      </div>

    </div>
  `;
}

function switchAccountTab(tabName) {
  AppState.accountSubTab = tabName;
  const content = document.getElementById('account-tab-content');
  if (content) {
    content.innerHTML = renderAccountSubTabContent(tabName);
    lucide.createIcons();
    renderView('account', false);
  }
}

function renderAccountSubTabContent(tab) {
  const u = AppState.currentUser;
  const pointsPhpValue = ((u.points || 0) / 100).toFixed(2);

  switch (tab) {
    case 'overview':
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-6">
            <!-- Quick Top-Up Saldo Card -->
            <div class="glass-panel p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-base text-[var(--text-main)]">Quick Cash-In Preset Amounts 👛</h3>
                  <p class="text-xs text-[var(--text-muted)]">Add funds instantly via 24/7 QR Ph, GCash, or Maya to unlock 0s top-ups.</p>
                </div>
                <span class="coquette-bow text-xl">🎀</span>
              </div>
              <div class="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-xs font-bold">
                <button onclick="quickCashIn(100)" class="p-3 rounded-2xl bg-[var(--bg-subtle)] hover:border-[var(--accent-pink)] border border-[var(--border-color)] text-[var(--text-main)] transition text-center shadow-sm">
                  ₱100
                </button>
                <button onclick="quickCashIn(250)" class="p-3 rounded-2xl bg-[var(--bg-subtle)] hover:border-[var(--accent-pink)] border border-[var(--border-color)] text-[var(--text-main)] transition text-center shadow-sm">
                  ₱250
                </button>
                <button onclick="quickCashIn(500)" class="p-3 rounded-2xl bg-[var(--bg-subtle)] hover:border-[var(--accent-pink)] border border-[var(--border-color)] text-[var(--accent-pink)] transition text-center shadow-sm">
                  ₱500 🎀
                </button>
                <button onclick="quickCashIn(1000)" class="p-3 rounded-2xl bg-[var(--bg-subtle)] hover:border-[var(--accent-pink)] border border-[var(--border-color)] text-[var(--text-main)] transition text-center shadow-sm">
                  ₱1,000
                </button>
                <button onclick="quickCashIn(2500)" class="p-3 rounded-2xl bg-[var(--bg-subtle)] hover:border-[var(--accent-pink)] border border-[var(--border-color)] text-[var(--text-main)] transition text-center shadow-sm">
                  ₱2,500
                </button>
                <button onclick="quickCashIn(5000)" class="p-3 rounded-2xl bg-[var(--bg-subtle)] hover:border-[var(--accent-pink)] border border-[var(--border-color)] text-[var(--text-main)] transition text-center shadow-sm">
                  ₱5,000
                </button>
              </div>
            </div>

            <!-- Recent Orders Snippet -->
            <div class="glass-panel p-6 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-base text-[var(--text-main)]">Recent Orders History 🛍️</h3>
                <button onclick="switchAccountTab('orders')" class="text-xs text-[var(--accent-pink)] font-bold hover:underline">View All (${AppState.orders.length}) ♡</button>
              </div>
              <div class="divide-y divide-[var(--border-color)] text-xs">
                ${AppState.orders.slice(0, 3).map(o => `
                  <div class="py-3 flex items-center justify-between">
                    <div>
                      <div class="font-bold text-[var(--text-main)]">${o.gameTitle} • ${o.itemName}</div>
                      <div class="text-[11px] text-[var(--text-dim)]">#${o.id} • ${new Date(o.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-[var(--accent-pink)]">₱${o.amount.toFixed(2)}</div>
                      <span class="text-[10px] text-emerald-600 font-semibold">${o.status} ♡</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column: Reseller Progress -->
          <div class="space-y-6">
            <div class="glass-panel p-6 space-y-4 border-2 border-[var(--border-color)]">
              <div class="flex items-center space-x-2">
                <span class="text-xl">👑</span>
                <h4 class="font-bold text-sm text-[var(--text-main)]">Reseller Tier Status</h4>
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between text-[var(--text-muted)]">
                  <span>Current Tier:</span>
                  <span class="font-bold text-[var(--accent-pink)]">${u.tier}</span>
                </div>
                <div class="flex justify-between text-[var(--text-muted)]">
                  <span>Active Saldo:</span>
                  <span class="font-bold">₱${(u.walletBalance || 0).toFixed(2)}</span>
                </div>
                <!-- Progress Bar -->
                <div class="w-full bg-[var(--bg-subtle)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)] mt-2">
                  <div class="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style="width: ${Math.min(100, ((u.walletBalance || 0) / 50000) * 100)}%"></div>
                </div>
                <p class="text-[10px] text-[var(--text-dim)] pt-1">Reach ₱50,000 balance to unlock <strong>Gold Reseller</strong> with extra 3-5% wholesale discount! 🎀</p>
              </div>
              <button onclick="navigateTo('leaderboard')" class="w-full py-2.5 rounded-2xl btn-pink text-xs font-bold text-center block shadow-sm">
                View Affiliate Leaderboard 🏆
              </button>
            </div>

            <!-- Saved Accounts Quick Card -->
            <div class="glass-panel p-6 space-y-3">
              <div class="flex justify-between items-center">
                <h4 class="font-bold text-sm text-[var(--text-main)]">Saved Game Accounts ⚡</h4>
                <button onclick="switchAccountTab('saved')" class="text-xs text-[var(--accent-pink)] font-bold hover:underline">+ Manage</button>
              </div>
              <div class="space-y-2 text-xs">
                ${(u.savedAccounts || []).slice(0, 3).map(sa => `
                  <div class="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex justify-between items-center">
                    <div>
                      <div class="font-bold text-[var(--text-main)]">${sa.name}</div>
                      <div class="text-[10px] text-[var(--text-dim)] font-mono">${Object.values(sa.fields).join(' • ')}</div>
                    </div>
                    <span class="text-[10px] text-[var(--accent-pink)] font-bold">1-Click Ready</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

    case 'topup':
      return `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-7 glass-panel p-6 space-y-6">
            <div>
              <div class="inline-flex items-center space-x-1 px-3 py-1 rounded-full coquette-badge text-xs font-bold mb-2">
                <span>👛</span>
                <span>Nexone Equivalent: /user/topup</span>
              </div>
              <h3 class="font-black text-lg text-[var(--text-main)]">Add Balance / Saldo Cash-In 🎀</h3>
              <p class="text-xs text-[var(--text-muted)]">24/7 automated cash-in via QR Ph, GCash, Maya, and ShopeePay.</p>
            </div>

            <div class="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex justify-between items-center">
              <div>
                <span class="text-[11px] text-[var(--text-muted)] block">Current Active Balance:</span>
                <span class="text-2xl font-black text-[var(--accent-pink)]">₱${(u.walletBalance || 0).toFixed(2)}</span>
              </div>
              <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-xs">0s Latency</span>
            </div>

            <!-- Amount Selector -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-[var(--text-muted)]">Select Cash-In Amount</label>
              <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-bold">
                <button type="button" onclick="selectDedicatedDeposit(100)" class="dep-tab-btn p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-pink)]">₱100</button>
                <button type="button" onclick="selectDedicatedDeposit(250)" class="dep-tab-btn p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-pink)]">₱250</button>
                <button type="button" onclick="selectDedicatedDeposit(500)" class="dep-tab-btn p-2.5 rounded-xl border-2 border-[var(--accent-pink)] bg-[var(--bg-card)] text-[var(--accent-pink)] font-black">₱500 🎀</button>
                <button type="button" onclick="selectDedicatedDeposit(1000)" class="dep-tab-btn p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-pink)]">₱1,000</button>
                <button type="button" onclick="selectDedicatedDeposit(2500)" class="dep-tab-btn p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-pink)]">₱2,500</button>
                <button type="button" onclick="selectDedicatedDeposit(5000)" class="dep-tab-btn p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-pink)]">₱5,000</button>
              </div>
              <input type="number" id="ded-deposit-amount" placeholder="Or enter custom amount (min. ₱50)" value="500" class="theme-input w-full px-4 py-2.5 rounded-2xl text-xs mt-2" />
            </div>

            <!-- Channels -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-[var(--text-muted)]">Payment Gateway</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                <label class="p-3 rounded-2xl border-2 border-[var(--accent-pink)] bg-[var(--bg-card)] flex flex-col items-center justify-center space-y-1 cursor-pointer">
                  <input type="radio" name="ded-channel" value="QR Ph" checked class="hidden" />
                  <span class="text-sm">🎀</span>
                  <span>QR Ph 24/7</span>
                  <span class="text-[9px] text-emerald-600 font-normal">Automated</span>
                </label>
                <label class="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col items-center justify-center space-y-1 cursor-pointer">
                  <input type="radio" name="ded-channel" value="GCash" class="hidden" />
                  <span class="text-blue-500 font-black">G</span>
                  <span>GCash Direct</span>
                  <span class="text-[9px] text-[var(--text-dim)] font-normal">Instant</span>
                </label>
                <label class="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col items-center justify-center space-y-1 cursor-pointer">
                  <input type="radio" name="ded-channel" value="Maya" class="hidden" />
                  <span class="text-emerald-500 font-black">M</span>
                  <span>Maya Pay</span>
                  <span class="text-[9px] text-[var(--text-dim)] font-normal">Instant</span>
                </label>
                <label class="p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col items-center justify-center space-y-1 cursor-pointer">
                  <input type="radio" name="ded-channel" value="ShopeePay" class="hidden" />
                  <span class="text-orange-500 font-black">S</span>
                  <span>ShopeePay</span>
                  <span class="text-[9px] text-[var(--text-dim)] font-normal">Instant</span>
                </label>
              </div>
            </div>

            <button onclick="generateQrCashInCode()" class="w-full py-3.5 rounded-2xl btn-pink font-bold text-xs shadow-lg flex items-center justify-center space-x-2">
              <span>🎀</span>
              <span>Generate 24/7 QR Ph Cash-In Code ♡</span>
            </button>
          </div>

          <!-- Right Column: Interactive Dynamic QR Ph Display -->
          <div class="lg:col-span-5 space-y-6">
            <div id="qr-cashin-box" class="glass-panel p-6 text-center space-y-4 border-2 border-[var(--border-color)]">
              <div class="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-2xl mx-auto">
                📱
              </div>
              <h4 class="font-bold text-sm text-[var(--text-main)]">Official 24/7 QR Ph Instant Gateway</h4>
              <p class="text-xs text-[var(--text-muted)]">Click "Generate" on the left to create your personal single-use payment barcode.</p>
              
              <!-- QR Code Mock Container -->
              <div class="p-5 rounded-3xl bg-white border-2 border-pink-200 inline-block shadow-inner">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SWEVENS-QRPH-CASHIN-500-CHA" alt="QR Ph Barcode" class="w-44 h-44 mx-auto rounded-xl" />
                <div class="pt-2 text-[10px] text-gray-700 font-mono font-bold flex items-center justify-center space-x-1">
                  <span>🇵🇭</span>
                  <span>BSP Standard QR Ph</span>
                </div>
              </div>

              <div class="space-y-1 text-xs">
                <div class="text-[var(--text-dim)]">Simulated Cash-In Amount: <strong class="text-[var(--accent-pink)]">₱500.00</strong></div>
                <div class="text-[10px] text-[var(--text-muted)]">Zero transaction fee • Auto-credited in 10-30s</div>
              </div>

              <button onclick="executeSimulatedCashIn(500, 'QR Ph')" class="w-full py-2.5 rounded-xl btn-pink text-xs font-bold shadow-md">
                ⚡ Simulate Instant Bank Scan & Credit (+₱500.00)
              </button>
            </div>

            <!-- Cash-In History -->
            <div class="glass-panel p-5 space-y-3">
              <h4 class="font-bold text-xs text-[var(--text-main)] uppercase tracking-wider">Recent Cash-In Deposits</h4>
              <div class="divide-y divide-[var(--border-color)] text-xs">
                ${(u.deposits || []).slice(0, 4).map(d => `
                  <div class="py-2.5 flex justify-between items-center">
                    <div>
                      <div class="font-bold text-[var(--text-main)]">+₱${d.amount.toFixed(2)} (${d.method})</div>
                      <div class="text-[10px] text-[var(--text-dim)]">${new Date(d.timestamp).toLocaleString()}</div>
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-[10px]">${d.status}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

    case 'orders':
      return `
        <div class="glass-panel p-6 space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div class="inline-flex items-center space-x-1 px-3 py-1 rounded-full coquette-badge text-xs font-bold mb-1">
                <span>🛍️</span>
                <span>Nexone Equivalent: /user/history</span>
              </div>
              <h3 class="font-bold text-base text-[var(--text-main)]">Orders & Purchase Invoices</h3>
              <p class="text-xs text-[var(--text-muted)]">Complete top-up reload history for player accounts.</p>
            </div>
            <button onclick="window.print()" class="px-4 py-2 rounded-2xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] text-xs font-bold transition flex items-center space-x-1.5 shadow-sm">
              <i data-lucide="printer" class="w-3.5 h-3.5"></i>
              <span>Print All Receipts</span>
            </button>
          </div>

          <div class="overflow-x-auto pt-2">
            <table class="w-full text-left text-xs text-[var(--text-muted)]">
              <thead class="text-[var(--text-main)] uppercase font-semibold border-b border-[var(--border-color)]" style="background: var(--table-head-bg);">
                <tr>
                  <th class="py-3 px-4">Order ID</th>
                  <th class="py-3 px-4">Product</th>
                  <th class="py-3 px-4">Player UID</th>
                  <th class="py-3 px-4">Price</th>
                  <th class="py-3 px-4">Payment</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--border-color)]">
                ${AppState.orders.map(o => `
                  <tr class="hover:bg-[var(--bg-subtle)] transition">
                    <td class="py-3 px-4 font-mono font-bold text-[var(--accent-pink)]">#${o.id}</td>
                    <td class="py-3 px-4 font-bold text-[var(--text-main)]">${o.gameTitle} <span class="block text-[11px] font-normal text-[var(--text-dim)]">${o.itemName}</span></td>
                    <td class="py-3 px-4 font-mono">${o.accountId}</td>
                    <td class="py-3 px-4 font-black text-[var(--accent-pink)]">₱${o.amount.toFixed(2)}</td>
                    <td class="py-3 px-4">${o.paymentMethod}</td>
                    <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-[10px]">${o.status}</span></td>
                    <td class="py-3 px-4 text-right">
                      <button onclick="showInvoiceModal('${o.id}')" class="px-3 py-1 rounded-xl btn-pink text-[11px] font-bold">
                        View Receipt ♡
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

    case 'points':
      return `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div class="md:col-span-7 glass-panel p-6 space-y-6">
            <div>
              <div class="inline-flex items-center space-x-1 px-3 py-1 rounded-full coquette-badge text-xs font-bold mb-2">
                <span>✨</span>
                <span>Nexone Equivalent: /user/point</span>
              </div>
              <h3 class="font-black text-lg text-[var(--text-main)]">SWEVENS Reward Points Center 🎀</h3>
              <p class="text-xs text-[var(--text-muted)]">Official point conversion: <strong>100 points = ₱1.00 Active Wallet Saldo</strong>.</p>
            </div>

            <div class="p-5 rounded-3xl bg-[var(--bg-subtle)] border-2 border-[var(--accent-pink)] space-y-2">
              <span class="text-xs text-[var(--text-dim)] uppercase font-bold">Available Points Balance</span>
              <div class="flex items-baseline space-x-3">
                <span class="text-3xl font-black text-[var(--text-main)]">${u.points || 0}</span>
                <span class="text-sm font-bold text-[var(--accent-pink)]">Points (≈ ₱${pointsPhpValue} Saldo)</span>
              </div>
              <p class="text-[11px] text-[var(--text-muted)]">Earn 10 points for every ₱100 spend on games. Redeem anytime directly to your wallet!</p>
            </div>

            <!-- Redemption Box -->
            <div class="space-y-3 p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <h4 class="font-bold text-sm text-[var(--text-main)]">Redeem Points to Wallet Saldo</h4>
              <div class="space-y-2">
                <label class="block text-xs font-semibold text-[var(--text-muted)]">Points to convert (min. 100 pts)</label>
                <div class="flex gap-2">
                  <input type="number" id="redeem-pts-input" value="${u.points || 1000}" max="${u.points || 0}" step="100" class="theme-input flex-1 px-3.5 py-2.5 rounded-2xl text-xs font-bold" oninput="updatePointsCalc(this.value)" />
                  <button onclick="document.getElementById('redeem-pts-input').value = ${u.points || 0}; updatePointsCalc(${u.points || 0});" class="px-3 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-bold">
                    Max All
                  </button>
                </div>
                <div id="points-calc-display" class="text-xs font-semibold text-emerald-600">
                  Value: +₱${((u.points || 0) / 100).toFixed(2)} to Wallet Saldo ♡
                </div>
              </div>
              <button onclick="executePointsRedemption()" class="w-full py-3 rounded-2xl btn-pink text-xs font-bold shadow-md">
                Redeem into Active Saldo 🎀
              </button>
            </div>
          </div>

          <!-- Right Column: Points Ledger -->
          <div class="md:col-span-5 glass-panel p-6 space-y-4">
            <h4 class="font-bold text-sm text-[var(--text-main)]">Points Transaction History</h4>
            <div class="divide-y divide-[var(--border-color)] text-xs">
              ${(u.pointsHistory || [
                { id: 'PT-101', description: 'MLBB Weekly Pass Reload', points: '+102 pts', php: '+₱1.02', date: '2026-10-20 18:30' },
                { id: 'PT-102', description: 'Valorant VP Top-Up', points: '+535 pts', php: '+₱5.35', date: '2026-10-19 14:15' },
                { id: 'PT-103', description: 'Redeemed to Wallet Saldo', points: '-500 pts', php: '-₱5.00', date: '2026-10-17 11:00' }
              ]).map(p => `
                <div class="py-3 flex justify-between items-center">
                  <div>
                    <div class="font-bold text-[var(--text-main)]">${p.description}</div>
                    <div class="text-[10px] text-[var(--text-dim)]">${p.id} • ${p.date}</div>
                  </div>
                  <div class="text-right">
                    <span class="font-black ${p.points.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}">${p.points}</span>
                    <span class="block text-[10px] text-[var(--text-dim)]">${p.php}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

    case 'affiliate':
      return `
        <div class="glass-panel p-6 sm:p-8 space-y-8">
          <div>
            <div class="inline-flex items-center space-x-1 px-3 py-1 rounded-full coquette-badge text-xs font-bold mb-2">
              <span>💌</span>
              <span>Nexone Equivalent: /user/affiliate & /affiliate-program</span>
            </div>
            <h3 class="font-black text-xl text-[var(--text-main)]">Gaming Affiliate Program Hub</h3>
            <p class="text-xs sm:text-sm text-[var(--text-muted)]">Share your voucher code: Gamers get 5% discount, you earn 3% commission on every reload!</p>
          </div>

          <!-- Cards Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="p-6 rounded-3xl bg-[var(--bg-subtle)] border-2 border-[var(--accent-pink)] space-y-2">
              <span class="text-xs text-[var(--text-dim)] uppercase font-bold">Your Custom Promo Code</span>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-black font-mono text-[var(--accent-pink)]">${u.affiliateCode || 'SWEVENS-CHA'}</span>
                <button onclick="navigator.clipboard.writeText('${u.affiliateCode || 'SWEVENS-CHA'}'); showToast('Voucher code copied! 🎀', 'success');" class="btn-pink px-3 py-1.5 rounded-xl text-xs font-bold">
                  Copy Code
                </button>
              </div>
              <p class="text-[10px] text-[var(--text-dim)] pt-1">Gives 5% instant discount to shoppers.</p>
            </div>

            <div class="p-6 rounded-3xl bg-[var(--bg-subtle)] border-2 border-[var(--border-color)] space-y-2">
              <span class="text-xs text-[var(--text-dim)] uppercase font-bold">Commission Balance Available</span>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-black text-emerald-600">₱${(u.affiliateEarnings || 0).toFixed(2)}</span>
                <button onclick="switchAccountTab('withdraw')" class="btn-pink px-3 py-1.5 rounded-xl text-xs font-bold">
                  Withdraw 💸
                </button>
              </div>
              <p class="text-[10px] text-[var(--text-dim)] pt-1">Payout via GCash, Maya, or Bank.</p>
            </div>

            <div class="p-6 rounded-3xl bg-[var(--bg-subtle)] border-2 border-[var(--border-color)] space-y-2">
              <span class="text-xs text-[var(--text-dim)] uppercase font-bold">Referred Sales Count</span>
              <div class="text-2xl font-black text-[var(--text-main)]">${u.totalSalesReferred || 24} Orders</div>
              <p class="text-[10px] text-[var(--text-dim)] pt-1">Current monthly volume: ₱${(u.monthlyMilestoneProgress || 84250).toLocaleString()}</p>
            </div>
          </div>

          <!-- Share Link -->
          <div class="space-y-2">
            <label class="block text-xs font-semibold text-[var(--text-muted)]">Shareable Direct Referral Link</label>
            <div class="flex gap-2">
              <input type="text" readonly value="https://swevens.ph/?ref=${u.affiliateCode || 'SWEVENS-CHA'}" class="theme-input flex-1 px-4 py-2.5 rounded-2xl text-xs font-mono" />
              <button onclick="navigator.clipboard.writeText('https://swevens.ph/?ref=${u.affiliateCode || 'SWEVENS-CHA'}'); showToast('Affiliate link copied! 🎀', 'success');" class="btn-pink px-5 py-2.5 rounded-2xl text-xs font-bold shrink-0">
                Copy Link ♡
              </button>
            </div>
          </div>

          <!-- NEXONE PERFORMANCE BONUS MILESTONES TABLE -->
          <div class="space-y-4 pt-4 border-t border-[var(--border-color)]">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 class="font-bold text-sm text-[var(--text-main)]">Nexone Performance Bonus Milestones 👑</h4>
                <p class="text-xs text-[var(--text-muted)]">Earn extra monthly salary bonuses on top of standard 3% commissions!</p>
              </div>
              <span class="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/80 px-3 py-1 rounded-full border border-rose-300">
                ⏳ Resets every 1st day of the month
              </span>
            </div>

            <!-- Current Progress to First Milestone -->
            <div class="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-[var(--text-main)]">Target: ₱500k Milestone Bonus (+₱5,000 Cash)</span>
                <span class="text-[var(--accent-pink)]">₱${(u.monthlyMilestoneProgress || 84250).toLocaleString()} / ₱500,000 (16.8%)</span>
              </div>
              <div class="w-full bg-[var(--bg-card)] h-3 rounded-full overflow-hidden border border-[var(--border-color)]">
                <div class="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 rounded-full" style="width: 16.8%"></div>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-[var(--text-muted)]">
                <thead class="text-[var(--text-main)] uppercase font-semibold border-b border-[var(--border-color)]" style="background: var(--table-head-bg);">
                  <tr>
                    <th class="py-3 px-4">Monthly Affiliate Volume</th>
                    <th class="py-3 px-4">Bonus Salary</th>
                    <th class="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[var(--border-color)]">
                  <tr class="hover:bg-[var(--bg-subtle)]">
                    <td class="py-3 px-4 font-bold text-[var(--text-main)]">₱500,000 affiliate revenue</td>
                    <td class="py-3 px-4 font-black text-emerald-600 text-sm">₱5,000.00</td>
                    <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 font-bold text-[10px]">In Progress (₱84k/₱500k)</span></td>
                  </tr>
                  <tr class="hover:bg-[var(--bg-subtle)]">
                    <td class="py-3 px-4 font-bold text-[var(--text-main)]">₱1,000,000 affiliate revenue</td>
                    <td class="py-3 px-4 font-black text-emerald-600 text-sm">₱12,000.00</td>
                    <td class="py-3 px-4"><span class="text-[var(--text-dim)] text-[10px]">Upcoming</span></td>
                  </tr>
                  <tr class="hover:bg-[var(--bg-subtle)]">
                    <td class="py-3 px-4 font-bold text-[var(--text-main)]">₱2,500,000 affiliate revenue</td>
                    <td class="py-3 px-4 font-black text-emerald-600 text-sm">₱30,000.00</td>
                    <td class="py-3 px-4"><span class="text-[var(--text-dim)] text-[10px]">Upcoming</span></td>
                  </tr>
                  <tr class="hover:bg-[var(--bg-subtle)]">
                    <td class="py-3 px-4 font-bold text-[var(--text-main)]">₱5,000,000 affiliate revenue</td>
                    <td class="py-3 px-4 font-black text-emerald-600 text-sm">₱75,000.00</td>
                    <td class="py-3 px-4"><span class="text-[var(--text-dim)] text-[10px]">Upcoming</span></td>
                  </tr>
                  <tr class="hover:bg-[var(--bg-subtle)]">
                    <td class="py-3 px-4 font-bold text-[var(--text-main)]">₱10,000,000 affiliate revenue</td>
                    <td class="py-3 px-4 font-black text-emerald-600 text-sm">₱200,000.00</td>
                    <td class="py-3 px-4"><span class="text-[var(--text-dim)] text-[10px]">Master Tier</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

    case 'withdraw':
      return `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div class="md:col-span-7 glass-panel p-6 space-y-6">
            <div>
              <div class="inline-flex items-center space-x-1 px-3 py-1 rounded-full coquette-badge text-xs font-bold mb-2">
                <span>💸</span>
                <span>Nexone Equivalent: /user/withdraw</span>
              </div>
              <h3 class="font-black text-lg text-[var(--text-main)]">Commission Payout & Withdrawal</h3>
              <p class="text-xs text-[var(--text-muted)]">Request payout to GCash, Maya, or Philippine bank accounts.</p>
            </div>

            <div class="p-5 rounded-3xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex justify-between items-center">
              <div>
                <span class="text-xs text-[var(--text-muted)]">Available Commission to Withdraw:</span>
                <div class="text-2xl font-black text-emerald-600">₱${(u.affiliateEarnings || 0).toFixed(2)}</div>
              </div>
              <button onclick="withdrawAffiliateEarnings()" class="btn-pink px-4 py-2 rounded-2xl text-xs font-bold shadow-md">
                1-Click Transfer to Saldo ♡
              </button>
            </div>

            <!-- Payout Request Form -->
            <div class="space-y-4 p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <h4 class="font-bold text-sm text-[var(--text-main)]">External E-Wallet / Bank Withdrawal</h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block font-semibold text-[var(--text-muted)] mb-1">Payout Channel</label>
                  <select id="wd-channel" class="theme-input w-full px-3 py-2 rounded-xl text-xs">
                    <option value="GCash">GCash (Philippines)</option>
                    <option value="Maya">Maya Wallet</option>
                    <option value="BPI">BPI Bank Direct</option>
                    <option value="BDO">BDO Unibank</option>
                    <option value="UnionBank">UnionBank PH</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-[var(--text-muted)] mb-1">Amount (₱)</label>
                  <input type="number" id="wd-amount" value="${Math.min(500, u.affiliateEarnings || 0)}" min="100" class="theme-input w-full px-3 py-2 rounded-xl text-xs font-bold" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block font-semibold text-[var(--text-muted)] mb-1">Account Name</label>
                  <input type="text" id="wd-name" value="Cha Dela Cruz" class="theme-input w-full px-3 py-2 rounded-xl text-xs" />
                </div>
                <div>
                  <label class="block font-semibold text-[var(--text-muted)] mb-1">Account Number / Mobile</label>
                  <input type="text" id="wd-account" value="0917-510-1510" class="theme-input w-full px-3 py-2 rounded-xl text-xs font-mono" />
                </div>
              </div>

              <button onclick="submitExternalWithdrawal()" class="w-full py-3 rounded-2xl btn-pink text-xs font-bold shadow-md">
                Submit Payout Request 🎀
              </button>
            </div>
          </div>

          <!-- Payout History -->
          <div class="md:col-span-5 glass-panel p-6 space-y-4">
            <h4 class="font-bold text-sm text-[var(--text-main)]">Withdrawal Request Records</h4>
            <div class="divide-y divide-[var(--border-color)] text-xs">
              ${(u.withdrawals || [
                { id: 'WD-501', method: 'GCash (0917***1510)', amount: 350.00, status: 'Processed 🎀', date: '2026-10-16 16:40' }
              ]).map(w => `
                <div class="py-3 flex justify-between items-center">
                  <div>
                    <div class="font-bold text-[var(--text-main)]">₱${w.amount.toFixed(2)} (${w.method})</div>
                    <div class="text-[10px] text-[var(--text-dim)]">${w.id} • ${w.date}</div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 font-bold text-[10px]">${w.status}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

    case 'saved':
      return `
        <div class="space-y-6">
          <div class="glass-panel p-6 space-y-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 class="font-bold text-base text-[var(--text-main)]">Saved In-Game Player Profiles ⚡</h3>
                <p class="text-xs text-[var(--text-muted)]">Save your IDs to 1-click autofill during top-up without retyping! 🎀</p>
              </div>
              <button onclick="toggleAddSavedProfileModal(true)" class="btn-pink px-4 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shadow-md">
                <span>+</span>
                <span>Add Saved Account</span>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              ${(u.savedAccounts || []).map(sa => {
                const game = SWEVENS_DATA.games.find(g => g.id === sa.gameId) || { title: sa.gameId };
                return `
                  <div class="p-4 rounded-3xl bg-[var(--bg-subtle)] border-2 border-[var(--border-color)] space-y-3 relative shadow-sm">
                    <div class="flex justify-between items-start">
                      <div>
                        <span class="text-[10px] font-bold text-[var(--accent-pink)] uppercase tracking-wider">${game.title}</span>
                        <h4 class="font-bold text-sm text-[var(--text-main)]">${sa.name}</h4>
                      </div>
                      <button onclick="deleteSavedAccount('${sa.id}')" class="text-rose-400 hover:text-rose-600 text-xs" title="Remove">✕</button>
                    </div>
                    <div class="p-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] space-y-1">
                      ${Object.entries(sa.fields).map(([k, v]) => `
                        <div class="flex justify-between"><span class="text-[var(--text-dim)] uppercase text-[10px]">${k}:</span> <span class="font-bold">${v}</span></div>
                      `).join('')}
                    </div>
                    <button onclick="openGamePage('${sa.gameId}')" class="w-full py-2 rounded-xl btn-pink text-[11px] font-bold text-center block">
                      Top Up This ID ♡
                    </button>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- RECENT RECHARGED HISTORY SECTION -->
            <div class="pt-6 border-t border-[var(--border-color)] space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-sm text-[var(--text-main)] flex items-center space-x-1.5">
                    <span>🎀</span>
                    <span>Recent Recharged Accounts History</span>
                  </h4>
                  <p class="text-xs text-[var(--text-muted)]">Automatic history of all player IDs and servers recharged on SWEVENS.</p>
                </div>
                <button onclick="clearRecentRechargedAccounts()" class="text-xs text-rose-500 hover:underline">Clear History</button>
              </div>

              ${(() => {
                const recent = getSavedRechargeHistory();
                if (recent.length === 0) {
                  return `
                    <div class="p-6 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-color)]">
                      <span>Wala pang na-recharge na account. Ang bawat recharge mo ay awtomatikong mase-save dito! 🎀</span>
                    </div>
                  `;
                }
                return `
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    ${recent.map(r => `
                      <div class="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-pink)] transition space-y-2">
                        <div class="flex items-start justify-between">
                          <div>
                            <div class="text-[10px] font-bold text-[var(--accent-pink)] uppercase">${r.gameTitle || r.gameId}</div>
                            <div class="font-black text-xs text-[var(--text-main)]">${r.nickname || r.userId}</div>
                          </div>
                          <span class="text-base">${r.regionFlag || '👑'}</span>
                        </div>
                        <div class="text-[11px] font-mono text-[var(--text-muted)]">
                          ID: <strong class="text-[var(--text-main)]">${r.userId}</strong> ${r.zoneId ? `(${r.zoneId})` : ''}
                        </div>
                        <div class="flex items-center justify-between text-[10px] text-[var(--text-dim)] pt-1 border-t border-[var(--border-color)]">
                          <span>Last: ${r.lastItemName || 'Item'}</span>
                          <button onclick="openGamePage('${r.gameId}'); setTimeout(() => autofillSavedHistory('${r.userId}', '${r.zoneId || ''}', '${(r.nickname || '').replace(/'/g, "\\'")}'), 200);" class="text-[var(--accent-pink)] font-bold hover:underline">Recharge ♡</button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `;
              })()}
            </div>
          </div>
        </div>
      `;

    case 'reseller':
      return `
        <div class="glass-panel p-6 space-y-6">
          <div>
            <h3 class="font-bold text-base text-[var(--text-main)]">SWEVENS Reseller Tier Matrix 👑</h3>
            <p class="text-xs text-[var(--text-muted)]">Maintain your active wallet balance to unlock automated wholesale rates.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            ${SWEVENS_DATA.resellerTiers.map(t => {
              const isCurrent = (u.tier || '').toLowerCase().includes(t.name.toLowerCase().split(' ')[0]);
              return `
                <div class="p-6 rounded-3xl bg-[var(--bg-subtle)] border-2 ${isCurrent ? 'border-[var(--accent-pink)] shadow-lg' : 'border-[var(--border-color)]'} space-y-3 relative">
                  ${isCurrent ? `<span class="absolute -top-3 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase shadow">Your Current Tier 🎀</span>` : ''}
                  <h4 class="font-black text-lg text-[var(--text-main)]">${t.name}</h4>
                  <div class="text-xs font-mono font-bold text-[var(--accent-pink)]">${t.balanceReq}</div>
                  <div class="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] space-y-1.5">
                    <div class="font-bold text-[var(--text-main)]">${t.discount}</div>
                    <div class="text-[11px] text-[var(--text-dim)]">${t.perk}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

    case 'settings':
      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <!-- Profile Details Form -->
          <div class="glass-panel p-6 space-y-5">
            <div>
              <div class="inline-flex items-center space-x-1 px-3 py-1 rounded-full coquette-badge text-xs font-bold mb-2">
                <span>⚙️</span>
                <span>Nexone Equivalent: /user/settings</span>
              </div>
              <h3 class="font-bold text-base text-[var(--text-main)]">Profile Information 🎀</h3>
              <p class="text-xs text-[var(--text-muted)]">Update your registered member details.</p>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block font-semibold text-[var(--text-muted)] mb-1">Display Name</label>
                <input type="text" id="set-name" value="${u.name}" class="theme-input w-full px-3.5 py-2.5 rounded-xl font-bold" />
              </div>
              <div>
                <label class="block font-semibold text-[var(--text-muted)] mb-1">Username (Login ID)</label>
                <input type="text" id="set-username" value="${u.username || 'itsme_cha'}" class="theme-input w-full px-3.5 py-2.5 rounded-xl font-mono font-bold" />
              </div>
              <div>
                <label class="block font-semibold text-[var(--text-muted)] mb-1">Email Address</label>
                <input type="email" id="set-email" value="${u.email}" class="theme-input w-full px-3.5 py-2.5 rounded-xl" />
              </div>
              <div>
                <label class="block font-semibold text-[var(--text-muted)] mb-1">Mobile / WhatsApp Number</label>
                <input type="text" id="set-phone" value="${u.phone || '0917-510-1510'}" class="theme-input w-full px-3.5 py-2.5 rounded-xl font-mono" />
              </div>
              <button onclick="saveProfileSettings()" class="w-full py-2.5 rounded-2xl btn-pink font-bold shadow-md mt-2">
                Save Profile Changes 🎀
              </button>
            </div>
          </div>

          <!-- Password & Security Form -->
          <div class="glass-panel p-6 space-y-5">
            <div>
              <h3 class="font-bold text-base text-[var(--text-main)]">Security & Password 🔒</h3>
              <p class="text-xs text-[var(--text-muted)]">Update your password to keep your wallet saldo safe.</p>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block font-semibold text-[var(--text-muted)] mb-1">Current Password</label>
                <input type="password" id="set-curr-pass" placeholder="Enter current password" value="${u.password || 'fries1510'}" class="theme-input w-full px-3.5 py-2.5 rounded-xl" />
              </div>
              <div>
                <label class="block font-semibold text-[var(--text-muted)] mb-1">New Password</label>
                <input type="password" id="set-new-pass" placeholder="Enter new password (min. 6 chars)" class="theme-input w-full px-3.5 py-2.5 rounded-xl" />
              </div>
              <div>
                <label class="block font-semibold text-[var(--text-muted)] mb-1">Confirm New Password</label>
                <input type="password" id="set-conf-pass" placeholder="Re-type new password" class="theme-input w-full px-3.5 py-2.5 rounded-xl" />
              </div>
              <button onclick="changePasswordSettings()" class="w-full py-2.5 rounded-2xl btn-pink font-bold shadow-md mt-2">
                Update Password ♡
              </button>
            </div>

            <!-- Notifications Toggles -->
            <div class="pt-4 border-t border-[var(--border-color)] space-y-3">
              <h4 class="font-bold text-xs text-[var(--text-main)] uppercase tracking-wider">Alert Preferences</h4>
              <label class="flex items-center justify-between text-xs cursor-pointer">
                <span>Telegram Bot Bot Instant Alerts</span>
                <input type="checkbox" checked class="accent-pink-500 w-4 h-4" />
              </label>
              <label class="flex items-center justify-between text-xs cursor-pointer">
                <span>SMS Top-Up Delivery Confirmation</span>
                <input type="checkbox" checked class="accent-pink-500 w-4 h-4" />
              </label>
            </div>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

function initAccountEvents() {}

// ----------------- AFFILIATE LEADERBOARD VIEW -----------------
function renderLeaderboardView() {
  const activeTab = AppState.leaderboardTab || 'monthly';
  const leaders = SWEVENS_DATA.leaderboard[activeTab] || SWEVENS_DATA.leaderboard.monthly;

  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <!-- HEADER -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full coquette-badge text-xs font-bold">
          <i data-lucide="trophy" class="w-3.5 h-3.5 text-amber-500"></i>
          <span>Official SWEVENS Rankings 🎀</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-[var(--text-main)]">Affiliate & Reseller Leaderboard</h1>
        <p class="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto">
          Top-earning game reload affiliates in the Philippines. Share your voucher code to claim monthly cash bonuses and perks! 👑✨
        </p>
      </div>

      <!-- TIMEFRAME TABS -->
      <div class="flex justify-center space-x-2">
        <div class="inline-flex p-1 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs font-bold">
          <button onclick="setLeaderboardTab('monthly')" class="px-5 py-2 rounded-xl transition ${activeTab === 'monthly' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)]'}">
            Monthly (Prize Pool ₱50k) 🎀
          </button>
          <button onclick="setLeaderboardTab('weekly')" class="px-5 py-2 rounded-xl transition ${activeTab === 'weekly' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)]'}">
            Weekly Sprint
          </button>
          <button onclick="setLeaderboardTab('daily')" class="px-5 py-2 rounded-xl transition ${activeTab === 'daily' ? 'btn-pink' : 'text-[var(--text-muted)] hover:text-[var(--accent-pink)]'}">
            Daily Top
          </button>
        </div>
      </div>

      <!-- TOP 3 PODIUM CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        
        <!-- 2nd Place -->
        ${leaders[1] ? `
          <div class="p-6 rounded-3xl glass-panel border-2 border-slate-300 dark:border-slate-700 text-center space-y-3 order-2 md:order-1 shadow-md">
            <span class="text-3xl block">🥈</span>
            <div class="text-xs font-bold text-slate-500 uppercase">2nd Place</div>
            <h3 class="font-bold text-base text-[var(--text-main)]">${leaders[1].name}</h3>
            <div class="text-xl font-black text-[var(--accent-pink)]">₱${leaders[1].commission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
            <div class="text-xs text-[var(--text-dim)]">${leaders[1].sales} Orders Referred</div>
            <span class="inline-block px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[11px] font-bold text-[var(--accent-pink)] border border-[var(--border-color)]">Bonus +₱3,000 Cash</span>
          </div>
        ` : ''}

        <!-- 1st Place (Champion) -->
        ${leaders[0] ? `
          <div class="p-8 rounded-3xl glass-panel border-2 border-[var(--accent-pink)] text-center space-y-4 order-1 md:order-2 shadow-2xl relative" style="background: var(--banner-bg);">
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-rose-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase shadow">
              👑 MONTHLY CHAMPION 🎀
            </div>
            <span class="text-4xl block pt-2">🥇</span>
            <div class="text-xs font-bold text-amber-500 uppercase tracking-wider">1st Place VIP</div>
            <h3 class="font-black text-xl text-[var(--text-main)]">${leaders[0].name}</h3>
            <div class="text-3xl font-black text-[var(--accent-pink)]">₱${leaders[0].commission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
            <div class="text-xs font-semibold text-[var(--text-muted)]">${leaders[0].sales} Orders Referred ♡</div>
            <span class="inline-block px-4 py-1.5 rounded-full btn-pink text-xs font-bold shadow-md">Bonus +₱5,000 Cash Prize</span>
          </div>
        ` : ''}

        <!-- 3rd Place -->
        ${leaders[2] ? `
          <div class="p-6 rounded-3xl glass-panel border-2 border-amber-600/30 text-center space-y-3 order-3 shadow-md">
            <span class="text-3xl block">🥉</span>
            <div class="text-xs font-bold text-amber-600 uppercase">3rd Place</div>
            <h3 class="font-bold text-base text-[var(--text-main)]">${leaders[2].name}</h3>
            <div class="text-xl font-black text-[var(--accent-pink)]">₱${leaders[2].commission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
            <div class="text-xs text-[var(--text-dim)]">${leaders[2].sales} Orders Referred</div>
            <span class="inline-block px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[11px] font-bold text-[var(--accent-pink)] border border-[var(--border-color)]">Bonus +₱1,500 Cash</span>
          </div>
        ` : ''}

      </div>

      <!-- FULL RANKING TABLE -->
      <div class="glass-panel overflow-hidden border-2 border-[var(--border-color)]">
        <div class="p-4 border-b border-[var(--border-color)] flex justify-between items-center text-xs">
          <span class="font-bold text-[var(--text-main)]">Full Leaderboard Standings</span>
          <span class="text-[var(--text-dim)]">Real-time commission tracking</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[var(--text-muted)]">
            <thead class="text-[var(--text-main)] uppercase font-semibold border-b border-[var(--border-color)]" style="background: var(--table-head-bg);">
              <tr>
                <th class="py-3 px-4">Rank</th>
                <th class="py-3 px-4">Affiliate Name</th>
                <th class="py-3 px-4">Reseller Tier</th>
                <th class="py-3 px-4">Referred Sales</th>
                <th class="py-3 px-4 text-right">Commission Earned</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]">
              ${leaders.map(l => `
                <tr class="hover:bg-[var(--bg-subtle)] transition">
                  <td class="py-3 px-4 font-bold text-sm text-[var(--text-main)]">${l.badge || `#${l.rank}`}</td>
                  <td class="py-3 px-4 font-bold text-[var(--text-main)] flex items-center space-x-2">
                    <span>${l.name}</span>
                  </td>
                  <td class="py-3 px-4 text-[var(--accent-pink)] font-semibold">${l.tier}</td>
                  <td class="py-3 px-4">${l.sales} orders</td>
                  <td class="py-3 px-4 text-right font-black text-[var(--accent-pink)]">₱${l.commission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- CALL TO ACTION -->
      <div class="p-6 rounded-3xl glass-panel text-center space-y-3 border-2 border-[var(--border-color)]">
        <span class="text-3xl block">💌</span>
        <h3 class="font-bold text-base text-[var(--text-main)]">Want to compete on the SWEVENS Leaderboard?</h3>
        <p class="text-xs text-[var(--text-muted)] max-w-md mx-auto">
          Share your personal voucher code with friends or in Facebook and Discord groups. Earn up to 3% on every game credit purchase!
        </p>
        <button onclick="openOrNavigateAccount()" class="btn-pink px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md">
          Open My Affiliate Code ♡
        </button>
      </div>

    </div>
  `;
}

function initLeaderboardEvents() {}

function setLeaderboardTab(tab) {
  AppState.leaderboardTab = tab;
  renderView('leaderboard', false);
}

// ----------------- WALLET SALDO CASH-IN MODAL -----------------
function openDepositModal() {
  if (!AppState.currentUser) {
    openAuthModal('login');
    return;
  }

  const modalHtml = `
    <div id="deposit-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div class="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-md w-full rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative">
        <button onclick="closeDepositModal()" class="absolute top-5 right-5 text-[var(--text-dim)] hover:text-[var(--text-main)]">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-2xl">
            👛
          </div>
          <div>
            <h3 class="text-lg font-black text-[var(--text-main)]">Top Up Wallet Saldo 🎀</h3>
            <p class="text-xs text-[var(--text-muted)]">Instant cash-in via GCash, Maya, or QR Ph</p>
          </div>
        </div>

        <!-- Current Balance -->
        <div class="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex justify-between items-center text-xs">
          <span class="text-[var(--text-muted)]">Current Saldo:</span>
          <span class="font-black text-lg text-[var(--accent-pink)]">₱${(AppState.currentUser.walletBalance || 0).toFixed(2)}</span>
        </div>

        <!-- Presets -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold text-[var(--text-muted)]">Choose Cash-In Amount</label>
          <div class="grid grid-cols-3 gap-2 text-xs font-bold">
            <button type="button" onclick="selectDepositPreset(100)" class="dep-preset p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--accent-pink)]">₱100</button>
            <button type="button" onclick="selectDepositPreset(250)" class="dep-preset p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--accent-pink)]">₱250</button>
            <button type="button" onclick="selectDepositPreset(500)" class="dep-preset p-2.5 rounded-xl border-2 border-[var(--accent-pink)] bg-[var(--bg-subtle)] text-[var(--accent-pink)] font-black">₱500 🎀</button>
            <button type="button" onclick="selectDepositPreset(1000)" class="dep-preset p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--accent-pink)]">₱1,000</button>
            <button type="button" onclick="selectDepositPreset(2500)" class="dep-preset p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--accent-pink)]">₱2,500</button>
            <button type="button" onclick="selectDepositPreset(5000)" class="dep-preset p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-main)] hover:border-[var(--accent-pink)]">₱5,000</button>
          </div>
          <input type="number" id="deposit-custom-amount" placeholder="Or enter other amount (min. ₱50)" value="500" class="theme-input w-full px-3.5 py-2 rounded-2xl text-xs mt-2" />
        </div>

        <!-- Channel -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold text-[var(--text-muted)]">Payment Channel</label>
          <div class="grid grid-cols-3 gap-2 text-xs font-semibold">
            <label class="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] flex items-center space-x-1.5 cursor-pointer">
              <input type="radio" name="deposit-channel" value="GCash" checked />
              <span>GCash</span>
            </label>
            <label class="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] flex items-center space-x-1.5 cursor-pointer">
              <input type="radio" name="deposit-channel" value="Maya" />
              <span>Maya</span>
            </label>
            <label class="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] flex items-center space-x-1.5 cursor-pointer">
              <input type="radio" name="deposit-channel" value="QR Ph" />
              <span>QR Ph</span>
            </label>
          </div>
        </div>

        <button onclick="submitDeposit()" class="w-full py-3 rounded-2xl btn-pink font-bold text-xs shadow-md">
          Simulate Instant Cash-In ♡
        </button>
      </div>
    </div>
  `;

  closeDepositModal();
  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstElementChild);
  lucide.createIcons();
}

function closeDepositModal() {
  const m = document.getElementById('deposit-modal');
  if (m) m.remove();
}

function selectDepositPreset(amt) {
  const input = document.getElementById('deposit-custom-amount');
  if (input) input.value = amt;
  document.querySelectorAll('.dep-preset').forEach(btn => {
    btn.classList.remove('border-2', 'border-[var(--accent-pink)]', 'font-black');
    if (btn.textContent.includes(amt.toString())) {
      btn.classList.add('border-2', 'border-[var(--accent-pink)]', 'font-black');
    }
  });
}

function submitDeposit() {
  const input = document.getElementById('deposit-custom-amount');
  const amt = parseFloat(input ? input.value : 0);
  if (!amt || amt < 50) {
    showToast('Minimum cash-in amount is ₱50.00 🎀', 'warning');
    return;
  }

  const channel = document.querySelector('input[name="deposit-channel"]:checked')?.value || 'GCash';

  closeDepositModal();

  // Update user balance
  AppState.currentUser.walletBalance = (AppState.currentUser.walletBalance || 0) + amt;
  if (!AppState.currentUser.deposits) AppState.currentUser.deposits = [];
  AppState.currentUser.deposits.unshift({
    id: 'DEP-' + Math.floor(10000 + Math.random() * 90000),
    method: channel,
    amount: amt,
    status: 'Completed',
    timestamp: new Date().toISOString()
  });

  try {
    localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
  } catch (e) {}

  renderNavigation();
  showToast(`Successfully added ₱${amt.toFixed(2)} to your SWEVENS Saldo via ${channel}! 🎀`, 'success');

  if (AppState.currentView === 'account') {
    renderView('account', false);
  }
}

function quickCashIn(amt) {
  openDepositModal();
  selectDepositPreset(amt);
}

// ----------------- POINTS REDEMPTION -----------------
function redeemLoyaltyPoints() {
  const u = AppState.currentUser;
  if (!u || !u.points || u.points <= 0) {
    showToast('You do not have any loyalty points to redeem right now ♡', 'info');
    return;
  }

  const phpValue = u.points / 100;
  u.walletBalance = (u.walletBalance || 0) + phpValue;
  showToast(`Redeemed ${u.points} Points into +₱${phpValue.toFixed(2)} Wallet Saldo! 🎀`, 'success');
  u.points = 0;

  try {
    localStorage.setItem('swevens_user', JSON.stringify(u));
  } catch (e) {}

  renderNavigation();
  if (AppState.currentView === 'account') {
    renderView('account', false);
  }
}

function withdrawAffiliateEarnings() {
  const u = AppState.currentUser;
  if (!u || !u.affiliateEarnings || u.affiliateEarnings <= 0) {
    showToast('No affiliate earnings available to claim ♡', 'info');
    return;
  }

  const amt = u.affiliateEarnings;
  u.walletBalance = (u.walletBalance || 0) + amt;
  u.affiliateEarnings = 0;

  showToast(`Transferred ₱${amt.toFixed(2)} commission directly to your active Wallet Saldo! 🎀`, 'success');

  try {
    localStorage.setItem('swevens_user', JSON.stringify(u));
  } catch (e) {}

  renderNavigation();
  if (AppState.currentView === 'account') {
    renderView('account', false);
  }
}

// ----------------- DEDICATED TOPUP & CASH-IN HELPERS -----------------
function selectDedicatedDeposit(amt) {
  const input = document.getElementById('ded-deposit-amount');
  if (input) input.value = amt;
  document.querySelectorAll('.dep-tab-btn').forEach(b => {
    b.classList.remove('border-2', 'border-[var(--accent-pink)]', 'font-black');
    if (b.textContent.includes(amt.toString())) {
      b.classList.add('border-2', 'border-[var(--accent-pink)]', 'font-black');
    }
  });
}

function generateQrCashInCode() {
  const input = document.getElementById('ded-deposit-amount');
  const amt = parseFloat(input ? input.value : 500) || 500;
  const channel = document.querySelector('input[name="ded-channel"]:checked')?.value || 'QR Ph';
  const qrBox = document.getElementById('qr-cashin-box');
  if (!qrBox) return;

  const refCode = 'QRPH-' + Math.floor(100000 + Math.random() * 900000);

  qrBox.innerHTML = `
    <div class="space-y-4">
      <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full coquette-badge text-xs font-bold">
        <span>🎀</span>
        <span>Single-Use 24/7 QR Ph Invoice</span>
      </div>
      <h4 class="font-bold text-sm text-[var(--text-main)]">Scan & Pay via ${channel}</h4>
      
      <div class="p-5 rounded-3xl bg-white border-2 border-pink-300 inline-block shadow-lg relative">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SWEVENS-QRPH-${refCode}-${amt}" alt="Dynamic QR Code" class="w-44 h-44 mx-auto rounded-xl" />
        <div class="pt-2 text-[10px] text-gray-700 font-mono font-bold flex items-center justify-center space-x-1">
          <span>🇵🇭</span>
          <span>BSP QR Ph • Ref #${refCode}</span>
        </div>
      </div>

      <div class="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs space-y-1">
        <div class="flex justify-between"><span class="text-[var(--text-dim)]">Amount to Pay:</span> <strong class="text-base text-[var(--accent-pink)]">₱${amt.toFixed(2)}</strong></div>
        <div class="flex justify-between"><span class="text-[var(--text-dim)]">Recipient:</span> <span>SWEVENS Digital Philippines 🎀</span></div>
        <div class="flex justify-between"><span class="text-[var(--text-dim)]">Payment Mode:</span> <span>Automated 0-second bot credit</span></div>
      </div>

      <button onclick="executeSimulatedCashIn(${amt}, '${channel}')" class="w-full py-3 rounded-2xl btn-pink text-xs font-bold shadow-md flex items-center justify-center space-x-2">
        <i data-lucide="zap" class="w-4 h-4"></i>
        <span>Simulate Instant Scan & Auto-Credit (+₱${amt.toFixed(2)}) ♡</span>
      </button>
    </div>
  `;
  lucide.createIcons();
  showToast(`Generated 24/7 QR Ph Code for ₱${amt.toFixed(2)}! 🎀`, 'info');
}

function executeSimulatedCashIn(amt, channel = 'QR Ph') {
  if (!AppState.currentUser) return;
  AppState.currentUser.walletBalance = (AppState.currentUser.walletBalance || 0) + amt;
  if (!AppState.currentUser.deposits) AppState.currentUser.deposits = [];
  AppState.currentUser.deposits.unshift({
    id: 'DEP-' + Math.floor(10000 + Math.random() * 90000),
    method: channel,
    amount: amt,
    status: 'Completed',
    timestamp: new Date().toISOString()
  });

  try {
    localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
  } catch (e) {}

  renderNavigation();
  showToast(`Successfully added ₱${amt.toFixed(2)} to your SWEVENS Saldo via ${channel}! 🎀`, 'success');
  renderView('account', false);
}

function updatePointsCalc(val) {
  const pts = parseInt(val) || 0;
  const php = (pts / 100).toFixed(2);
  const el = document.getElementById('points-calc-display');
  if (el) {
    el.textContent = `Value: +₱${php} to Wallet Saldo ♡`;
  }
}

function executePointsRedemption() {
  const input = document.getElementById('redeem-pts-input');
  const pts = parseInt(input ? input.value : 0) || 0;
  const u = AppState.currentUser;
  if (!u || !u.points || u.points < 100) {
    showToast('Minimum points to redeem is 100 pts (₱1.00) 🎀', 'warning');
    return;
  }
  if (pts > u.points) {
    showToast(`You only have ${u.points} points available ♡`, 'error');
    return;
  }

  const phpValue = pts / 100;
  u.points -= pts;
  u.walletBalance = (u.walletBalance || 0) + phpValue;
  if (!u.pointsHistory) u.pointsHistory = [];
  u.pointsHistory.unshift({
    id: 'PT-' + Math.floor(100 + Math.random() * 900),
    description: 'Redeemed into Wallet Saldo',
    points: `-${pts} pts`,
    php: `-₱${phpValue.toFixed(2)}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  try {
    localStorage.setItem('swevens_user', JSON.stringify(u));
  } catch (e) {}

  renderNavigation();
  showToast(`Redeemed ${pts} Points into +₱${phpValue.toFixed(2)} Active Saldo! 🎀`, 'success');
  renderView('account', false);
}

function submitExternalWithdrawal() {
  const u = AppState.currentUser;
  const amtInput = document.getElementById('wd-amount');
  const channel = document.getElementById('wd-channel')?.value || 'GCash';
  const name = document.getElementById('wd-name')?.value.trim() || 'Cha Dela Cruz';
  const account = document.getElementById('wd-account')?.value.trim() || '0917-510-1510';
  const amt = parseFloat(amtInput ? amtInput.value : 0) || 0;

  if (amt < 100) {
    showToast('Minimum withdrawal is ₱100.00 🎀', 'warning');
    return;
  }
  if (amt > (u.affiliateEarnings || 0)) {
    showToast(`Insufficient commission balance (Available: ₱${(u.affiliateEarnings || 0).toFixed(2)}) ♡`, 'error');
    return;
  }

  u.affiliateEarnings -= amt;
  if (!u.withdrawals) u.withdrawals = [];
  u.withdrawals.unshift({
    id: 'WD-' + Math.floor(100 + Math.random() * 900),
    method: `${channel} (${account})`,
    amount: amt,
    status: 'Processed 🎀',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16)
  });

  try {
    localStorage.setItem('swevens_user', JSON.stringify(u));
  } catch (e) {}

  renderNavigation();
  showToast(`Payout request of ₱${amt.toFixed(2)} to ${channel} submitted successfully! 🎀`, 'success');
  renderView('account', false);
}

function saveProfileSettings() {
  const u = AppState.currentUser;
  if (!u) return;
  const name = document.getElementById('set-name')?.value.trim();
  const username = document.getElementById('set-username')?.value.trim();
  const email = document.getElementById('set-email')?.value.trim();
  const phone = document.getElementById('set-phone')?.value.trim();

  if (name) u.name = name;
  if (username) u.username = username;
  if (email) u.email = email;
  if (phone) u.phone = phone;

  try {
    localStorage.setItem('swevens_user', JSON.stringify(u));
  } catch (e) {}

  renderNavigation();
  showToast('Profile settings saved successfully! 🎀', 'success');
  renderView('account', false);
}

function changePasswordSettings() {
  const u = AppState.currentUser;
  if (!u) return;
  const curr = document.getElementById('set-curr-pass')?.value;
  const next = document.getElementById('set-new-pass')?.value;
  const conf = document.getElementById('set-conf-pass')?.value;

  if (u.password && curr !== u.password) {
    showToast('Current password does not match (fries1510) ♡', 'error');
    return;
  }
  if (!next || next.length < 6) {
    showToast('New password must be at least 6 characters 🎀', 'warning');
    return;
  }
  if (next !== conf) {
    showToast('New passwords do not match ♡', 'error');
    return;
  }

  u.password = next;
  try {
    localStorage.setItem('swevens_user', JSON.stringify(u));
  } catch (e) {}

  showToast('Password updated successfully! 🎀', 'success');
  const p1 = document.getElementById('set-new-pass');
  const p2 = document.getElementById('set-conf-pass');
  if (p1) p1.value = '';
  if (p2) p2.value = '';
}

function showInvoiceModal(orderId) {
  const order = AppState.orders.find(o => o.id === orderId) || AppState.orders[0];
  if (!order) return;

  const modalHtml = `
    <div id="invoice-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div class="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-lg w-full rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative">
        <button onclick="closeInvoiceModal()" class="absolute top-5 right-5 text-[var(--text-dim)] hover:text-[var(--text-main)]">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="text-center space-y-1 pb-3 border-b border-[var(--border-color)]">
          <div class="text-2xl">🎀</div>
          <h3 class="text-xl font-black text-[var(--text-main)]">SWEVENS OFFICIAL INVOICE</h3>
          <p class="text-xs text-[var(--accent-pink)] font-mono">Invoice #${order.id} • ${new Date(order.timestamp).toLocaleString()}</p>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1.5 font-mono">
            <div class="flex justify-between"><span class="text-[var(--text-dim)]">Product:</span> <span class="font-bold text-[var(--text-main)]">${order.gameTitle}</span></div>
            <div class="flex justify-between"><span class="text-[var(--text-dim)]">Item:</span> <span class="font-bold text-[var(--accent-pink)]">${order.itemName}</span></div>
            <div class="flex justify-between"><span class="text-[var(--text-dim)]">Player UID / Zone:</span> <span>${order.accountId}</span></div>
            <div class="flex justify-between"><span class="text-[var(--text-dim)]">Payment Gateway:</span> <span>${order.paymentMethod}</span></div>
            <div class="flex justify-between"><span class="text-[var(--text-dim)]">Status:</span> <span class="text-emerald-600 font-bold">PAID & DELIVERED ♡</span></div>
          </div>

          <div class="flex justify-between items-center text-sm font-bold pt-2 border-t border-[var(--border-color)]">
            <span>Total Paid:</span>
            <span class="text-xl font-black text-[var(--accent-pink)]">₱${order.amount.toFixed(2)}</span>
          </div>

          <!-- Official Coquette Stamp -->
          <div class="p-3 rounded-2xl border-2 border-dashed border-pink-300 dark:border-pink-800 text-center text-[10px] text-[var(--accent-pink)] font-semibold">
            🎀 CERTIFIED GENUINE DIGITAL RELOAD • SWEVENS.PH PHILIPPINES 🎀
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button onclick="window.print()" class="flex-1 py-2.5 rounded-2xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold transition flex items-center justify-center space-x-1.5">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>Print Receipt</span>
          </button>
          <button onclick="closeInvoiceModal()" class="flex-1 py-2.5 rounded-2xl btn-pink text-xs font-bold shadow-md">
            Done ♡
          </button>
        </div>
      </div>
    </div>
  `;

  closeInvoiceModal();
  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstElementChild);
  lucide.createIcons();
}

function closeInvoiceModal() {
  const m = document.getElementById('invoice-modal');
  if (m) m.remove();
}

// ----------------- SAVED GAME PROFILES -----------------
function deleteSavedAccount(saId) {
  if (!AppState.currentUser || !AppState.currentUser.savedAccounts) return;
  AppState.currentUser.savedAccounts = AppState.currentUser.savedAccounts.filter(s => s.id !== saId);
  try {
    localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
  } catch (e) {}
  showToast('Saved profile removed ♡', 'info');
  switchAccountTab('saved');
}

function toggleAddSavedProfileModal(show) {
  if (!show) {
    const m = document.getElementById('add-profile-modal');
    if (m) m.remove();
    return;
  }

  const modalHtml = `
    <div id="add-profile-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div class="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl relative">
        <button onclick="toggleAddSavedProfileModal(false)" class="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--text-main)]">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <h3 class="font-bold text-base text-[var(--text-main)]">Add In-Game Profile 🎀</h3>
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Select Game</label>
            <select id="asp-game" class="theme-input w-full px-3 py-2 rounded-xl">
              <option value="mobile-legends-ph">Mobile Legends: Bang Bang</option>
              <option value="valorant">Valorant</option>
              <option value="roblox">Roblox</option>
              <option value="genshin-impact">Genshin Impact</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Profile Nickname (Label)</label>
            <input type="text" id="asp-name" placeholder="e.g. My MLBB Main ♡" class="theme-input w-full px-3 py-2 rounded-xl" />
          </div>
          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">User ID / Riot ID</label>
            <input type="text" id="asp-id1" placeholder="e.g. 12345678 or TenZ#PH1" class="theme-input w-full px-3 py-2 rounded-xl" />
          </div>
          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Zone ID / Server (Optional)</label>
            <input type="text" id="asp-id2" placeholder="e.g. 1004 or Asia" class="theme-input w-full px-3 py-2 rounded-xl" />
          </div>
          <button onclick="saveNewProfile()" class="w-full py-2.5 rounded-2xl btn-pink font-bold mt-2 shadow-md">
            Save Profile 🎀
          </button>
        </div>
      </div>
    </div>
  `;
  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstElementChild);
  lucide.createIcons();
}

function saveNewProfile() {
  const gameId = document.getElementById('asp-game')?.value;
  const name = document.getElementById('asp-name')?.value.trim() || 'My Account ♡';
  const id1 = document.getElementById('asp-id1')?.value.trim();
  const id2 = document.getElementById('asp-id2')?.value.trim();

  if (!id1) {
    showToast('Please enter your Player ID 🎀', 'error');
    return;
  }

  const fields = {};
  if (gameId === 'mobile-legends-ph') {
    fields.userId = id1;
    fields.zoneId = id2 || '1004';
  } else if (gameId === 'valorant') {
    fields.riotId = id1;
  } else if (gameId === 'roblox') {
    fields.robloxUser = id1;
  } else if (gameId === 'genshin-impact') {
    fields.uid = id1;
    fields.server = id2 || 'Asia';
  }

  if (!AppState.currentUser.savedAccounts) AppState.currentUser.savedAccounts = [];
  AppState.currentUser.savedAccounts.push({
    id: 'sa-' + Date.now(),
    gameId,
    name,
    fields
  });

  try {
    localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
  } catch (e) {}

  toggleAddSavedProfileModal(false);
  showToast(`Profile "${name}" saved successfully! 🎀`, 'success');
  switchAccountTab('saved');
}

function autofillSavedAccount(saId) {
  if (!AppState.currentUser || !AppState.currentUser.savedAccounts) return;
  const sa = AppState.currentUser.savedAccounts.find(s => s.id === saId);
  if (!sa) return;

  AppState.accountData = { ...sa.fields };

  // Update DOM inputs
  Object.entries(sa.fields).forEach(([k, v]) => {
    const input = document.getElementById(`input-${k}`);
    if (input) input.value = v;
  });

  updateSummarySection();
  verifyPlayerNickname();
  showToast(`Autofilled from ${sa.name} 🎀`, 'success');
}

// ----------------- GAME DETAIL / TOP-UP VIEW -----------------
function renderGameView(game) {
  const currentTotal = calculateCurrentTotal();
  const userSavedForGame = (AppState.currentUser && AppState.currentUser.savedAccounts) 
    ? AppState.currentUser.savedAccounts.filter(s => s.gameId === game.id) 
    : [];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      <!-- Back Navigation & Breadcrumb -->
      <div class="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <button onclick="navigateTo('home')" class="hover:text-[var(--accent-pink)] flex items-center space-x-1 font-semibold transition">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <span>Back to All Games</span>
        </button>
        <div class="flex items-center space-x-2">
          <span>Home</span>
          <span>/</span>
          <span>${game.category.toUpperCase()}</span>
          <span>/</span>
          <span class="text-[var(--accent-pink)] font-bold">${game.title} 🎀</span>
        </div>
      </div>

      <!-- GAME HERO BANNER -->
      <div class="rounded-3xl border border-[var(--border-color)] p-5 sm:p-7 relative overflow-hidden shadow-xl" style="background: var(--banner-bg);">
        <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img src="${game.image}" alt="${game.title}" class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-[var(--border-color)] shadow-md shrink-0" />
          <div class="space-y-1.5 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold text-[var(--accent-pink)] bg-[var(--bg-card)] px-3 py-0.5 rounded-full border border-[var(--border-color)] shadow-sm">
                ${game.region}
              </span>
              <span class="text-xs font-bold text-emerald-600 bg-[var(--bg-card)] px-3 py-0.5 rounded-full border border-[var(--border-color)] flex items-center space-x-1 shadow-sm">
                <span>🎀</span>
                <span>Automated Instant Reload</span>
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">${game.title}</h1>
            <p class="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl">${game.description}</p>
            <div class="flex items-center space-x-4 pt-1 text-xs text-[var(--text-dim)]">
              <div class="flex items-center text-amber-500 font-bold">
                <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400 mr-1"></i>
                <span>${game.rating.toFixed(1)} / 5.0</span>
              </div>
              <span>•</span>
              <span>${game.reviewsCount} happy gamers ♡</span>
              <span>•</span>
              <button onclick="toggleIdGuideModal(true)" class="text-[var(--accent-pink)] hover:underline flex items-center space-x-1 font-semibold">
                <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
                <span>Where is my ID? 🎀</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN MULTI-STEP CHECKOUT FORM -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- LEFT COLUMN: STEPS 1 to 4 -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- STEP 1: USER ACCOUNT ID -->
          <div class="glass-panel p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="step-number">1</span>
                <div>
                  <h3 class="font-bold text-[var(--text-main)] text-base">Enter Account Information 🎀</h3>
                  <p class="text-xs text-[var(--text-muted)]">Input your player ID to ensure accurate credit delivery.</p>
                </div>
              </div>
              <button onclick="toggleIdGuideModal(true)" class="text-xs text-[var(--accent-pink)] hover:underline flex items-center space-x-1 font-semibold">
                <i data-lucide="info" class="w-3.5 h-3.5"></i>
                <span>Guide</span>
              </button>
            </div>

            <!-- FAST AUTOFILL FROM SAVED PROFILES & RECENT RECHARGE HISTORY -->
            ${renderSavedAccountsChips(game)}

            ${userSavedForGame.length > 0 ? `
              <div class="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-wrap items-center gap-2 text-xs">
                <span class="font-bold text-[var(--text-main)] flex items-center space-x-1">
                  <span>⚡ Quick Fill:</span>
                </span>
                ${userSavedForGame.map(sa => `
                  <button onclick="autofillSavedAccount('${sa.id}')" class="px-3 py-1 rounded-xl bg-[var(--bg-card)] hover:border-[var(--accent-pink)] border border-[var(--border-color)] text-[var(--accent-pink)] font-bold shadow-sm transition">
                    ${sa.name}
                  </button>
                `).join('')}
              </div>
            ` : ''}

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              ${game.idFields.map(field => `
                <div>
                  <label class="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">${field.label} ${field.required ? '<span class="text-rose-500">*</span>' : ''}</label>
                  ${field.type === 'select' ? `
                    <select 
                      id="input-${field.id}" 
                      onchange="updateAccountField('${field.id}', this.value)"
                      class="theme-input w-full px-3.5 py-2.5 rounded-2xl text-sm"
                    >
                      ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                  ` : `
                    <input 
                      type="${field.type}" 
                      id="input-${field.id}" 
                      placeholder="${field.placeholder}" 
                      value="${AppState.accountData[field.id] || ''}"
                      oninput="updateAccountField('${field.id}', this.value)"
                      class="theme-input w-full px-3.5 py-2.5 rounded-2xl text-sm"
                    />
                  `}
                </div>
              `).join('')}
            </div>

            <!-- Nickname verification bar -->
            <div class="pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div id="nickname-display-box" class="flex-1 text-xs">
                ${renderNicknameStatus()}
              </div>
              <button 
                type="button" 
                onclick="verifyPlayerNickname()" 
                id="btn-verify-nick"
                class="px-4 py-2 rounded-2xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--accent-pink)] transition flex items-center justify-center space-x-1.5 shrink-0 shadow-sm"
              >
                <span>🎀</span>
                <span>Check In-Game Nickname</span>
              </button>
            </div>
          </div>

          <!-- STEP 2: SELECT ITEM / DENOMINATION -->
          <div class="glass-panel p-5 sm:p-6 space-y-5">
            <div class="flex items-center space-x-3">
              <span class="step-number">2</span>
              <div>
                <h3 class="font-bold text-[var(--text-main)] text-base">Select Desired Denomination ♡</h3>
                <p class="text-xs text-[var(--text-muted)]">Choose diamonds, passes, or coin bundles.</p>
              </div>
            </div>

            ${game.itemSections.map(section => `
              <div class="space-y-3">
                <h4 class="text-xs font-bold text-[var(--accent-pink)] uppercase tracking-wider flex items-center space-x-2">
                  <span class="coquette-bow">🎀</span>
                  <span>${section.name}</span>
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  ${section.items.map(item => {
                    const isSelected = AppState.selectedItem && AppState.selectedItem.id === item.id;
                    return `
                      <div 
                        onclick="selectItem('${item.id}')"
                        data-item-id="${item.id}"
                        class="selectable-card rounded-2xl p-3.5 flex flex-col justify-between ${isSelected ? 'active' : ''}"
                      >
                        <div class="check-indicator" style="display: ${isSelected ? 'flex' : 'none'};">
                          <i data-lucide="check" class="w-3 h-3 text-white"></i>
                        </div>
                        <div class="space-y-1 pr-4">
                          <div class="font-bold text-sm text-[var(--text-main)]">${item.name}</div>
                          <div class="text-[11px] text-[var(--text-muted)]">${item.amount}</div>
                        </div>
                        <div class="pt-3 mt-2 border-t border-[var(--border-color)] flex items-baseline justify-between">
                          <span class="text-sm font-extrabold text-[var(--accent-pink)]">₱${item.price.toFixed(2)}</span>
                          ${item.badge ? `
                            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--accent-pink)] border border-[var(--border-color)]">
                              ${item.badge}
                            </span>
                          ` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- STEP 3: PAYMENT METHOD (INCLUDES WALLET SALDO) -->
          <div class="glass-panel p-5 sm:p-6 space-y-5">
            <div class="flex items-center space-x-3">
              <span class="step-number">3</span>
              <div>
                <h3 class="font-bold text-[var(--text-main)] text-base">Select Local PH Payment Method 🇵🇭</h3>
                <p class="text-xs text-[var(--text-muted)]">Pay via SWEVENS Saldo, GCash, Maya, ShopeePay, or Instant QR Ph.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${SWEVENS_DATA.paymentMethods.map(pm => {
                const isSelected = AppState.selectedPayment && AppState.selectedPayment.id === pm.id;
                const methodPrice = calculatePriceForPayment(pm);
                const isWallet = pm.id === 'wallet';
                const userBalance = (AppState.currentUser?.walletBalance || 0);
                const hasEnough = userBalance >= methodPrice;

                return `
                  <div 
                    onclick="selectPayment('${pm.id}')"
                    data-payment-id="${pm.id}"
                    class="selectable-card rounded-2xl p-3.5 flex items-center justify-between ${isSelected ? 'active' : ''}"
                  >
                    <div class="check-indicator" style="display: ${isSelected ? 'flex' : 'none'};">
                      <i data-lucide="check" class="w-3 h-3 text-white"></i>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-1 flex items-center justify-center shrink-0 shadow-sm text-lg">
                        ${isWallet ? '👛' : `<img src="${pm.logo}" alt="${pm.name}" class="max-w-full max-h-full object-contain" />`}
                      </div>
                      <div>
                        <div class="font-bold text-xs text-[var(--text-main)] flex items-center space-x-1">
                          <span>${pm.name}</span>
                        </div>
                        <div class="text-[10px] text-[var(--text-dim)]">
                          ${isWallet 
                            ? `<span class="${hasEnough ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}">Saldo: ₱${userBalance.toFixed(2)}</span>` 
                            : `${pm.processingTime} • <span class="text-[var(--accent-pink)] font-semibold">${pm.badge}</span>`}
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div id="payment-price-${pm.id}" class="text-xs font-bold text-[var(--accent-pink)]">₱${methodPrice.toFixed(2)}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- STEP 4: PROMO CODE & RECEIPT EMAIL -->
          <div class="glass-panel p-5 sm:p-6 space-y-4">
            <div class="flex items-center space-x-3">
              <span class="step-number">4</span>
              <div>
                <h3 class="font-bold text-[var(--text-main)] text-base">Voucher & Contact Details 💌</h3>
                <p class="text-xs text-[var(--text-muted)]">Apply discounts and enter your email for transaction receipt.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <!-- Voucher Input -->
              <div>
                <label class="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Have a Promo / Voucher Code?</label>
                <div class="flex space-x-2">
                  <input 
                    type="text" 
                    id="voucher-input" 
                    placeholder="e.g. COQUETTE5" 
                    value="${AppState.appliedVoucher ? AppState.appliedVoucher.code : ''}"
                    class="theme-input w-full px-3.5 py-2.5 rounded-2xl text-sm uppercase font-mono"
                  />
                  <button 
                    onclick="applyVoucherCode()"
                    class="px-4 py-2.5 rounded-2xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--accent-pink)] transition shadow-sm"
                  >
                    Apply 🎀
                  </button>
                </div>
                ${AppState.appliedVoucher ? `
                  <div class="text-xs text-emerald-600 mt-1.5 flex items-center space-x-1 font-semibold">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                    <span>Applied: ${AppState.appliedVoucher.desc}</span>
                  </div>
                ` : `
                  <p class="text-[11px] text-[var(--text-dim)] mt-1.5">Try voucher code: <strong class="text-[var(--accent-pink)] cursor-pointer" onclick="useSuggestedVoucher('COQUETTE5')">COQUETTE5 🎀</strong></p>
                `}
              </div>

              <!-- Email for receipt -->
              <div>
                <label class="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Email Address for Official Receipt</label>
                <input 
                  type="email" 
                  id="checkout-email-input" 
                  placeholder="your-email@example.com" 
                  value="${AppState.userEmail || (AppState.currentUser?.email || '')}"
                  oninput="AppState.userEmail = this.value"
                  class="theme-input w-full px-3.5 py-2.5 rounded-2xl text-sm"
                />
                <p class="text-[11px] text-[var(--text-dim)] mt-1.5">Order receipt and delivery proof will be sent to your inbox ♡.</p>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: STICKY ORDER SUMMARY & CHECKOUT BUTTON -->
        <div class="lg:col-span-4 sticky top-24 space-y-4">
          <div class="glass-panel p-5 sm:p-6 border-2 border-[var(--border-color)] space-y-5 shadow-xl">
            <h3 class="text-base font-bold text-[var(--text-main)] flex items-center justify-between">
              <span class="flex items-center space-x-1.5">
                <span>🎀</span>
                <span>Order Summary</span>
              </span>
              <span class="text-xs font-bold text-[var(--accent-pink)] bg-[var(--bg-subtle)] px-2.5 py-0.5 rounded-full border border-[var(--border-color)]">Step 5/5</span>
            </h3>

            <div class="space-y-3 text-xs border-y border-[var(--border-color)] py-4">
              <div class="flex justify-between text-[var(--text-muted)]">
                <span>Game:</span>
                <span class="font-bold text-[var(--text-main)]" id="summary-game-title">${game.title}</span>
              </div>
              <div class="flex justify-between text-[var(--text-muted)]">
                <span>Package:</span>
                <span class="font-bold text-[var(--accent-pink)]" id="summary-package-name">${AppState.selectedItem ? AppState.selectedItem.name : 'None selected'}</span>
              </div>
              <div class="flex justify-between text-[var(--text-muted)]">
                <span>Payment:</span>
                <span class="font-bold text-[var(--text-main)]" id="summary-payment-name">${AppState.selectedPayment ? AppState.selectedPayment.name : 'Select payment'}</span>
              </div>
              <div class="flex justify-between text-[var(--text-muted)]">
                <span>Account ID:</span>
                <span class="font-mono text-[var(--text-main)] font-semibold" id="summary-account-id">${getFormattedAccountId() || '<span class="text-rose-500 font-normal">Not entered</span>'}</span>
              </div>
              <div id="summary-nick-row" style="display: ${AppState.verifiedNick ? 'flex' : 'none'};" class="justify-between text-emerald-600 font-medium">
                <span>Nickname:</span>
                <span class="font-bold" id="summary-nick-value">${AppState.verifiedNick || ''}</span>
              </div>

              <!-- Subtotal & Discount breakdown -->
              <div class="pt-2 border-t border-[var(--border-color)] space-y-1.5">
                <div class="flex justify-between text-[var(--text-dim)]">
                  <span>Base Price:</span>
                  <span id="summary-base-price">₱${(AppState.selectedItem ? AppState.selectedItem.price : 0).toFixed(2)}</span>
                </div>
                <div id="summary-voucher-row" style="display: ${AppState.appliedVoucher ? 'flex' : 'none'};" class="justify-between text-emerald-600 font-semibold">
                  <span>Voucher Discount:</span>
                  <span id="summary-voucher-discount">-₱${calculateVoucherDiscount().toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-[var(--text-dim)]">
                  <span>Gateway Fee:</span>
                  <span id="summary-gateway-fee">₱${calculatePaymentFee().toFixed(2)}</span>
                </div>
              </div>

              <!-- Grand Total -->
              <div class="pt-2 border-t border-[var(--border-color)] flex justify-between items-baseline">
                <span class="font-bold text-sm text-[var(--text-main)]">Grand Total:</span>
                <div class="text-right">
                  <span class="text-2xl font-black text-[var(--accent-pink)]" id="summary-grand-total">₱${currentTotal.toFixed(2)}</span>
                  <span class="block text-[10px] text-[var(--text-dim)]">Includes all local taxes</span>
                </div>
              </div>
            </div>

            <!-- Instant Buy Button -->
            <button 
              type="button" 
              id="checkout-buy-button"
              onclick="proceedToCheckout()"
              class="w-full py-3.5 rounded-2xl ${AppState.serverMismatch && game.regionCode === 'PH' ? 'opacity-60 cursor-not-allowed bg-rose-400 text-white' : 'btn-pink'} font-black text-sm flex items-center justify-center space-x-2 shadow-xl"
            >
              <span>🎀</span>
              <span id="checkout-buy-button-text">${AppState.serverMismatch && game.regionCode === 'PH' ? 'Server Mismatch (Bawal sa PH Server)' : `BUY NOW • ₱${currentTotal.toFixed(2)}`}</span>
            </button>

            <!-- Guarantee micro-copy -->
            <div class="space-y-1.5 text-[11px] text-[var(--text-dim)] text-center">
              <div class="flex items-center justify-center space-x-1.5 text-emerald-600 font-semibold">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                <span>Automated delivery upon payment ♡</span>
              </div>
              <p>By purchasing, you agree to SWEVENS Terms & Conditions.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- ID HELPER MODAL -->
      <div id="id-guide-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <div class="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-lg w-full rounded-3xl p-6 space-y-4 shadow-2xl relative">
          <button onclick="toggleIdGuideModal(false)" class="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--text-main)]">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-xl">
              🎀
            </div>
            <div>
              <h3 class="font-bold text-[var(--text-main)] text-base">${game.idGuide.title}</h3>
              <p class="text-xs text-[var(--text-muted)]">Follow these instructions carefully ♡</p>
            </div>
          </div>
          <div class="space-y-2.5 text-xs text-[var(--text-muted)]">
            ${game.idGuide.steps.map((st, idx) => `
              <div class="flex items-start space-x-2.5 p-2.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                <span class="w-5 h-5 rounded-full bg-[var(--accent-pink)] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">${idx + 1}</span>
                <span>${st}</span>
              </div>
            `).join('')}
          </div>
          <button onclick="toggleIdGuideModal(false)" class="w-full py-2.5 rounded-2xl btn-pink text-xs font-bold">
            Got it, take me back 🎀
          </button>
        </div>
      </div>

    </div>
  `;
}

function initGameViewEvents(game) {
  if (!AppState.selectedItem && game.itemSections[0]?.items[0]) {
    AppState.selectedItem = game.itemSections[0].items[0];
  }
  if (!AppState.selectedPayment) {
    AppState.selectedPayment = (AppState.currentUser && AppState.currentUser.walletBalance >= (AppState.selectedItem ? AppState.selectedItem.price : 0)) 
      ? SWEVENS_DATA.paymentMethods[0] 
      : SWEVENS_DATA.paymentMethods[1];
  }
}

function updateAccountField(fieldId, value) {
  AppState.accountData[fieldId] = value;
  AppState.verifiedNick = null;
  updateSummarySection();
}

// ----------------- SAVED RECHARGE HISTORY & PROFILES -----------------
function getSavedRechargeHistory(gameId = null) {
  try {
    const raw = localStorage.getItem('swevens_saved_accounts');
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    if (!gameId) return list;

    const isMlbb = gameId === 'mobile-legends-ph' || gameId.startsWith('mlbb') || gameId.startsWith('mobile-legends');
    if (isMlbb) {
      return list.filter(item => item.gameId === 'mobile-legends-ph' || item.gameId.startsWith('mlbb') || item.gameId.startsWith('mobile-legends'));
    }
    return list.filter(item => item.gameId === gameId);
  } catch (e) {
    return [];
  }
}

function savePlayerRechargeHistory(entry) {
  try {
    const raw = localStorage.getItem('swevens_saved_accounts');
    let list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];

    // Remove duplicates with same userId & zoneId
    list = list.filter(item => !(item.userId === entry.userId && item.zoneId === entry.zoneId));
    list.unshift(entry);
    if (list.length > 20) list = list.slice(0, 20);

    localStorage.setItem('swevens_saved_accounts', JSON.stringify(list));
  } catch (e) {}
}

function clearRecentRechargedAccounts() {
  try {
    localStorage.removeItem('swevens_saved_accounts');
  } catch (e) {}
  showToast('Cleared saved recharge accounts 🎀', 'info');
  if (AppState.activeGame) {
    openGamePage(AppState.activeGame.id, false);
  }
}

function autofillSavedHistory(userId, zoneId, nickname) {
  AppState.accountData['userId'] = userId;
  if (zoneId) AppState.accountData['zoneId'] = zoneId;

  const uInput = document.getElementById('input-userId');
  if (uInput) uInput.value = userId;
  const zInput = document.getElementById('input-zoneId');
  if (zInput && zoneId) zInput.value = zoneId;

  if (nickname) {
    AppState.verifiedNick = nickname;
  }
  verifyPlayerNickname();
  showToast(`Autofilled account for ${nickname || userId} 🎀`, 'success');
}

function renderSavedAccountsChips(game) {
  const saved = getSavedRechargeHistory(game.id);
  if (!saved || saved.length === 0) return '';

  return `
    <div class="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-[var(--text-main)] flex items-center space-x-1.5">
          <span>🎀</span>
          <span>Recent Recharged IDs (1-Click Autofill):</span>
        </span>
        <button type="button" onclick="clearRecentRechargedAccounts()" class="text-[10px] text-[var(--text-dim)] hover:text-rose-500 transition">
          Clear ✕
        </button>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        ${saved.slice(0, 6).map(item => `
          <button 
            type="button"
            onclick="autofillSavedHistory('${item.userId}', '${item.zoneId || ''}', '${(item.nickname || '').replace(/'/g, "\\'")}')"
            class="group px-3 py-1.5 rounded-xl bg-[var(--bg-card)] hover:border-[var(--accent-pink)] border border-[var(--border-color)] text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
            title="Last item: ${item.lastItemName || 'Item'} (₱${(item.lastPrice || 0).toFixed(2)})"
          >
            <span>${item.regionFlag || '👑'}</span>
            <span class="font-bold text-[var(--text-main)] group-hover:text-[var(--accent-pink)]">${item.nickname || item.userId}</span>
            <span class="text-[10px] font-mono text-[var(--text-dim)]">(${item.userId}${item.zoneId ? ' • ' + item.zoneId : ''})</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function getMlbbGameTitleForRegion(regionCode) {
  const map = {
    'ID': 'MLBB Indonesia (🇮🇩)',
    'MY': 'MLBB Singapore & Malaysia (🇸🇬🇲🇾)',
    'SG': 'MLBB Singapore & Malaysia (🇸🇬🇲🇾)',
    'TR': 'MLBB Turkey (🇹🇷)',
    'RU': 'MLBB Russia (🇷🇺)',
    'US': 'MLBB US Server (🇺🇸)',
    'GLOBAL': 'MLBB Global Smile One (🌐)'
  };
  return map[regionCode] || 'MLBB Global (🌐)';
}

function switchToDetectedServer(regionCode) {
  let targetId = 'mlbb-global';
  if (regionCode === 'ID') targetId = 'mlbb-id';
  else if (regionCode === 'MY' || regionCode === 'SG') targetId = 'mlbb-sg-my';
  else if (regionCode === 'TR') targetId = 'mlbb-tr';
  else if (regionCode === 'RU') targetId = 'mlbb-ru';
  else if (regionCode === 'US') targetId = 'mlbb-us';
  else if (regionCode === 'GLOBAL') targetId = 'mlbb-global';

  const game = SWEVENS_DATA.games.find(g => g.id === targetId);
  if (!game) return;

  AppState.serverMismatch = false;
  openGamePage(targetId, true);
  showToast(`Lumipat sa ${game.title}! Pwede nang mag-order 🎀`, 'success');
}

function renderNicknameStatus() {
  if (AppState.isCheckingNick) {
    return `
      <div class="flex items-center space-x-2 text-[var(--accent-pink)] font-semibold">
        <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
        <span>Connecting to live game database... 🎀</span>
      </div>
    `;
  }

  if (AppState.serverMismatch && AppState.activeGame?.regionCode === 'PH') {
    const regCode = AppState.detectedRegion || 'ID';
    const regTitle = getMlbbGameTitleForRegion(regCode);
    return `
      <div class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-400 text-rose-700 dark:text-rose-200 space-y-2.5">
        <div class="flex items-start space-x-2.5">
          <span class="text-xl shrink-0">⚠️</span>
          <div>
            <div class="font-extrabold text-sm text-rose-800 dark:text-rose-100 flex items-center space-x-1.5">
              <span>Server Mismatch! Bawal I-process sa PH Server 🎀</span>
            </div>
            <p class="text-xs text-rose-600 dark:text-rose-300 mt-0.5 leading-relaxed">
              Ang player IGN <strong class="underline font-bold text-rose-900 dark:text-white">${AppState.verifiedNick}</strong> ay nakarehistro sa <strong>${AppState.detectedServerName || regCode}</strong> server at hindi sa Philippine Server (🇵🇭). Hindi ito pwedeng iproseso sa PH channel dahil magkaka-error ang order.
            </p>
          </div>
        </div>
        <div class="pt-2 border-t border-rose-300/60 dark:border-rose-800 flex flex-wrap items-center gap-2">
          <span class="text-xs font-bold text-rose-800 dark:text-rose-200">Lumipat sa Tamang Server:</span>
          <button 
            type="button"
            onclick="switchToDetectedServer('${regCode}')"
            class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs shadow-md hover:scale-105 transition flex items-center space-x-1"
          >
            <span>👉 Lumipat sa ${regTitle}</span>
          </button>
          <button 
            type="button"
            onclick="switchToDetectedServer('GLOBAL')"
            class="px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-rose-900 border border-rose-400 text-rose-800 dark:text-rose-200 font-bold text-xs hover:bg-white transition"
          >
            <span>Global Server (Smile One) 🌐</span>
          </button>
        </div>
      </div>
    `;
  }

  if (AppState.verifiedNick) {
    return `
      <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-2 rounded-2xl border border-emerald-400/50 shadow-sm">
        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>
        <span>IGN: <strong class="text-[var(--text-main)] underline">${AppState.verifiedNick}</strong></span>
        ${AppState.verifiedRegion ? `<span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 border border-emerald-400 text-emerald-700 dark:text-emerald-200">${AppState.verifiedRegion} ✓ Server Matched 🎀</span>` : ''}
      </div>
    `;
  }

  if (AppState.nickCheckError) {
    return `
      <div class="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/60 px-3.5 py-2 rounded-2xl border border-rose-400/50">
        <i data-lucide="alert-circle" class="w-4 h-4 text-rose-500"></i>
        <span class="text-xs">${AppState.nickCheckError}</span>
      </div>
    `;
  }

  return `
    <span class="text-[var(--text-dim)]">Enter your ID & Server, then click Check to pull your EXACT in-game nickname ♡</span>
  `;
}

async function verifyPlayerNickname() {
  const game = AppState.activeGame;
  if (!game) return;

  const firstField = game.idFields[0];
  const val = AppState.accountData[firstField.id];

  if (!val || String(val).trim().length === 0) {
    showToast(`Please enter your ${firstField.label} first! 🎀`, 'error');
    return;
  }

  const zoneField = game.idFields.find(f => f.id === 'zoneId');
  const zoneVal = zoneField ? AppState.accountData['zoneId'] : null;

  if (zoneField && (!zoneVal || String(zoneVal).trim().length === 0)) {
    showToast(`Please enter your Zone ID (Server) first! 🎀`, 'error');
    return;
  }

  AppState.isCheckingNick = true;
  AppState.verifiedNick = null;
  AppState.nickCheckError = null;
  AppState.serverMismatch = false;

  const box = document.getElementById('nickname-display-box');
  if (box) {
    box.innerHTML = renderNicknameStatus();
    lucide.createIcons();
  }

  try {
    const res = await fetch('/api/check-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: game.id,
        userId: String(val).trim(),
        zoneId: zoneVal ? String(zoneVal).trim() : ''
      })
    });
    const data = await res.json();
    AppState.isCheckingNick = false;

    if (data.success && data.nickname) {
      AppState.verifiedNick = data.nickname;
      AppState.verifiedRegion = data.region || '🇵🇭';
      AppState.verifiedServer = data.server || (zoneVal ? `Cluster #${zoneVal}` : 'PH Server');
      AppState.detectedRegion = data.regionCode || 'PH';
      AppState.detectedServerName = data.region || 'Philippines';
      AppState.nickCheckError = null;

      // Server mismatch detection
      if (game.regionCode === 'PH' && data.regionCode && data.regionCode !== 'PH') {
        AppState.serverMismatch = true;
      } else {
        AppState.serverMismatch = false;
      }

      // Save to recent recharge history
      savePlayerRechargeHistory({
        gameId: game.id,
        gameTitle: game.title,
        userId: String(val).trim(),
        zoneId: zoneVal ? String(zoneVal).trim() : '',
        nickname: data.nickname,
        region: data.region || '',
        regionCode: data.regionCode || '',
        regionFlag: data.regionFlag || game.serverFlag || '🇵🇭',
        lastItemName: AppState.selectedItem ? AppState.selectedItem.name : '',
        lastPrice: AppState.selectedItem ? AppState.selectedItem.price : 0,
        timestamp: new Date().toISOString()
      });

      if (box) {
        box.innerHTML = renderNicknameStatus();
        lucide.createIcons();
      }
      updateSummarySection();

      if (AppState.serverMismatch) {
        showToast(`⚠️ Server Mismatch! Detected: ${data.region || data.regionCode}`, 'warning');
      } else {
        showToast(`Exact IGN Found: ${data.nickname} ♡`, 'success');
      }
    } else {
      AppState.verifiedNick = null;
      AppState.serverMismatch = false;
      AppState.nickCheckError = data.message || 'ID/Server not found on game server. Please check your credentials.';
      if (box) {
        box.innerHTML = renderNicknameStatus();
        lucide.createIcons();
      }
      updateSummarySection();
      showToast(AppState.nickCheckError, 'error');
    }
  } catch (err) {
    AppState.isCheckingNick = false;
    AppState.nickCheckError = 'Connection error while checking ID.';
    if (box) {
      box.innerHTML = renderNicknameStatus();
      lucide.createIcons();
    }
    showToast('Failed to check ID. Please check connection ♡', 'error');
  }
}

function selectItem(itemId) {
  const game = AppState.activeGame;
  if (!game) return;

  for (const sec of game.itemSections) {
    const found = sec.items.find(i => i.id === itemId);
    if (found) {
      AppState.selectedItem = found;
      break;
    }
  }

  // Visual toggle on DOM without losing input focus or scrolling
  document.querySelectorAll('.selectable-card[data-item-id]').forEach(card => {
    const isThis = card.getAttribute('data-item-id') === itemId;
    card.classList.toggle('active', isThis);
    const ind = card.querySelector('.check-indicator');
    if (ind) ind.style.display = isThis ? 'flex' : 'none';
  });

  updateSummarySection();
  if (AppState.selectedItem) {
    showToast(`Napili: ${AppState.selectedItem.name} 🎀`, 'info');
  }
}

function selectPayment(paymentId) {
  const found = SWEVENS_DATA.paymentMethods.find(p => p.id === paymentId);
  if (found) {
    AppState.selectedPayment = found;
    document.querySelectorAll('.selectable-card[data-payment-id]').forEach(card => {
      const isThis = card.getAttribute('data-payment-id') === paymentId;
      card.classList.toggle('active', isThis);
      const ind = card.querySelector('.check-indicator');
      if (ind) ind.style.display = isThis ? 'flex' : 'none';
    });
    updateSummarySection();
  }
}

function applyVoucherCode() {
  const input = document.getElementById('voucher-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  const voucher = SWEVENS_DATA.vouchers.find(v => v.code === code);
  if (!voucher) {
    showToast('Invalid promo code. Please check and try again! 🎀', 'error');
    return;
  }

  const basePrice = AppState.selectedItem ? AppState.selectedItem.price : 0;
  if (basePrice < voucher.minSpend) {
    showToast(`Voucher requires a minimum spend of ₱${voucher.minSpend.toFixed(2)}`, 'warning');
    return;
  }

  AppState.appliedVoucher = voucher;
  showToast(`Promo ${voucher.code} applied with love! 🎀`, 'success');
  updateSummarySection();
}

function useSuggestedVoucher(code) {
  const input = document.getElementById('voucher-input');
  if (input) {
    input.value = code;
    applyVoucherCode();
  }
}

function toggleIdGuideModal(show) {
  const modal = document.getElementById('id-guide-modal');
  if (modal) {
    modal.classList.toggle('hidden', !show);
    lucide.createIcons();
  }
}

function getFormattedAccountId() {
  const game = AppState.activeGame;
  if (!game) return '';
  const parts = [];
  for (const f of game.idFields) {
    if (AppState.accountData[f.id]) {
      parts.push(AppState.accountData[f.id]);
    }
  }
  return parts.join(' - ');
}

function calculateVoucherDiscount() {
  if (!AppState.appliedVoucher || !AppState.selectedItem) return 0;
  const price = AppState.selectedItem.price;
  if (AppState.appliedVoucher.type === 'percent') {
    return (price * AppState.appliedVoucher.discount) / 100;
  }
  return AppState.appliedVoucher.discount;
}

function calculatePaymentFee() {
  if (!AppState.selectedPayment || !AppState.selectedItem) return 0;
  const pm = AppState.selectedPayment;
  if (pm.feeType === 'percentage') {
    return (AppState.selectedItem.price * pm.fee) / 100;
  }
  return pm.fee;
}

function calculatePriceForPayment(pm) {
  const base = AppState.selectedItem ? AppState.selectedItem.price : 0;
  const discount = calculateVoucherDiscount();
  const discounted = Math.max(0, base - discount);
  const fee = pm.feeType === 'percentage' ? (discounted * pm.fee) / 100 : pm.fee;
  return discounted + fee;
}

function calculateCurrentTotal() {
  if (!AppState.selectedItem) return 0;
  const base = AppState.selectedItem.price;
  const discount = calculateVoucherDiscount();
  const fee = calculatePaymentFee();
  return Math.max(0, base - discount + fee);
}

function updateSummarySection() {
  const currentTotal = calculateCurrentTotal();
  const game = AppState.activeGame;
  const isMismatchBlocked = AppState.serverMismatch && game && game.regionCode === 'PH';

  // 1. Update Package Name
  const pkgEl = document.getElementById('summary-package-name');
  if (pkgEl) {
    pkgEl.textContent = AppState.selectedItem ? AppState.selectedItem.name : 'None selected';
  }

  // 2. Update Payment Name
  const payEl = document.getElementById('summary-payment-name');
  if (payEl) {
    payEl.textContent = AppState.selectedPayment ? AppState.selectedPayment.name : 'Select payment';
  }

  // 3. Update Account ID & Nick
  const accEl = document.getElementById('summary-account-id');
  if (accEl) {
    accEl.innerHTML = getFormattedAccountId() || '<span class="text-rose-500 font-normal">Not entered</span>';
  }

  const nickRow = document.getElementById('summary-nick-row');
  const nickVal = document.getElementById('summary-nick-value');
  if (nickRow && nickVal) {
    if (AppState.verifiedNick) {
      nickRow.style.display = 'flex';
      nickVal.textContent = AppState.verifiedNick;
    } else {
      nickRow.style.display = 'none';
    }
  }

  // 4. Update Price breakdown
  const baseEl = document.getElementById('summary-base-price');
  if (baseEl) {
    baseEl.textContent = `₱${(AppState.selectedItem ? AppState.selectedItem.price : 0).toFixed(2)}`;
  }

  const voucherRow = document.getElementById('summary-voucher-row');
  const voucherEl = document.getElementById('summary-voucher-discount');
  if (voucherRow && voucherEl) {
    if (AppState.appliedVoucher) {
      voucherRow.style.display = 'flex';
      voucherEl.textContent = `-₱${calculateVoucherDiscount().toFixed(2)}`;
    } else {
      voucherRow.style.display = 'none';
    }
  }

  const feeEl = document.getElementById('summary-gateway-fee');
  if (feeEl) {
    feeEl.textContent = `₱${calculatePaymentFee().toFixed(2)}`;
  }

  const grandEl = document.getElementById('summary-grand-total');
  if (grandEl) {
    grandEl.textContent = `₱${currentTotal.toFixed(2)}`;
  }

  // 5. Update Buy button
  const buyBtn = document.getElementById('checkout-buy-button');
  const buyBtnText = document.getElementById('checkout-buy-button-text');
  if (buyBtn && buyBtnText) {
    if (isMismatchBlocked) {
      buyBtn.className = 'w-full py-3.5 rounded-2xl opacity-60 cursor-not-allowed bg-rose-400 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-xl';
      buyBtnText.textContent = 'Server Mismatch (Bawal sa PH Server)';
    } else {
      buyBtn.className = 'w-full py-3.5 rounded-2xl btn-pink font-black text-sm flex items-center justify-center space-x-2 shadow-xl';
      buyBtnText.textContent = `BUY NOW • ₱${currentTotal.toFixed(2)}`;
    }
  }

  // 6. Update payment prices
  if (SWEVENS_DATA && SWEVENS_DATA.paymentMethods) {
    SWEVENS_DATA.paymentMethods.forEach(pm => {
      const pEl = document.getElementById(`payment-price-${pm.id}`);
      if (pEl) {
        pEl.textContent = `₱${calculatePriceForPayment(pm).toFixed(2)}`;
      }
    });
  }
}

// ----------------- CHECKOUT MODAL & TRANSACTION -----------------
function proceedToCheckout() {
  const game = AppState.activeGame;
  if (!game) return;

  for (const f of game.idFields) {
    if (f.required && (!AppState.accountData[f.id] || AppState.accountData[f.id].trim() === '')) {
      showToast(`Please enter your ${f.label} before proceeding! 🎀`, 'error');
      const inputEl = document.getElementById(`input-${f.id}`);
      if (inputEl) inputEl.focus();
      return;
    }
  }

  if (!AppState.selectedItem) {
    showToast('Please select a denomination first! 🎀', 'error');
    return;
  }

  if (!AppState.selectedPayment) {
    showToast('Please choose a payment method! 🎀', 'error');
    return;
  }

  // Server mismatch check
  if (AppState.serverMismatch && game.regionCode === 'PH') {
    showToast(`❌ Hindi pwedeng iprocess! Ang account na ${AppState.verifiedNick || 'ito'} ay taga-${AppState.detectedServerName || AppState.detectedRegion}. Lumipat sa tamang server para makapag-order! 🎀`, 'error');
    return;
  }

  const total = calculateCurrentTotal();

  // If paying with wallet saldo
  if (AppState.selectedPayment.id === 'wallet') {
    if (!AppState.currentUser) {
      openAuthModal('login');
      return;
    }
    const userBal = AppState.currentUser.walletBalance || 0;
    if (userBal < total) {
      showToast(`Insufficient Wallet Saldo (Balance: ₱${userBal.toFixed(2)}). Please cash in first! 🎀`, 'warning');
      openDepositModal();
      return;
    }

    // Instant payment from saldo
    AppState.currentUser.walletBalance -= total;
    // Earn reward points (e.g. 1 point per ₱1 spent)
    AppState.currentUser.points = (AppState.currentUser.points || 0) + Math.floor(total);

    try {
      localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
    } catch (e) {}

    renderNavigation();

    const orderId = 'SW-' + Math.floor(100000 + Math.random() * 900000);
    simulatePaymentSuccess(orderId, total);
    return;
  }

  openCheckoutModal();
}

function openCheckoutModal() {
  const orderId = 'SW-' + Math.floor(100000 + Math.random() * 900000);
  const total = calculateCurrentTotal();
  const pm = AppState.selectedPayment;
  const game = AppState.activeGame;
  const item = AppState.selectedItem;

  const modalHtml = `
    <div id="checkout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div class="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-lg w-full rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative">
        <button onclick="closeCheckoutModal()" class="absolute top-5 right-5 text-[var(--text-dim)] hover:text-[var(--text-main)]">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-2xl">
            🎀
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-mono font-bold text-[var(--accent-pink)]">${orderId}</span>
              <span class="text-[10px] text-amber-600 bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold">Awaiting Payment</span>
            </div>
            <h3 class="text-lg font-black text-[var(--text-main)]">SWEVENS Quick Checkout ♡</h3>
          </div>
        </div>

        <!-- Timer -->
        <div class="bg-[var(--bg-subtle)] rounded-2xl p-3 border border-[var(--border-color)] flex items-center justify-between text-xs">
          <span class="text-[var(--text-muted)]">Payment window expires in:</span>
          <span id="checkout-countdown" class="font-mono font-bold text-[var(--accent-pink)] text-sm">14:59</span>
        </div>

        <!-- Simulated QR Ph / GCash Code -->
        <div class="text-center py-2 space-y-3">
          <div class="inline-block p-4 bg-white rounded-3xl shadow-xl border-2 border-[var(--border-color)]">
            <svg class="w-44 h-44 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 h30 v30 h-30 z M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z" />
              <path d="M70,0 h30 v30 h-30 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z" />
              <path d="M0,70 h30 v30 h-30 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z" />
              <rect x="35" y="5" width="10" height="20" />
              <rect x="50" y="15" width="15" height="10" />
              <rect x="35" y="35" width="30" height="30" rx="4" />
              <rect x="75" y="35" width="20" height="10" />
              <rect x="75" y="50" width="10" height="20" />
              <rect x="5" y="40" width="20" height="10" />
              <rect x="15" y="55" width="10" height="10" />
              <rect x="40" y="75" width="20" height="10" />
              <rect x="65" y="75" width="30" height="20" />
            </svg>
            <div class="text-[10px] font-black text-pink-600 tracking-wider mt-1">SWEVENS • OFFICIAL QR PH 🎀</div>
          </div>
          <div class="text-xs text-[var(--text-muted)]">
            Scan via <strong class="text-[var(--accent-pink)]">${pm.name}</strong> or any Philippine banking app
          </div>
        </div>

        <!-- Payment details breakdown -->
        <div class="space-y-1.5 p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs">
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">Merchant:</span>
            <span class="font-bold text-[var(--text-main)]">SWEVENS PHILIPPINES INC.</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">Amount to Pay:</span>
            <span class="font-black text-[var(--accent-pink)] text-sm">₱${total.toFixed(2)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">Target Account:</span>
            <span class="font-mono text-[var(--text-main)] font-semibold">${getFormattedAccountId()} (${AppState.verifiedNick || 'Verified'})</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2">
          <button 
            type="button" 
            onclick="simulatePaymentSuccess('${orderId}', ${total})"
            class="w-full py-3 rounded-2xl btn-pink font-bold text-xs flex items-center justify-center space-x-2"
          >
            <span>🎀</span>
            <span>I Have Completed Payment ♡</span>
          </button>
          <button 
            type="button" 
            onclick="closeCheckoutModal()"
            class="w-full py-2.5 rounded-2xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] text-xs font-semibold"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById('modal-root') || document.body;
  const existing = document.getElementById('checkout-modal');
  if (existing) existing.remove();

  const wrap = document.createElement('div');
  wrap.innerHTML = modalHtml;
  container.appendChild(wrap.firstElementChild);
  lucide.createIcons();

  startCheckoutTimer();
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.remove();
  if (window.checkoutInterval) clearInterval(window.checkoutInterval);
}

function startCheckoutTimer() {
  let seconds = 15 * 60;
  if (window.checkoutInterval) clearInterval(window.checkoutInterval);

  window.checkoutInterval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(window.checkoutInterval);
      closeCheckoutModal();
      showToast('Payment window expired. Please re-order! 🎀', 'error');
      return;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const el = document.getElementById('checkout-countdown');
    if (el) {
      el.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }, 1000);
}

function simulatePaymentSuccess(orderId, total) {
  closeCheckoutModal();

  const newOrder = {
    id: orderId,
    gameId: AppState.activeGame.id,
    gameTitle: AppState.activeGame.title,
    itemName: AppState.selectedItem.name,
    amount: total,
    paymentMethod: AppState.selectedPayment.name,
    accountId: getFormattedAccountId(),
    nickname: AppState.verifiedNick || 'CoquetteGamer_PH 🎀',
    email: AppState.userEmail || (AppState.currentUser?.email || 'player@swevens.ph'),
    status: 'Completed',
    timestamp: new Date().toISOString(),
    txHash: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6)
  };

  AppState.orders.unshift(newOrder);
  try {
    localStorage.setItem('swevens_orders', JSON.stringify(AppState.orders));
  } catch (e) {}

  savePlayerRechargeHistory({
    gameId: AppState.activeGame.id,
    gameTitle: AppState.activeGame.title,
    userId: AppState.accountData['userId'] || getFormattedAccountId(),
    zoneId: AppState.accountData['zoneId'] || '',
    nickname: AppState.verifiedNick || 'CoquetteGamer_PH 🎀',
    region: AppState.verifiedRegion || '',
    regionCode: AppState.detectedRegion || '',
    regionFlag: AppState.activeGame.serverFlag || '🇵🇭',
    lastItemName: AppState.selectedItem.name,
    lastPrice: total,
    timestamp: new Date().toISOString()
  });

  showToast(`Payment received! Order ${orderId} delivered with love ♡ 🎀`, 'success');

  setTimeout(() => {
    navigateTo('order-tracker');
    setTimeout(() => {
      searchOrderById(orderId);
    }, 150);
  }, 300);
}

// ----------------- ORDER TRACKER VIEW -----------------
function renderOrderTrackerView() {
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <!-- HEADER -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full coquette-badge text-xs font-bold">
          <span class="coquette-bow">🎀</span>
          <span>Official SWEVENS Verification ♡</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-[var(--text-main)]">Track Your Order Status</h1>
        <p class="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto">
          Enter your SWEVENS Order Number (e.g. SW-892410) or registered email to check real-time payment confirmation and diamond delivery.
        </p>
      </div>

      <!-- SEARCH INPUT CARD -->
      <div class="glass-panel p-6 space-y-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <i data-lucide="search" class="w-4 h-4 text-[var(--text-dim)] absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="order-search-query" 
              placeholder="Enter Order ID (e.g. SW-892410) or Email 🎀" 
              class="theme-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-mono"
            />
          </div>
          <button 
            onclick="performOrderSearch()"
            class="btn-pink px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shrink-0"
          >
            <span>🎀</span>
            <span>Track Order</span>
          </button>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
          <span>Recent orders:</span>
          ${AppState.orders.slice(0, 3).map(o => `
            <button onclick="searchOrderById('${o.id}')" class="px-2.5 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--accent-pink)] hover:bg-[var(--bg-surface)] font-mono text-[11px] border border-[var(--border-color)]">
              ${o.id}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- SEARCH RESULTS CONTAINER -->
      <div id="order-search-result" class="space-y-4">
        ${renderOrderResultCard(AppState.orders[0] || null)}
      </div>

    </div>
  `;
}

function initOrderTrackerEvents() {
  const input = document.getElementById('order-search-query');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performOrderSearch();
    });
  }
}

function performOrderSearch() {
  const input = document.getElementById('order-search-query');
  if (!input) return;
  const q = input.value.trim().toUpperCase();
  if (!q) {
    showToast('Please enter an Order ID or email 🎀', 'warning');
    return;
  }
  searchOrderById(q);
}

function searchOrderById(query) {
  const order = AppState.orders.find(o => 
    o.id.toUpperCase() === query.toUpperCase() || 
    (o.email && o.email.toLowerCase() === query.toLowerCase())
  );

  const container = document.getElementById('order-search-result');
  if (container) {
    container.innerHTML = renderOrderResultCard(order, query);
    lucide.createIcons();
  }
}

function renderOrderResultCard(order, query = '') {
  if (!order) {
    return `
      <div class="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center space-y-3 shadow-md">
        <span class="text-3xl block">🎀</span>
        <h4 class="text-sm font-bold text-[var(--text-main)]">No Order Found</h4>
        <p class="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
          We couldn't find an order matching "${query}". Please check your order ID or contact SWEVENS support ♡.
        </p>
      </div>
    `;
  }

  const isCompleted = order.status === 'Completed';

  return `
    <div class="glass-panel p-6 sm:p-8 space-y-6 border-2 border-[var(--border-color)]">
      
      <!-- Top Status Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5 border-b border-[var(--border-color)]">
        <div>
          <span class="text-xs font-mono font-bold text-[var(--accent-pink)]">Order #${order.id} 🎀</span>
          <h2 class="text-xl font-black text-[var(--text-main)]">${order.gameTitle}</h2>
          <span class="text-xs text-[var(--text-dim)]">${new Date(order.timestamp).toLocaleString()}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-400'} text-xs font-bold">
            <span class="w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}"></span>
            <span>${order.status.toUpperCase()} ♡</span>
          </span>
        </div>
      </div>

      <!-- PROGRESS TRACKER TIMELINE -->
      <div class="py-2">
        <div class="grid grid-cols-4 gap-2 text-center text-xs">
          <div class="space-y-1.5">
            <div class="w-8 h-8 rounded-full bg-[var(--accent-pink)] text-white font-bold mx-auto flex items-center justify-center shadow-md">
              <i data-lucide="check" class="w-4 h-4"></i>
            </div>
            <span class="font-bold text-[var(--text-main)] block text-[11px]">Placed</span>
          </div>
          <div class="space-y-1.5">
            <div class="w-8 h-8 rounded-full bg-[var(--accent-pink)] text-white font-bold mx-auto flex items-center justify-center shadow-md">
              <i data-lucide="check" class="w-4 h-4"></i>
            </div>
            <span class="font-bold text-[var(--text-main)] block text-[11px]">Paid</span>
          </div>
          <div class="space-y-1.5">
            <div class="w-8 h-8 rounded-full bg-[var(--accent-pink)] text-white font-bold mx-auto flex items-center justify-center shadow-md">
              <i data-lucide="check" class="w-4 h-4"></i>
            </div>
            <span class="font-bold text-[var(--text-main)] block text-[11px]">Verified</span>
          </div>
          <div class="space-y-1.5">
            <div class="w-8 h-8 rounded-full ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-[var(--border-color)] text-[var(--text-dim)]'} font-bold mx-auto flex items-center justify-center shadow-md">
              <i data-lucide="check-check" class="w-4 h-4"></i>
            </div>
            <span class="font-bold ${isCompleted ? 'text-emerald-600' : 'text-[var(--text-dim)]'} block text-[11px]">Delivered 🎀</span>
          </div>
        </div>
      </div>

      <!-- INVOICE SPECIFICATION DETAILS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs">
        <div>
          <span class="text-[var(--text-muted)] block mb-0.5">Purchased Item:</span>
          <span class="font-bold text-[var(--text-main)] text-sm">${order.itemName}</span>
        </div>
        <div>
          <span class="text-[var(--text-muted)] block mb-0.5">Amount Paid:</span>
          <span class="font-black text-[var(--accent-pink)] text-sm">₱${order.amount.toFixed(2)} (${order.paymentMethod})</span>
        </div>
        <div>
          <span class="text-[var(--text-muted)] block mb-0.5">Player / Account ID:</span>
          <span class="font-mono font-bold text-[var(--text-main)]">${order.accountId}</span>
        </div>
        <div>
          <span class="text-[var(--text-muted)] block mb-0.5">Verified Nickname:</span>
          <span class="font-bold text-emerald-600">${order.nickname}</span>
        </div>
        <div class="sm:col-span-2 pt-2 border-t border-[var(--border-color)] flex flex-wrap justify-between items-center text-[11px] text-[var(--text-dim)] font-mono">
          <span>TX HASH: ${order.txHash}</span>
          <span>EMAIL: ${order.email}</span>
        </div>
      </div>

      <!-- OFFICIAL WATERMARK RECEIPT SEAL -->
      <div class="p-3 rounded-2xl bg-pink-500/5 border border-pink-400/30 flex items-center justify-between text-xs">
        <div class="flex items-center space-x-2">
          <span class="text-base">🎀</span>
          <div>
            <div class="font-bold text-[var(--accent-pink)]">Verified Official Order • SWEVENS.PH</div>
            <div class="text-[var(--text-muted)] text-[11px]">Authorized by Portal Owner: <strong class="text-[var(--text-main)]">Cha (@itsme_cha) ♡</strong></div>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-400/40 text-[var(--accent-pink)] font-mono font-bold text-[10px] uppercase tracking-wider">
          AUTHENTICATED
        </span>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap justify-end gap-3 pt-2">
        <button onclick="window.print()" class="px-4 py-2 rounded-2xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] font-bold text-xs flex items-center space-x-1.5 transition border border-[var(--border-color)]">
          <i data-lucide="printer" class="w-3.5 h-3.5"></i>
          <span>Print Receipt 🎀</span>
        </button>
        <button onclick="openGamePage('${order.gameId}')" class="btn-pink px-5 py-2 rounded-2xl font-bold text-xs flex items-center space-x-1.5">
          <span>🎀</span>
          <span>Buy Again ♡</span>
        </button>
      </div>

    </div>
  `;
}

// ----------------- MLBB SERVER CHECKER VIEW -----------------
function renderServerCheckerView() {
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <div class="text-center space-y-2">
        <div class="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full coquette-badge text-xs font-bold">
          <span class="coquette-bow">🎀</span>
          <span>MLBB Zone & Region Detection ♡</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-[var(--text-main)]">Mobile Legends Server & ID Checker</h1>
        <p class="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto">
          Verify your Moonton User ID and Zone ID on SWEVENS before buying diamonds to ensure your server region is 100% compatible.
        </p>
      </div>

      <div class="glass-panel p-6 sm:p-8 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">User ID</label>
            <input 
              type="number" 
              id="sc-user-id" 
              placeholder="e.g. 12345678" 
              class="theme-input w-full px-3.5 py-2.5 rounded-2xl text-sm font-mono"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Zone ID (4-5 digits)</label>
            <input 
              type="number" 
              id="sc-zone-id" 
              placeholder="e.g. 1004" 
              class="theme-input w-full px-3.5 py-2.5 rounded-2xl text-sm font-mono"
            />
          </div>
        </div>

        <button 
          onclick="runServerCheck()" 
          id="btn-run-sc"
          class="w-full py-3 rounded-2xl btn-pink font-bold text-xs flex items-center justify-center space-x-2"
        >
          <span>🎀</span>
          <span>Check Server & In-Game Nickname Now ♡</span>
        </button>

        <!-- Result Box -->
        <div id="server-check-result" class="hidden p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-4 shadow-inner">
          <!-- Dynamically inserted -->
        </div>
      </div>

      <!-- Quick Tips -->
      <div class="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] space-y-2 shadow-sm">
        <h4 class="font-bold text-[var(--text-main)] flex items-center space-x-1.5">
          <span>🎀</span>
          <span>Why is Zone ID verification critical?</span>
        </h4>
        <p>Mobile Legends restricts cross-region diamond gifting for specific server pools. SWEVENS checker guarantees that your diamond package will be credited instantly without errors ♡.</p>
      </div>

    </div>
  `;
}

function initServerCheckerEvents() {}

async function runServerCheck() {
  const userId = document.getElementById('sc-user-id')?.value.trim();
  const zoneId = document.getElementById('sc-zone-id')?.value.trim();

  if (!userId || !zoneId) {
    showToast('Please enter both User ID and Zone ID 🎀', 'error');
    return;
  }

  const btn = document.getElementById('btn-run-sc');
  if (btn) {
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Summoning Moonton Game Server... 🎀</span>`;
    lucide.createIcons();
  }

  const resultBox = document.getElementById('server-check-result');

  try {
    const res = await fetch('/api/check-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: 'mobile-legends-ph',
        userId: userId,
        zoneId: zoneId
      })
    });
    const data = await res.json();

    if (btn) {
      btn.innerHTML = `<span>🎀</span><span>Check Server & In-Game Nickname Now ♡</span>`;
      lucide.createIcons();
    }

    if (resultBox) {
      resultBox.classList.remove('hidden');
      if (data.success && data.nickname) {
        resultBox.innerHTML = `
          <div class="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="font-bold text-[var(--text-main)] text-sm">Account Verified in Moonton Database ♡</span>
            </div>
            <span class="text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-400">Match 100% ✓</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div>
              <span class="text-[var(--text-dim)] block">Exact In-Game Name:</span>
              <span class="font-black text-[var(--accent-pink)] text-base">${data.nickname}</span>
            </div>
            <div>
              <span class="text-[var(--text-dim)] block">User ID & Zone:</span>
              <span class="font-bold text-[var(--text-main)]">${data.userId} (${data.zoneId})</span>
            </div>
            <div>
              <span class="text-[var(--text-dim)] block">Server Region:</span>
              <span class="font-bold text-[var(--text-main)]">${data.region || '🇵🇭'} (${data.regionCode || 'PH'})</span>
            </div>
            <div>
              <span class="text-[var(--text-dim)] block">Recharge Status:</span>
              <span class="font-bold text-emerald-600">Ready for Instant Reload 🎀</span>
            </div>
          </div>
          <div class="pt-3 border-t border-[var(--border-color)] flex justify-end">
            <button onclick="proceedFromChecker('${data.userId}', '${data.zoneId}', '${encodeURIComponent(data.nickname)}')" class="btn-pink px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-1.5 shadow-md">
              <span>Top Up Diamonds for ${data.nickname} ♡</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5 ml-1"></i>
            </button>
          </div>
        `;
        showToast(`Found exact IGN: ${data.nickname} 🎀`, 'success');
      } else {
        resultBox.innerHTML = `
          <div class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 space-y-2">
            <div class="flex items-center space-x-2 font-bold">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-500"></i>
              <span>Account Not Found on Official Server</span>
            </div>
            <p class="text-xs">${data.message || 'The User ID or Zone ID entered does not match any active Moonton account. Please check your in-game profile.'}</p>
          </div>
        `;
        showToast(data.message || 'Account not found in Moonton database! 🎀', 'error');
      }
      lucide.createIcons();
    }
  } catch (err) {
    if (btn) {
      btn.innerHTML = `<span>🎀</span><span>Check Server & In-Game Nickname Now ♡</span>`;
      lucide.createIcons();
    }
    showToast('Network error while querying Moonton gateway. ♡', 'error');
  }
}

function proceedFromChecker(userId, zoneId, encodedNick) {
  AppState.accountData = AppState.accountData || {};
  AppState.accountData['userId'] = userId;
  AppState.accountData['zoneId'] = zoneId;
  AppState.verifiedNick = decodeURIComponent(encodedNick);
  openGamePage('mobile-legends-ph');
}

// ----------------- PRICE LIST VIEW -----------------
function renderPriceListView() {
  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      <div class="text-center space-y-2">
        <h1 class="text-2xl sm:text-4xl font-extrabold text-[var(--text-main)]">SWEVENS Complete Price List 🎀</h1>
        <p class="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto">
          Compare real-time rates across all denominations and payment methods with zero hidden markup ♡.
        </p>
      </div>

      <!-- Price Table Card -->
      <div class="glass-panel overflow-hidden">
        <div class="p-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div class="relative w-full sm:w-72">
            <i data-lucide="search" class="w-4 h-4 text-[var(--text-dim)] absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="price-table-search" 
              placeholder="Filter by game or item 🎀..." 
              oninput="filterPriceTable(this.value)"
              class="theme-input w-full pl-9 pr-4 py-2 rounded-2xl text-xs"
            />
          </div>
          <div class="text-xs text-[var(--text-muted)]">
            Updated today: <span class="text-[var(--accent-pink)] font-semibold">October 2026 🎀</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[var(--text-muted)]">
            <thead class="text-[var(--text-main)] uppercase font-semibold border-b border-[var(--border-color)]" style="background: var(--table-head-bg);">
              <tr>
                <th class="py-3 px-4">Game</th>
                <th class="py-3 px-4">Package Item</th>
                <th class="py-3 px-4">Regular Market</th>
                <th class="py-3 px-4">SWEVENS Price</th>
                <th class="py-3 px-4">Savings</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody id="price-table-body" class="divide-y divide-[var(--border-color)]">
              ${renderPriceTableRows()}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function initPriceListEvents() {}

function renderPriceTableRows(filter = '') {
  const rows = [];
  SWEVENS_DATA.games.forEach(game => {
    game.itemSections.forEach(section => {
      section.items.forEach(item => {
        if (!filter || 
            game.title.toLowerCase().includes(filter.toLowerCase()) || 
            item.name.toLowerCase().includes(filter.toLowerCase())) {
          const savings = item.originalPrice ? item.originalPrice - item.price : 0;
          rows.push(`
            <tr class="hover:bg-[var(--bg-subtle)] transition">
              <td class="py-3 px-4 font-bold text-[var(--text-main)] flex items-center space-x-2">
                <img src="${game.image}" class="w-6 h-6 rounded-lg object-cover" />
                <span>${game.title}</span>
              </td>
              <td class="py-3 px-4 font-semibold text-[var(--text-muted)]">${item.name} (${item.amount})</td>
              <td class="py-3 px-4 text-[var(--text-dim)] line-through">₱${(item.originalPrice || item.price * 1.15).toFixed(2)}</td>
              <td class="py-3 px-4 font-bold text-[var(--accent-pink)]">₱${item.price.toFixed(2)}</td>
              <td class="py-3 px-4 text-emerald-600 font-semibold">${savings > 0 ? `Save ₱${savings.toFixed(2)}` : 'Best Rate 🎀'}</td>
              <td class="py-3 px-4 text-right">
                <button onclick="openGamePage('${game.id}')" class="px-3 py-1 rounded-xl btn-pink text-[11px] font-bold">
                  Top Up ♡
                </button>
              </td>
            </tr>
          `);
        }
      });
    });
  });

  return rows.join('');
}

function filterPriceTable(val) {
  const tbody = document.getElementById('price-table-body');
  if (tbody) {
    tbody.innerHTML = renderPriceTableRows(val);
    lucide.createIcons();
  }
}

// ----------------- AFFILIATE & RESELLER VIEW -----------------
function renderAffiliateView() {
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <div class="text-center space-y-2">
        <div class="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full coquette-badge text-xs font-bold">
          <span class="coquette-bow">🎀</span>
          <span>SWEVENS Coquette Partner Program ♡</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold text-[var(--text-main)]">Affiliate & Reseller Hub</h1>
        <p class="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto">
          Start your own game top-up business or earn passive commissions by sharing sweet referral links.
        </p>
      </div>

      <!-- Tiers -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="p-6 rounded-3xl glass-panel space-y-4">
          <div class="text-xs font-bold text-[var(--text-dim)] uppercase">Bronze Partner 🎀</div>
          <div class="text-2xl font-black text-[var(--text-main)]">2.5% <span class="text-xs font-normal text-[var(--text-dim)]">Commission</span></div>
          <p class="text-xs text-[var(--text-muted)]">Ideal for gamers sharing links with friends and Discord servers.</p>
          <ul class="text-xs text-[var(--text-muted)] space-y-1.5 pt-2 border-t border-[var(--border-color)]">
            <li class="flex items-center space-x-1.5"><span>🎀</span><span>Instant Payout via GCash</span></li>
            <li class="flex items-center space-x-1.5"><span>🎀</span><span>Personal Affiliate Dashboard</span></li>
          </ul>
        </div>

        <div class="p-6 rounded-3xl glass-panel space-y-4 border-2 border-[var(--accent-pink)] shadow-xl relative">
          <div class="absolute -top-3 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase shadow">Most Loved 🎀</div>
          <div class="text-xs font-bold text-[var(--accent-pink)] uppercase">Silver Reseller ♡</div>
          <div class="text-2xl font-black text-[var(--text-main)]">5.0% <span class="text-xs font-normal text-[var(--text-dim)]">Rebate</span></div>
          <p class="text-xs text-[var(--text-muted)]">For active digital store owners and Facebook community moderators.</p>
          <ul class="text-xs text-[var(--text-muted)] space-y-1.5 pt-2 border-t border-[var(--border-color)]">
            <li class="flex items-center space-x-1.5"><span>🎀</span><span>Wholesale VIP Pricing</span></li>
            <li class="flex items-center space-x-1.5"><span>🎀</span><span>Priority 24/7 Agent Support</span></li>
          </ul>
        </div>

        <div class="p-6 rounded-3xl glass-panel space-y-4">
          <div class="text-xs font-bold text-amber-500 uppercase">Gold VIP Merchant ✨</div>
          <div class="text-2xl font-black text-[var(--text-main)]">8.0% <span class="text-xs font-normal text-[var(--text-dim)]">Margin</span></div>
          <p class="text-xs text-[var(--text-muted)]">High-volume gaming clubs, esports teams, and digital merchants.</p>
          <ul class="text-xs text-[var(--text-muted)] space-y-1.5 pt-2 border-t border-[var(--border-color)]">
            <li class="flex items-center space-x-1.5"><span>🎀</span><span>Automated API Integration</span></li>
            <li class="flex items-center space-x-1.5"><span>🎀</span><span>Dedicated Account Manager</span></li>
          </ul>
        </div>
      </div>

      <!-- Referral Link Generator -->
      <div class="p-6 rounded-3xl glass-panel space-y-4">
        <h3 class="font-bold text-[var(--text-main)] text-base">Generate Your Coquette Referral Link 🎀</h3>
        <div class="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            readonly 
            value="https://swevens.ph/?ref=COQUETTE_QUEEN_${Math.floor(1000 + Math.random() * 9000)}" 
            id="affiliate-link-input"
            class="theme-input flex-1 px-4 py-2.5 rounded-2xl text-xs font-mono"
          />
          <button onclick="copyAffiliateLink()" class="btn-pink px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 shrink-0">
            <i data-lucide="copy" class="w-4 h-4"></i>
            <span>Copy Link ♡</span>
          </button>
        </div>
      </div>

    </div>
  `;
}

function initAffiliateEvents() {}

function copyAffiliateLink() {
  const input = document.getElementById('affiliate-link-input');
  if (input) {
    navigator.clipboard.writeText(input.value);
    showToast('Coquette referral link copied to clipboard! 🎀', 'success');
  }
}

// ----------------- AUTHENTICATION MODAL -----------------
function openAuthModal(mode = 'login') {
  const modalHtml = `
    <div id="auth-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div class="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-md w-full rounded-3xl p-6 space-y-5 shadow-2xl relative">
        <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--text-main)]">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="text-center space-y-1">
          <div class="text-3xl mb-1">🎀</div>
          <h3 class="text-xl font-black text-[var(--text-main)]">${mode === 'login' ? 'Member Login' : 'Create Free Account'}</h3>
          <p class="text-xs text-[var(--text-muted)]">${mode === 'login' ? 'Access your wallet saldo, saved profiles, and discounts ♡' : 'Join 1.1M+ sweet Filipino gamers today 🎀'}</p>
        </div>

        <div class="space-y-3">
          <!-- Google OAuth Simulator -->
          <button onclick="simulateGoogleLogin()" class="w-full py-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-main)] flex items-center justify-center space-x-2 transition shadow-sm">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.14z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.33 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12s.45 3.8 1.26 5.42l4.06-3.15z"/><path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.06 3.15c.94-2.83 3.57-4.96 6.67-4.96z"/></svg>
            <span>Continue with Google</span>
          </button>

          <div class="relative flex py-1 items-center">
            <div class="flex-grow border-t border-[var(--border-color)]"></div>
            <span class="flex-shrink mx-2 text-[10px] text-[var(--text-dim)] uppercase">Or with email / phone</span>
            <div class="flex-grow border-t border-[var(--border-color)]"></div>
          </div>

          ${mode === 'register' ? `
            <div>
              <label class="block text-xs font-semibold text-[var(--text-muted)] mb-1">Full Name</label>
              <input type="text" id="auth-name" placeholder="Cha 🎀" value="Cha 🎀" class="theme-input w-full px-3 py-2 rounded-2xl text-xs" />
            </div>
          ` : ''}
          <div>
            <label class="block text-xs font-semibold text-[var(--text-muted)] mb-1">${mode === 'login' ? 'Username or Email / Mobile' : 'Email or Mobile Number'}</label>
            <input type="text" id="auth-email" placeholder="e.g. itsme_cha 🎀" value="${mode === 'login' ? 'itsme_cha' : ''}" class="theme-input w-full px-3 py-2 rounded-2xl text-xs font-mono" />
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-xs font-semibold text-[var(--text-muted)]">Password</label>
              ${mode === 'login' ? `<span class="text-[10px] text-[var(--text-dim)]">Hint: fries1510</span>` : ''}
            </div>
            <input type="password" id="auth-pass" placeholder="Enter password" value="${mode === 'login' ? 'fries1510' : ''}" class="theme-input w-full px-3 py-2 rounded-2xl text-xs" />
          </div>

          <button onclick="submitAuthForm('${mode}')" class="w-full py-2.5 rounded-2xl btn-pink text-xs font-bold mt-2 shadow-md">
            ${mode === 'login' ? 'Log In Now ♡' : 'Create Account 🎀'}
          </button>
        </div>

        <div class="text-center text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
          ${mode === 'login' ? `
            <span>Don't have an account? </span>
            <button onclick="closeAuthModal(); openAuthModal('register')" class="text-[var(--accent-pink)] hover:underline font-bold">Register here 🎀</button>
          ` : `
            <span>Already have an account? </span>
            <button onclick="closeAuthModal(); openAuthModal('login')" class="text-[var(--accent-pink)] hover:underline font-bold">Log in here ♡</button>
          `}
        </div>
      </div>
    </div>
  `;

  closeAuthModal();
  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstElementChild);
  lucide.createIcons();
}

function closeAuthModal() {
  const m = document.getElementById('auth-modal');
  if (m) m.remove();
}

function simulateGoogleLogin() {
  closeAuthModal();
  AppState.currentUser = JSON.parse(JSON.stringify(SWEVENS_DATA.defaultMemberAccount));
  try {
    localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
  } catch (e) {}
  renderNavigation();
  showToast(`Signed in with Google as ${AppState.currentUser.name}! 🎀`, 'success');
  navigateTo('account');
}

function submitAuthForm(mode) {
  const userInput = document.getElementById('auth-email')?.value.trim();
  const passInput = document.getElementById('auth-pass')?.value.trim();
  const name = document.getElementById('auth-name')?.value.trim() || 'Cha 🎀';

  if (!userInput) {
    showToast('Please enter your username, email, or mobile number 🎀', 'error');
    return;
  }

  if (mode === 'login') {
    // Check if logging in as itsme_cha / fries1510
    if (userInput.toLowerCase() === 'itsme_cha' || userInput.toLowerCase().includes('cha') || passInput === 'fries1510') {
      AppState.currentUser = JSON.parse(JSON.stringify(SWEVENS_DATA.defaultMemberAccount));
      if (passInput) AppState.currentUser.password = passInput;
      try {
        localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
      } catch (e) {}
      closeAuthModal();
      renderNavigation();
      showToast('Welcome back Cha (itsme_cha)! 🎀 Signed in successfully ♡', 'success');
      navigateTo('account');
      return;
    }
  }

  // Otherwise standard register / login
  AppState.currentUser = {
    id: 'USR-' + Math.floor(10000 + Math.random() * 90000),
    name: name,
    username: userInput.includes('@') ? userInput.split('@')[0] : userInput,
    password: passInput || 'fries1510',
    email: userInput.includes('@') ? userInput : `${userInput}@swevens.ph`,
    phone: '0917-510-1510',
    tier: 'Silver Reseller',
    walletBalance: 1450.00,
    points: 1450,
    affiliateCode: 'SWEVENS-' + (userInput.length > 3 ? userInput.substring(0, 5).toUpperCase() : 'CHA'),
    affiliateEarnings: 520.00,
    totalSalesReferred: 24,
    monthlyMilestoneTarget: 500000,
    monthlyMilestoneProgress: 84250,
    savedAccounts: SWEVENS_DATA.defaultMemberAccount.savedAccounts,
    deposits: SWEVENS_DATA.defaultMemberAccount.deposits,
    pointsHistory: SWEVENS_DATA.defaultMemberAccount.pointsHistory,
    withdrawals: SWEVENS_DATA.defaultMemberAccount.withdrawals
  };

  try {
    localStorage.setItem('swevens_user', JSON.stringify(AppState.currentUser));
  } catch (e) {}

  closeAuthModal();
  renderNavigation();
  showToast(`Welcome ${name}! You are now signed into SWEVENS ♡`, 'success');
  navigateTo('account');
}

function logoutUser() {
  AppState.currentUser = null;
  try {
    localStorage.removeItem('swevens_user');
  } catch (e) {}
  renderNavigation();
  showToast('Logged out successfully ♡', 'info');
  navigateTo('home');
}

// ----------------- TOAST ALERTS & TICKER -----------------
function showToast(message, type = 'info') {
  const colors = {
    info: 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--accent-pink)] shadow-xl',
    success: 'bg-[var(--bg-card)] border-emerald-400 text-emerald-600 shadow-xl',
    error: 'bg-[var(--bg-card)] border-rose-400 text-rose-600 shadow-xl',
    warning: 'bg-[var(--bg-card)] border-amber-400 text-amber-600 shadow-xl'
  };

  const toast = document.createElement('div');
  toast.className = `fixed bottom-20 sm:bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl border transition-all duration-300 translate-y-4 opacity-0 ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <span>🎀</span>
    <span class="text-xs font-semibold">${message}</span>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function renderTicker() {
  const el = document.getElementById('live-sales-ticker');
  if (!el) return;

  const tickerItems = [
    'User 0917*** bought Weekly Diamond Pass via GCash on SWEVENS 🎀 (10s ago)',
    'User 0928*** purchased 1,375 Valorant Points via QR Ph ♡',
    'User 0966*** reloaded 112 MLBB Diamonds via Maya ✨',
    'User 0908*** bought Blessing of the Welkin Moon via ShopeePay 🌸',
    'User 0995*** got 800 Roblox Robux via QR Ph 🎀',
    'User 0915*** redeemed ₱500 Steam Wallet Code via BPI Direct ♡'
  ];

  el.innerHTML = tickerItems.map(item => `
    <span class="inline-flex items-center space-x-2">
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent-pink)]"></span>
      <span>${item}</span>
    </span>
  `).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
}

function setupGlobalEvents() {}

// ----------------- LIVE PINK COQUETTE DESIGN ELEMENTS 🎀🌸✨ -----------------
function initCoquetteLiveElements() {
  const layer = document.getElementById('coquette-floating-layer');
  if (!layer) return;

  const symbols = ['🎀', '🌸', '✨', '💖', '🦋', '🌷', '♡', '🎀', '🌸'];
  const maxItems = 16;
  let currentItems = 0;

  function spawnFloatingItem() {
    if (currentItems >= maxItems) return;

    const item = document.createElement('div');
    item.className = 'floating-item';
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    // Randomize initial positions & drift animations
    const left = Math.random() * 95; // 0% to 95%
    const duration = 12 + Math.random() * 16; // 12s to 28s
    const size = 15 + Math.random() * 16; // 15px to 31px
    const driftX = (Math.random() - 0.5) * 120; // -60px to +60px
    const rot = (Math.random() - 0.5) * 90; // -45deg to +45deg
    const opacity = 0.45 + Math.random() * 0.45; // 0.45 to 0.9

    item.style.left = `${left}%`;
    item.style.fontSize = `${size}px`;
    item.style.animationDuration = `${duration}s`;
    item.style.opacity = opacity;
    item.style.setProperty('--drift-x', `${driftX}px`);
    item.style.setProperty('--rot', `${rot}deg`);

    layer.appendChild(item);
    currentItems++;

    item.addEventListener('animationend', () => {
      item.remove();
      currentItems--;
    });
  }

  // Pre-seed a few items and start gentle interval
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnFloatingItem, i * 600);
  }
  setInterval(spawnFloatingItem, 2200);

  // Sparkle Trail on mouse movement
  let lastSparkleTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < 80) return; // Throttled for smooth 60fps performance
    lastSparkleTime = now;
    createSparkle(e.clientX, e.clientY);
  });

  // Sparkle Burst on click
  window.addEventListener('click', (e) => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        createSparkle(e.clientX + (Math.random() - 0.5) * 24, e.clientY + (Math.random() - 0.5) * 24);
      }, i * 45);
    }
  });

  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'coquette-sparkle-particle';
    const particles = ['✨', '🌸', '🎀', '💖', '★', '♡'];
    sparkle.textContent = particles[Math.floor(Math.random() * particles.length)];
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 850);
  }
}

function copyVoucherCode(code) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`Voucher code "${code}" copied with love! 🎀 Enjoy 5% OFF ♡`, 'success');
    }).catch(() => {
      showToast(`Use voucher code: ${code} 🎀`, 'info');
    });
  } else {
    showToast(`Use voucher code: ${code} 🎀`, 'info');
  }
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
