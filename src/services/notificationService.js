import { notificationStore } from "./notificationStore";
import { userStore } from "./userStore";

async function notifyRegisteredParticipants(
  eventId,
  eventTitle,
  type,
  message,
) {
  const users = await userStore.getUsers();
  const registered = users.filter(
    (u) =>
      u.role === "participant" &&
      Array.isArray(u.registrations) &&
      u.registrations.includes(eventId),
  );

  if (registered.length === 0) return;

  const now = new Date().toISOString();
  const notifications = registered.map((u) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId: u.id,
    eventId,
    eventTitle,
    type,
    message,
    isRead: false,
    createdAt: now,
  }));

  notificationStore.addMany(notifications);
}

function getNotificationsForUser(userId) {
  return notificationStore.getForUser(userId);
}

function markReadForUser(userId) {
  notificationStore.markReadForUser(userId);
}

export const notificationService = {
  notifyRegisteredParticipants,
  getNotificationsForUser,
  markReadForUser,
};
