import apiClient from "./apiClient";

export async function register({ email, password, username }) {
  const response = await apiClient.post("/api/auth", {
    email,
    password,
    username,
  });

  return response.data;
}

export async function login({ email, username, password }) {
  const response = await apiClient.post("/api/auth/login", {
    email,
    username,
    password,
  });

  return response.data;
}

export async function logout() {
  const response = await apiClient.post("/api/auth/logout");
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get("/api/auth/me");
  return response.data;
}

export async function refreshToken() {
  const response = await apiClient.post("/api/auth/refresh");
  return response.data;
}
