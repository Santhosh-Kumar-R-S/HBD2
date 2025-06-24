const API_BASE = '/api'

export const uploadReactionVideo = async (videoBlob: Blob): Promise<void> => {
  const formData = new FormData()
  const filename = `reaction-${Date.now()}.webm`
  formData.append('video', videoBlob, filename)
  formData.append('timestamp', new Date().toISOString())

  const response = await fetch(`${API_BASE}/upload-reaction`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }
}

export const getReactionVideos = async () => {
  const response = await fetch(`${API_BASE}/reactions`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch videos: ${response.statusText}`)
  }
  
  return response.json()
}

export const deleteReactionVideo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/reactions/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.statusText}`)
  }
}