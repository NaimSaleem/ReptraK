export const STORAGE_KEY = 'reptrak-user';

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const FULL_DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ZONES = {
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

export const defaultUser = {
  name: '',
  habit: '',
  frequency: '',
  streak: 0,
  count: 0,
  minutes: 0,
  premium: false,
  calendarView: 'month',
  currentDay: 2,
  activities: [
    {
      id: 'focus',
      name: 'Deep Work',
      targetCount: 2,
      loggedCount: 1,
      timeGoal: 90,
      timeLogged: 50
    },
    {
      id: 'movement',
      name: 'Movement',
      targetCount: 1,
      loggedCount: 0,
      timeGoal: 30,
      timeLogged: 0
    },
    {
      id: 'reading',
      name: 'Reading',
      targetCount: 1,
      loggedCount: 1,
      timeGoal: 20,
      timeLogged: 20
    }
  ],
  week: [
    { label: 'Mon', percent: 100, mood: 'perfect' },
    { label: 'Tue', percent: 42, mood: 'low' },
    { label: 'Wed', percent: 64, mood: 'mid' },
    { label: 'Thu', percent: 0, mood: 'low' },
    { label: 'Fri', percent: 86, mood: 'complete' },
    { label: 'Sat', percent: 55, mood: 'mid' },
    { label: 'Sun', percent: 24, mood: 'low' }
  ],
  month: [
    100, 80, 42, 64, 30, 92, 18,
    54, 72, 88, 40, 0, 61, 77,
    84, 58, 91, 36, 45, 69, 100,
    26, 50, 73, 87, 33, 60, 94
  ]
};

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeUser(rawUser = {}) {
  const merged = { ...defaultUser, ...rawUser };
  merged.activities = Array.isArray(rawUser.activities) && rawUser.activities.length
    ? rawUser.activities.map((activity, index) => ({
      ...defaultUser.activities[index % defaultUser.activities.length],
      ...activity
    }))
    : defaultUser.activities.map((activity) => ({ ...activity }));
  merged.week = Array.isArray(rawUser.week) && rawUser.week.length
    ? rawUser.week.map((day, index) => ({
      ...defaultUser.week[index % defaultUser.week.length],
      ...day
    }))
    : defaultUser.week.map((day) => ({ ...day }));
  merged.month = Array.isArray(rawUser.month) && rawUser.month.length
    ? [...rawUser.month]
    : [...defaultUser.month];

  return merged;
}

export function loadUser() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return normalizeUser();
    return normalizeUser(JSON.parse(stored));
  } catch {
    return normalizeUser();
  }
}

export function persistUser(user) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function isOnboarded(user) {
  return Boolean(user.name && user.habit && user.frequency);
}

export function getSelectedDayIndex(user) {
  return clamp(user.currentDay || 0, 0, Math.max(user.month.length - 1, 0));
}

export function getSelectedWeekIndex(user) {
  return getSelectedDayIndex(user) % 7;
}

export function getSelectedDayLongLabel(user) {
  return FULL_DAY_LABELS[getSelectedWeekIndex(user)];
}

export function getSelectedDayTitle(user) {
  return `${getSelectedDayLongLabel(user)} · Day ${getSelectedDayIndex(user) + 1}`;
}

export function getCountCompletion(activity) {
  const target = Math.max(Number(activity.targetCount) || 0, 0);
  const logged = Math.max(Number(activity.loggedCount) || 0, 0);

  if (!target && !logged) return 0;
  if (!target) return 1;

  return clamp(logged / target, 0, 1);
}

export function getTimeCompletion(activity) {
  const goal = Math.max(Number(activity.timeGoal) || 0, 0);
  const logged = Math.max(Number(activity.timeLogged) || 0, 0);

  if (!goal) return 0;
  return clamp(logged / goal, 0, 1);
}

export function getActivityPercent(activity) {
  const countCompletion = getCountCompletion(activity);
  const usesTime = Number(activity.timeGoal) > 0;
  const percent = usesTime
    ? Math.round(((countCompletion + getTimeCompletion(activity)) / 2) * 100)
    : Math.round(countCompletion * 100);

  return clamp(percent, 0, 100);
}

export function getDayPercent(user) {
  if (!user.activities.length) return 0;
  const total = user.activities.reduce((sum, activity) => sum + getActivityPercent(activity), 0);
  return Math.round(total / user.activities.length);
}

export function getZone(percent) {
  if (percent >= 100) return 'perfect';
  if (percent > 75) return 'complete';
  if (percent >= 50) return 'mid';
  return 'low';
}

export function getZoneConfig(percent) {
  return ZONES[getZone(percent)];
}

export function getCompletedActivityCount(user) {
  return user.activities.filter((activity) => getActivityPercent(activity) >= 75).length;
}

export function getWeakestActivity(user) {
  return user.activities.reduce((lowest, activity) => {
    if (!lowest) return activity;
    return getActivityPercent(activity) < getActivityPercent(lowest) ? activity : lowest;
  }, null);
}

export function getStrongestActivity(user) {
  return user.activities.reduce((strongest, activity) => {
    if (!strongest) return activity;
    return getActivityPercent(activity) > getActivityPercent(strongest) ? activity : strongest;
  }, null);
}

export function getStreakFromMonth(user) {
  let streak = 0;
  for (let index = getSelectedDayIndex(user); index >= 0; index -= 1) {
    if ((user.month[index] || 0) >= 75) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}

export function syncDerivedState(rawUser) {
  const user = normalizeUser(rawUser);
  const dayPercent = getDayPercent(user);
  const dayIndex = getSelectedDayIndex(user);
  const weekIndex = getSelectedWeekIndex(user);

  user.month[dayIndex] = dayPercent;
  user.week[weekIndex] = {
    ...user.week[weekIndex],
    label: DAY_LABELS[weekIndex],
    percent: dayPercent,
    mood: getZone(dayPercent)
  };
  user.count = user.activities.reduce((sum, activity) => sum + Math.max(Number(activity.loggedCount) || 0, 0), 0);
  user.minutes = user.activities.reduce((sum, activity) => sum + Math.max(Number(activity.timeLogged) || 0, 0), 0);
  user.streak = getStreakFromMonth(user);

  return user;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getCoachContent(user, percent) {
  const completedActivities = getCompletedActivityCount(user);
  const weakest = getWeakestActivity(user);
  const strongest = getStrongestActivity(user);
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

export function getProfileContent(percent) {
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

