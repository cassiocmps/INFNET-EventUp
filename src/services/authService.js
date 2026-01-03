let usersStore = null;

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

  try {
    const response = await fetch("/api/users.json");
    const data = await response.json();
    usersStore = data.users || [];
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
    };

    const users = await getUsers();
    usersStore = [...users, newUser];

    return { success: true, user: newUser };
  } catch (error) {
    throw error;
  }
}

export const authService = {
  signIn,
  signUp,
};
