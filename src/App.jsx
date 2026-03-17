import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  DAY_LABELS,
  ZONES,
  getActivityPercent,
  getCoachContent,
  getCompletedActivityCount,
  getDayPercent,
  getGreeting,
  getProfileContent,
  getSelectedDayIndex,
  getSelectedDayLongLabel,
  getSelectedDayTitle,
  getZone,
  getZoneConfig,
  isOnboarded,
  loadUser,
  persistUser,
  syncDerivedState
} from './lib/reptrak';

const iconFamilies = [
  'futbol',
  'basketball',
  'volleyball',
  'music',
  'headphones',
  'person-dancing',
  'book',
  'guitar',
  'microphone',
  'leaf',
  'palette',
  'paintbrush',
  'brain',
  'person-running'
];

function updateUserState(currentUser, recipe) {
  const draft = structuredClone(currentUser);
  recipe(draft);
  return syncDerivedState(draft);
}

function App() {
  const [user, setUser] = useState(() => syncDerivedState(loadUser()));
  const [activeScreen, setActiveScreen] = useState('landing');
  const [nameInput, setNameInput] = useState('');
  const [habitInput, setHabitInput] = useState('');
  const [frequencyInput, setFrequencyInput] = useState('4');
  const [selectedHabitChoice, setSelectedHabitChoice] = useState('Deep Work');
  const [selectedFrequency, setSelectedFrequency] = useState('4');
  const particlesRef = useRef(null);
  const liquidButtonRef = useRef(null);
  const liquidFillRef = useRef(null);
  const waveOneRef = useRef(null);
  const waveTwoRef = useRef(null);

  useEffect(() => {
    setNameInput(user.name || '');
    setHabitInput(user.habit || '');
    setFrequencyInput(user.frequency ? String(user.frequency) : '4');
    setSelectedHabitChoice(user.habit || 'Deep Work');
    setSelectedFrequency(user.frequency ? String(user.frequency) : '4');
  }, [user.name, user.habit, user.frequency]);

  useEffect(() => {
    persistUser(user);
  }, [user]);

  useEffect(() => {
    const screen = document.querySelector(`[data-screen="${activeScreen}"]`);
    if (!screen) return;

    const items = screen.querySelectorAll(
      '.glass-card, .glass-btn, .hero-orb, .topbar, .bottom-nav, .activity-row, .price-pill, .view-pill, .liquid-button'
    );

    gsap.fromTo(
      items,
      { y: 18, opacity: 0, filter: 'blur(6px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.04,
        ease: 'power2.out',
        overwrite: 'auto'
      }
    );
  }, [activeScreen, user.activities.length]);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return undefined;

    let timeoutIds = [];
    let intervalId;

    function createParticle() {
      if (!container) return;

      const particle = document.createElement('div');
      const icon = iconFamilies[Math.floor(Math.random() * iconFamilies.length)];
      const startX = Math.random() * container.offsetWidth;
      const drift = (Math.random() * 120) - 60;
      const duration = 11 + Math.random() * 10;
      const size = 18 + Math.random() * 28;
      const sway = 16 + Math.random() * 24;

      particle.className = 'particle';
      particle.innerHTML = `<i class="fa-solid fa-${icon}"></i>`;
      particle.style.left = `${startX}px`;
      particle.style.bottom = `${-40 - Math.random() * 40}px`;
      particle.style.fontSize = `${size}px`;
      particle.style.opacity = `${0.08 + Math.random() * 0.14}`;

      container.appendChild(particle);

      gsap.timeline({
        defaults: { ease: 'none' },
        onComplete: () => particle.remove()
      })
        .to(particle, { y: -container.offsetHeight - 180, duration }, 0)
        .to(particle, { x: drift, duration }, 0)
        .to(
          particle,
          {
            keyframes: [
              { x: `+=${sway}`, duration: duration * 0.28, ease: 'sine.inOut' },
              { x: `-=${sway * 1.8}`, duration: duration * 0.32, ease: 'sine.inOut' },
              { x: `+=${sway * 1.35}`, duration: duration * 0.4, ease: 'sine.inOut' }
            ]
          },
          0
        )
        .to(
          particle,
          {
            rotation: Math.random() * 110 - 55,
            scale: 0.72 + Math.random() * 0.48,
            opacity: 0,
            duration
          },
          0
        );
    }

    for (let index = 0; index < 10; index += 1) {
      timeoutIds.push(window.setTimeout(createParticle, index * 240));
    }

    intervalId = window.setInterval(createParticle, 1400);

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
      window.clearInterval(intervalId);
    };
  }, []);

  const dayPercent = getDayPercent(user);
  const zoneKey = getZone(dayPercent);
  const zone = getZoneConfig(dayPercent);
  const coach = getCoachContent(user, dayPercent);
  const profile = getProfileContent(dayPercent);
  const progressAngle = Math.max(18, Math.round((dayPercent / 100) * 360));
  const completedActivities = getCompletedActivityCount(user);
  const displayName = user.name || 'there';
  const displayHabit = user.habit || user.activities[0]?.name || 'Your first habit';
  const displayFrequency = Number(user.frequency) || user.activities[0]?.targetCount || 0;
  const selectedDayIndex = getSelectedDayIndex(user);

  useEffect(() => {
    const liquidButton = liquidButtonRef.current;
    const liquidFill = liquidFillRef.current;
    const waveOne = waveOneRef.current;
    const waveTwo = waveTwoRef.current;

    if (!liquidButton || !liquidFill || !waveOne || !waveTwo) return;

    const shift = Math.min(Math.max(100 - dayPercent, 0), 100);
    liquidButton.style.setProperty('--liquid-color', ZONES[zoneKey].gradient);

    gsap.to(liquidFill, {
      yPercent: shift,
      duration: 1.05,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    if (!waveOne.dataset.looping) {
      waveOne.dataset.looping = 'true';
      gsap.to(waveOne, {
        rotation: 360,
        duration: 7.5,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%'
      });
    }

    if (!waveTwo.dataset.looping) {
      waveTwo.dataset.looping = 'true';
      gsap.to(waveTwo, {
        rotation: -360,
        duration: 10.5,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%'
      });
    }
  }, [dayPercent, zoneKey]);

  function commit(recipe) {
    setUser((currentUser) => updateUserState(currentUser, recipe));
  }

  function goTo(screenId) {
    setActiveScreen(screenId);
  }

  function handleSaveName() {
    if (!nameInput.trim()) return;
    commit((draft) => {
      draft.name = nameInput.trim();
    });
    goTo('habit');
  }

  function handleSaveHabit() {
    const nextHabit = habitInput.trim() || selectedHabitChoice;
    if (!nextHabit) return;

    commit((draft) => {
      draft.habit = nextHabit;
      if (draft.activities[0]) {
        draft.activities[0].name = nextHabit;
      }
    });
    goTo('frequency');
  }

  function handleSaveFrequency() {
    const nextFrequency = Number(frequencyInput) || Number(selectedFrequency);
    if (!nextFrequency) return;

    commit((draft) => {
      draft.frequency = nextFrequency;
      if (draft.activities[0]) {
        draft.activities[0].targetCount = nextFrequency;
      }
    });
    goTo('dashboard');
  }

  function handleActivityChange(activityId, field, value) {
    commit((draft) => {
      const activity = draft.activities.find((item) => item.id === activityId);
      if (!activity) return;
      activity[field] = Math.max(Number(value) || 0, 0);
    });
  }

  function handleQuickAdd() {
    commit((draft) => {
      if (draft.activities[0]) {
        draft.activities[0].loggedCount += 1;
      }
    });
  }

  function handleSubscribe() {
    commit((draft) => {
      draft.premium = true;
    });
    window.alert(
      'Premium is now active in the React prototype.\n\n' +
      'Unlocked here:\n' +
      '1. Weekly compare-and-contrast positioning.\n' +
      '2. More detailed progress language and analytics framing.\n' +
      '3. Pricing flow that matches your $2.99 intro / $5.99 monthly model.\n\n' +
      'Next real build step: connect Stripe Checkout or RevenueCat.'
    );
  }

  function handleLiquidClick() {
    if (!liquidButtonRef.current) return;
    gsap.fromTo(
      liquidButtonRef.current,
      { rotate: -2, x: -3 },
      {
        rotate: 0,
        x: 0,
        duration: 0.48,
        ease: 'elastic.out(1, 0.35)',
        keyframes: [
          { rotate: 3, x: 4, duration: 0.08 },
          { rotate: -3, x: -4, duration: 0.08 },
          { rotate: 2, x: 3, duration: 0.08 },
          { rotate: -1, x: -2, duration: 0.08 },
          { rotate: 0, x: 0, duration: 0.16 }
        ]
      }
    );
  }

  function renderMonthCells() {
    if (user.calendarView === 'day') {
      return (
        <article className={`day-focus-card day-focus-card--${zoneKey}`}>
          <p className="eyebrow">Selected day</p>
          <h3>{getSelectedDayTitle(user)}</h3>
          <p>{profile.summary}</p>
          <div className="day-focus-card__stats">
            <span>{completedActivities}/{user.activities.length} activities above 75%</span>
            <strong>{dayPercent}% complete</strong>
          </div>
        </article>
      );
    }

    const values = user.calendarView === 'week'
      ? user.month.slice(Math.floor(selectedDayIndex / 7) * 7, Math.floor(selectedDayIndex / 7) * 7 + 7)
      : user.month;

    return values.map((percentValue, index) => {
      const actualIndex = user.calendarView === 'week'
        ? Math.floor(selectedDayIndex / 7) * 7 + index
        : index;

      return (
        <button
          key={`${user.calendarView}-${actualIndex}`}
          className={`month-cell month-cell--${getZone(percentValue)} ${actualIndex === selectedDayIndex ? 'month-cell--selected' : ''}`}
          type="button"
          onClick={() => commit((draft) => { draft.currentDay = actualIndex; })}
        >
          <span>{user.calendarView === 'week' ? DAY_LABELS[index] : actualIndex + 1}</span>
          <strong>{percentValue}%</strong>
        </button>
      );
    });
  }

  function renderActivityList(profileMode = false) {
    const scope = profileMode ? 'profile' : 'dashboard';
    return user.activities.map((activity, index) => {
      const percentValue = getActivityPercent(activity);
      const activityZone = getZoneConfig(percentValue);

      return (
        <article className="activity-row" key={`${scope}-${activity.id}`}>
          <div className="activity-row__top">
            <div>
              <h4 className="activity-row__title">{activity.name}</h4>
              <p className="activity-row__meta">
                {activity.loggedCount}/{activity.targetCount} reps
                {activity.timeGoal ? ` · ${activity.timeLogged}/${activity.timeGoal} min` : ' · time optional'}
                {profileMode ? ` · ${activityZone.label}` : ''}
              </p>
            </div>
            <span
              className={`activity-row__badge activity-row__badge--${getZone(percentValue)}`}
              style={{ background: activityZone.gradient, color: '#102044' }}
            >
              {percentValue}%
            </span>
          </div>

          <div className="activity-row__controls">
            <div className="activity-control">
              <label htmlFor={`count-${scope}-${activity.id}-${index}`}>Count</label>
              <input
                id={`count-${scope}-${activity.id}-${index}`}
                type="number"
                min="0"
                step="1"
                value={activity.loggedCount}
                onChange={(event) => handleActivityChange(activity.id, 'loggedCount', event.target.value)}
              />
            </div>
            <div className="activity-control">
              <label htmlFor={`time-${scope}-${activity.id}-${index}`}>Time (min)</label>
              <input
                id={`time-${scope}-${activity.id}-${index}`}
                type="number"
                min="0"
                step="5"
                value={activity.timeLogged}
                onChange={(event) => handleActivityChange(activity.id, 'timeLogged', event.target.value)}
              />
            </div>
          </div>
        </article>
      );
    });
  }

  function Screen({ id, children }) {
    return (
      <section className={`screen ${activeScreen === id ? 'active' : ''}`} data-screen={id}>
        {children}
      </section>
    );
  }

  function BottomNav({ current }) {
    const navItems = [
      ['dashboard', 'house', 'Home'],
      ['calendar', 'calendar-days', 'Calendar'],
      ['profile', 'circle-user', 'Profile'],
      ['premium', 'gem', 'Premium']
    ];

    return (
      <nav className="bottom-nav" aria-label="Primary">
        {navItems.map(([target, icon, label]) => (
          <button
            key={target}
            className={`nav-pill ${current === target ? 'is-active' : ''}`}
            type="button"
            onClick={() => goTo(target)}
          >
            <i className={`fa-solid fa-${icon}`}></i>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    );
  }

  return (
    <main className="app-stage">
      <div className="phone" aria-label="ReptraK mobile prototype">
        <div className="ambient-layer ambient-layer-one"></div>
        <div className="ambient-layer ambient-layer-two"></div>
        <div className="ambient-grid"></div>
        <div className="side-rail side-rail-left"></div>
        <div className="side-rail side-rail-right"></div>
        <div id="particles" ref={particlesRef}></div>

        <Screen id="landing">
          <div className="screen-grid landing-grid">
            <header className="topbar topbar-landing">
              <span className="brand-mark">ReptraK</span>
              <button className="mini-glass-btn" type="button" onClick={() => goTo(isOnboarded(user) ? 'dashboard' : 'account')}>
                {isOnboarded(user) ? 'Dashboard' : 'Log in'}
              </button>
            </header>

            <div className="hero-orb">
              <div className="hero-orb__glare"></div>
              <div className="hero-orb__core">
                <span className="hero-orb__label">ReptraK</span>
              </div>
            </div>

            <div className="hero-copy">
              <p className="eyebrow">Frutiger Aero Habit Tracking</p>
              <h1 className="logo">ReptraK</h1>
              <p className="tagline">
                Build habits in a polished, glossy system that feels calm, premium, and alive.
              </p>
            </div>

            <div className="feature-cluster">
              <article className="glass-card stat-card stat-card--wide">
                <span className="stat-card__label">Momentum</span>
                <strong className="stat-card__value">{Math.max(user.streak, 7)} day streak</strong>
                <p className="stat-card__meta">Optimized for daily check-ins and weekly rhythm.</p>
              </article>
              <article className="glass-card stat-card">
                <span className="stat-card__label">Consistency</span>
                <strong className="stat-card__value">{dayPercent}%</strong>
              </article>
              <article className="glass-card stat-card">
                <span className="stat-card__label">Focus blocks</span>
                <strong className="stat-card__value">{user.count || 18}</strong>
              </article>
            </div>

            <div className="cta-stack">
              <button className="glass-btn glass-btn--primary" type="button" onClick={() => goTo(isOnboarded(user) ? 'dashboard' : 'account')}>
                {isOnboarded(user) ? 'Continue' : 'Start Tracking'}
              </button>
              <button className="glass-btn glass-btn--secondary" type="button" onClick={() => goTo('premium')}>
                See Premium
              </button>
            </div>
          </div>
        </Screen>

        <Screen id="account">
          <div className="screen-grid">
            <header className="topbar">
              <button className="mini-glass-btn" type="button" onClick={() => goTo('landing')}>Back</button>
              <span className="topbar-title">Create your profile</span>
            </header>

            <article className="glass-card panel panel--hero">
              <p className="eyebrow">Step 1</p>
              <h2>What should we call you?</h2>
              <p className="supporting-copy">
                We keep this lightweight so your setup stays quick and the dashboard feels personal.
              </p>
              <label className="input-label" htmlFor="name-input">Display name</label>
              <input
                className="glass-input"
                id="name-input"
                type="text"
                placeholder="Naim"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
              />
              <button className="glass-btn glass-btn--primary" type="button" onClick={handleSaveName}>Continue</button>
            </article>
          </div>
        </Screen>

        <Screen id="habit">
          <div className="screen-grid">
            <header className="topbar">
              <button className="mini-glass-btn" type="button" onClick={() => goTo('account')}>Back</button>
              <span className="topbar-title">Choose your core habit</span>
            </header>

            <article className="glass-card panel panel--hero">
              <p className="eyebrow">Step 2</p>
              <h2>What are you tracking first?</h2>
              <div className="chip-grid">
                {['Deep Work', 'Morning Run', 'Reading', 'Meditation'].map((choice) => (
                  <button
                    key={choice}
                    className={`glass-chip ${selectedHabitChoice === choice ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => {
                      setSelectedHabitChoice(choice);
                      setHabitInput(choice);
                    }}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              <label className="input-label" htmlFor="habit-input">Custom habit</label>
              <input
                className="glass-input"
                id="habit-input"
                type="text"
                placeholder="Design practice"
                value={habitInput}
                onChange={(event) => {
                  setHabitInput(event.target.value);
                  setSelectedHabitChoice('');
                }}
              />
              <button className="glass-btn glass-btn--primary" type="button" onClick={handleSaveHabit}>Set Habit</button>
            </article>
          </div>
        </Screen>

        <Screen id="frequency">
          <div className="screen-grid">
            <header className="topbar">
              <button className="mini-glass-btn" type="button" onClick={() => goTo('habit')}>Back</button>
              <span className="topbar-title">Dial in your cadence</span>
            </header>

            <article className="glass-card panel panel--hero">
              <p className="eyebrow">Step 3</p>
              <h2>How many days per week?</h2>
              <div className="frequency-grid">
                {['3', '4', '5', '7'].map((value) => (
                  <button
                    key={value}
                    className={`frequency-pill ${selectedFrequency === value ? 'is-selected' : ''}`}
                    type="button"
                    onClick={() => {
                      setSelectedFrequency(value);
                      setFrequencyInput(value);
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <label className="input-label" htmlFor="frequency-input">Target sessions</label>
              <input
                className="glass-input"
                id="frequency-input"
                type="number"
                min="1"
                max="7"
                value={frequencyInput}
                onChange={(event) => {
                  setFrequencyInput(event.target.value);
                  setSelectedFrequency(event.target.value);
                }}
              />
              <button className="glass-btn glass-btn--primary" type="button" onClick={handleSaveFrequency}>Build Dashboard</button>
            </article>
          </div>
        </Screen>

        <Screen id="dashboard">
          <div className="screen-grid dashboard-grid">
            <header className="topbar">
              <div>
                <p className="eyebrow">Today</p>
                <h2 className="topbar-heading">{getGreeting()}, {displayName}</h2>
              </div>
              <button className="mini-glass-btn mini-glass-btn--icon" type="button" onClick={() => goTo('profile')} aria-label="Open profile">
                <i className="fa-solid fa-droplet"></i>
              </button>
            </header>

            <article className="glass-card hero-card">
              <div className="hero-card__copy">
                <p className="eyebrow">Today summary</p>
                <h3>{displayHabit}</h3>
                <p id="habit-summary">
                  {displayFrequency
                    ? `${displayFrequency} target reps this week. Count is the core score, and time stays optional for every activity.`
                    : 'Set your target cadence, then log counts and optional time without needing Premium.'}
                </p>
              </div>
              <div className="hero-card__ring">
                <div
                  className="progress-ring"
                  style={{
                    '--progress-angle': `${progressAngle}deg`,
                    background: `
                      radial-gradient(circle at 35% 28%, rgba(255,255,255,0.88), rgba(167,245,255,0.46) 18%, rgba(111,217,255,0.18) 34%, rgba(35,33,77,0) 68%),
                      conic-gradient(from 0deg, ${zone.ring} 0deg, ${zone.ring} ${progressAngle}deg, rgba(255,255,255,0.12) ${progressAngle}deg, rgba(255,255,255,0.12) 360deg)
                    `
                  }}
                >
                  <span>{dayPercent}%</span>
                </div>
              </div>
            </article>

            <div className="metrics-strip">
              <article className="glass-card metric-card">
                <span>Streak</span>
                <strong>{user.streak}</strong>
              </article>
              <article className="glass-card metric-card">
                <span>Check-ins</span>
                <strong>{user.count}</strong>
              </article>
              <article className="glass-card metric-card">
                <span>Today %</span>
                <strong>{dayPercent}%</strong>
              </article>
            </div>

            <article className="glass-card coach-card">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Coach</p>
                  <h3>{coach.heading}</h3>
                </div>
                <span className="section-kicker">{coach.kicker}</span>
              </div>
              <p className="coach-copy">{coach.copy}</p>
            </article>

            <article className="glass-card activity-card">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Activities</p>
                  <h3>Log today's work</h3>
                </div>
                <span className="section-kicker">Free feature</span>
              </div>
              <div className="activity-list">{renderActivityList(false)}</div>
            </article>

            <div className="cta-stack cta-stack--dashboard">
              <button className="glass-btn glass-btn--primary" type="button" onClick={handleQuickAdd}>
                Quick Add to First Activity
              </button>
              <button className="glass-btn glass-btn--secondary" type="button" onClick={() => goTo('premium')}>
                Unlock Premium
              </button>
            </div>

            <BottomNav current="dashboard" />
          </div>
        </Screen>

        <Screen id="calendar">
          <div className="screen-grid dashboard-grid">
            <header className="topbar">
              <button className="mini-glass-btn" type="button" onClick={() => goTo('dashboard')}>Back</button>
              <span className="topbar-title">Calendar</span>
            </header>

            <article className="glass-card calendar-card">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Basic tracking</p>
                  <h3>Month, week, and day</h3>
                </div>
                <span className="section-kicker">Free feature</span>
              </div>
              <div className="view-switch">
                {['month', 'week', 'day'].map((view) => (
                  <button
                    key={view}
                    className={`view-pill ${user.calendarView === view ? 'is-active' : ''}`}
                    type="button"
                    onClick={() => commit((draft) => { draft.calendarView = view; })}
                  >
                    {view[0].toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
              <div className="month-grid">{renderMonthCells()}</div>
            </article>

            <article className="glass-card weekly-card">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Week view</p>
                  <h3>Completion map</h3>
                </div>
                <span className="section-kicker">
                  {completedActivities}/{user.activities.length} activities in the green today
                </span>
              </div>
              <div className="week-grid">
                {user.week.map((day, index) => {
                  const weekZone = getZoneConfig(day.percent);
                  return (
                    <button
                      key={day.label}
                      className={`day-cell is-${getZone(day.percent)} ${index === selectedDayIndex % 7 ? 'is-selected' : ''}`}
                      type="button"
                      onClick={() => commit((draft) => {
                        draft.currentDay = Math.floor(getSelectedDayIndex(draft) / 7) * 7 + index;
                      })}
                    >
                      <span>{day.label}</span>
                      <b style={{ background: `${weekZone.gradient}, rgba(255,255,255,0.08)` }}></b>
                    </button>
                  );
                })}
              </div>
            </article>

            <BottomNav current="calendar" />
          </div>
        </Screen>

        <Screen id="profile">
          <div className="screen-grid dashboard-grid">
            <header className="topbar">
              <button className="mini-glass-btn" type="button" onClick={() => goTo('dashboard')}>Back</button>
              <span className="topbar-title">Profile</span>
            </header>

            <article className="glass-card profile-card">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Daily completion</p>
                  <h3>{getSelectedDayLongLabel(user)}</h3>
                </div>
                <span className="section-kicker">{dayPercent}%</span>
              </div>
              <button
                className="liquid-button"
                ref={liquidButtonRef}
                type="button"
                aria-label="Shake liquid summary"
                onClick={handleLiquidClick}
              >
                <span className="liquid-button__glass">
                  <span className="liquid-button__fill" ref={liquidFillRef}></span>
                  <span className="liquid-button__wave liquid-button__wave--one" ref={waveOneRef}></span>
                  <span className="liquid-button__wave liquid-button__wave--two" ref={waveTwoRef}></span>
                  <span className="liquid-button__label">{dayPercent}%</span>
                </span>
              </button>
              <p className="coach-copy">{coach.copy}</p>
            </article>

            <article className="glass-card insight-card">
              <p className="eyebrow">How you're doing</p>
              <h3>{profile.headline}</h3>
              <p>{profile.summary}</p>
            </article>

            <article className="glass-card activity-card">
              <div className="section-header">
                <div>
                  <p className="eyebrow">Today's entries</p>
                  <h3>Activity breakdown</h3>
                </div>
              </div>
              <div className="activity-list activity-list--profile">{renderActivityList(true)}</div>
            </article>

            <BottomNav current="profile" />
          </div>
        </Screen>

        <Screen id="premium">
          <div className="screen-grid dashboard-grid">
            <header className="topbar">
              <button className="mini-glass-btn" type="button" onClick={() => goTo('dashboard')}>Back</button>
              <span className="topbar-title">Premium</span>
            </header>

            <article className="glass-card premium-card">
              <p className="eyebrow">ReptraK Plus</p>
              <h2>Deeper stats, compare-and-contrast trends, and real performance feedback.</h2>
              <div className="price-stack">
                <div className="price-pill">
                  <span>Intro month</span>
                  <strong>$2.99</strong>
                  <em>First 30 days</em>
                </div>
                <div className="price-pill">
                  <span>Then</span>
                  <strong>$5.99</strong>
                  <em>Monthly</em>
                </div>
              </div>
              <div className="premium-grid">
                <div className="premium-badge">
                  <i className="fa-solid fa-chart-line"></i>
                  <span>Weekly progress analysis</span>
                </div>
                <div className="premium-badge">
                  <i className="fa-solid fa-scale-balanced"></i>
                  <span>Compare strong vs weak days</span>
                </div>
                <div className="premium-badge">
                  <i className="fa-solid fa-wave-square"></i>
                  <span>Detailed activity stats</span>
                </div>
                <div className="premium-badge">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                  <span>Long-range trend memory</span>
                </div>
              </div>
              <button className="glass-btn glass-btn--primary" type="button" onClick={handleSubscribe}>
                {user.premium ? 'Premium Active' : 'Start Premium'}
              </button>
            </article>

            <div className="insight-grid">
              <article className="glass-card insight-card">
                <p className="eyebrow">Free tier</p>
                <h3>Track and stay honest</h3>
                <p>Calendar, daily views, counts, optional time goals, and progress coaching stay free.</p>
              </article>
              <article className="glass-card insight-card">
                <p className="eyebrow">Premium tier</p>
                <h3>Understand patterns</h3>
                <p>
                  Today is {dayPercent >= Math.round(user.week.reduce((sum, day) => sum + day.percent, 0) / user.week.length) ? 'ahead of' : 'behind'} your weekly average.
                  Premium is where best-day versus weak-day comparison becomes readable.
                </p>
              </article>
            </div>

            <BottomNav current="premium" />
          </div>
        </Screen>
      </div>
    </main>
  );
}

export default App;
