let usersStore = null;
let rolesStore = null;
const USERS_STORAGE_KEY = "mockUsers";
const SIMULATED_LATENCY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function persistUsers(users) {
  usersStore = users;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
  const content = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", content);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function getUsers() {
  if (usersStore !== null) {
    return usersStore;
  }

  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers) {
    try {
      usersStore = JSON.parse(storedUsers);
      return usersStore;
    } catch (error) {
      console.error("Error parsing stored users:", error);
      localStorage.removeItem(USERS_STORAGE_KEY);
    }
  }

  try {
    const response = await fetch("/api/users.json");
    const data = await response.json();
    usersStore = data.users || [];
    persistUsers(usersStore);
    return usersStore;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

async function signIn(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  await sleep(SIMULATED_LATENCY_MS);

  try {
    const users = await getUsers();
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

    const users = await getUsers();
    persistUsers([...users, newUser]);

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
