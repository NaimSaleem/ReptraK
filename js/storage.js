const STORAGE_KEY = 'reptrak-user';

const defaultUser = {
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
    { label: 'Mon', percent: 100, mood: 'complete' },
    { label: 'Tue', percent: 42, mood: 'warning' },
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

function normalizeUser(rawUser) {
  const merged = { ...defaultUser, ...rawUser };
  merged.activities = Array.isArray(rawUser?.activities) && rawUser.activities.length
    ? rawUser.activities.map((activity, index) => ({
      ...defaultUser.activities[index % defaultUser.activities.length],
      ...activity
    }))
    : defaultUser.activities.map((activity) => ({ ...activity }));
  merged.week = Array.isArray(rawUser?.week) && rawUser.week.length
    ? rawUser.week.map((day, index) => ({
      ...defaultUser.week[index % defaultUser.week.length],
      ...day
    }))
    : defaultUser.week.map((day) => ({ ...day }));
  merged.month = Array.isArray(rawUser?.month) && rawUser.month.length
    ? [...rawUser.month]
    : [...defaultUser.month];

  return merged;
}

function loadUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return normalizeUser({});
    return normalizeUser(JSON.parse(stored));
  } catch {
    return normalizeUser({});
  }
}

let user = loadUser();

function saveUser() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

window.user = user;
window.saveUser = saveUser;
