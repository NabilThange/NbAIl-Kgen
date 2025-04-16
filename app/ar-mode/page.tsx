"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, X, Mic, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGroqVisionCompletion } from '@/lib/groq-service'; // Assuming this can be reused
import { motion } from "framer-motion"
import { Suspense } from "react"
import { Glasses, Check } from "lucide-react"
import MinimalHeader from "@/components/minimal-header"
import Link from "next/link"
import dynamic from "next/dynamic"

// Dynamically import components
const DynamicSparklesCore = dynamic(() => import("@/components/sparkles").then((mod) => mod.SparklesCore), {
  ssr: false,
  loading: () => <div className="h-full w-full absolute inset-0 z-0 bg-black/[0.96]"></div>,   
})

// Loading component for content
const ContentLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
  </div>
)

export default function ARModePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [lastImageBase64, setLastImageBase64] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState<string>(""); // For potential text input alongside image
  const [enabled, setEnabled] = useState(false) // Keep state for potential visual feedback

  // Request camera access
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const getCameraStream = async () => {
      setError(null);
      setIsLoading(true);
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment", // Prefer rear camera
            width: { ideal: 1280 }, // Request a reasonable resolution
            height: { ideal: 720 } 
          },
          audio: false // No audio needed for basic frame capture
        });
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
      } finally {
        setIsLoading(false);
      }
    };

    getCameraStream();

    // Cleanup function to stop the stream when the component unmounts
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        console.log("Camera stream stopped.");
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleClose = () => {
    router.back(); // Go back to the previous page (likely chat)
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

  const handleEnable = () => {
    // Navigate to the camera page instead of just setting state
    router.push('/ar-mode/camera');
    // Optionally, keep setEnabled(true) if you want the button to look disabled after click before navigation
    // setEnabled(true); 
  }

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] flex flex-col relative overflow-x-hidden">
      {/* Interactive background with moving particles */}
      <div className="h-full w-full absolute inset-0">
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
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-gray-300">Get real-time translations of text in your environment</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-gray-300">Identify objects and get information about them</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-gray-300">Receive step-by-step guidance for complex tasks</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-gray-300">See virtual annotations on physical objects</p>
                    </div>
                  </div>
                  <Button
                    className={`bg-purple-600 hover:bg-purple-700 text-white`}
                    // Remove the disabled logic for now, always navigates
                    // disabled={enabled} 
                    onClick={handleEnable}
                  >
                    {/* Keep button text simple */}
                    Enable AR Mode
                  </Button>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="relative">
                    <div className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 glow-purple-sm">
                      {/* Placeholder Image */}
                      <img
                        src="/placeholder.svg?height=300&width=400" 
                        alt="AR Mode Illustration"
                        className="w-full h-auto"
                      />
                    </div>
                    {/* Remove the conditional overlay for simplicity */}
                    {/* {enabled && (...)} */}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 bg-gray-800/90 backdrop-blur-md rounded-xl p-8 border border-gray-700 glow-purple-sm"
            >
              <h3 className="text-xl font-bold text-white mb-4">How AR Mode Works</h3>
              <p className="text-gray-300 mb-6">
                AR Mode uses your device's camera to understand your environment and overlay helpful information. Here's
                how to get the most out of it:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Enable Permissions", description: "Allow camera access when prompted to let NbAIl see your environment." },
                  { title: "Point Your Camera", description: "Aim your device at objects, text, or scenes you want information about." },
                  { title: "Voice Commands", description: "Use voice commands like 'What's this?' or 'Translate this' for quick actions." },
                ].map((step, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600 card-hover">
                    <div className="bg-purple-500/20 w-8 h-8 rounded-full flex items-center justify-center mb-3">
                      <span className="text-purple-500 font-medium">{index + 1}</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">{step.title}</h4>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </Suspense>
        </div>
      </main>

      <footer className="border-t border-gray-800 glass py-6 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            AR Mode is currently in beta. We appreciate your feedback!
          </p>
          <div className="flex space-x-4">
            <Button
              variant="link"
              className="text-purple-500 hover:text-purple-400 text-sm font-medium"
              onClick={() => router.push("/chat")}
            >
              Return to Chat
            </Button>
            <Link href="/dashboard" className="text-purple-500 hover:text-purple-400 text-sm font-medium">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
