import React, { useRef, useEffect, useState } from 'react'
import { uploadReactionVideo } from '../services/api'

interface CameraRecorderProps {
  isRecording: boolean
  onRecordingChange: (recording: boolean) => void
}

const CameraRecorder: React.FC<CameraRecorderProps> = ({ isRecording, onRecordingChange }) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [hasPermission, setHasPermission] = useState(false)

  // Request camera permission on component mount
  useEffect(() => {
    requestCameraAccess()
    
    // Handle page visibility changes and beforeunload
    const handleVisibilityChange = () => {
      if (document.hidden && isRecording) {
        stopRecording()
      }
    }

    const handleBeforeUnload = () => {
      if (isRecording) {
        stopRecording()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      cleanup()
    }
  }, [isRecording])

  // Handle recording state changes
  useEffect(() => {
    if (isRecording && hasPermission) {
      startRecording()
    } else if (!isRecording && mediaRecorderRef.current?.state === 'recording') {
      stopRecording()
    }
  }, [isRecording, hasPermission])

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: true
      })
      
      streamRef.current = stream
      setHasPermission(true)
    } catch (error) {
      console.error('Camera access denied:', error)
      setHasPermission(false)
    }
  }

  const startRecording = () => {
    if (!streamRef.current || !hasPermission) return

    try {
      chunksRef.current = []
      
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus'
      })

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        uploadRecording()
      }

      mediaRecorderRef.current.start(1000) // Collect data every second
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      onRecordingChange(false)
    }
  }

  const uploadRecording = async () => {
    if (chunksRef.current.length === 0) return

    try {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      await uploadReactionVideo(blob)
      chunksRef.current = []
    } catch (error) {
      console.error('Upload failed:', error)
      // Store failed upload for retry
      retryUploadLater(new Blob(chunksRef.current, { type: 'video/webm' }))
    }
  }

  const retryUploadLater = (blob: Blob) => {
    // Store in localStorage for retry when connection is restored
    const reader = new FileReader()
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      
      const failedUploads = JSON.parse(localStorage.getItem('failedUploads') || '[]')
      failedUploads.push({
        data: base64,
        timestamp: Date.now(),
        retryCount: 0
      })
      localStorage.setItem('failedUploads', JSON.stringify(failedUploads))
      
      // Set up retry mechanism
      setTimeout(retryFailedUploads, 30000) // Retry after 30 seconds
    }
    reader.readAsArrayBuffer(blob)
  }

  const retryFailedUploads = async () => {
    const failedUploads = JSON.parse(localStorage.getItem('failedUploads') || '[]')
    const successfulUploads: number[] = []

    for (let i = 0; i < failedUploads.length; i++) {
      const upload = failedUploads[i]
      
      if (upload.retryCount >= 5) continue // Max 5 retries

      try {
        const binaryString = atob(upload.data)
        const bytes = new Uint8Array(binaryString.length)
        for (let j = 0; j < binaryString.length; j++) {
          bytes[j] = binaryString.charCodeAt(j)
        }
        const blob = new Blob([bytes], { type: 'video/webm' })
        
        await uploadReactionVideo(blob)
        successfulUploads.push(i)
      } catch (error) {
        failedUploads[i].retryCount++
        console.error(`Retry ${upload.retryCount} failed:`, error)
      }
    }

    // Remove successful uploads
    const remainingUploads = failedUploads.filter((_, index) => !successfulUploads.includes(index))
    localStorage.setItem('failedUploads', JSON.stringify(remainingUploads))

    // Schedule next retry if there are remaining uploads
    if (remainingUploads.length > 0) {
      setTimeout(retryFailedUploads, 60000) // Retry after 1 minute
    }
  }

  const cleanup = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  // This component is intentionally invisible to maintain the surprise
  return null
}

export default CameraRecorder