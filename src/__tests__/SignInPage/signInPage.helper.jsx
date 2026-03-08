import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import SignInPage from "../../pages/SignIn";

export function renderSignIn({ locationState = null } = {}) {
  const initialPath = locationState
    ? { pathname: "/", state: locationState }
    : "/";

  const authValue = {
    currentUser: null,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  };

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
