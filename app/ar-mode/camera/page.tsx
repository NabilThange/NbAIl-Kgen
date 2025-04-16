"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2, Sparkles, Eye } from 'lucide-react'; // Replaced Camera/Mic with Eye
import { Button } from '@/components/ui/button';
// Import TensorFlow.js and COCO-SSD model
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Define type for detected objects
interface Detection { 
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
}

export default function ARCameraPage() { // Renamed component for clarity
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number>();
  const modelRef = useRef<cocoSsd.ObjectDetection>();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(true); // Renamed isLoading
  const [detections, setDetections] = useState<Detection[]>([]);
  const [videoDimensions, setVideoDimensions] = useState<{width: number, height: number} | null>(null);

  // Load COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      setModelLoading(true);
      setError(null);
      try {
        await tf.ready(); // Ensure TF.js backend is ready
        console.log("TensorFlow.js backend ready.");
        modelRef.current = await cocoSsd.load();
        console.log("COCO-SSD model loaded.");
      } catch (err) {
        console.error("Error loading COCO-SSD model:", err);
        setError("Failed to load object detection model.");
        modelRef.current = undefined; // Explicitly set to undefined on error
      } finally {
        setModelLoading(false);
      }
    };
    loadModel();
  }, []);

  // Request camera access and get dimensions
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    const videoElement = videoRef.current;

    const getCameraStream = async () => {
      setError(null);
      // Don't set modelLoading here, it's handled separately
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
        if (videoElement) {
          videoElement.srcObject = currentStream;
          // Wait for metadata to get dimensions
          videoElement.onloadedmetadata = () => {
              setVideoDimensions({
                  width: videoElement.videoWidth,
                  height: videoElement.videoHeight
              });
              console.log(`Video dimensions: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
              // Start detection loop only after model and video are ready
              requestRef.current = requestAnimationFrame(detectObjects);
          };
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
      } 
      // Removed finally block setting modelLoading
    };

    getCameraStream();

    // Cleanup function
    return () => {
      if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
      }
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        console.log("Camera stream stopped.");
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Detection loop function
  const detectObjects = useCallback(async () => {
    if (videoRef.current && videoRef.current.readyState === 4 && modelRef.current && !modelLoading) {
      try {
        const predictions = await modelRef.current.detect(videoRef.current);
        setDetections(predictions);
      } catch (error) {
        console.error("Error during detection:", error);
        // Optionally set an error state here
      }
    }
    // Continue the loop
    requestRef.current = requestAnimationFrame(detectObjects);
  }, [modelLoading]); // Re-run if modelLoading changes (though loop starts after loading)

  const handleClose = () => {
    router.back();
  };
  
  // Calculate scale factors if video element dimensions differ from display dimensions
  const scaleX = videoRef.current ? videoRef.current.clientWidth / (videoDimensions?.width || 1) : 1;
  const scaleY = videoRef.current ? videoRef.current.clientHeight / (videoDimensions?.height || 1) : 1;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Model Loading State */}
      {modelLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
           <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
           <p className="text-lg">Loading AI Model...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-30 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg mb-6">{error}</p>
          <Button onClick={handleClose} variant="destructive" size="lg">
            Go Back
          </Button>
        </div>
      )}
      
      {/* Camera View & Detections (only if stream and model are ready) */}
      {stream && !modelLoading && !error && (
        <>
          {/* Video Feed Container (for positioning context) */}
          <div className="relative w-full h-full flex items-center justify-center">
             <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-w-full max-h-full object-contain border-4 border-red-500" // Added red border for visibility
             />
             {/* Detection Overlays - Temporarily commented out */}
             {/* {detections.map((detection, index) => { ... })} */}
          </div>

          {/* Top Bar - Kept for closing */}
          <div className="absolute top-0 right-0 z-10 p-4 md:p-6">
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

          {/* Detection Count - Temporarily commented out */}
          {/* <div className="absolute bottom-4 left-4 z-10 ..."> ... </div> */}
        </>
      )}
      {/* Global Styles - Can keep these */}
      {/* <style jsx global>{ ... }</style> */}
    </div>
  );
}
