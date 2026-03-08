const NOTIFICATIONS_KEY = "notifications";

function getAll() {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function persist(notifications) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function getForUser(userId) {
  return getAll()
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addMany(notifications) {
  const all = getAll();
  persist([...all, ...notifications]);
}

function markReadForUser(userId) {
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
