const USERS_KEY = "moody.dev.users";
const SESSION_KEY = "moody.dev.session";

const demoUsers = [
  {
    name: "user1",
    email: "test@test",
    password: "123456",
  },
];

export const DEV_LOGIN_HINT =
  "Demo login: test@test or user1 with password 123456";

function readUsers() {
  const storedUsers = window.localStorage.getItem(USERS_KEY);

  if (!storedUsers) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
    return demoUsers;
  }

  try {
    return JSON.parse(storedUsers);
  } catch {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
    return demoUsers;
  }
}

function saveUsers(users) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSessionUser(user) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSessionUser() {
  const storedSession = window.localStorage.getItem(SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    return null;
  }
}

export function clearSessionUser() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function loginWithDevCredentials(identifier, password) {
  if (!identifier.trim() || !password.trim()) {
    return {
      success: false,
      message: "Please enter username/email and password.",
    };
  }

  const users = readUsers();
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const matchedUser = users.find((user) => {
    return (
      user.email.toLowerCase() === normalizedIdentifier ||
      user.name.toLowerCase() === normalizedIdentifier
    );
  });

  if (!matchedUser || matchedUser.password !== password) {
    return {
      success: false,
      message: "Login failed. Try demo account or create a new account.",
    };
  }

  saveSessionUser({
    name: matchedUser.name,
    email: matchedUser.email,
  });

  return { success: true };
}

export function registerDevUser({ name, email, password }) {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return {
      success: false,
      message: "All fields are required.",
    };
  }

  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim().toLowerCase();
  const alreadyExists = users.some((user) => {
    return (
      user.email.toLowerCase() === normalizedEmail ||
      user.name.toLowerCase() === normalizedName
    );
  });

  if (alreadyExists) {
    return {
      success: false,
      message: "This email or username is already registered.",
    };
  }

  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    password: password.trim(),
  };

  const nextUsers = [...users, newUser];
  saveUsers(nextUsers);
  saveSessionUser({
    name: newUser.name,
    email: newUser.email,
  });

  return { success: true };
}
