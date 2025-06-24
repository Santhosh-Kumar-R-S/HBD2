import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react'
import CameraRecorder from './CameraRecorder'

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [currentQuality, setCurrentQuality] = useState('360p')
  const [isRecording, setIsRecording] = useState(false)

  // Video qualities mapping
  const videoQualities = {
    '360p': '/api/video/birthday-video-360p.mp4',
    '480p': '/api/video/birthday-video-480p.mp4',
    '720p': '/api/video/birthday-video-720p.mp4',
    '1080p': '/api/video/birthday-video-1080p.mp4'
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', handleVideoEnd)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [])

  const handleVideoEnd = () => {
    setIsPlaying(false)
    setIsRecording(false)
  }

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      video.play()
      setIsPlaying(true)
      if (!isRecording) {
        setIsRecording(true)
      }
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const changeQuality = (quality: string) => {
    const video = videoRef.current
    if (!video) return

    const currentTime = video.currentTime
    const wasPlaying = !video.paused

    video.src = videoQualities[quality as keyof typeof videoQualities]
    video.load()

    video.addEventListener('loadeddata', () => {
      video.currentTime = currentTime
      if (wasPlaying) {
        video.play()
      }
    }, { once: true })

    setCurrentQuality(quality)
    setShowQualityMenu(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative">
      <CameraRecorder isRecording={isRecording} onRecordingChange={setIsRecording} />
      
      <div className="video-container">
        <video
          ref={videoRef}
          className="w-full h-auto"
          src={videoQualities[currentQuality as keyof typeof videoQualities]}
          poster="/api/video/thumbnail.jpg"
        >
          Your browser does not support the video tag.
        </video>

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-birthday-pink rounded-full transition-all duration-150"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-birthday-pink transition-colors duration-200 p-2"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-birthday-pink transition-colors duration-200"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/20 rounded-lg appearance-none slider"
                />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="text-white hover:text-birthday-pink transition-colors duration-200 p-2"
              >
                <Settings size={20} />
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-birthday-black/90 rounded-lg p-2 min-w-24">
                  <div className="text-white text-sm mb-2 font-medium">Quality</div>
                  <div className="space-y-1">
                    {Object.keys(videoQualities).map((quality) => (
                      <button
                        key={quality}
                        onClick={() => changeQuality(quality)}
                        className={`quality-button w-full text-left ${
                          currentQuality === quality ? 'active' : 'text-white'
                        }`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer