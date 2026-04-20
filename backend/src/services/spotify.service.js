const axios = require('axios');

// Get Spotify access token (Client Credentials Flow)
async function getAccessToken(clientId, clientSecret) {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
  };

  const response = await axios.post(tokenUrl, params, { headers });
  return response.data.access_token;
}

// Search tracks by mood/genre
async function searchTracksByMood(mood, accessToken) {
  const url = `https://api.spotify.com/v1/search`;
  const params = {
    q: mood,
    type: 'track',
    limit: 10,
  };
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await axios.get(url, { params, headers });
  return response.data.tracks.items;
}

module.exports = {
  getAccessToken,
  searchTracksByMood,
};
