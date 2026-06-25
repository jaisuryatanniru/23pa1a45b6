// src/utils/priorityNotifications.js
import { log } from './logger';

export const getTopPriorityNotifications = (notifications, n = 10) => {
  log('frontend', 'info', 'utils', 'Getting top ' + n + ' priority notifications');

  if (!notifications || notifications.length === 0) {
    log('frontend', 'warn', 'utils', 'No notifications found');
    return [];
  }

  const weightMap = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
  };

  const now = new Date();

  const scored = notifications.map(function(notif) {
    const weight = weightMap[notif.Type] || 0;

    const timestamp = new Date(notif.Timestamp);
    const hoursAgo = (now - timestamp) / (1000 * 60 * 60);

    const recency = Math.max(0, 24 - hoursAgo) / 24;

    return {
      ...notif,
      priority: weight + recency
    };
  });

  scored.sort(function(a, b) {
    return b.priority - a.priority;
  });

  const top = scored.slice(0, n);

  log('frontend', 'info', 'utils', 'Returning ' + top.length + ' priority notifications');
  return top;
};