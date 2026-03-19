import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export function getNotificationPreview(user) {
  const tone = user?.notificationSettings?.tone || 'Coach';
  const name = user?.name || 'Champion';
  const habit = user?.habit || 'your focus habit';

  if (tone === 'Calm') {
    return {
      title: `${name}, your rhythm is waiting!`,
      body: `A gentle check-in with ${habit} can brighten the whole day!`
    };
  }

  if (tone === 'Push') {
    return {
      title: `${name}, let’s chase that green day!`,
      body: `${habit} is the one! Land one clean rep and the board starts glowing!`
    };
  }

  return {
    title: `${name}, ready for another rep?!`,
    body: `Your focus is ${habit}! One strong check-in can light the whole board up!`
  };
}

function parseReminderTime(reminderTime = '7:30 PM') {
  const [timePart = '7:30', meridiemRaw = 'PM'] = reminderTime.trim().split(' ');
  const [hourString = '7', minuteString = '30'] = timePart.split(':');
  const meridiem = meridiemRaw.toUpperCase();
  let hour = Number(hourString);
  const minute = Number(minuteString);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return { hour: 19, minute: 30 };
  }

  if (meridiem === 'PM' && hour < 12) {
    hour += 12;
  }
  if (meridiem === 'AM' && hour === 12) {
    hour = 0;
  }

  return { hour, minute };
}

async function ensurePermissions() {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted || existing.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('daily-coach', {
    name: 'Daily Coach',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 180, 120, 180],
    lightColor: '#6FD9FF'
  });
}

export async function clearNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function syncNotificationsForUser(user) {
  await clearNotifications();

  if (!user?.notificationSettings?.enabled || !user?.name || !user?.habit) {
    return;
  }

  const hasPermission = await ensurePermissions();
  if (!hasPermission) {
    return;
  }

  await ensureAndroidChannel();

  const { hour, minute } = parseReminderTime(user.notificationSettings.reminderTime);
  const message = getNotificationPreview(user);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: message.title,
      body: message.body,
      sound: false
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      ...(Platform.OS === 'android' ? { channelId: 'daily-coach' } : {})
    }
  });
}
