# 🚀 Deployment Guide

## Step 1: Push to GitHub

1. **Create a new repository on GitHub**
2. **In your terminal, run these commands:**

```bash
git init
git add .
git commit -m "Initial commit - Birthday surprise website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Deploy on Netlify

### Option A: Deploy via GitHub (Recommended)

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/login with your GitHub account**
3. **Click "New site from Git"**
4. **Choose GitHub and select your repository**
5. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`

### Option B: Manual Deploy

1. **Build your project locally:**
```bash
npm run build
```

2. **Drag and drop the `dist` folder to Netlify**

## Step 3: Configure Your Videos

Since this is a serverless deployment, you'll need to host your birthday videos externally:

### Option 1: Use Cloud Storage (Recommended)
- Upload videos to AWS S3, Google Cloud Storage, or Cloudinary
- Update video URLs in `src/components/VideoPlayer.tsx`

### Option 2: Include in Repository (Small files only)
- Add videos to `public/videos/` folder
- Update paths in `VideoPlayer.tsx` to `/videos/filename.mp4`

## Step 4: Update Video URLs

Edit `src/components/VideoPlayer.tsx`:

```typescript
const videoQualities = {
  '360p': 'https://your-cloud-storage.com/birthday-video-360p.mp4',
  '480p': 'https://your-cloud-storage.com/birthday-video-480p.mp4',
  '720p': 'https://your-cloud-storage.com/birthday-video-720p.mp4',
  '1080p': 'https://your-cloud-storage.com/birthday-video-1080p.mp4'
}
```

## Step 5: Access Your Deployed Site

- **Main site:** `https://your-site-name.netlify.app`
- **Admin panel:** `https://your-site-name.netlify.app/admin`

## Important Notes

### File Storage Limitations
- Netlify functions are stateless - uploaded files don't persist
- For production use, integrate with cloud storage:
  - AWS S3 + CloudFront
  - Cloudinary
  - Google Cloud Storage

### Environment Variables
If you add cloud storage, set these in Netlify:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`
- etc.

## Production Recommendations

For a fully functional production version:

1. **Set up cloud storage** for persistent file handling
2. **Add a database** (like Supabase) for metadata
3. **Implement proper authentication** for admin panel
4. **Add error monitoring** (like Sentry)
5. **Set up analytics** to track usage

## Troubleshooting

- **Videos not loading:** Check video URLs and CORS settings
- **Upload failures:** Implement cloud storage integration
- **Function timeouts:** Optimize video processing
- **Build errors:** Check Node.js version compatibility

Your birthday surprise website is now ready for deployment! 🎉