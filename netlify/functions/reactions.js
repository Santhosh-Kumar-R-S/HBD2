export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    if (event.httpMethod === 'GET') {
      // Return mock data for demo
      // In production, fetch from your database
      const mockReactions = [
        {
          id: 'demo-1',
          filename: 'demo-reaction-1.webm',
          uploadDate: new Date().toISOString(),
          size: 1024 * 1024 * 5 // 5MB
        }
      ]

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockReactions)
      }
    }

    if (event.httpMethod === 'DELETE') {
      const pathParts = event.path.split('/')
      const videoId = pathParts[pathParts.length - 1]
      
      // In production, delete from your storage and database
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Video deleted successfully' })
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}