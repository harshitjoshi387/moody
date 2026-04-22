import axios from 'axios';

// Suggest song from backend (local DB or Spotify)
export const suggestSong = async (mood) => {
  const res = await axios.post('/api/suggest-song', { mood });
  return res.data;
};
