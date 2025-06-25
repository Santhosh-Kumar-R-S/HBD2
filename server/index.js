import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// For Vercel deployment, use /tmp directory for uploads
const isVercel = process.env.VERCEL === '1'
const uploadsDir = isVercel ? '/tmp/uploads' : path.join(__dirname, 'uploads')
const reactionsDir = path.join(uploadsDir, 'reactions')
const videosDir = path.join(uploadsDir, 'videos')

// Create necessary directories
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(reactionsDir)) fs.mkdirSync(reactionsDir, { recursive: true })
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true })

// Multer configuration for reaction videos
const reactionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, reactionsDir)
  },
  filename: (req, file, cb) => {
    const id = uuidv4()
    const filename = `${id}.webm`
    cb(null, filename)
  }
})

const uploadReaction = multer({ 
  storage: reactionStorage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
})

// Store video metadata - use environment variable for Vercel
const videoMetadata = isVercel ? '/tmp/video-metadata.json' : path.join(__dirname, 'video-metadata.json')

const getVideoMetadata = () => {
  try {
    if (fs.existsSync(videoMetadata)) {
      return JSON.parse(fs.readFileSync(videoMetadata, 'utf8'))
    }
  } catch (error) {
    console.error('Error reading metadata:', error)
  }
  return []
}

const saveVideoMetadata = (data) => {
  try {
    fs.writeFileSync(videoMetadata, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving metadata:', error)
  }
}

// Routes

// Upload reaction video
app.post('/api/upload-reaction', uploadReaction.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' })
    }

    const metadata = getVideoMetadata()
    const videoData = {
      id: path.parse(req.file.filename).name,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadDate: req.body.timestamp || new Date().toISOString(),
      path: req.file.path
    }

    metadata.push(videoData)
    saveVideoMetadata(metadata)

    res.json({ 
      message: 'Video uploaded successfully',
      id: videoData.id
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// Get all reaction videos
app.get('/api/reactions', (req, res) => {
  try {
    const metadata = getVideoMetadata()
    res.json(metadata)
  } catch (error) {
    console.error('Error fetching reactions:', error)
    res.status(500).json({ error: 'Failed to fetch reactions' })
  }
})

// Serve reaction video files
app.get('/api/reactions/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(reactionsDir, filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Video not found' })
    }

    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      const file = fs.createReadStream(filePath, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/webm',
      }
      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/webm',
      }
      res.writeHead(200, head)
      fs.createReadStream(filePath).pipe(res)
    }
  } catch (error) {
    console.error('Error serving video:', error)
    res.status(500).json({ error: 'Failed to serve video' })
  }
})

// Delete reaction video
app.delete('/api/reactions/:id', (req, res) => {
  try {
    const id = req.params.id
    const metadata = getVideoMetadata()
    const videoIndex = metadata.findIndex(video => video.id === id)
    
    if (videoIndex === -1) {
      return res.status(404).json({ error: 'Video not found' })
    }

    const video = metadata[videoIndex]
    const filePath = path.join(reactionsDir, video.filename)
    
    // Delete file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
    
    // Remove from metadata
    metadata.splice(videoIndex, 1)
    saveVideoMetadata(metadata)
    
    res.json({ message: 'Video deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Failed to delete video' })
  }
})

// Serve birthday video files
app.get('/api/video/:filename', (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(videosDir, filename)
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      error: 'Video not found',
      message: 'Please upload your birthday video files to the videos directory'
    })
  }

  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(filePath, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(filePath).pipe(res)
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// For Vercel, export the app as a serverless function
if (isVercel) {
  export default app
} else {
  app.listen(PORT, () => {
    console.log(`🎉 Birthday Surprise Server running on port ${PORT}`)
    console.log(`📁 Upload directory: ${uploadsDir}`)
    console.log(`🎥 Videos directory: ${videosDir}`)
    console.log(`📹 Reactions directory: ${reactionsDir}`)
  })
}