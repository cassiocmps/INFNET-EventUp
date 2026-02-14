let eventsStore = null;
let categoriesStore = null;

async function getEvents() {
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

export const eventService = {
  getEvents,
  getCategories,
  createEvent,
};
