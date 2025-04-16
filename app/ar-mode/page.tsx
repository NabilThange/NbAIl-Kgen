"use client"

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, X, Mic, Send, Loader2, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGroqVisionCompletion } from '@/lib/groq-service'; // Assuming this can be reused
import { motion } from "framer-motion";
import MinimalHeader from "@/components/minimal-header";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import components for the info view
const DynamicSparklesCore = dynamic(() => import("@/components/sparkles").then((mod) => mod.SparklesCore), {
  ssr: false,
  loading: () => <div className="h-full w-full absolute inset-0 z-0 bg-black/[0.96]"></div>,
});

// Loading component for info content
const ContentLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

export default function ARModePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [lastImageBase64, setLastImageBase64] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>(""); // For potential text input alongside image

  // Request camera access only when needed
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const getCameraStream = async () => {
      if (!isCameraActive) return; // Only run if camera view is active

      setError(null);
      setIsLoadingCamera(true);
      setStream(null); // Reset stream initially
      try {
        console.log("Requesting camera access...");
        currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 } 
          },
          audio: false
        });
        console.log("Camera stream acquired.");
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
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
        setIsCameraActive(false); // Revert to info view on error
      } finally {
        setIsLoadingCamera(false);
      }
    };

    getCameraStream();

    // Cleanup: Stop stream if camera becomes inactive or component unmounts
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        console.log("Camera stream stopped.");
        setStream(null);
      }
    };
    // Rerun effect when isCameraActive changes
  }, [isCameraActive]); 

  // Close camera view and return to info screen
  const handleCloseCamera = () => {
    setError(null);
    setLastResponse(null);
    setLastImageBase64(null);
    setIsCameraActive(false);
  };

  // Capture frame and send to AI
  const handleCapture = async (query?: string) => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Video or canvas element not available.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    const context = canvas.getContext('2d');
    if (!context) {
        setError("Could not get canvas context.");
        return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data as base64
    // Use jpeg for smaller size, adjust quality as needed
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
    setLastImageBase64(imageBase64); // Store for potential display or retry
    setLastResponse(null); // Clear previous response
    setIsAnalyzing(true);
    setError(null);

    const prompt = query || "Describe what you see in this image."; // Default prompt

    try {
      console.log("Sending image to Groq Vision...");
      const response = await getGroqVisionCompletion(prompt, imageBase64, 'image/jpeg');
      console.log("Groq Vision Response:", response);
      setLastResponse(response || "I received the image, but couldn't generate a description.");
      
      // Optional: Speak the response
      // speakText(response);
      
    } catch (err) {
      console.error("Error analyzing image:", err);
      let errorMsg = "An unknown error occurred during analysis.";
      if (err instanceof Error) {
         errorMsg = `Failed to analyze image: ${err.message}`;
      }
      setError(errorMsg);
      setLastResponse(null);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Placeholder for voice input logic
  const handleVoiceInput = () => {
      console.log("Voice input triggered");
      // We can adapt the logic from the chat page later if needed
  };

  // Camera View Component/JSX
  const CameraView = (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Loading State */}
      {isLoadingCamera && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
           <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
           <p className="text-lg">Starting Camera...</p>
        </div>
      )}

      {/* Error State (handled within this view now) */}
      {error && !isLoadingCamera && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-30 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Camera Error</h2>
          <p className="text-lg mb-6">{error}</p>
          <Button onClick={handleCloseCamera} variant="destructive" size="lg">
            Go Back to Info
          </Button>
        </div>
      )}
      
      {/* Camera View & Controls (only if stream is active and no error) */}
      {stream && !isLoadingCamera && !error && (
        <>
          {/* Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted // Mute the video element itself
            className="absolute top-0 left-0 w-full h-full object-cover z-0" // Cover the entire container
          />
          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} /> 

          {/* Overlay UI */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-6 pointer-events-none"> {/* pointer-events-none for container, enable for children */}
            {/* Top Bar */}
            <div className="flex justify-end pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={handleCloseCamera}
                aria-label="Close Camera View"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Response Area (Placeholder) */}
            {lastResponse && (
                <div className="bg-black/70 backdrop-blur-sm p-4 rounded-lg max-w-lg mx-auto text-center mb-4 pointer-events-auto">
                    <p>{lastResponse}</p>
                </div>
            )}

            {/* Bottom Bar */}
            <div className="flex justify-center items-center space-x-4 pointer-events-auto">
               {/* Text Input (Optional for query with image) - Can be hidden/shown */}
               {/* <Input 
                  type="text" 
                  value={userQuery} 
                  onChange={(e) => setUserQuery(e.target.value)} 
                  placeholder="Ask about the image..."
                  className="bg-black/50 border-gray-700 text-white rounded-full"
               /> */}

              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black/50 hover:bg-black/70 text-white w-16 h-16 border-2 border-white"
                onClick={() => handleCapture()}
                aria-label="Capture Image"
                disabled={isAnalyzing}
              >
                 {isAnalyzing ? <Loader2 className="h-7 w-7 animate-spin" /> : <Camera className="h-7 w-7" />}
              </Button>
              {/* Optional Voice Button */}
               {/* <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black/50 hover:bg-black/70 text-white w-14 h-14"
                onClick={handleVoiceInput}
                aria-label="Ask with Voice"
                disabled={isAnalyzing}
              >
                <Mic className="h-6 w-6" />
              </Button> */}
            </div>
          </div>
          
          {/* Analysis Loading Overlay */}
          {isAnalyzing && (
             <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
                <Sparkles className="h-12 w-12 text-purple-400 mb-4 animate-pulse" />
                <p className="text-xl font-medium">NbAIl is analyzing...</p>
                <p className="text-gray-400 mt-2">Please wait a moment.</p>
             </div>
          )}
        </>
      )}
    </div>
  );

  // Informational View Component/JSX
  const InfoView = (
     <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] flex flex-col relative overflow-x-hidden">
       {/* Interactive background */}
       <div className="h-full w-full absolute inset-0 z-0">
         <DynamicSparklesCore
           id="tsparticlesfullpage"
           background="transparent"
           minSize={0.6}
           maxSize={1.4}
           particleDensity={50}
           className="w-full h-full"
           particleColor="#FFFFFF"
         />
       </div>
       <MinimalHeader title="AR Mode" />
       <main className="flex-1 pt-16 relative z-10">
         <div className="container mx-auto px-4 py-12 max-w-4xl">
           <Suspense fallback={<ContentLoading />}>
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="bg-gray-800/90 backdrop-blur-md rounded-xl p-8 border border-gray-700 glow-purple-sm"
             >
               <div className="flex flex-col md:flex-row items-center gap-8">
                 <div className="w-full md:w-1/2">
                   <h2 className="text-2xl font-bold text-white mb-4">Experience Augmented Reality Assistance</h2>
                   <p className="text-gray-300 mb-6">
                     AR Mode overlays helpful information in your field of view, allowing NbAIl to provide contextual
                     assistance in the real world.
                   </p>
                   {/* Feature list from previous version */}
                   <div className="space-y-4 mb-6">
                     <div className="flex items-start">
                       <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                         <Check className="h-4 w-4 text-purple-500" />
                       </div>
                       <p className="text-gray-300">Get real-time translations</p>
                     </div>
                     <div className="flex items-start">
                       <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                         <Check className="h-4 w-4 text-purple-500" />
                       </div>
                       <p className="text-gray-300">Identify objects</p>
                     </div>
                     <div className="flex items-start">
                       <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                         <Check className="h-4 w-4 text-purple-500" />
                       </div>
                       <p className="text-gray-300">Receive step-by-step guidance</p>
                     </div>
                   </div>
                   {/* Button to activate camera */}
                   <Button
                     className="bg-purple-600 hover:bg-purple-700 text-white"
                     onClick={() => setIsCameraActive(true)} // Set state to true
                   >
                    Activate AR Camera
                   </Button>
                 </div>
                 {/* Illustration placeholder */}
                 <div className="w-full md:w-1/2">
                   <div className="relative">
                     <div className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 glow-purple-sm">
                       <img
                         src="/placeholder.svg?height=300&width=400" // Use placeholder or actual image
                         alt="AR Mode Illustration"
                         className="w-full h-auto"
                       />
                     </div>
                   </div>
                 </div>
               </div>
             </motion.div>
             {/* How it works section (optional, can be added back) */}
           </Suspense>
         </div>
       </main>
       {/* Footer from previous version */}
       <footer className="border-t border-gray-800 glass py-6 relative z-10">
         <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
           <p className="text-gray-400 text-sm mb-4 md:mb-0">
             AR Mode requires camera permissions.
           </p>
           <div className="flex space-x-4">
             <Button
               variant="link"
               className="text-purple-500 hover:text-purple-400 text-sm font-medium"
               onClick={() => router.back()} // Go back to previous page
             >
               Return to Chat
             </Button>
           </div>
         </div>
       </footer>
     </div>
  );

  // Return the correct view based on state
  return isCameraActive ? CameraView : InfoView;
}
