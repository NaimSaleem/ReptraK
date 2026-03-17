/* global user, saveUser, gsap */

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL_DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ZONES = {
  low: {
    label: 'Reset zone',
    badge: 'Low',
    gradient: 'linear-gradient(180deg, rgba(255, 147, 92, 0.96), rgba(255, 101, 48, 0.62))',
    accent: '#ff9f6d',
    ring: 'rgba(255, 150, 88, 0.92)'
  },
  mid: {
    label: 'Building zone',
    badge: 'Mid',
    gradient: 'linear-gradient(180deg, rgba(255, 236, 131, 0.98), rgba(255, 188, 72, 0.62))',
    accent: '#ffe586',
    ring: 'rgba(255, 224, 110, 0.94)'
  },
  complete: {
    label: 'Strong zone',
    badge: 'Green',
    gradient: 'linear-gradient(180deg, rgba(121, 244, 156, 0.96), rgba(35, 194, 106, 0.62))',
    accent: '#7bf29c',
    ring: 'rgba(109, 232, 146, 0.94)'
  },
  perfect: {
    label: 'Crystal zone',
    badge: 'Full',
    gradient: 'linear-gradient(180deg, rgba(136, 239, 255, 1), rgba(54, 170, 255, 0.72))',
    accent: '#88efff',
    ring: 'rgba(111, 217, 255, 0.98)'
  }
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getSelectedDayIndex() {
  return clamp(user.currentDay || 0, 0, Math.max(user.month.length - 1, 0));
}

function getSelectedWeekIndex() {
  return getSelectedDayIndex() % 7;
}

function getSelectedDayLongLabel() {
  return FULL_DAY_LABELS[getSelectedWeekIndex()];
}

function getSelectedDayTitle() {
  return `${getSelectedDayLongLabel()} · Day ${getSelectedDayIndex() + 1}`;
}

function getCountCompletion(activity) {
  const target = Math.max(Number(activity.targetCount) || 0, 0);
  const logged = Math.max(Number(activity.loggedCount) || 0, 0);

  if (!target && !logged) return 0;
  if (!target) return 1;

  return clamp(logged / target, 0, 1);
}

function getTimeCompletion(activity) {
  const goal = Math.max(Number(activity.timeGoal) || 0, 0);
  const logged = Math.max(Number(activity.timeLogged) || 0, 0);

  if (!goal && !logged) return 0;
  if (!goal) return 0;

  return clamp(logged / goal, 0, 1);
}

function getActivityPercent(activity) {
  const countCompletion = getCountCompletion(activity);
  const usesTime = Number(activity.timeGoal) > 0 && Number(activity.timeLogged) > 0;
  const percent = usesTime
    ? Math.round(((countCompletion + getTimeCompletion(activity)) / 2) * 100)
    : Math.round(countCompletion * 100);

  return clamp(percent, 0, 100);
}

function getDayPercent() {
  if (!Array.isArray(user.activities) || !user.activities.length) return 0;

  const total = user.activities.reduce((sum, activity) => sum + getActivityPercent(activity), 0);
  return Math.round(total / user.activities.length);
}

function getZone(percent) {
  if (percent >= 100) return 'perfect';
  if (percent > 75) return 'complete';
  if (percent >= 50) return 'mid';
  return 'low';
}

function getZoneConfig(percent) {
  return ZONES[getZone(percent)];
}

function getCompletedActivityCount() {
  return user.activities.filter((activity) => getActivityPercent(activity) >= 75).length;
}

function getWeakestActivity() {
  return user.activities.reduce((lowest, activity) => {
    if (!lowest) return activity;
    return getActivityPercent(activity) < getActivityPercent(lowest) ? activity : lowest;
  }, null);
}

function getStrongestActivity() {
  return user.activities.reduce((strongest, activity) => {
    if (!strongest) return activity;
    return getActivityPercent(activity) > getActivityPercent(strongest) ? activity : strongest;
  }, null);
}

function getStreakFromMonth() {
  let streak = 0;
  for (let index = getSelectedDayIndex(); index >= 0; index -= 1) {
    if ((user.month[index] || 0) >= 75) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

function syncUserState() {
  const dayPercent = getDayPercent();
  const dayIndex = getSelectedDayIndex();
  const weekIndex = getSelectedWeekIndex();

  user.month[dayIndex] = dayPercent;
  user.week[weekIndex] = {
    ...user.week[weekIndex],
    label: DAY_LABELS[weekIndex],
    percent: dayPercent,
    mood: getZone(dayPercent)
  };
  user.count = user.activities.reduce((sum, activity) => sum + Math.max(Number(activity.loggedCount) || 0, 0), 0);
  user.minutes = user.activities.reduce((sum, activity) => sum + Math.max(Number(activity.timeLogged) || 0, 0), 0);
  user.streak = getStreakFromMonth();

  return dayPercent;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getCoachContent(percent) {
  const completedActivities = getCompletedActivityCount();
  const weakest = getWeakestActivity();
  const strongest = getStrongestActivity();
  const weekPercents = user.week.map((day) => day?.percent || 0);
  const weeklyAverage = Math.round(weekPercents.reduce((sum, value) => sum + value, 0) / weekPercents.length);
  const weeklyBest = Math.max(...weekPercents);
  const weeklyWorst = Math.min(...weekPercents);
  const premiumTail = user.premium
    ? ` Compared with this week, you are ${percent >= weeklyAverage ? 'ahead of' : 'below'} your ${weeklyAverage}% average, with a best day of ${weeklyBest}% and a weakest day of ${weeklyWorst}%.`
    : '';

  if (percent >= 100) {
    return {
      heading: 'You cleared the day',
      kicker: 'Bright blue finish',
      copy: `Everything landed. Today is fully complete, your liquid is crystal blue, and this is the kind of day Premium will compare against weaker ones.${premiumTail}`
    };
  }

  if (percent > 75) {
    return {
      heading: 'You are in the green zone',
      kicker: `${completedActivities}/${user.activities.length} activities moving`,
      copy: `You are doing well. ${weakest ? `${weakest.name} is the only soft spot left.` : 'One more clean pass will lock in the day.'}${premiumTail}`
    };
  }

  if (percent >= 50) {
    return {
      heading: 'Momentum is real',
      kicker: 'Yellow means halfway there',
      copy: strongest
        ? `${strongest.name} is carrying the day. Bring ${weakest ? weakest.name : 'the last habit'} up and you will move out of the caution band.${premiumTail}`
        : `A little more logging will move the day into a safer zone.${premiumTail}`
    };
  }

  return {
    heading: 'Today needs a reset',
    kicker: 'Red-orange means under 50%',
    copy: weakest
      ? `Start with ${weakest.name}. Small wins matter more than widgets right now, and one focused check-in will raise the whole day.${premiumTail}`
      : `Start with your easiest habit and build from there.${premiumTail}`
  };
}

function getProfileContent(percent) {
  if (percent >= 100) {
    return {
      headline: 'Completed and clean',
      summary: 'Today hit full completion. Count goals landed, optional time goals landed, and the liquid summary turned bright blue because the day is fully closed.'
    };
  }

  if (percent > 75) {
    return {
      headline: 'Strong day, close to full',
      summary: 'You are above the green threshold. The only thing left is refinement: finish the remaining habit or add a little more time if you want the day to lock in at 100%.'
    };
  }

  if (percent >= 50) {
    return {
      headline: 'Progress is visible',
      summary: 'You are above the halfway mark, which turns the day yellow. The system is telling you there is real momentum, but not enough consistency yet to call it finished.'
    };
  }

  return {
    headline: 'Needs attention',
    summary: 'The day is still under 50%, so the summary shifts into a red-orange warning state. Focus on one activity and build upward instead of trying to fix everything at once.'
  };
}

function getPremiumButtonLabel() {
  return user.premium ? 'Premium Active' : 'Start Premium';
}

function getBadgeMarkup(percent) {
  const zone = getZoneConfig(percent);
  return `
    <span class="activity-row__badge activity-row__badge--${getZone(percent)}" style="background:${zone.gradient}; color:#102044;">
      ${percent}%
    </span>
  `;
}

function createActivityRow(activity, index, profileMode) {
  const percent = getActivityPercent(activity);
  const zoneLabel = getZoneConfig(percent).label;
  const scope = profileMode ? 'profile' : 'dashboard';
  const wrapper = document.createElement('article');
  wrapper.className = 'activity-row';
  wrapper.innerHTML = `
    <div class="activity-row__top">
      <div>
        <h4 class="activity-row__title">${activity.name}</h4>
        <p class="activity-row__meta">
          ${activity.loggedCount}/${activity.targetCount} reps
          ${activity.timeGoal ? ` · ${activity.timeLogged}/${activity.timeGoal} min` : ' · time optional'}
          ${profileMode ? ` · ${zoneLabel}` : ''}
        </p>
      </div>
      ${getBadgeMarkup(percent)}
    </div>
    <div class="activity-row__controls">
      <div class="activity-control">
        <label for="count-${scope}-${activity.id}-${index}">Count</label>
        <input id="count-${scope}-${activity.id}-${index}" type="number" min="0" step="1" value="${activity.loggedCount}">
      </div>
      <div class="activity-control">
        <label for="time-${scope}-${activity.id}-${index}">Time (min)</label>
        <input id="time-${scope}-${activity.id}-${index}" type="number" min="0" step="5" value="${activity.timeLogged}">
      </div>
    </div>
  `;

  const [countInput, timeInput] = wrapper.querySelectorAll('input');
  countInput.addEventListener('input', () => {
    activity.loggedCount = Math.max(Number(countInput.value) || 0, 0);
    saveUser();
    updateDashboard();
  });
  timeInput.addEventListener('input', () => {
    activity.timeLogged = Math.max(Number(timeInput.value) || 0, 0);
    saveUser();
    updateDashboard();
  });

  return wrapper;
}

function renderActivityLists() {
  const dashboardList = document.getElementById('activity-list');
  const profileList = document.getElementById('profile-activity-list');

  if (!dashboardList || !profileList) return;

  dashboardList.replaceChildren(...user.activities.map((activity, index) => createActivityRow(activity, index, false)));
  profileList.replaceChildren(...user.activities.map((activity, index) => createActivityRow(activity, index, true)));
}

function createMonthCell(percent, label, index) {
  const button = document.createElement('button');
  const zone = getZone(percent);
  button.type = 'button';
  button.className = `month-cell month-cell--${zone}`;
  if (index === getSelectedDayIndex()) {
    button.classList.add('month-cell--selected');
  }
  button.innerHTML = `<span>${label}</span><strong>${percent}%</strong>`;
  button.addEventListener('click', () => {
    user.currentDay = index;
    saveUser();
    updateDashboard();
  });
  return button;
}

function renderDayCard(container, percent) {
  const completedActivities = getCompletedActivityCount();
  const profile = getProfileContent(percent);
  const panel = document.createElement('article');
  panel.className = `day-focus-card day-focus-card--${getZone(percent)}`;
  panel.innerHTML = `
    <p class="eyebrow">Selected day</p>
    <h3>${getSelectedDayTitle()}</h3>
    <p>${profile.summary}</p>
    <div class="day-focus-card__stats">
      <span>${completedActivities}/${user.activities.length} activities above 75%</span>
      <strong>${percent}% complete</strong>
    </div>
  `;
  container.replaceChildren(panel);
}

function renderCalendar() {
  const monthGrid = document.getElementById('month-grid');
  const switcher = document.getElementById('calendar-switch');

  if (!monthGrid || !switcher) return;

  switcher.querySelectorAll('[data-calendar-view]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.calendarView === user.calendarView);
    if (!button.dataset.bound) {
      button.dataset.bound = 'true';
      button.addEventListener('click', () => {
        user.calendarView = button.dataset.calendarView;
        saveUser();
        updateDashboard();
      });
    }
  });

  if (user.calendarView === 'day') {
    renderDayCard(monthGrid, user.month[getSelectedDayIndex()] || 0);
    return;
  }

  if (user.calendarView === 'week') {
    const weekStart = Math.floor(getSelectedDayIndex() / 7) * 7;
    const cells = user.month.slice(weekStart, weekStart + 7)
      .map((percent, offset) => createMonthCell(percent, DAY_LABELS[offset], weekStart + offset));
    monthGrid.replaceChildren(...cells);
    return;
  }

  const cells = user.month.map((percent, index) => createMonthCell(percent, `${index + 1}`, index));
  monthGrid.replaceChildren(...cells);
}

function updateWeekGrid() {
  const cells = document.querySelectorAll('#week-grid .day-cell');
  cells.forEach((cell, index) => {
    const day = user.week[index];
    const meter = cell.querySelector('b');
    const label = cell.querySelector('span');
    const percent = day?.percent || 0;
    const zone = getZoneConfig(percent);

    cell.classList.remove('is-low', 'is-mid', 'is-complete', 'is-perfect', 'is-selected');
    cell.classList.add(`is-${getZone(percent)}`);
    if (index === getSelectedWeekIndex()) {
      cell.classList.add('is-selected');
    }
    if (label) {
      label.textContent = day?.label || DAY_LABELS[index];
    }
    if (meter) {
      meter.style.background = `${zone.gradient}, rgba(255,255,255,0.08)`;
      meter.style.boxShadow = `0 0 24px ${zone.ring.replace('0.92', '0.22').replace('0.94', '0.22').replace('0.98', '0.24')}, inset 0 2px 8px rgba(255,255,255,0.24)`;
    }
    if (!cell.dataset.bound) {
      cell.dataset.bound = 'true';
      cell.addEventListener('click', () => {
        user.currentDay = Math.floor(getSelectedDayIndex() / 7) * 7 + index;
        saveUser();
        updateDashboard();
      });
    }
  });
}

function animateLiquid(percent, zoneKey) {
  const liquidButton = document.getElementById('liquid-summary');
  const liquidFill = document.getElementById('liquid-fill');
  const waveOne = document.querySelector('.liquid-button__wave--one');
  const waveTwo = document.querySelector('.liquid-button__wave--two');
  const zone = ZONES[zoneKey];

  if (!liquidButton || !liquidFill || typeof gsap === 'undefined') return;

  const shift = clamp(100 - percent, 0, 100);

  liquidButton.style.setProperty('--liquid-color', zone.gradient);

  gsap.to(liquidFill, {
    yPercent: shift,
    duration: 1.05,
    ease: 'power3.out',
    overwrite: 'auto'
  });

  if (waveOne && !waveOne.dataset.looping) {
    waveOne.dataset.looping = 'true';
    gsap.to(waveOne, {
      rotation: 360,
      duration: 7.5,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%'
    });
  }

  if (waveTwo && !waveTwo.dataset.looping) {
    waveTwo.dataset.looping = 'true';
    gsap.to(waveTwo, {
      rotation: -360,
      duration: 10.5,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%'
    });
  }

  if (!liquidButton.dataset.bound) {
    liquidButton.dataset.bound = 'true';
    liquidButton.addEventListener('click', () => {
      gsap.fromTo(
        liquidButton,
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
    });
  }
}

function updateDashboard() {
  const dayPercent = syncUserState();
  const zoneKey = getZone(dayPercent);
  const zone = ZONES[zoneKey];
  const coach = getCoachContent(dayPercent);
  const profile = getProfileContent(dayPercent);
  const displayName = user.name || 'there';
  const displayHabit = user.habit || user.activities[0]?.name || 'Your first habit';
  const displayFrequency = Number(user.frequency) || user.activities[0]?.targetCount || 0;
  const completedActivities = getCompletedActivityCount();
  const progressAngle = Math.max(18, Math.round((dayPercent / 100) * 360));
  const streak = document.getElementById('metric-streak');
  const count = document.getElementById('metric-count');
  const percent = document.getElementById('metric-percent');
  const greeting = document.getElementById('dashboard-greeting');
  const habitName = document.getElementById('habit-name');
  const habitSummary = document.getElementById('habit-summary');
  const ring = document.getElementById('progress-ring');
  const ringValue = document.getElementById('progress-ring-value');
  const weeklySummary = document.getElementById('weekly-summary');
  const coachHeading = document.getElementById('coach-heading');
  const coachKicker = document.getElementById('coach-kicker');
  const coachCopy = document.getElementById('coach-copy');
  const profileDayLabel = document.getElementById('profile-day-label');
  const profilePercentLabel = document.getElementById('profile-percent-label');
  const profileCoachCopy = document.getElementById('profile-coach-copy');
  const profileHeadline = document.getElementById('profile-headline');
  const profileSummary = document.getElementById('profile-summary');
  const liquidLabel = document.getElementById('liquid-label');
  const subscribeButton = document.getElementById('btn-subscribe');

  if (!greeting) return;

  greeting.textContent = `${getGreeting()}, ${displayName}`;
  habitName.textContent = displayHabit;
  habitSummary.textContent = displayFrequency
    ? `${displayFrequency} target reps this week. Count is the core score, and time stays optional for every activity.`
    : 'Set your target cadence, then log counts and optional time without needing Premium.';

  streak.textContent = `${user.streak}`;
  count.textContent = `${user.count}`;
  percent.textContent = `${dayPercent}%`;
  ringValue.textContent = `${dayPercent}%`;
  ring.style.setProperty('--progress-angle', `${progressAngle}deg`);
  ring.style.background = `
    radial-gradient(circle at 35% 28%, rgba(255, 255, 255, 0.88), rgba(167, 245, 255, 0.46) 18%, rgba(111, 217, 255, 0.18) 34%, rgba(35, 33, 77, 0) 68%),
    conic-gradient(from 0deg, ${zone.ring} 0deg, ${zone.ring} ${progressAngle}deg, rgba(255, 255, 255, 0.12) ${progressAngle}deg, rgba(255, 255, 255, 0.12) 360deg)
  `;

  weeklySummary.textContent = `${completedActivities}/${user.activities.length} activities in the green today`;
  coachHeading.textContent = coach.heading;
  coachKicker.textContent = coach.kicker;
  coachCopy.textContent = coach.copy;

  profileDayLabel.textContent = getSelectedDayLongLabel();
  profilePercentLabel.textContent = `${dayPercent}%`;
  profileCoachCopy.textContent = coach.copy;
  profileHeadline.textContent = profile.headline;
  profileSummary.textContent = profile.summary;
  liquidLabel.textContent = `${dayPercent}%`;

  if (subscribeButton) {
    subscribeButton.textContent = getPremiumButtonLabel();
  }

  renderActivityLists();
  renderCalendar();
  updateWeekGrid();
  animateLiquid(dayPercent, zoneKey);
  saveUser();
}

function logPractice() {
  const firstActivity = user.activities[0];
  if (!firstActivity) return;

  firstActivity.loggedCount += 1;
  saveUser();
  updateDashboard();
}

window.updateDashboard = updateDashboard;
window.logPractice = logPractice;
