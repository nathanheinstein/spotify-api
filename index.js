const clientId = SPOTIFY_CLIENT_ID;
const clientSecret = SPOTIFY_CLIENT_SECRET;
const refreshToken = SPOTIFY_REFRESH_TOKEN;


function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*'); 
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Allow-Credentials', 'true'); 
  
  return response;
}

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchSpotifyData(url, token) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  return response.json();
}

async function handleOptionsRequest() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',  // or specify your domain
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400', // Cache for 24 hours
    }
  });
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle the OPTIONS preflight request
  if (request.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  try {
    const token = await getAccessToken();

    let response;
    if (path === '/spotify/currently-playing') {
      const data = await fetchSpotifyData('https://api.spotify.com/v1/me/player/currently-playing', token);
      response = new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
    } else if (path === '/spotify/recently-liked') {
      const data = await fetchSpotifyData('https://api.spotify.com/v1/me/tracks?limit=5', token);
      response = new Response(JSON.stringify(data.items), { headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response('Not Found', { status: 404 });
    }

   
    return addCorsHeaders(response);
  } catch (error) {
    const errorResponse = new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });

  
    return addCorsHeaders(errorResponse);
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});