import { userStore } from "./userStore";

let eventsStore = null;
let categoriesStore = null;
const SIMULATED_LATENCY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getEvents() {
  await sleep(SIMULATED_LATENCY_MS);

  if (eventsStore !== null) {
    return eventsStore;
  }

  try {
    const response = await fetch("/api/events.json");
    const data = await response.json();
    eventsStore = data.events || [];
    return eventsStore;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
}

async function getCategories() {
  await sleep(SIMULATED_LATENCY_MS);

  if (categoriesStore !== null) {
    return categoriesStore;
  }

  try {
    const response = await fetch("/api/categories.json");
    const data = await response.json();
    categoriesStore = data.categories || [];
    return categoriesStore;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

async function createEvent({ title, description, category, organizerId }) {
  if (!title || !description || !category) {
    throw new Error("Title, description, and category are required");
  }

  try {
    const events = await getEvents();

    const newEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      organizerId: organizerId || "current-user",
      createdAt: new Date().toISOString(),
      status: "active",
    };

    eventsStore = [...events, newEvent];

    return { success: true, event: newEvent };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

async function toggleFavoriteForUser({ user, eventId }) {
  if (!user || !eventId) {
    throw new Error("User and eventId are required");
  }

  await sleep(SIMULATED_LATENCY_MS);

  const currentFavorites = user.favorites || [];
  const isFavorited = currentFavorites.includes(eventId);
  const updatedFavorites = isFavorited
    ? currentFavorites.filter((id) => id !== eventId)
    : [...currentFavorites, eventId];

  const updatedUser = {
    ...user,
    favorites: updatedFavorites,
  };

  return userStore.updateUserProfile(updatedUser);
}

async function registerForEventForUser({ user, eventId }) {
  if (!user || !eventId) {
    throw new Error("User and eventId are required");
  }

  await sleep(SIMULATED_LATENCY_MS);

  const currentRegistrations = user.registrations || [];
  if (currentRegistrations.includes(eventId)) {
    return user;
  }

  const updatedUser = {
    ...user,
    registrations: [...currentRegistrations, eventId],
  };

  return userStore.updateUserProfile(updatedUser);
}

async function unregisterFromEventForUser({ user, eventId }) {
  if (!user || !eventId) {
    throw new Error("User and eventId are required");
  }

  await sleep(SIMULATED_LATENCY_MS);

  const currentRegistrations = user.registrations || [];
  const updatedUser = {
    ...user,
    registrations: currentRegistrations.filter((id) => id !== eventId),
  };

  return userStore.updateUserProfile(updatedUser);
}

export const eventService = {
  getEvents,
  getCategories,
  createEvent,
  toggleFavoriteForUser,
  registerForEventForUser,
  unregisterFromEventForUser,
};
