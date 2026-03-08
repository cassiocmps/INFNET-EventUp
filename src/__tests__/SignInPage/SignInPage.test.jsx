import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authService } from "../../services/authService";
import { renderSignIn } from "./signInPage.helper";

jest.mock("../../services/authService");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUser = {
  id: "u1",
  name: "Alice",
  email: "alice@test.com",
  role: "organizer",
  favorites: [],
  registrations: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  authService.signIn.mockResolvedValue({ user: mockUser });
});

describe("SignInPage – rendering", () => {
  test("renders email and password fields", () => {
    renderSignIn();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("submit button is disabled when form is empty", () => {
    renderSignIn();
    expect(screen.getByRole("button", { name: /enter/i })).toBeDisabled();
  });

  test("renders the sign-up navigation button", () => {
    renderSignIn();
    expect(
      screen.getByRole("button", { name: /new here/i }),
    ).toBeInTheDocument();
  });
});

describe("SignInPage – form interaction", () => {
  test("enables submit button when email and password are filled", async () => {
    const user = userEvent.setup();
    renderSignIn();

    await user.type(screen.getByLabelText("Email"), "alice@test.com");
    await user.type(screen.getByLabelText("Password"), "secret123");

    expect(screen.getByRole("button", { name: /enter/i })).toBeEnabled();
  });

  test("disables submit button again after clearing email", async () => {
    const user = userEvent.setup();
    renderSignIn();

    await user.type(screen.getByLabelText("Email"), "alice@test.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.clear(screen.getByLabelText("Email"));

    expect(screen.getByRole("button", { name: /enter/i })).toBeDisabled();
  });
});

describe("SignInPage – successful sign-in", () => {
  test("calls authService.signIn with entered credentials", async () => {
    const user = userEvent.setup();
    renderSignIn();

    await user.type(screen.getByLabelText("Email"), "alice@test.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /enter/i }));

    await waitFor(() => {
      expect(authService.signIn).toHaveBeenCalledWith(
        "alice@test.com",
        "secret123",
      );
    });
  });

  test("navigates to dashboard after successful sign-in", async () => {
    const user = userEvent.setup();
    renderSignIn();

    await user.type(screen.getByLabelText("Email"), "alice@test.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /enter/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});

describe("SignInPage – failed sign-in", () => {
  test("shows error toast when credentials are invalid", async () => {
    authService.signIn.mockRejectedValue(
      new Error("Invalid email or password."),
    );
    const user = userEvent.setup();
    renderSignIn();

    await user.type(screen.getByLabelText("Email"), "wrong@test.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /enter/i }));

    expect(
      await screen.findByText("Invalid email or password."),
    ).toBeInTheDocument();
  });

  test("shows generic error toast when service throws without a message", async () => {
    authService.signIn.mockRejectedValue(new Error());
    const user = userEvent.setup();
    renderSignIn();

    await user.type(screen.getByLabelText("Email"), "alice@test.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: /enter/i }));

    expect(
      await screen.findByText("An error occurred. Please try again."),
    ).toBeInTheDocument();
  });
});

describe("SignInPage – navigation", () => {
  test("navigates to sign-up when sign-up button is clicked", async () => {
    const user = userEvent.setup();
    renderSignIn();

    await user.click(screen.getByRole("button", { name: /new here/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });
});

describe("SignInPage – location state", () => {
  test("shows success toast when arriving with a successMessage in state", async () => {
    renderSignIn({
      locationState: { successMessage: "Profile created successfully!" },
    });

    expect(
      await screen.findByText("Profile created successfully!"),
    ).toBeInTheDocument();
  });
});
