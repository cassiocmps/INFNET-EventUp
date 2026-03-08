const USERS_STORAGE_KEY = "mockUsers";

let usersStore = null;

function persistUsers(users) {
  usersStore = users;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
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

async function updateUserProfile(updatedUser) {
  const users = await getUsers();
  const targetEmail = updatedUser.email?.trim().toLowerCase();
  const userIndex = users.findIndex(
    (user) => user.email?.trim().toLowerCase() === targetEmail,
  );

  if (userIndex >= 0) {
    const nextUsers = [...users];
    nextUsers[userIndex] = {
      ...nextUsers[userIndex],
      ...updatedUser,
    };
    persistUsers(nextUsers);
  } else {
    persistUsers([...users, updatedUser]);
  }

  return updatedUser;
}

export const userStore = {
  getUsers,
  persistUsers,
  updateUserProfile,
};
