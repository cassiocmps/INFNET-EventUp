import { userStore } from "./userStore";

let rolesStore = null;
const SIMULATED_LATENCY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hashPassword(password) {
  const content = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", content);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signIn(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  await sleep(SIMULATED_LATENCY_MS);

  try {
    const users = await userStore.getUsers();
    const passwordHash = await hashPassword(password);

    const user = users.find(
      (u) =>
        u.email === email.trim().toLowerCase() &&
        u.passwordHash === passwordHash,
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    return { success: true, user };
  } catch (error) {
    throw error;
  }
}

async function signUp(profile) {
  if (!profile.name || !profile.email || !profile.password || !profile.role) {
    throw new Error("All fields are required");
  }

  await sleep(SIMULATED_LATENCY_MS);

  try {
    const signupResponse = await fetch("/api/signup.json");
    const signupData = await signupResponse.json();

    if (!signupData.accepted) {
      throw new Error("Sign up not accepted by server");
    }

    const passwordHash = await hashPassword(profile.password);

    const newUser = {
      name: profile.name.trim(),
      email: profile.email.trim().toLowerCase(),
      role: profile.role,
      passwordHash,
      favorites: [],
      registrations: [],
    };

    const users = await userStore.getUsers();
    userStore.persistUsers([...users, newUser]);

    return { success: true, user: newUser };
  } catch (error) {
    throw error;
  }
}

async function getRoles() {
  await sleep(SIMULATED_LATENCY_MS);

  if (rolesStore !== null) {
    return rolesStore;
  }

  try {
    const response = await fetch("/api/roles.json");
    const data = await response.json();
    rolesStore = data.roles || [];
    return rolesStore;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw new Error("Failed to fetch roles");
  }
}

export const authService = {
  signIn,
  signUp,
  getRoles,
};
