import apiClient from "./apiClient";

export async function suggestSong(mood) {
  const response = await apiClient.post("/api/suggest-song", { mood });
  return response.data;
}
