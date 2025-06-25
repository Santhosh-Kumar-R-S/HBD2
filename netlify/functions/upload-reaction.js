import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Configure multer for memory storage (Netlify functions)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
})

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // For demo purposes, we'll simulate file upload
    // In production, you'd integrate with cloud storage like AWS S3
    
    const videoId = uuidv4()
    const timestamp = new Date().toISOString()
    
    // Store metadata (in production, use a database)
    const metadata = {
      id: videoId,
      filename: `${videoId}.webm`,
      uploadDate: timestamp,
      size: event.body ? Buffer.from(event.body, 'base64').length : 0
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Video uploaded successfully',
        id: videoId
      })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Upload failed' })
    }
  }
}