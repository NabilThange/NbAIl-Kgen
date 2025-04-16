"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, X, Mic, Send, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getGroqVisionCompletion } from '@/lib/groq-service';
import { AnimatePresence, motion } from 'framer-motion';

// Type for AI analysis result
interface AnalysisResult {
  heading: string;
  description: string;
}

export default function ARModePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [lastImageBase64, setLastImageBase64] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Request camera access
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let cancelled = false;

    const getCameraStream = async () => {
      setError(null);
      setIsLoading(true);
      setStream(null);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }

      try {
        console.log(`Requesting camera with facingMode: ${facingMode}`);
        currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 } 
          },
          audio: false
        });
        
        if (cancelled) {
          currentStream.getTracks().forEach(track => track.stop());
          return;
        }
        
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
         if (cancelled) return;
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
        if (!cancelled) setIsLoading(false);
      }
    };

    getCameraStream();

    return () => {
      cancelled = true;
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        console.log("Camera stream stopped.");
      }
    };
  }, [facingMode]);

  const handleClose = () => {
    router.back();
  };

  // TTS Function
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) {
      console.warn("Speech synthesis not supported or no text provided.");
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Capture frame and send to AI
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
    if (facingMode === 'user') {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
    setLastImageBase64(imageBase64);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    setError(null);

    const prompt = query || "Describe what you see in this image in detail. Start with a short, descriptive heading (max 5 words) on the first line, followed by a newline and then the detailed explanation.";

    try {
      const fullResponse = await getGroqVisionCompletion(prompt, imageBase64, 'image/jpeg');
      
      if (fullResponse) {
        const lines = fullResponse.split('\n');
        const heading = lines[0] || "Analysis Result";
        const description = lines.slice(1).join('\n').trim() || "No detailed description available.";
        
        const result: AnalysisResult = { heading, description };
        setAnalysisResult(result);
        speakText(result.heading);
      } else {
        setAnalysisResult({ heading: "Analysis Failed", description: "I received the image, but couldn't generate a description." });
        speakText("Analysis Failed");
      }
      
    } catch (err) {
      console.error("Error analyzing image:", err);
      let errorMsg = "An unknown error occurred during analysis.";
      if (err instanceof Error) {
         errorMsg = `Failed to analyze image: ${err.message}`;
      }
      setError(errorMsg);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to flip the camera
  const handleFlipCamera = () => {
    if (isAnalyzing || isLoading) return;
    setFacingMode(prevMode => prevMode === "environment" ? "user" : "environment");
  };
  
  // Placeholder for voice input logic
  const handleReadDescription = () => {
      if (analysisResult && !isSpeaking) {
         speakText(analysisResult.description);
      }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
           <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
           <p className="text-lg">Starting Camera...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-30 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Camera Error</h2>
          <p className="text-lg mb-6">{error}</p>
          <Button onClick={handleClose} variant="destructive" size="lg">
            Go Back
          </Button>
        </div>
      )}
      
      {/* Camera View & Controls */}
      {stream && !isLoading && !error && (
        <>
          {/* Video Feed - Flip horizontally if user camera */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted 
            className={`absolute top-0 left-0 w-full h-full object-cover z-0 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} /> 

          <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-6 pointer-events-none">
            {/* Top Bar - Replace Back Button */} 
            <div className="flex justify-start pointer-events-auto">
              <button
                className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group pointer-events-auto"
                type="button"
                onClick={handleClose}
                aria-label="Go Back"
              >
                <div
                  className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                    <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000"></path>
                    <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000"></path>
                  </svg>
                </div>
                <p className="translate-x-2">Go Back</p>
              </button>
            </div>

            {/* Response Area - Use Card */}
            <AnimatePresence>
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-lg mx-auto mb-4 pointer-events-auto"
                >
                  <Card className="bg-black/80 backdrop-blur-md border border-purple-500/50 text-white shadow-lg shadow-purple-500/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span className="flex items-center">
                          <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                          {analysisResult.heading}
                        </span>
                        <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-7 w-7 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50"
                           onClick={handleReadDescription}
                           disabled={isSpeaking}
                           aria-label="Read description aloud"
                        >
                           <Mic className={`h-4 w-4 ${isSpeaking ? 'text-green-400 animate-pulse' : ''}`} />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 text-sm max-h-32 overflow-y-auto">
                        {analysisResult.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Bar - Add Flip Button, Replace Capture Button */} 
            <div className="flex justify-center items-center space-x-4 pointer-events-auto mb-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black/50 hover:bg-black/70 text-white w-14 h-14 border-gray-600"
                onClick={handleFlipCamera}
                aria-label="Flip Camera"
                disabled={isAnalyzing || isLoading}
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              
              <button 
                 className="button pointer-events-auto" 
                 onClick={() => handleCapture()}
                 disabled={isAnalyzing}
                 aria-label="Take a Photo"
              >
                {isAnalyzing ? 
                  <Loader2 className="h-6 w-6 animate-spin text-white" /> : 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="svg-icon">
                    <g strokeWidth="2" strokeLinecap="round" stroke="#fff" fillRule="evenodd" clipRule="evenodd">
                      <path d="m4 9c0-1.10457.89543-2 2-2h2l.44721-.89443c.33879-.67757 1.03131-1.10557 1.78889-1.10557h3.5278c.7576 0 1.4501.428 1.7889 1.10557l.4472.89443h2c1.1046 0 2 .89543 2 2v8c0 1.1046-.8954 2-2 2h-12c-1.10457 0-2-.8954-2-2z"></path>
                      <path d="m15 13c0 1.6569-1.3431 3-3 3s-3-1.3431-3-3 1.3431-3 3-3 3 1.3431 3 3z"></path>
                    </g>
                  </svg>
                }
                <span className="lable">{isAnalyzing ? 'Analyzing...' : 'Take a Photo'}</span>
              </button>
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
}
