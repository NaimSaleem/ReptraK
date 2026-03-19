import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = 'reptrak-user';
export const DAYS_IN_MONTH_VIEW = 30;
export const FUTURE_MONTH_WINDOW = 24;

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

const DEFAULT_MONTH_VALUES = [
  100, 80, 42, 64, 30, 92, 18, 54, 72, 88,
  40, 0, 61, 77, 84, 58, 91, 36, 45, 69,
  100, 26, 50, 73, 87, 33, 60, 94, 71, 86
];

function getMonthStart(dateLike = new Date()) {
  const date = new Date(dateLike);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getTodayIndex(dateLike = new Date()) {
  return clamp(new Date(dateLike).getDate() - 1, 0, DAYS_IN_MONTH_VIEW - 1);
}

export function getCurrentMonthKey(dateLike = new Date()) {
  const date = new Date(dateLike);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

function parseMonthKey(monthKey) {
  const [year, month] = String(monthKey || '').split('-').map((value) => Number(value));
  return {
    year: Number.isFinite(year) ? year : new Date().getFullYear(),
    month: Number.isFinite(month) ? month : 1
  };
}

function monthKeyToDate(monthKey) {
  const { year, month } = parseMonthKey(monthKey);
  return new Date(year, month - 1, 1);
}

function compareMonthKeys(a, b) {
  return monthKeyToDate(a).getTime() - monthKeyToDate(b).getTime();
}

function shiftMonthKey(monthKey, offset) {
  const date = monthKeyToDate(monthKey);
  date.setMonth(date.getMonth() + offset);
  return getCurrentMonthKey(date);
}

function normalizeMonthArray(values = []) {
  return Array.from({ length: DAYS_IN_MONTH_VIEW }, (_, index) => {
    const value = Number(values[index]);
    return Number.isFinite(value) ? clamp(value, 0, 100) : 0;
  });
}

function normalizeVoidDays(values = []) {
  return [...new Set(
    values
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value >= 0 && value < DAYS_IN_MONTH_VIEW)
  )].sort((a, b) => a - b);
}

function buildWeekSummary(monthValues, currentDay, voidDays = []) {
  const weekStart = Math.floor(clamp(currentDay, 0, DAYS_IN_MONTH_VIEW - 1) / 7) * 7;
  return DAY_LABELS.map((label, index) => {
    const actualIndex = weekStart + index;
    const percent = actualIndex < monthValues.length ? monthValues[actualIndex] || 0 : 0;
    const isVoided = voidDays.includes(actualIndex);
    return {
      label,
      percent,
      mood: isVoided ? 'void' : getZone(percent)
    };
  });
}

export function getMonthLabel(monthKey) {
  return monthKeyToDate(monthKey).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

export function getMonthOffsetFromCurrent(monthKey) {
  const current = monthKeyToDate(getCurrentMonthKey());
  const selected = monthKeyToDate(monthKey);
  return (selected.getFullYear() - current.getFullYear()) * 12 + (selected.getMonth() - current.getMonth());
}

export function isFutureMonthKey(monthKey) {
  return getMonthOffsetFromCurrent(monthKey) > 0;
}

export function isPastMonthKey(monthKey) {
  return getMonthOffsetFromCurrent(monthKey) < 0;
}

export function getAvailableMonthKeys(accountCreatedAt, futureMonths = FUTURE_MONTH_WINDOW) {
  const start = getMonthStart(accountCreatedAt);
  const end = getMonthStart(new Date());
  end.setMonth(end.getMonth() + futureMonths);

  const keys = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    keys.push(getCurrentMonthKey(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return keys;
}

export function selectMonth(user, monthKey) {
  const normalized = normalizeUser(user);
  const available = getAvailableMonthKeys(normalized.accountCreatedAt);

  if (!available.includes(monthKey)) {
    return normalized;
  }

  return {
    ...normalized,
    selectedMonthKey: monthKey,
    monthRecords: ensureMonthRecord(normalized.monthRecords, monthKey),
    voidDaysByMonth: {
      ...normalized.voidDaysByMonth,
      [monthKey]: getVoidDaysForMonth(normalized, monthKey)
    }
  };
}

function createNotificationSettings() {
  return {
    enabled: true,
    reminderTime: '7:30 PM',
    tone: 'Coach',
    preview: 'You’re doing great! Ready for another rep?!'
  };
}

export function createDefaultUser(now = new Date()) {
  const monthKey = getCurrentMonthKey(now);
  const todayIndex = getTodayIndex(now);
  return {
    name: '',
    habit: '',
    frequency: '',
    streak: 0,
    count: 0,
    minutes: 0,
    premium: false,
    theme: 'aqua',
    calendarView: 'month',
    currentDay: todayIndex,
    logDayIndex: todayIndex,
    activitySeq: 3,
    accountCreatedAt: now.toISOString(),
    selectedMonthKey: monthKey,
    monthRecords: {
      [monthKey]: [...DEFAULT_MONTH_VALUES]
    },
    voidDaysByMonth: {
      [monthKey]: []
    },
    voidDays: [],
    focusArchive: [],
    notificationSettings: createNotificationSettings(),
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
    week: buildWeekSummary(DEFAULT_MONTH_VALUES, todayIndex),
    month: [...DEFAULT_MONTH_VALUES]
  };
}

export const defaultUser = createDefaultUser();

export function getSelectedMonthKey(user) {
  return user.selectedMonthKey || getCurrentMonthKey();
}

export function getMonthRecord(user, monthKey = getSelectedMonthKey(user)) {
  return normalizeMonthArray(user.monthRecords?.[monthKey]);
}

function getVoidDaysForMonth(user, monthKey = getSelectedMonthKey(user)) {
  return normalizeVoidDays(user.voidDaysByMonth?.[monthKey]);
}

function ensureMonthRecord(monthRecords, monthKey) {
  return {
    ...monthRecords,
    [monthKey]: normalizeMonthArray(monthRecords[monthKey])
  };
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

export function isVoidDay(user, dayIndex, monthKey = getSelectedMonthKey(user)) {
  return getVoidDaysForMonth(user, monthKey).includes(dayIndex);
}

export function ensureFocusActivity(activities) {
  if (!activities.length) {
    return [{
      ...createDefaultUser().activities[0],
      role: 'focus'
    }];
  }

  const defaults = createDefaultUser().activities;
  const normalized = activities.map((activity, index) => ({
    ...defaults[index % defaults.length],
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
  const baseline = createDefaultUser();
  const merged = { ...baseline, ...rawUser };
  const activeMonthKey = getCurrentMonthKey();
  const availableKeys = getAvailableMonthKeys(rawUser.accountCreatedAt || baseline.accountCreatedAt);

  const incomingActivities = Array.isArray(rawUser.activities) && rawUser.activities.length
    ? rawUser.activities.slice(0, 3)
    : baseline.activities.map((activity) => ({ ...activity }));

  merged.activities = ensureFocusActivity(incomingActivities);

  const monthRecords = {};
  if (rawUser.monthRecords && typeof rawUser.monthRecords === 'object') {
    Object.entries(rawUser.monthRecords).forEach(([key, values]) => {
      monthRecords[key] = normalizeMonthArray(values);
    });
  }

  if (!Object.keys(monthRecords).length) {
    monthRecords[activeMonthKey] = Array.isArray(rawUser.month)
      ? normalizeMonthArray(rawUser.month)
      : [...baseline.month];
  }

  monthRecords[activeMonthKey] = monthRecords[activeMonthKey] || [...baseline.month];
  merged.monthRecords = monthRecords;

  const voidDaysByMonth = {};
  if (rawUser.voidDaysByMonth && typeof rawUser.voidDaysByMonth === 'object') {
    Object.entries(rawUser.voidDaysByMonth).forEach(([key, values]) => {
      voidDaysByMonth[key] = normalizeVoidDays(values);
    });
  } else if (Array.isArray(rawUser.voidDays)) {
    voidDaysByMonth[activeMonthKey] = normalizeVoidDays(rawUser.voidDays);
  }

  merged.voidDaysByMonth = voidDaysByMonth;
  merged.accountCreatedAt = rawUser.accountCreatedAt || baseline.accountCreatedAt;
  merged.selectedMonthKey = rawUser.selectedMonthKey || activeMonthKey;

  if (!availableKeys.includes(merged.selectedMonthKey)) {
    merged.selectedMonthKey = compareMonthKeys(merged.selectedMonthKey, availableKeys[0]) < 0
      ? availableKeys[0]
      : availableKeys[availableKeys.length - 1];
  }

  merged.monthRecords = ensureMonthRecord(merged.monthRecords, merged.selectedMonthKey);
  merged.monthRecords = ensureMonthRecord(merged.monthRecords, activeMonthKey);
  merged.voidDaysByMonth[merged.selectedMonthKey] = getVoidDaysForMonth(merged, merged.selectedMonthKey);
  merged.voidDaysByMonth[activeMonthKey] = getVoidDaysForMonth(merged, activeMonthKey);

  merged.month = getMonthRecord(merged, merged.selectedMonthKey);
  merged.voidDays = getVoidDaysForMonth(merged, merged.selectedMonthKey);
  merged.currentDay = clamp(Number(merged.currentDay) || 0, 0, DAYS_IN_MONTH_VIEW - 1);
  merged.logDayIndex = clamp(
    Number(merged.logDayIndex ?? getTodayIndex()) || 0,
    0,
    DAYS_IN_MONTH_VIEW - 1
  );
  merged.activitySeq = Math.max(Number(merged.activitySeq) || merged.activities.length, merged.activities.length);
  merged.habit = merged.habit || getFocusActivity(merged)?.name || '';
  merged.notificationSettings = {
    ...createNotificationSettings(),
    ...(rawUser.notificationSettings || {})
  };
  merged.week = buildWeekSummary(merged.month, merged.currentDay, merged.voidDays);
  merged.focusArchive = Array.isArray(rawUser.focusArchive) ? [...rawUser.focusArchive] : [];

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

export async function clearStoredUser() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user:', error);
  }
}

export function isOnboarded(user) {
  return Boolean(user.name && user.habit && user.frequency);
}

export function getSelectedDayIndex(user) {
  return clamp(user.currentDay || 0, 0, DAYS_IN_MONTH_VIEW - 1);
}

export function getLogDayIndex(user) {
  return clamp(user.logDayIndex ?? getTodayIndex(), 0, DAYS_IN_MONTH_VIEW - 1);
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
  const activeMonthKey = getCurrentMonthKey();
  const monthValues = getMonthRecord(user, activeMonthKey);
  const voidDays = getVoidDaysForMonth(user, activeMonthKey);
  let streak = 0;

  for (let index = getLogDayIndex(user); index >= 0; index -= 1) {
    if (voidDays.includes(index)) continue;
    if ((monthValues[index] || 0) >= 75) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function syncDerivedState(rawUser) {
  const user = normalizeUser(rawUser);
  const activeMonthKey = getCurrentMonthKey();
  const dayPercent = getDayPercent(user);
  const dayIndex = getLogDayIndex(user);
  const activeMonth = getMonthRecord(user, activeMonthKey);
  const activeVoidDays = getVoidDaysForMonth(user, activeMonthKey);

  if (!activeVoidDays.includes(dayIndex)) {
    activeMonth[dayIndex] = dayPercent;
  }

  user.monthRecords = {
    ...user.monthRecords,
    [activeMonthKey]: activeMonth
  };
  user.month = getMonthRecord(user, user.selectedMonthKey);
  user.voidDays = getVoidDaysForMonth(user, user.selectedMonthKey);
  user.week = buildWeekSummary(user.month, user.currentDay, user.voidDays);
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
    id: `${currentFocus.id}-${Date.now()}`,
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
        role: 'supplementary'
      };
    }
    if (activity.id === nextFocusId) {
      return {
        ...activity,
        role: 'focus'
      };
    }
    return { ...activity, role: 'supplementary' };
  });

  return {
    ...normalized,
    habit: nextFocus.name,
    frequency: String(nextFocus.targetCount || normalized.frequency || ''),
    activities,
    focusArchive: [archivedEntry, ...normalized.focusArchive].slice(0, 30)
  };
}

export function toggleVoidDay(user, dayIndex, monthKey = getSelectedMonthKey(user)) {
  const normalized = normalizeUser(user);
  const currentVoidDays = getVoidDaysForMonth(normalized, monthKey);
  const exists = currentVoidDays.includes(dayIndex);
  const nextVoidDays = exists
    ? currentVoidDays.filter((value) => value !== dayIndex)
    : [...currentVoidDays, dayIndex];

  return {
    ...normalized,
    voidDaysByMonth: {
      ...normalized.voidDaysByMonth,
      [monthKey]: normalizeVoidDays(nextVoidDays)
    }
  };
}

export function getPremiumInsights(user) {
  const monthValues = user.month || [];
  const voidDays = user.voidDays || [];
  const selectedDay = getSelectedDayIndex(user);
  const currentWeekStart = Math.floor(selectedDay / 7) * 7;
  const previousWeekStart = Math.max(currentWeekStart - 7, 0);

  const currentWeek = monthValues
    .slice(currentWeekStart, currentWeekStart + 7)
    .filter((_, index) => !voidDays.includes(currentWeekStart + index));
  const previousWeek = monthValues
    .slice(previousWeekStart, currentWeekStart)
    .filter((_, index) => !voidDays.includes(previousWeekStart + index));
  const activeMonth = monthValues.filter((_, index) => !voidDays.includes(index));

  const weekAvg = currentWeek.length
    ? Math.round(currentWeek.reduce((sum, value) => sum + value, 0) / currentWeek.length)
    : 0;
  const monthAvg = activeMonth.length
    ? Math.round(activeMonth.reduce((sum, value) => sum + value, 0) / activeMonth.length)
    : 0;
  const trend = previousWeek.length
    ? weekAvg - Math.round(previousWeek.reduce((sum, value) => sum + value, 0) / previousWeek.length)
    : 0;
  const best = currentWeek.length ? Math.max(...currentWeek, 0) : 0;
  const worst = currentWeek.length ? Math.min(...currentWeek, 100) : 0;

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
    ? ` Week avg ${insights.weekAvg}% vs month avg ${insights.monthAvg}% (${insights.trend >= 0 ? '+' : ''}${insights.trend})!`
    : '';

  if (percent >= 100) {
    return {
      heading: 'That was awesome!',
      kicker: `${focus?.name || 'Focus habit'} is fully complete!`,
      copy: `You closed the loop beautifully! Your focus habit is locked in, and the day is glowing bright blue!${premiumTail}`
    };
  }

  if (percent > 75) {
    return {
      heading: 'You’re on fire!',
      kicker: `${focus?.name || 'Focus habit'} is in the green zone!`,
      copy: `Just a little more and this day is totally sealed! Keep the energy up and let your support habits stay light and helpful!${premiumTail}`
    };
  }

  if (percent >= 50) {
    return {
      heading: 'Nice momentum!',
      kicker: 'Yellow means you’re halfway there!',
      copy: `You’ve got real traction now! Stay with ${focus?.name || 'your focus habit'} and use your ${supplementaryCount} support habit${supplementaryCount === 1 ? '' : 's'} to keep the rhythm fun!${premiumTail}`
    };
  }

  return {
    heading: 'Fresh start, let’s go!',
    kicker: 'Red-orange means today needs one strong rep!',
    copy: `Start small, move fast, and get one clean win on ${focus?.name || 'your focus habit'}! Once that first rep lands, the whole day can turn around!${premiumTail}`
  };
}

export function getProfileContent(percent) {
  if (percent >= 100) {
    return {
      headline: 'Amazing finish!',
      summary: 'Today is fully complete! You landed the reps, the time goals, and the closeout feels crisp and confident!'
    };
  }

  if (percent > 75) {
    return {
      headline: 'Looking strong!',
      summary: 'You’re above the green line and almost at a full closeout! One more push could lock the day in beautifully!'
    };
  }

  if (percent >= 50) {
    return {
      headline: 'Momentum is building!',
      summary: 'You’re over halfway there! Keep it playful, stack another rep, and let the day keep brightening up!'
    };
  }

  return {
    headline: 'A bounce-back is ready!',
    summary: 'The day is still early in the climb! One focused action can wake the whole board up and get you moving again!'
  };
}
