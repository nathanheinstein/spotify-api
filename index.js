import fetch from "node-fetch";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) throw new Error("Failed to refresh access token");

  const data = await response.json();
  return data.access_token;
}

async function fetchSpotifyData(url, token) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error(`Spotify API error: ${response.statusText}`);

  return response.json();
}

export async function handler(event) {
  try {
    const path = event.rawPath;
    const token = await getAccessToken();

    let responseData;
    if (path === "/spotify/currently-playing") {
      responseData = await fetchSpotifyData("https://api.spotify.com/v1/me/player/currently-playing", token);
    } else if (path === "/spotify/recently-liked") {
      const data = await fetchSpotifyData("https://api.spotify.com/v1/me/tracks?limit=5", token);
      responseData = data.items;
    } else {
      return { statusCode: 404, body: JSON.stringify({ error: "Not Found" }) };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET",
      },
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
