import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { eventService } from "../../services/eventService";
import {
  mockCategories,
  mockOrganizer,
  renderPage,
} from "./createEventPage.helper";

jest.mock("../../services/eventService");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  eventService.getCategories.mockResolvedValue(mockCategories);
  eventService.getEventById.mockResolvedValue(null);
  eventService.createEvent.mockResolvedValue({ id: "new-event" });
  eventService.updateEvent.mockResolvedValue({});
});

describe("CreateEventPage – create mode", () => {
  test("renders the page title", async () => {
    renderPage();
    expect(await screen.findByText("Create new event")).toBeInTheDocument();
  });

  test("renders all form fields", async () => {
    renderPage();
    await screen.findByText("Create new event");

    expect(screen.getByLabelText("Event title")).toBeInTheDocument();
    expect(screen.getByLabelText("Event description")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Capacity")).toBeInTheDocument();
    expect(screen.getByLabelText("Price ($)")).toBeInTheDocument();
  });

  test("submit button is disabled when form is empty", async () => {
    renderPage();
    await screen.findByText("Create new event");

    const submitBtn = screen.getByRole("button", { name: /create event/i });
    expect(submitBtn).toBeDisabled();
  });

  test("renders cancel button", async () => {
    renderPage();
    await screen.findByText("Create new event");

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });
});

describe("CreateEventPage – validation", () => {
  test("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Create new event");

    const titleInput = screen.getByLabelText("Event title");
    await user.type(titleInput, "ab");

    await user.type(
      screen.getByLabelText("Event description"),
      "A valid description here",
    );
    await user.selectOptions(screen.getByLabelText("Category"), "music");
    await user.type(screen.getByLabelText("Date"), "2026-12-01");
    await user.type(screen.getByLabelText("Time"), "10:00");
    await user.type(screen.getByLabelText("Location"), "Main Hall");
    await user.type(screen.getByLabelText("Capacity"), "50");

    const submitBtn = screen.getByRole("button", { name: /create event/i });
    await user.click(submitBtn);

    expect(
      await screen.findByText("Title must be at least 3 characters."),
    ).toBeInTheDocument();
  });

  test("shows required error for missing category", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Create new event");

    await user.type(screen.getByLabelText("Event title"), "Valid Title");
    await user.type(
      screen.getByLabelText("Event description"),
      "A valid description here",
    );
    await user.selectOptions(screen.getByLabelText("Category"), "music");
    await user.type(screen.getByLabelText("Date"), "2026-12-01");
    await user.type(screen.getByLabelText("Time"), "10:00");
    await user.type(screen.getByLabelText("Location"), "Main Hall");
    await user.type(screen.getByLabelText("Capacity"), "50");

    const { fireEvent } = require("@testing-library/react");
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "" },
    });
    // eslint-disable-next-line testing-library/no-node-access
    fireEvent.submit(document.querySelector("form"));

    expect(
      await screen.findByText("Category is required."),
    ).toBeInTheDocument();
  });
});

describe("CreateEventPage – submission", () => {
  test("calls createEvent and navigates to dashboard on success", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Create new event");

    await user.type(screen.getByLabelText("Event title"), "My Great Event");
    await user.type(
      screen.getByLabelText("Event description"),
      "A valid description here",
    );
    await user.selectOptions(screen.getByLabelText("Category"), "music");
    await user.type(screen.getByLabelText("Date"), "2026-12-01");
    await user.type(screen.getByLabelText("Time"), "10:00");
    await user.type(screen.getByLabelText("Location"), "Main Hall");
    await user.type(screen.getByLabelText("Capacity"), "100");
    const submitBtn = screen.getByRole("button", { name: /create event/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(eventService.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "My Great Event",
          description: "A valid description here",
          category: "music",
          location: "Main Hall",
          capacity: 100,
          price: 0,
          organizerId: "u1",
          organizerName: "Alice Organizer",
        }),
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/dashboard",
        expect.objectContaining({
          state: expect.objectContaining({
            successMessage: expect.any(String),
          }),
        }),
      );
    });
  });

  test("shows error toast when createEvent fails", async () => {
    eventService.createEvent.mockRejectedValue(new Error("Server error"));
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Create new event");

    await user.type(screen.getByLabelText("Event title"), "My Great Event");
    await user.type(
      screen.getByLabelText("Event description"),
      "A valid description here",
    );
    await user.selectOptions(screen.getByLabelText("Category"), "music");
    await user.type(screen.getByLabelText("Date"), "2026-12-01");
    await user.type(screen.getByLabelText("Time"), "10:00");
    await user.type(screen.getByLabelText("Location"), "Main Hall");
    await user.type(screen.getByLabelText("Capacity"), "100");

    const submitBtn = screen.getByRole("button", { name: /create event/i });
    await user.click(submitBtn);

    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});

