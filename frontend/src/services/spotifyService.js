import apiClient from "./apiClient";

export async function getSpotifySongs(mood) {
  const response = await apiClient.post("/api/spotify-songs", { mood });
  return response.data;
}
