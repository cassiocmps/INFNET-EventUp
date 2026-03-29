import type { Notification } from "types";

const NOTIFICATIONS_KEY = "notifications";

function getAll(): Notification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? (JSON.parse(stored) as Notification[]) : [];
  } catch {
    return [];
  }
}

function persist(notifications: Notification[]): void {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function getForUser(userId: string): Notification[] {
  return getAll()
    .filter((n) => n.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

function addMany(notifications: Notification[]): void {
  const all = getAll();
  persist([...all, ...notifications]);
}

function markReadForUser(userId: string): void {
  const all = getAll();
  const updated = all.map((n) =>
    n.userId === userId ? { ...n, isRead: true } : n,
  );
  persist(updated);
}

export const notificationStore = {
  getForUser,
  addMany,
  markReadForUser,
};
