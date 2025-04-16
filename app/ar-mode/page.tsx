"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Mic, Loader2, AlertTriangle, Volume2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
// Import the new service function
import { getGroqVisionAnalysis } from "@/lib/groq-service"
// We might need TTS later
// import { speakText } from '@/lib/tts-service'; // Assuming TTS logic is extracted

export default function ARModePage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [userQuery, setUserQuery] = useState("Describe what you see in detail.") // Default prompt

  // Function to setup camera
  const setupCamera = useCallback(async () => {
    setError(null)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Prefer back camera
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      if (err instanceof Error) {
         if (err.name === "NotAllowedError") {
          setError("Camera permission denied. Please enable camera access in your browser settings.")
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            setError("No suitable camera found. Please ensure a camera is connected and enabled.");
        } else {
           setError(`Error accessing camera: ${err.message}`)
        }
      } else {
         setError("An unknown error occurred while accessing the camera.")
      }
    }
  }, [])

  // Setup camera on mount
  useEffect(() => {
    // Only call setupCamera once on mount
    if (!stream) {
       setupCamera()
    }
    
    // Cleanup stream on unmount using the stream state variable
    return () => {
      // Access the current value of stream state inside the cleanup function
      setStream(currentStream => {
        if (currentStream) {
          console.log("Cleaning up camera stream...")
          currentStream.getTracks().forEach((track) => track.stop())
        }
        return null; // Ensure stream state is reset
      });
    }
  // Remove stream from dependencies, rely on mount/unmount behavior
  // setupCamera is stable due to useCallback([])
  }, [setupCamera])

  // Function to capture frame
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref not available")
      return null
    }
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext("2d")
    if (!context) {
        console.error("Could not get canvas context")
        return null
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    // Convert to base64 JPEG
    try {
      return canvas.toDataURL("image/jpeg", 0.9) // Adjust quality as needed
    } catch (e) {
      console.error("Error converting canvas to data URL:", e)
      setError("Failed to capture frame.")
      return null
    }
  }, [])

  // Function to handle analysis
  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true)
    setAiResponse(null)
    setError(null)
    const imageDataUrl = captureFrame()

    if (!imageDataUrl) {
      setIsAnalyzing(false)
      setError("Could not capture frame for analysis.")
      return
    }

    console.log("Frame captured, sending to analysis...")

    try {
      // Use the actual API call
      const response = await getGroqVisionAnalysis(imageDataUrl, userQuery)
      setAiResponse(response)
      // Optionally speak the response
      // speakText(response);

    } catch (err) {
      console.error("Error analyzing image:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis."
      setError(`Analysis failed: ${errorMessage}`)
    } finally {
      setIsAnalyzing(false)
    }
  }, [captureFrame, userQuery]) // Add userQuery dependency

  return (
    <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden">
      {/* Header */} 
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20 bg-gradient-to-b from-black/50 to-transparent">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-white bg-white/10 hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">AR Mode</h1>
        {/* Placeholder for potential settings/flash toggle */}
        <div className="w-10"></div>
      </header>

      {/* Camera View */} 
      <div className="flex-1 relative bg-black"> {/* Ensure container has a background */} 
        {error ? (
          <div className="text-center p-4 bg-red-900/50 rounded-lg max-w-sm mx-auto z-10">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-200 font-medium mb-1">Error</p> {/* Simplified title */} 
            <p className="text-red-300 text-sm">{error}</p>
            {/* Conditionally show Try Again button only for camera errors */}
            {error.includes("camera") && 
               <Button onClick={setupCamera} size="sm" variant="destructive" className="mt-3">Try Again</Button>
            }
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted 
            // Use absolute positioning to fill the container more reliably
            className={`absolute inset-0 w-full h-full object-cover ${stream ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} 
          />
        )}
         {/* Loading overlay */} 
         {!stream && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        )}
        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>

      {/* AI Response Overlay */} 
      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-4 right-4 md:left-auto md:right-8 md:max-w-sm p-4 bg-black/70 backdrop-blur-md rounded-lg border border-gray-700 shadow-xl z-20"
          >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold text-purple-300">NbAIl Says:</h3>
                <button onClick={() => setAiResponse(null)} className="text-gray-400 hover:text-white -mt-1 -mr-1">
                    <X className="h-4 w-4" />
                </button>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{aiResponse}</p>
             {/* Optional: Add TTS button here */}
             {/* <Button size="sm" variant="ghost" className="mt-2 text-purple-300"><Volume2 className="h-4 w-4 mr-1"/> Speak</Button> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */} 
      <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-4 z-20 bg-gradient-to-t from-black/50 to-transparent">
        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={!stream || isAnalyzing || !!error}
          className="rounded-full w-16 h-16 p-0 bg-white/80 hover:bg-white text-black disabled:bg-gray-500 disabled:opacity-50 transition-all duration-200 hover:scale-105 active:scale-95 relative shadow-lg"
        >
          {isAnalyzing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Camera className="h-6 w-6" />
              {/* Pulsing ring effect */}
              <span className="absolute inset-0 rounded-full border-2 border-white/50 animate-pulse"></span>
            </>
          )}
        </Button>
        {/* Placeholder for voice input button */}
        {/* <Button variant="ghost" size="icon" className="absolute right-8 bottom-6 text-white bg-white/10 hover:bg-white/20 rounded-full"><Mic className="h-5 w-5"/></Button> */}
      </footer>
    </div>
  )
}
