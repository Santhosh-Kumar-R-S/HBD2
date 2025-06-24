import React from 'react'
import VideoPlayer from './components/VideoPlayer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="birthday-card p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-birthday-pink to-birthday-dark-pink mb-4 animate-pulse-slow">
            🎉 Happy Birthday! 🎉
          </h1>
          <p className="text-birthday-pink text-lg md:text-xl font-medium animate-float">
            Your best friend has a special surprise for you!
          </p>
        </div>
        
        <VideoPlayer />
        
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm md:text-base">
            Made with ❤️ just for you
          </p>
        </div>
      </div>
    </div>
  )
}

export default App