describe("CreateEventPage – auth guard", () => {
  test("redirects to sign-in when there is no logged-in user", async () => {
    renderPage({ user: null, isOrganizer: false });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/",
        expect.objectContaining({
          state: expect.objectContaining({ errorMessage: expect.any(String) }),
        }),
      );
    });
  });

  test("redirects non-organizers to dashboard", async () => {
    renderPage({
      user: { ...mockOrganizer, role: "participant" },
      isOrganizer: false,
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/dashboard",
        expect.objectContaining({
          state: expect.objectContaining({ errorMessage: expect.any(String) }),
        }),
      );
    });
  });
});

describe("CreateEventPage – cancel", () => {
  test("navigates to dashboard when cancel is clicked", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("Create new event");

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

describe("CreateEventPage – edit mode", () => {
  const existingEvent = {
    id: "e1",
    title: "Existing Event",
    description: "Existing description",
    category: "tech",
    date: "2026-12-10",
    time: "14:00",
    location: "Tech Hub",
    capacity: 200,
    price: 10,
    organizerId: "u1",
    organizerName: "Alice Organizer",
  };

  test("renders Edit event title and loads event data", async () => {
    eventService.getEventById.mockResolvedValue(existingEvent);
    renderPage({
      path: "/edit-event/e1",
      routePattern: "/edit-event/:eventId",
    });

    expect(await screen.findByText("Edit event")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Existing description"),
      ).toBeInTheDocument();
    });
  });

  test("title and price inputs are disabled in edit mode", async () => {
    eventService.getEventById.mockResolvedValue(existingEvent);
    renderPage({
      path: "/edit-event/e1",
      routePattern: "/edit-event/:eventId",
    });

    await screen.findByText("Edit event");

    await waitFor(() => {
      expect(screen.getByLabelText("Event title")).toBeDisabled();
      expect(screen.getByLabelText("Price ($)")).toBeDisabled();
    });
  });

  test("calls updateEvent on submit and navigates to dashboard", async () => {
    eventService.getEventById.mockResolvedValue(existingEvent);
    const user = userEvent.setup();
    renderPage({
      path: "/edit-event/e1",
      routePattern: "/edit-event/:eventId",
    });

    await screen.findByText("Edit event");
    await waitFor(() =>
      expect(
        screen.getByDisplayValue("Existing description"),
      ).toBeInTheDocument(),
    );

    await user.clear(screen.getByLabelText("Location"));
    await user.type(screen.getByLabelText("Location"), "New Venue");

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(eventService.updateEvent).toHaveBeenCalledWith(
        expect.objectContaining({ id: "e1", location: "New Venue" }),
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/dashboard",
        expect.objectContaining({
          state: expect.objectContaining({
            successMessage: expect.any(String),
          }),
        }),
      );
    });
  });

  test("shows error toast when event is not found", async () => {
    eventService.getEventById.mockResolvedValue(null);
    renderPage({
      path: "/edit-event/unknown",
      routePattern: "/edit-event/:eventId",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/dashboard",
        expect.objectContaining({
          state: expect.objectContaining({ errorMessage: expect.any(String) }),
        }),
      );
    });
  });
});

describe("CreateEventPage – category loading error", () => {
  test("shows error toast when categories fail to load", async () => {
    eventService.getCategories.mockRejectedValue(new Error("Network error"));
    renderPage();

    expect(
      await screen.findByText("Failed to load categories. Please try again."),
    ).toBeInTheDocument();
  });
});
