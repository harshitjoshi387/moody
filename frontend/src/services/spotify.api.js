import axios from 'axios';

// Get Spotify songs by mood (if you have a dedicated endpoint)
export const getSpotifySongs = async (mood) => {
  const res = await axios.post('/api/spotify-songs', { mood });
  return res.data;
};
