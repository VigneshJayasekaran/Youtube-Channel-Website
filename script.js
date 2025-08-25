const API_KEY = "AIzaSyBVS7La2SW9FILXt_CmUTowfDfIg9B881E";
const CHANNEL_ID = "UCdidnvDIruEg_-MRJ6TsLsw"; 
const MAX_RESULTS = 5;

async function loadVideos() {
  try {
    // Step 1: Get Uploads Playlist ID
    let channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    let channelData = await channelResponse.json();
    let uploadsPlaylist = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Step 2: Get Videos from Playlist
    let videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=${MAX_RESULTS}&key=${API_KEY}`
    );
    let videoData = await videoResponse.json();

    // Step 3: Collect video IDs for statistics
    let videoIds = videoData.items.map(item => item.snippet.resourceId.videoId).join(",");

    // Step 4: Get video statistics (likeCount, viewCount)
    let statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`
    );
    let statsData = await statsResponse.json();

    // Step 5: Render Videos
    const container = document.getElementById("video-container");
    container.innerHTML = "";

    videoData.items.forEach((item, index) => {
      let videoId = item.snippet.resourceId.videoId;
      let title = item.snippet.title;
      let thumbnail = item.snippet.thumbnails.medium.url;
      let published = new Date(item.snippet.publishedAt).toLocaleDateString();

      // Stats
      let stats = statsData.items[index].statistics;
      let likes = stats.likeCount || 0;
      let views = stats.viewCount || 0;

      container.innerHTML += `
        <div class="video-card" style="margin-bottom:20px;">
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
            <img src="${thumbnail}" alt="${title}"
            <p><strong>${title}</strong></p>
            <small>📅 ${published}</small><br>
              <div class="stats">
                    👍 ${likes} Likes <span class="views">👁️ ${views} Views</span>
             </div>
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

