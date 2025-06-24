# 🎉 Birthday Surprise Video Website

A special birthday surprise website that records reactions while your friend watches their birthday video! Features automatic reaction recording, video quality selection, mobile-responsive design, and admin panel to view all reactions.

## ✨ Features

- **Hidden Reaction Recording**: Secretly records front camera reactions while watching the video
- **Mobile-First Design**: Optimized for mobile viewing with beautiful black & pink theme
- **Video Quality Selection**: 360p, 480p, 720p, 1080p quality options
- **Background Upload**: Automatic upload with retry on connection loss
- **Admin Panel**: View, download, and manage all reaction videos
- **Responsive Design**: Works perfectly on all devices

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare Your Birthday Video

You need to create multiple quality versions of your birthday video:

**Option A: Use online video converter (Recommended)**
1. Upload your video to [CloudConvert](https://cloudconvert.com/mp4-converter) or similar
2. Convert to different qualities:
   - 360p: Width 640px, Height 360px
   - 480p: Width 854px, Height 480px  
   - 720p: Width 1280px, Height 720px
   - 1080p: Width 1920px, Height 1080px

**Option B: Use FFmpeg (If you have it installed)**
```bash
# 360p version
ffmpeg -i your-video.mp4 -vf scale=640:360 -b:v 500k birthday-video-360p.mp4

# 480p version  
ffmpeg -i your-video.mp4 -vf scale=854:480 -b:v 1000k birthday-video-480p.mp4

# 720p version
ffmpeg -i your-video.mp4 -vf scale=1280:720 -b:v 2500k birthday-video-720p.mp4

# 1080p version
ffmpeg -i your-video.mp4 -vf scale=1920:1080 -b:v 5000k birthday-video-1080p.mp4
```

### 3. Place Your Videos

Copy your video files to the videos directory:
```
server/uploads/videos/
├── birthday-video-360p.mp4
├── birthday-video-480p.mp4
├── birthday-video-720p.mp4
├── birthday-video-1080p.mp4
└── thumbnail.jpg (optional)
```

### 4. Start the Application

**Terminal 1 - Start Backend Server:**
```bash
npm run server
```

**Terminal 2 - Start Frontend (in a new window):**
```bash
npm run dev
```

The website will be available at: `http://localhost:5173`

## 📱 How to Use

### For Your Friend (Birthday Girl):
1. Open the website on mobile browser
2. Allow camera permissions when prompted
3. Watch the birthday video
4. Reactions are automatically recorded (hidden from view)
5. Video uploads automatically when finished

### For You (Admin):
1. Visit: `http://localhost:5173/admin`
2. View all recorded reactions
3. Download or delete reaction videos
4. Monitor upload status

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── VideoPlayer.tsx      # Main video player with controls
│   │   ├── CameraRecorder.tsx   # Hidden reaction recording
│   │   └── AdminPanel.tsx       # Admin interface
│   ├── services/
│   │   └── api.ts              # API service functions
│   └── App.tsx                 # Main application
├── server/
│   ├── index.js                # Backend server
│   └── uploads/
│       ├── videos/             # Place birthday videos here
│       └── reactions/          # Recorded reactions stored here
└── README.md                   # This file
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  'birthday-pink': '#FF69B4',        // Main pink
  'birthday-dark-pink': '#FF1493',   // Darker pink
  'birthday-black': '#0F0F0F',       // Main black
  'birthday-gray': '#1A1A1A',        // Gray accent
}
```

### Birthday Message
Edit the title in `src/App.tsx`:
```tsx
<h1 className="text-4xl md:text-6xl font-bold...">
  🎉 Happy Birthday Sarah! 🎉  {/* Change name here */}
</h1>
```

## 🔧 Technical Features

### Camera Recording
- Automatically starts when video plays
- Records at 640x480 resolution with audio
- Uses WebM format for efficient compression
- Stops when video ends or browser is closed

### Upload System
- Background upload prevents interrupting user experience
- Retry mechanism for failed uploads
- Stores failed uploads in localStorage
- Automatic retry when connection is restored

### Video Quality
- Single video file serves multiple qualities
- Quality switching preserves playback position
- Default starts at 360p for faster loading
- Smooth transitions between qualities

### Mobile Optimization
- Touch-friendly controls
- Responsive video player
- Optimized for portrait orientation
- Smooth performance on older devices

## 🐛 Troubleshooting

### Camera Permission Issues
- Ensure HTTPS in production (required for camera access)
- Check browser permissions in settings
- Try different browsers if permission denied

### Video Not Loading
- Check video files are in `server/uploads/videos/`
- Ensure video files are named correctly
- Verify video format is MP4

### Upload Failures
- Check server is running on port 3001
- Verify network connection
- Failed uploads will retry automatically

### Mobile Issues
- Use Chrome or Safari on mobile
- Ensure sufficient device storage
- Close other apps to free memory

## 🚀 Deployment Options

### Local Network Sharing
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Share: `http://YOUR-IP:5173`
3. Ensure both devices on same WiFi

### Cloud Deployment
For production deployment, you'll need:
- HTTPS certificate (required for camera access)
- Node.js hosting (Heroku, DigitalOcean, etc.)
- Static file hosting for frontend

## 📊 Admin Panel Features

- **View All Reactions**: Grid layout of all recorded videos
- **Download Videos**: Direct download to your device  
- **Delete Management**: Remove unwanted recordings
- **Upload Monitoring**: See file sizes and upload dates
- **Responsive Interface**: Works on desktop and mobile

## 🔒 Privacy & Security

- Recordings only start when video plays
- No preview shown to maintain surprise
- Files stored locally on your server
- Admin access required to view reactions
- Automatic cleanup options available

## 💡 Tips for Best Results

1. **Test First**: Try the website yourself before sharing
2. **Good Lighting**: Ensure your friend has good lighting for clear reactions
3. **Stable Internet**: Better connection = better video quality
4. **Mobile Friendly**: Encourage landscape mode for better video
5. **Storage Space**: Ensure device has sufficient storage

## 🎯 Success Checklist

- [ ] Videos placed in correct directory
- [ ] Server running on port 3001
- [ ] Frontend accessible at localhost:5173
- [ ] Camera permissions working
- [ ] Test recording and upload
- [ ] Admin panel accessible
- [ ] Mobile responsiveness verified

---

**Made with ❤️ for an amazing birthday surprise!**

*Need help? Check the troubleshooting section or feel free to ask questions.*