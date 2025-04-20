const TWITCH_API_URL = 'https://api.twitch.tv/helix';
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

async function getTwitchAccessToken() {
  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_TWITCH_CLIENT_SECRET;
  
  const response = await fetch(`${TWITCH_AUTH_URL}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
    method: 'POST'
  });
  
  const data = await response.json();
  return data.access_token;
}

async function fetchWithAuth(endpoint, params = {}) {
  const token = await getTwitchAccessToken();
  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  
  const url = new URL(`${TWITCH_API_URL}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Client-Id': clientId
    }
  });
  
  return response.json();
}

export async function getChannelInfo(username) {
  const userData = await fetchWithAuth('/users', { login: username });
  if (!userData.data || userData.data.length === 0) {
    throw new Error('Channel not found');
  }
  
  const userId = userData.data[0].id;
  const channelData = await fetchWithAuth('/channels', { broadcaster_id: userId });
  
  return {
    userId,
    ...userData.data[0],
    ...channelData.data[0]
  };
}

export async function getFollowerCount(userId) {
  const response = await fetchWithAuth('/channels/followers', { broadcaster_id: userId });
  return response.total;
}

export async function getStreamInfo(userId) {
  const response = await fetchWithAuth('/streams', { user_id: userId });
  return response.data[0] || null;
}

export async function getVideos(userId, limit = 10) {
  const response = await fetchWithAuth('/videos', { user_id: userId, first: limit });
  return response.data;
}

export async function getClips(userId, limit = 20) {
  const response = await fetchWithAuth('/clips', { broadcaster_id: userId, first: limit });
  return response.data;
}
