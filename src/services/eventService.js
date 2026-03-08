import { userStore } from "./userStore";
import { notificationService } from "./notificationService";

let eventsStore = null;
let categoriesStore = null;
const SIMULATED_LATENCY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getEvents() {
  await sleep(SIMULATED_LATENCY_MS);

  if (eventsStore !== null) {
    return eventsStore.filter((event) => event.status !== "cancelled");
  }

  try {
    const response = await fetch("/api/events.json");
    const data = await response.json();
    eventsStore = data.events || [];
    return eventsStore.filter((event) => event.status !== "cancelled");
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

async function createEvent({
  title,
  description,
  category,
  date,
  time,
  location,
  capacity,
  price,
  organizerId,
  organizerName,
}) {
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
      date,
      time,
      location,
      capacity,
      price: price ?? 0,
      organizerId: organizerId || "current-user",
      organizerName: organizerName || "",
      enrolled: 0,
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

async function getEventById(id) {
  const events = await getEvents();
  return events.find((event) => event.id === id) || null;
}

async function getEventsByOrganizer(organizerId) {
  const events = await getEvents();
  return events.filter((event) => event.organizerId === organizerId);
}

async function updateEvent({
  id,
  title,
  description,
  category,
  date,
  time,
  location,
  capacity,
  price,
}) {
  await sleep(SIMULATED_LATENCY_MS);

  const events = await getEvents();
  const oldEvent = events.find((e) => e.id === id);

  eventsStore = events.map((event) =>
    event.id === id
      ? {
          ...event,
          title: title.trim(),
          description: description.trim(),
          category,
          date,
          time,
          location,
          capacity,
          price: price ?? event.price ?? 0,
        }
      : event,
  );

  if (oldEvent) {
    const changedFields = [];
    if (oldEvent.date !== date) changedFields.push("date");
    if (oldEvent.time !== time) changedFields.push("time");
    if (oldEvent.location !== location) changedFields.push("location");

    if (changedFields.length > 0) {
      await notificationService.notifyRegisteredParticipants(
        id,
        title.trim(),
        "update",
        `The event "${title.trim()}" was updated. See new details.`,
      );
    }
  }

  return { success: true };
}

async function cancelEvent(eventId) {
  await sleep(SIMULATED_LATENCY_MS);

  const events = await getEvents();
  const event = events.find((e) => e.id === eventId);

  eventsStore = events.map((e) =>
    e.id === eventId ? { ...e, status: "cancelled" } : e,
  );

  if (event) {
    await notificationService.notifyRegisteredParticipants(
      eventId,
      event.title,
      "cancellation",
      `The event "${event.title}" has been cancelled.`,
    );
  }

  return { success: true };
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
  getEventById,
  getEventsByOrganizer,
  updateEvent,
  cancelEvent,
  toggleFavoriteForUser,
  registerForEventForUser,
  unregisterFromEventForUser,
};
