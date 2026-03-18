import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = 'reptrak-user';

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const FULL_DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ZONES = {
  low: {
    label: 'Reset zone',
    badge: 'Low',
    color: '#ff6530',
    lightColor: '#ff9f6d',
    textColor: '#102044'
  },
  mid: {
    label: 'Building zone',
    badge: 'Mid',
    color: '#ffbc48',
    lightColor: '#ffe586',
    textColor: '#102044'
  },
  complete: {
    label: 'Strong zone',
    badge: 'Green',
    color: '#23c26a',
    lightColor: '#79f49c',
    textColor: '#102044'
  },
  perfect: {
    label: 'Crystal zone',
    badge: 'Full',
    color: '#36aaff',
    lightColor: '#88efff',
    textColor: '#102044'
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
  theme: 'aqua',
  calendarView: 'month',
  currentDay: 2,
  logDayIndex: 2,
  activitySeq: 3,
  voidDays: [],
  focusArchive: [],
  activities: [
    {
      id: 'focus',
      role: 'focus',
      name: 'Deep Work',
      targetCount: 2,
      loggedCount: 1,
      timeGoal: 90,
      timeLogged: 50
    },
    {
      id: 'movement',
      role: 'supplementary',
      name: 'Movement',
      targetCount: 1,
      loggedCount: 0,
      timeGoal: 30,
      timeLogged: 0
    },
    {
      id: 'reading',
      role: 'supplementary',
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

export function getFocusActivity(user) {
  return user.activities.find((activity) => activity.role === 'focus') || user.activities[0] || null;
}

export function getSupplementaryActivities(user) {
  const focusId = getFocusActivity(user)?.id;
  return user.activities.filter((activity) => activity.id !== focusId);
}

export function getTrackableActivities(user) {
  const focus = getFocusActivity(user);
  return focus ? [focus] : user.activities.slice(0, 1);
}

export function isVoidDay(user, dayIndex) {
  return Array.isArray(user.voidDays) && user.voidDays.includes(dayIndex);
}

export function ensureFocusActivity(activities) {
  if (!activities.length) {
    return [{
      ...defaultUser.activities[0],
      role: 'focus'
    }];
  }

  const normalized = activities.map((activity, index) => ({
    ...defaultUser.activities[index % defaultUser.activities.length],
    ...activity,
    role: activity.role === 'focus' ? 'focus' : 'supplementary'
  }));

  const focusCount = normalized.filter((activity) => activity.role === 'focus').length;
  if (focusCount === 0) {
    normalized[0].role = 'focus';
  } else if (focusCount > 1) {
    let seenFocus = false;
    for (const activity of normalized) {
      if (activity.role === 'focus' && !seenFocus) {
        seenFocus = true;
      } else if (activity.role === 'focus') {
        activity.role = 'supplementary';
      }
    }
  }
  return normalized;
}

export function normalizeUser(rawUser = {}) {
  const merged = { ...defaultUser, ...rawUser };

  const incomingActivities = Array.isArray(rawUser.activities) && rawUser.activities.length
    ? rawUser.activities.slice(0, 3)
    : defaultUser.activities.map((activity) => ({ ...activity }));

  merged.activities = ensureFocusActivity(incomingActivities);
  merged.week = Array.isArray(rawUser.week) && rawUser.week.length
    ? rawUser.week.map((day, index) => ({
      ...defaultUser.week[index % defaultUser.week.length],
      ...day
    }))
    : defaultUser.week.map((day) => ({ ...day }));

  merged.month = Array.isArray(rawUser.month) && rawUser.month.length
    ? [...rawUser.month]
    : [...defaultUser.month];

  merged.focusArchive = Array.isArray(rawUser.focusArchive) ? [...rawUser.focusArchive] : [];
  merged.voidDays = Array.isArray(rawUser.voidDays)
    ? rawUser.voidDays.filter((dayIndex) => Number.isFinite(dayIndex))
    : [];
  merged.currentDay = clamp(Number(merged.currentDay) || 0, 0, Math.max(merged.month.length - 1, 0));
  merged.logDayIndex = clamp(Number(merged.logDayIndex ?? merged.currentDay) || 0, 0, Math.max(merged.month.length - 1, 0));
  merged.activitySeq = Math.max(Number(merged.activitySeq) || merged.activities.length, merged.activities.length);
  merged.habit = merged.habit || getFocusActivity(merged)?.name || '';

  return merged;
}

export async function loadUser() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return normalizeUser();
    return normalizeUser(JSON.parse(stored));
  } catch {
    return normalizeUser();
  }
}

export async function persistUser(user) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to persist user:', error);
  }
}

