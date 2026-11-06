/**
 * ALTA - Main Application Controller
 * Handles Navigation, State Management, Views, and Interactive Animations
 */

const ALTA_APP = {
  currentView: 'overview',
  currentLearnStep: 1,
  activeCertificateState: 'not-eligible', // Starts as honest 'not-eligible' for Day 1
  sidebarOpen: false,
  rotatorInterval: null,

  init: function() {
    this.renderHeaderUserInfo();
    this.renderOverview();
    this.renderAchievements();
    this.renderLeaderboard();
    this.renderProgress();
    this.render90DayChallenge();
    this.renderCertificate();
    this.renderProfileAndSettings();
    this.renderTokenDashboard();
    this.setupEventListeners();
    this.initHeroTextRotator();
    this.initScrollReveal();

    // Initialize sub-engines
    if (window.ALTA_AI) ALTA_AI.init();
    if (window.ALTA_GAMES) {
      setTimeout(() => {
        ALTA_GAMES.loopRunner.init('loopRunnerCanvas');
        ALTA_GAMES.arrayQuest.init();
      }, 200);
    }
  },

  // 1. ANIMATION: Rotating Headline Text in Hero
  initHeroTextRotator: function() {
    const el = document.getElementById('heroRotatingText');
    if (!el) return;

    const phrases = ["Build Logic", "Think Better", "Solve Independently", "Master Invariants"];
    let idx = 0;

    if (this.rotatorInterval) clearInterval(this.rotatorInterval);

    this.rotatorInterval = setInterval(() => {
      // Fade out
      el.classList.remove('text-rotate-visible');
      el.classList.add('text-rotate-hidden');

      setTimeout(() => {
        idx = (idx + 1) % phrases.length;
        el.textContent = phrases[idx];
        // Fade in
        el.classList.remove('text-rotate-hidden');
        el.classList.add('text-rotate-visible');
      }, 350);
    }, 2800);
  },

  // 2. ANIMATION: Viewport Scroll Reveal (Intersection Observer)
  initScrollReveal: function() {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements || elements.length === 0) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      elements.forEach(el => observer.observe(el));
    } else {
      // Fallback
      elements.forEach(el => el.classList.add('revealed'));
    }
  },

  renderHeaderUserInfo: function() {
    const user = ALTA_DATA.user;
    const tokenPill = document.getElementById('userTokenPill');
    const streakPill = document.getElementById('userStreakPill');
    const userAvatarImg = document.getElementById('navbarAvatarImg');
    const sidebarAvatarImg = document.getElementById('sidebarAvatarImg');
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserRole = document.getElementById('sidebarUserRole');
    const sidebarXpLabel = document.getElementById('sidebarXpLabel');
    const sidebarXpBar = document.getElementById('sidebarXpBar');

    if (tokenPill) tokenPill.textContent = `🪙 ${user.tokens}`;
    if (streakPill) streakPill.textContent = `🔥 ${user.streak}d`;
    if (userAvatarImg) userAvatarImg.src = user.avatar;
    if (sidebarAvatarImg) sidebarAvatarImg.src = user.avatar;
    if (sidebarUserName) sidebarUserName.textContent = user.name;
    if (sidebarUserRole) sidebarUserRole.textContent = `Level ${user.level} • ${user.levelTitle}`;
    if (sidebarXpLabel) sidebarXpLabel.textContent = `${user.xp} / ${user.xpToNext} XP`;
    if (sidebarXpBar) sidebarXpBar.style.width = `${(user.xp / user.xpToNext) * 100}%`;
  },

  // Main Navigation Controller
  navigate: function(viewId) {
    this.currentView = viewId;

    // Hide all view containers
    document.querySelectorAll('.app-view-container').forEach(el => el.classList.add('hidden'));

    // Show target view container
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active state in sidebar
    document.querySelectorAll('.sidebar-nav-item').forEach(btn => {
      btn.classList.remove('bg-cyan-500/10', 'text-cyan-400', 'border-l-2', 'border-cyan-400', 'font-semibold');
      btn.classList.add('text-slate-400', 'hover:text-slate-200', 'hover:bg-white/5');
      if (btn.getAttribute('data-view') === viewId) {
        btn.classList.add('bg-cyan-500/10', 'text-cyan-400', 'border-l-2', 'border-cyan-400', 'font-semibold');
        btn.classList.remove('text-slate-400');
      }
    });

    // Close mobile sidebar if open
    this.toggleMobileSidebar(false);

    // Context triggers
    if (viewId === 'game-zone') {
      setTimeout(() => {
        ALTA_GAMES.loopRunner.init('loopRunnerCanvas');
        ALTA_GAMES.arrayQuest.init();
      }, 100);
    }
  },

  togglePortalMode: function(mode) {
    const landing = document.getElementById('altaLandingPage');
    const portal = document.getElementById('altaStudentApp');
    if (mode === 'landing') {
      landing?.classList.remove('hidden');
      portal?.classList.add('hidden');
      this.initHeroTextRotator();
      this.initScrollReveal();
    } else {
      landing?.classList.add('hidden');
      portal?.classList.remove('hidden');
      this.navigate(this.currentView || 'overview');
    }
  },

  toggleMobileSidebar: function(forceState) {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (!sidebar) return;

    this.sidebarOpen = typeof forceState === 'boolean' ? forceState : !this.sidebarOpen;
    if (this.sidebarOpen) {
      sidebar.classList.remove('-translate-x-full');
      backdrop?.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      backdrop?.classList.add('hidden');
    }
  },

  // 6-Step Workflow for Learn with AI
  goToLearnStep: function(stepNum) {
    this.currentLearnStep = stepNum;
    this.navigate('learn-ai');

    document.querySelectorAll('.learn-ai-step-page').forEach(page => page.classList.add('hidden'));
    const stepTarget = document.getElementById(`learn-step-${stepNum}`);
    if (stepTarget) stepTarget.classList.remove('hidden');

    if (stepNum === 3) {
      ALTA_AI.renderLearningPath();
    } else if (stepNum === 5) {
      ALTA_AI.renderUnlockScreen();
    } else if (stepNum === 6) {
      ALTA_AI.setupOriginalProblemSolving();
    }
  },

  // SECTION 1: Overview Render
  renderOverview: function() {
    // Quote
    const randomQuote = ALTA_DATA.quotes[Math.floor(Math.random() * ALTA_DATA.quotes.length)];
    const quoteEl = document.getElementById('dailyQuoteText');
    const authorEl = document.getElementById('dailyQuoteAuthor');
    const tipEl = document.getElementById('dailyQuoteTip');
    if (quoteEl) quoteEl.textContent = `“${randomQuote.quote}”`;
    if (authorEl) authorEl.textContent = `— ${randomQuote.author}`;
    if (tipEl) tipEl.textContent = `💡 Cognitive Tip: ${randomQuote.tip}`;

    // Recent activities list with honest empty state
    const actList = document.getElementById('overviewRecentActivities');
    if (actList) {
      actList.innerHTML = '';
      if (!ALTA_DATA.recentActivities || ALTA_DATA.recentActivities.length === 0) {
        actList.innerHTML = `
          <div class="p-4 text-center rounded-xl border border-white/5 bg-slate-900/40 text-xs text-slate-400 space-y-1">
            <p class="font-bold text-slate-300">No coding sessions recorded yet</p>
            <p class="text-[11px] text-slate-500">Solve your first diagnostic task below to start your streak!</p>
          </div>
        `;
      } else {
        ALTA_DATA.recentActivities.forEach(act => {
          const row = document.createElement('div');
          row.className = 'flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 bg-slate-900/40 transition-all';
          row.innerHTML = `
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs">
                ⚡
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-200">${act.title}</p>
                <p class="text-[10px] text-slate-400">${act.category} • ${act.time}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-400">${act.tokens}</span>
              <p class="text-[10px] text-slate-400">${act.accuracy}</p>
            </div>
          `;
          actList.appendChild(row);
        });
      }
    }

    // Recent Badges Row with honest empty state
    const badgeRow = document.getElementById('overviewRecentBadges');
    if (badgeRow) {
      badgeRow.innerHTML = '';
      const unlocked = ALTA_DATA.badges.filter(b => b.unlocked);
      if (unlocked.length === 0) {
        badgeRow.innerHTML = `
          <div class="col-span-2 p-3 text-center rounded-xl border border-white/5 bg-slate-900/40 text-xs text-slate-400 space-y-1">
            <p class="font-bold text-slate-300">All 8 badges locked</p>
            <p class="text-[10px] text-slate-500">Earn your first badge by solving a logic challenge!</p>
          </div>
        `;
      } else {
        unlocked.slice(0, 4).forEach(b => {
          const badge = document.createElement('div');
          badge.className = 'flex items-center gap-2 p-2.5 rounded-xl border border-white/10 bg-slate-900/40';
          badge.innerHTML = `
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-sm">
              ${b.icon}
            </div>
            <div>
              <p class="text-xs font-bold text-slate-200 truncate max-w-[100px]">${b.title}</p>
              <span class="text-[10px] text-purple-400">${b.tier}</span>
            </div>
          `;
          badgeRow.appendChild(badge);
        });
      }
    }

    // Render Weekly Activity SVG Chart
    this.renderActivityChart();
  },

  renderActivityChart: function() {
    const chartSvg = document.getElementById('overviewActivityChartSvg');
    if (!chartSvg) return;

    const data = ALTA_DATA.weeklyActivity.minutes;
    const maxVal = Math.max(...data, 60);
    const height = 140;
    const width = 360;
    const stepX = width / (data.length - 1);

    const points = data.map((val, idx) => {
      const x = idx * stepX;
      const y = height - (val / maxVal) * (height - 30) - 20;
      return { x, y, val };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const xMid = (points[i].x + points[i + 1].x) / 2;
      const yMid = (points[i].y + points[i + 1].y) / 2;
      pathD += ` Q ${points[i].x} ${points[i].y}, ${xMid} ${yMid} T ${points[i + 1].x} ${points[i + 1].y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L 0 ${height} Z`;

    chartSvg.innerHTML = `
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#00F2FE" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#7928CA" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#00F2FE"/>
          <stop offset="100%" stop-color="#A855F7"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#chartGrad)"/>
      <path d="${pathD}" fill="none" stroke="url(#lineGrad)" stroke-width="2.5" stroke-linecap="round"/>
      ${points.map((p, i) => `
        <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#070913" stroke="#00F2FE" stroke-width="2"/>
        <text x="${p.x}" y="${height - 2}" font-size="9" fill="#64748B" text-anchor="middle">${ALTA_DATA.weeklyActivity.days[i]}</text>
      `).join('')}
    `;
  },

  // SECTION: Achievements Gallery
  renderAchievements: function(filterTier = 'all') {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const filtered = filterTier === 'all' 
      ? ALTA_DATA.badges 
      : ALTA_DATA.badges.filter(b => b.tier.toLowerCase() === filterTier.toLowerCase());

    filtered.forEach(badge => {
      const card = document.createElement('div');
      card.className = `glass-panel p-5 relative overflow-hidden transition-all duration-300 ${
        badge.unlocked 
          ? 'border-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10' 
          : 'border-white/5 opacity-75 bg-slate-950/40'
      }`;

      card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
            badge.unlocked 
              ? 'bg-slate-800/80 border border-white/10 shadow-inner' 
              : 'bg-slate-900 border border-white/5 opacity-60'
          }">
            ${badge.icon}
          </div>
          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            badge.tier === 'Common' ? 'badge-common' :
            badge.tier === 'Rare' ? 'badge-rare' :
            badge.tier === 'Epic' ? 'badge-epic' : 'badge-legendary'
          }">${badge.tier}</span>
        </div>

        <h3 class="font-bold text-slate-100 text-sm mb-1">${badge.title}</h3>
        <p class="text-xs text-slate-400 mb-4 leading-relaxed">${badge.description}</p>

        <div class="border-t border-white/5 pt-3 mt-auto">
          ${
            badge.unlocked 
              ? `<div class="flex items-center justify-between text-[11px] text-emerald-400">
                   <span class="flex items-center gap-1">✓ Unlocked</span>
                   <span class="text-slate-400">${badge.earnedDate}</span>
                 </div>`
              : `<div class="space-y-1.5">
                   <div class="flex items-center justify-between text-[10px] text-slate-400">
                     <span>🔒 Locked</span>
                     <span class="font-mono text-slate-300">${badge.progressLabel || badge.progress + '%'}</span>
                   </div>
                   <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div class="h-full bg-cyan-400 rounded-full" style="width: ${badge.progress}%"></div>
                   </div>
                 </div>`
          }
        </div>
      `;
      grid.appendChild(card);
    });
  },

  // SECTION: Leaderboard
  renderLeaderboard: function() {
    const list = document.getElementById('leaderboardTableBody');
    if (!list) return;

    list.innerHTML = '';
    ALTA_DATA.leaderboard.rankings.forEach(item => {
      const row = document.createElement('tr');
      row.className = `border-b border-white/5 transition-colors ${
        item.isUser ? 'bg-cyan-500/10 border-cyan-500/30' : 'hover:bg-white/5'
      }`;

      row.innerHTML = `
        <td class="py-3 px-4 text-xs font-bold ${item.isUser ? 'text-cyan-400' : 'text-slate-400'}">
          #${item.rank}
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              ${item.name.charAt(0)}
            </div>
            <span class="text-xs font-semibold ${item.isUser ? 'text-cyan-300 font-bold' : 'text-slate-200'}">
              ${item.name}
            </span>
          </div>
        </td>
        <td class="py-3 px-4 text-xs text-slate-400">Level ${item.level}</td>
        <td class="py-3 px-4 text-xs font-bold text-emerald-400">🪙 ${item.tokens}</td>
        <td class="py-3 px-4 text-xs text-slate-300">${item.independentRate}</td>
        <td class="py-3 px-4 text-xs text-amber-400 font-semibold">🔥 ${item.streak}d</td>
      `;
      list.appendChild(row);
    });
  },

  // SECTION: My Progress & Analytics
  renderProgress: function() {
    const container = document.getElementById('progressSkillBars');
    if (!container) return;

    container.innerHTML = '';
    ALTA_DATA.skills.forEach(skill => {
      const block = document.createElement('div');
      block.className = 'space-y-1.5';
      block.innerHTML = `
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-slate-300">${skill.name}</span>
          <span class="font-bold text-white">${skill.mastery}% <span class="text-[10px] text-slate-400">(${skill.status})</span></span>
        </div>
        <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" style="width: ${skill.mastery}%; background: ${skill.color}"></div>
        </div>
      `;
      container.appendChild(block);
    });
  },

  // SECTION: 90-Day Challenge
  render90DayChallenge: function() {
    const grid = document.getElementById('milestoneGridContainer');
    if (!grid) return;

    grid.innerHTML = '';
    ALTA_DATA.challenge90Days.milestones.forEach(m => {
      const card = document.createElement('div');
      card.className = `glass-panel p-4 border transition-all ${
        m.status === 'completed' 
          ? 'border-emerald-500/40 bg-emerald-950/10' 
          : m.status === 'in-progress' 
          ? 'border-cyan-500/50 bg-cyan-950/20 ring-1 ring-cyan-500/30' 
          : 'border-white/5 opacity-60'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${
            m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
            m.status === 'in-progress' ? 'bg-cyan-500/20 text-cyan-300' :
            'bg-slate-800 text-slate-500'
          }">
            ${m.status === 'completed' ? 'Completed' : m.status === 'in-progress' ? 'Current Focus (Week 1)' : 'Locked'}
          </span>
          <span class="text-xs font-mono text-slate-400">Week ${m.week}</span>
        </div>
        <h4 class="font-bold text-slate-200 text-xs mb-1.5">${m.title}</h4>
        <p class="text-[11px] text-slate-400">${m.tasks} core coding exercises & assessment</p>
      `;
      grid.appendChild(card);
    });
  },

  // SECTION: Certificate System
  setCertificateState: function(state) {
    this.activeCertificateState = state;
    this.renderCertificate();
  },

  renderCertificate: function() {
    const container = document.getElementById('certificateStateContent');
    const state = this.activeCertificateState;
    if (!container) return;

    if (state === 'not-eligible') {
      container.innerHTML = `
        <div class="glass-panel p-8 text-center max-w-xl mx-auto border-cyan-500/30 bg-slate-900/40">
          <div class="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
            📜
          </div>
          <h3 class="text-lg font-bold text-slate-100 mb-1">Status: Day 1 of 90-Day Challenge</h3>
          <p class="text-xs text-slate-400 mb-6 leading-relaxed">
            ALTA honors certificates require demonstrated independent problem-solving. No certificate is issued purely for attendance.
          </p>
          <div class="text-left bg-slate-900/80 p-4 rounded-xl border border-white/5 text-xs space-y-2.5 mb-6 font-mono">
            <div class="flex items-center justify-between text-slate-300">
              <span>• Minimum 75 Active Practice Days</span>
              <span class="text-amber-400 font-bold">0 / 75</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span>• Complete 60 Foundational Tasks</span>
              <span class="text-amber-400 font-bold">0 / 60</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span>• Independent Problem Solving > 70%</span>
              <span class="text-amber-400 font-bold">0.0% (Pending)</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span>• Pass Day 80 Capstone Assessment</span>
              <span class="text-slate-500">Locked</span>
            </div>
          </div>
          <div class="flex justify-center gap-3">
            <button onclick="ALTA_APP.goToLearnStep(1)" class="px-6 py-2.5 rounded-xl font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs shadow-lg shadow-cyan-400/20">
              Start Day 1 Challenge Now →
            </button>
            <button onclick="ALTA_APP.setCertificateState('eligible')" class="px-4 py-2.5 rounded-xl text-xs bg-slate-800 text-slate-300 border border-white/10 hover:text-white">
              Preview Certificate Template
            </button>
          </div>
        </div>
      `;
    } else if (state === 'in-progress') {
      container.innerHTML = `
        <div class="glass-panel p-8 text-center max-w-xl mx-auto border-cyan-500/30 bg-cyan-950/10">
          <div class="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">
            ⏳
          </div>
          <h3 class="text-lg font-bold text-slate-100 mb-2">Certificate Status: In Progress</h3>
          <p class="text-xs text-slate-300 mb-6 leading-relaxed">
            Consistently solving foundational tasks advances your eligibility. Keep maintaining daily streak!
          </p>
          <div class="flex justify-center gap-3">
            <button onclick="ALTA_APP.setCertificateState('eligible')" class="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10">
              Preview Eligible State
            </button>
            <button onclick="ALTA_APP.goToLearnStep(1)" class="px-5 py-2 rounded-xl font-bold bg-cyan-500 text-slate-950 text-xs shadow-lg shadow-cyan-500/20">
              Continue Challenge
            </button>
          </div>
        </div>
      `;
    } else {
      // Eligible Certificate Preview
      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex items-center justify-between no-print max-w-4xl mx-auto">
            <div>
              <h3 class="text-lg font-bold text-slate-100">Official Certificate Preview</h3>
              <p class="text-xs text-slate-400">Unique Verification ID: ALTA-2026-90D-849201</p>
            </div>
            <div class="flex items-center gap-3">
              <button onclick="window.print()" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                🖨️ Print / Save as PDF
              </button>
              <button onclick="ALTA_APP.setCertificateState('not-eligible')" class="px-3 py-2 text-xs text-slate-400 hover:text-white">
                Back to Initial State
              </button>
            </div>
          </div>

          <div class="certificate-container rounded-lg" id="certificateModal">
            <div class="certificate-border-ornament"></div>
            
            <div class="relative z-10 text-center flex flex-col justify-between h-full py-4">
              <div>
                <div class="flex items-center justify-center gap-2 mb-2">
                  <div class="w-8 h-8 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center font-black text-sm">
                    ⚡
                  </div>
                  <span class="text-xl font-black tracking-widest text-slate-900">ALTA</span>
                </div>
                <p class="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-4">Academy of Logic & Thinking Architecture</p>
                
                <h1 class="text-2xl sm:text-3xl font-serif text-slate-900 tracking-wide mb-1">CERTIFICATE OF DISTINCTION</h1>
                <p class="text-xs text-slate-600 italic">This is to certify that</p>
                <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-1 border-b-2 border-amber-600/40 inline-block px-8 py-1">
                  Alex Johnson
                </h2>
                <p class="text-xs text-slate-700 max-w-lg mx-auto mt-3 leading-relaxed">
                  has rigorously mastered algorithmic logic building, space-time invariants, and independent problem-solving throughout the intensive 90-Day Challenge.
                </p>
              </div>

              <div class="grid grid-cols-4 gap-2 max-w-lg mx-auto my-4 text-center">
                <div class="bg-slate-100 p-2 rounded border border-slate-300">
                  <span class="block text-xs font-bold text-slate-800">>70%</span>
                  <span class="text-[9px] text-slate-500">Independent Solve</span>
                </div>
                <div class="bg-slate-100 p-2 rounded border border-slate-300">
                  <span class="block text-xs font-bold text-slate-800">75+ Days</span>
                  <span class="text-[9px] text-slate-500">Active Practice</span>
                </div>
                <div class="bg-slate-100 p-2 rounded border border-slate-300">
                  <span class="block text-xs font-bold text-slate-800">Honors</span>
                  <span class="text-[9px] text-slate-500">Merit Status</span>
                </div>
                <div class="bg-slate-100 p-2 rounded border border-slate-300">
                  <span class="block text-xs font-bold text-slate-800">Verified</span>
                  <span class="text-[9px] text-slate-500">SHA-256 Hash</span>
                </div>
              </div>

              <div class="flex items-end justify-between px-6 pt-4 border-t border-slate-200">
                <div class="text-left">
                  <p class="font-serif italic text-sm text-slate-800">Dr. Sarah Vance</p>
                  <p class="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Director of Pedagogy</p>
                </div>

                <div class="certificate-seal">
                  <div class="text-center text-[10px] leading-tight">
                    <span>ALTA</span><br>
                    <span class="text-[8px] font-normal">HONORS</span>
                  </div>
                </div>

                <div class="text-right">
                  <p class="font-serif italic text-sm text-slate-800">K. Arisawa, PhD</p>
                  <p class="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Head of AI Architecture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  // SECTION: Token Dashboard Modal
  renderTokenDashboard: function() {
    const list = document.getElementById('tokenTransactionsList');
    if (!list) return;

    list.innerHTML = '';
    if (!ALTA_DATA.tokenTransactions || ALTA_DATA.tokenTransactions.length === 0) {
      list.innerHTML = `
        <div class="p-4 text-center rounded-xl border border-white/5 bg-slate-900/40 text-xs text-slate-400">
          No transactions yet. Complete foundational tasks to earn your first ALTA tokens!
        </div>
      `;
      return;
    }

    ALTA_DATA.tokenTransactions.forEach(tx => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-900/40 text-xs';
      row.innerHTML = `
        <div>
          <p class="font-semibold text-slate-200">${tx.desc}</p>
          <p class="text-[10px] text-slate-400">${tx.date}</p>
        </div>
        <span class="font-bold ${tx.type === 'earn' ? 'text-emerald-400' : 'text-rose-400'}">
          ${tx.amount}
        </span>
      `;
      list.appendChild(row);
    });
  },

  toggleTokenModal: function(show) {
    const modal = document.getElementById('tokenEconomyModal');
    if (show) modal?.classList.remove('hidden');
    else modal?.classList.add('hidden');
  },

  // SECTION: Profile & Settings
  renderProfileAndSettings: function() {
    const nameEl = document.getElementById('profileUserName');
    const emailEl = document.getElementById('profileUserEmail');
    if (nameEl) nameEl.textContent = ALTA_DATA.user.name;
    if (emailEl) emailEl.textContent = ALTA_DATA.user.email;
  },

  switchSettingsTab: function(tabId) {
    document.querySelectorAll('.settings-tab-pane').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.classList.remove('text-cyan-400', 'border-cyan-400', 'font-bold');
      btn.classList.add('text-slate-400');
    });

    const targetPane = document.getElementById(`settings-pane-${tabId}`);
    const targetBtn = document.getElementById(`settings-btn-${tabId}`);
    if (targetPane) targetPane.classList.remove('hidden');
    if (targetBtn) {
      targetBtn.classList.add('text-cyan-400', 'border-cyan-400', 'font-bold');
      targetBtn.classList.remove('text-slate-400');
    }
  },

  setupEventListeners: function() {
    // Navbar search shortcut (Ctrl+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearchInput')?.focus();
      }
    });

    // Profile dropdown click outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('profileDropdown');
      const avatarBtn = document.getElementById('navbarAvatarBtn');
      if (dropdown && !dropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }
};

// Auto-run on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  ALTA_APP.init();
});
