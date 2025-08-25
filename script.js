// Replace with your channel ID and API Key
const API_KEY = "AIzaSyBVS7La2SW9FILXt_CmUTowfDfIg9B881E";
const CHANNEL_ID = "UCdidnvDIruEg_-MRJ6TsLsw"; // Replace with your channel ID
const MAX_RESULTS = 5;

async function loadVideos() {
  try {
    // Get Uploads Playlist ID
    let channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    let channelData = await channelResponse.json();
    let uploadsPlaylist = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Get Videos from Playlist
    let videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=${MAX_RESULTS}&key=${API_KEY}`
    );
    let videoData = await videoResponse.json();

    // Render Videos
    const container = document.getElementById("video-container");
    container.innerHTML = "";
    videoData.items.forEach(item => {
      let videoId = item.snippet.resourceId.videoId;
      let title = item.snippet.title;
      let thumbnail = item.snippet.thumbnails.medium.url;

      container.innerHTML += `
        <div class="video-card">
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
            <img src="${thumbnail}" alt="${title}">
            <p>${title}</p>
          </a>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading videos:", error);
  }
}

// Load on page start
window.onload = loadVideos;