export function isOnboarded(user) {
  return Boolean(user.name && user.habit && user.frequency);
}

export function getSelectedDayIndex(user) {
  return clamp(user.currentDay || 0, 0, Math.max(user.month.length - 1, 0));
}

export function getLogDayIndex(user) {
  return clamp(user.logDayIndex ?? user.currentDay ?? 0, 0, Math.max(user.month.length - 1, 0));
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
  const trackable = getTrackableActivities(user);
  if (!trackable.length) return 0;

  const total = trackable.reduce((sum, activity) => sum + getActivityPercent(activity), 0);
  return Math.round(total / trackable.length);
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
  return getTrackableActivities(user).filter((activity) => getActivityPercent(activity) >= 75).length;
}

export function getWeakestActivity(user) {
  return getTrackableActivities(user).reduce((lowest, activity) => {
    if (!lowest) return activity;
    return getActivityPercent(activity) < getActivityPercent(lowest) ? activity : lowest;
  }, null);
}

export function getStrongestActivity(user) {
  return getTrackableActivities(user).reduce((strongest, activity) => {
    if (!strongest) return activity;
    return getActivityPercent(activity) > getActivityPercent(strongest) ? activity : strongest;
  }, null);
}

export function getStreakFromMonth(user) {
  let streak = 0;
  for (let index = getLogDayIndex(user); index >= 0; index -= 1) {
    if (isVoidDay(user, index)) continue;
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
  const dayIndex = getLogDayIndex(user);
  const weekIndex = dayIndex % 7;

  if (!isVoidDay(user, dayIndex)) {
    user.month[dayIndex] = dayPercent;
    user.week[weekIndex] = {
      ...user.week[weekIndex],
      label: DAY_LABELS[weekIndex],
      percent: dayPercent,
      mood: getZone(dayPercent)
    };
  }

  user.count = user.activities.reduce((sum, activity) => sum + Math.max(Number(activity.loggedCount) || 0, 0), 0);
  user.minutes = user.activities.reduce((sum, activity) => sum + Math.max(Number(activity.timeLogged) || 0, 0), 0);
  user.streak = getStreakFromMonth(user);

  return user;
}

export function canAddActivity(user) {
  return user.activities.length < 3;
}

export function createActivity({ id, name, role = 'supplementary' }) {
  return {
    id,
    name,
    role,
    targetCount: 1,
    loggedCount: 0,
    timeGoal: 30,
    timeLogged: 0
  };
}

export function addActivity(user, name) {
  if (!canAddActivity(user)) return user;
  const nextSeq = (user.activitySeq || user.activities.length) + 1;
  const newActivity = createActivity({
    id: `habit-${nextSeq}`,
    name: name?.trim() || `Habit ${nextSeq}`
  });

  return {
    ...user,
    activitySeq: nextSeq,
    activities: [...user.activities, newActivity]
  };
}

export function switchFocusActivity(user, nextFocusId) {
  const normalized = normalizeUser(user);
  const currentFocus = getFocusActivity(normalized);
  if (!currentFocus || currentFocus.id === nextFocusId) return normalized;

  const nextFocus = normalized.activities.find((activity) => activity.id === nextFocusId);
  if (!nextFocus) return normalized;

  const archivedEntry = {
    id: currentFocus.id,
    name: currentFocus.name,
    switchedAt: new Date().toISOString(),
    finalPercent: getActivityPercent(currentFocus),
    loggedCount: currentFocus.loggedCount,
    timeLogged: currentFocus.timeLogged
  };

  const activities = normalized.activities.map((activity) => {
    if (activity.id === currentFocus.id) {
      return {
        ...activity,
        role: 'supplementary',
        loggedCount: 0,
        timeLogged: 0
      };
    }
    if (activity.id === nextFocusId) {
      return {
        ...activity,
        role: 'focus',
        loggedCount: 0,
        timeLogged: 0
      };
    }
    return { ...activity, role: 'supplementary' };
  });

  return {
    ...normalized,
    habit: nextFocus.name,
    frequency: String(nextFocus.targetCount || normalized.frequency || ''),
    activities,
    focusArchive: [archivedEntry, ...normalized.focusArchive].slice(0, 20)
  };
}

export function toggleVoidDay(user, dayIndex) {
  const normalized = normalizeUser(user);
  const exists = normalized.voidDays.includes(dayIndex);
  const voidDays = exists
    ? normalized.voidDays.filter((value) => value !== dayIndex)
    : [...normalized.voidDays, dayIndex];

  return {
    ...normalized,
    voidDays
  };
}

export function getPremiumInsights(user) {
  const selectedDay = getSelectedDayIndex(user);
  const currentWeekStart = Math.floor(selectedDay / 7) * 7;
  const currentWeek = user.month.slice(currentWeekStart, currentWeekStart + 7);
  const previousWeek = user.month.slice(Math.max(currentWeekStart - 7, 0), currentWeekStart);

  const weekAvg = currentWeek.length
    ? Math.round(currentWeek.reduce((sum, value) => sum + value, 0) / currentWeek.length)
    : 0;
  const monthAvg = user.month.length
    ? Math.round(user.month.reduce((sum, value) => sum + value, 0) / user.month.length)
    : 0;
  const trend = previousWeek.length
    ? weekAvg - Math.round(previousWeek.reduce((sum, value) => sum + value, 0) / previousWeek.length)
    : 0;
  const best = Math.max(...currentWeek, 0);
  const worst = Math.min(...currentWeek, 100);

  return { weekAvg, monthAvg, trend, best, worst };
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getCoachContent(user, percent) {
  const focus = getFocusActivity(user);
  const supplementaryCount = getSupplementaryActivities(user).length;
  const insights = getPremiumInsights(user);
  const premiumTail = user.premium
    ? ` Week avg ${insights.weekAvg}% vs month avg ${insights.monthAvg}% (${insights.trend >= 0 ? '+' : ''}${insights.trend}).`
    : '';

  if (percent >= 100) {
    return {
      heading: 'Mastery rep locked',
      kicker: `${focus?.name || 'Focus habit'} fully complete`,
      copy: `Bright blue closeout. Your focus habit is done and the day is closed. Supplementary habits are optional support only.${premiumTail}`
    };
  }

  if (percent > 75) {
    return {
      heading: 'Focus lane is strong',
      kicker: `${focus?.name || 'Focus habit'} in the green zone`,
      copy: `You are close to full completion on your main skill track. Keep supplementary habits light so focus stays sharp.${premiumTail}`
    };
  }

  if (percent >= 50) {
    return {
      heading: 'Momentum is real',
      kicker: 'Yellow means halfway there',
      copy: `Keep attention on ${focus?.name || 'the focus habit'}. You still have ${supplementaryCount} supplementary habit${supplementaryCount === 1 ? '' : 's'} available, but they do not raise your core mastery score.${premiumTail}`
    };
  }

  return {
    heading: 'Reset and rep',
    kicker: 'Red-orange means under 50%',
    copy: `Run one small rep on ${focus?.name || 'the focus habit'} right now. The system rewards consistency on one thing at a time.${premiumTail}`
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
