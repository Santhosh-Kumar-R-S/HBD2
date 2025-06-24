import React, { useState, useEffect } from 'react'
import { Download, Eye, Trash2, Calendar, Clock, User } from 'lucide-react'
import { getReactionVideos, deleteReactionVideo } from '../services/api'

interface ReactionVideo {
  id: string
  filename: string
  uploadDate: string
  size: number
  duration?: number
}

const AdminPanel: React.FC = () => {
  const [videos, setVideos] = useState<ReactionVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const data = await getReactionVideos()
      setVideos(data)
    } catch (error) {
      console.error('Failed to load videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reaction video?')) return

    try {
      await deleteReactionVideo(id)
      setVideos(videos.filter(video => video.id !== id))
    } catch (error) {
      console.error('Failed to delete video:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading reaction videos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="birthday-card p-6 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-birthday-pink to-birthday-dark-pink mb-2">
            Birthday Reaction Videos
          </h1>
          <p className="text-white/80 text-lg">
            Admin Panel - View all recorded reactions
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="birthday-card p-8 text-center">
            <User size={64} className="text-birthday-pink/50 mx-auto mb-4" />
            <h2 className="text-xl text-white mb-2">No Reactions Yet</h2>
            <p className="text-white/60">
              Reaction videos will appear here once your friend watches the birthday video.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id} className="birthday-card p-6">
                <div className="aspect-video bg-birthday-gray rounded-lg mb-4 relative overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    poster="/api/placeholder-thumbnail.jpg"
                    onClick={() => setSelectedVideo(selectedVideo === video.id ? null : video.id)}
                  >
                    <source src={`/api/reactions/${video.filename}`} type="video/webm" />
                  </video>
                  
                  {selectedVideo !== video.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                      <Eye size={32} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-white/80 text-sm">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(video.uploadDate)}
                  </div>

                  <div className="flex items-center text-white/80 text-sm">
                    <Clock size={16} className="mr-2" />
                    Size: {formatFileSize(video.size)}
                  </div>

                  <div className="flex space-x-2">
                    <a
                      href={`/api/reactions/${video.filename}`}
                      download
                      className="flex-1 bg-birthday-pink hover:bg-birthday-dark-pink text-birthday-black px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </a>
                    
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="birthday-card p-6 mt-6">
          <h2 className="text-xl font-bold text-birthday-pink mb-4">Instructions</h2>
          <div className="text-white/80 space-y-2">
            <p>• Click on any video thumbnail to play/pause the reaction</p>
            <p>• Use the download button to save reaction videos to your device</p>
            <p>• Videos are automatically uploaded when your friend finishes watching or leaves the page</p>
            <p>• Failed uploads will retry automatically when connection is restored</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel