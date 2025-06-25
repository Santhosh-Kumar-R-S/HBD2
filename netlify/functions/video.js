import fs from 'fs'
import path from 'path'

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const pathParts = event.path.split('/')
    const filename = pathParts[pathParts.length - 1]
    
    // For demo purposes, return a placeholder response
    // In production, serve from cloud storage
    return {
      statusCode: 404,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Video not found',
        message: 'Please upload your birthday video files to cloud storage and update the video URLs'
      })
    }
  } catch (error) {
    console.error('Video serve error:', error)
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to serve video' })
    }
  }
}