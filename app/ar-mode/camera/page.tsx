"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, X, Mic, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGroqVisionCompletion } from '@/lib/groq-service';

export default function ARModePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [lastImageBase64, setLastImageBase64] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const getCameraStream = async () => {
      setError(null);
      setIsLoading(true);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      setStream(null);

      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 } 
          },
          audio: false
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

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        console.log("Camera stream stopped.");
      }
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

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
    setLastImageBase64(imageBase64);
    setLastResponse(null);
    setIsAnalyzing(true);
    setError(null);

    // Use the detailed AR prompt if no specific query is provided
    const prompt = query || `> You are an intelligent AR assistant analyzing a real-time live camera feed. Your task is to break down the scene with maximum clarity and structure so it can be used immediately for AR overlays, scanning effects, voice interaction, and object-based responses.
>
> ⚠️ Structure your answer with clearly labeled sections, keep it precise and AR-friendly. Respond in bullet points and short paragraphs — suitable for use in an AR UI.

---

**1. 🔍 Environment Context**  
- Is the scene indoors or outdoors?  
- Describe lighting, weather (if visible), and overall ambiance.  
- Mention any visible floor/wall/sky/ground type.

**2. 📦 Detected Objects & Surfaces**  
- List each visible object (real-world items, devices, props, etc.)  
- For each object: name, color, size (approx.), and location (left/right/center/top/bottom)  
- If text is detected, show it and its meaning.

**3. 🧑‍🤝‍🧑 Human Presence & Behavior (if any)**  
- Number of people, position, posture (standing, sitting, walking, etc.)  
- Describe visible actions or gestures (e.g., pointing, holding something)  
- Clothing type or standout features

**4. 💻 Devices & Tech (if present)**  
- Identify any visible tech: phones, screens, cameras, etc.  
- Is the screen on? Any visible UI or brand?

**5. 🌱 Natural Elements**  
- Trees, plants, animals, sky, water, terrain, etc.  
- Realism level: realistic, stylized, artificial?

**6. 🧠 Focus Area (What Stands Out Most)**  
- What seems to be the central subject or point of interest?  
- Describe in 1 sentence what draws attention most

**7. 🧩 Spatial Awareness & Depth**  
- Distance between objects if clear  
- Mention any layering or foreground/background separation  
- Relative placement (e.g., "The lamp is next to the table on the left")

**8. 🧾 Voice Output Summary**  
- Generate a **5-word** voice summary (highlighting the main object or action)  
- This will be spoken by the assistant immediately

**9. 🪟 AR Overlay Suggestions**  
- For each key object or person:
  - Bounding box placement
  - Label text (e.g., "MacBook Pro", "Person: Standing")
  - Optional scanning animation (circle, pulse, glow, etc.)
- Suggest if anything should be highlighted, pulsed, or animated

**10. 📤 Actionable Info / User Guidance (Optional)**  
- What can the user ask or interact with next?  
- Suggest 1–2 voice questions user might ask based on the scene.`;

    try {
      const response = await getGroqVisionCompletion(prompt, imageBase64, 'image/jpeg');
      setLastResponse(response || "I received the image, but couldn't generate a description.");
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

  const handleVoiceInput = () => {
      console.log("Voice input triggered (placeholder)");
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
           <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
           <p className="text-lg">Starting Camera...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-30 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Camera Error</h2>
          <p className="text-lg mb-6">{error}</p>
          <Button onClick={handleClose} variant="destructive" size="lg">
            Go Back
          </Button>
        </div>
      )}
      
      {stream && !isLoading && !error && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted 
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} /> 

          <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-6 pointer-events-none">
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

            {lastResponse && (
                <div className="bg-black/70 backdrop-blur-sm p-4 rounded-lg max-w-lg mx-auto text-center mb-4 pointer-events-auto">
                    <p>{lastResponse}</p>
                </div>
            )}

            <div className="flex justify-center items-center space-x-4 pointer-events-auto mb-4">
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
            </div>
          </div>
          
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
}
