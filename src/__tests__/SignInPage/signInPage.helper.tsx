import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { AuthContextValue, User } from "../../types";
import { AuthContext } from "../../contexts/AuthContext";
import SignInPage from "../../pages/SignIn";

export const mockUser: User = {
  id: "u1",
  name: "Alice",
  email: "alice@test.com",
  role: "organizer",
  passwordHash: "",
  favorites: [],
  registrations: [],
};

export function renderSignIn({
  locationState = null,
}: {
  locationState?: Record<string, string> | null;
} = {}) {
  const initialPath = locationState
    ? { pathname: "/", state: locationState }
    : "/";

  const authValue = {
    currentUser: null,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  } as unknown as AuthContextValue;

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<SignInPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}
