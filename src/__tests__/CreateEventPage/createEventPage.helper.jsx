import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import CreateEventPage from "../../pages/CreateEvent";

export const mockOrganizer = {
  id: "u1",
  name: "Alice Organizer",
  email: "alice@test.com",
  role: "organizer",
  favorites: [],
  registrations: [],
};

export const mockCategories = [
  { value: "music", label: "Music" },
  { value: "tech", label: "Technology" },
];

export function renderPage({
  user = mockOrganizer,
  isOrganizer = true,
  path = "/create-event",
  routePattern = "/create-event",
} = {}) {
  const authValue = {
    currentUser: user,
    isOrganizer,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={routePattern} element={<CreateEventPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}
