import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Helper to find existing video file
function getAvailableVideo(preferredName) {
  const preferredPath = path.join(__dirname, preferredName);
  if (fs.existsSync(preferredPath)) {
    return preferredPath;
  }
  const altName = preferredName === 'site.mp4' ? 'site mobile.mp4' : 'site.mp4';
  const altPath = path.join(__dirname, altName);
  if (fs.existsSync(altPath)) {
    return altPath;
  }
  return null;
}

// Dedicated handler for desktop video
app.get('/site.mp4', (req, res) => {
  const videoPath = getAvailableVideo('site.mp4');
  if (videoPath) {
    return res.sendFile(videoPath);
  }
  res.status(404).send('Video not found');
});

// Dedicated handler for mobile video (encoded or decoded URI)
app.get(['/site%20mobile.mp4', '/site mobile.mp4'], (req, res) => {
  const videoPath = getAvailableVideo('site mobile.mp4');
  if (videoPath) {
    return res.sendFile(videoPath);
  }
  res.status(404).send('Video not found');
});

// Serve static assets from project directory
app.use(express.static(__dirname));

// Never send index.html for missing media files
app.get(/\.(mp4|webm|ogg|mp3|wav|png|jpg|jpeg|gif|svg|ico)$/, (req, res) => {
  res.status(404).send('Media file not found');
});

// Fallback all routes to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
