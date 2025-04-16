"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, X, Loader2, Sparkles } from 'lucide-react'; // Restore Camera icon
import { Button } from '@/components/ui/button';
import { getGroqVisionCompletion } from '@/lib/groq-service';

export default function ARCameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Restore canvasRef
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // For initial camera loading
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false); // For AI analysis
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  // Request camera access
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const getCameraStream = async () => {
      setError(null);
      setIsLoading(true);
      try {
        console.log("Requesting camera stream (single-frame mode)...");
        currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          },
          audio: false
        });
        setStream(currentStream);

        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.srcObject = currentStream;
          // No need for onloadedmetadata for single frame capture
          videoElement.play().catch(err => {
            console.error("Video play failed:", err);
            setError(`Video playback failed: ${err.message}. Ensure autoplay is allowed.`);
          });
        } else {
          setError("Video element failed to mount.");
        }
      } catch (err) { // Keep existing detailed error handling
        console.error("Error accessing camera:", err);
        if (err instanceof Error) {
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
             setError("Camera permission denied. Please enable camera access in your browser settings.");
          } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
             setError("No camera found. Please ensure a camera is connected and enabled.");
          } else {
             setError(`Failed to access camera: ${err.message}`);
          }
        } else {
           setError("An unknown error occurred while accessing the camera.");
        }
        setStream(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCameraStream();

    // Cleanup function
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        console.log("Camera stream stopped.");
      }
    };
  }, []); // Empty dependency array

  const handleClose = () => {
    router.back();
  };

  // Re-implement single-frame capture logic
  const handleCapture = async (query?: string) => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Video or canvas element not available.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
        setError("Could not get canvas context.");
        return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
    
    setLastResponse(null);
    setIsAnalyzing(true);
    setError(null);

    const prompt = query || "Describe what you see in this image.";

    try {
      console.log("Sending image to Groq Vision (single-frame mode)...");
      const response = await getGroqVisionCompletion(prompt, imageBase64, 'image/jpeg');
      setLastResponse(response || "Couldn't generate a description.");
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(err instanceof Error ? `Analysis failed: ${err.message}` : "Unknown analysis error.");
      setLastResponse(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Initial Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
           <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
           <p className="text-lg">Starting Camera...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-30 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg mb-6">{error}</p>
          <Button onClick={handleClose} variant="destructive" size="lg">
            Go Back
          </Button>
        </div>
      )}
      
      {/* Camera View & Controls */}
      {stream && !isLoading && !error && (
        <>
          {/* Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute top-0 left-0 w-full h-full object-cover z-0" // Use cover again
          />
          {/* Hidden Canvas */}
          <canvas ref={canvasRef} style={{ display: 'none' }} /> 

          {/* Overlay UI */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-6 pointer-events-none">
            {/* Top Bar */}
            <div className="flex justify-end pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={handleClose}
                aria-label="Close AR Mode"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Response Area */}
            {lastResponse && (
                <div className="bg-black/70 backdrop-blur-sm p-4 rounded-lg max-w-lg mx-auto text-center mb-4 pointer-events-auto shadow-lg">
                    <p>{lastResponse}</p>
                </div>
            )}

            {/* Bottom Bar - Restore Capture Button */}
            <div className="flex justify-center items-center space-x-4 pointer-events-auto">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black/50 hover:bg-black/70 text-white w-16 h-16 border-2 border-white shadow-xl"
                onClick={() => handleCapture()}
                aria-label="Capture Image"
                disabled={isAnalyzing}
              >
                 {isAnalyzing ? <Loader2 className="h-7 w-7 animate-spin" /> : <Camera className="h-7 w-7" />}
              </Button>
            </div>
          </div>
          
          {/* Analysis Loading Overlay */}
          {isAnalyzing && (
             <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
                <Sparkles className="h-12 w-12 text-purple-400 mb-4 animate-pulse" />
                <p className="text-xl font-medium">NbAIl is analyzing...</p>
             </div>
          )}
        </>
      )}
      {/* Remove global styles related to detection */}
    </div>
  );
}
