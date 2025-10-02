import React, { useRef, useEffect, useCallback } from 'react';

declare const jsQR: any;

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fix: Initialize useRef with null to provide an initial value, satisfying TypeScript's useRef overload requirements.
  const animationFrameId = useRef<number | null>(null);

  const tick = useCallback((_timestamp: number) => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          if (code) {
            onScan(code.data);
          }
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(tick);
  }, [onScan]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const setupCamera = async () => {
      // Try for environment camera first
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      } catch (err) {
        console.warn("Could not get environment camera, trying default camera.", err);
        // If that fails, try for any camera
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (finalErr) {
          console.error("Error accessing any camera:", finalErr);
          alert("Could not access camera. Please ensure permissions are granted and no other app is using it.");
          onClose();
          return;
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        videoRef.current.play();
        animationFrameId.current = requestAnimationFrame(tick);
      }
    };

    setupCamera();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [tick, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-brand-secondary rounded-xl shadow-lg p-4 sm:p-6 m-4 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-brand-light mb-4 text-center">Scan Student's QR Code</h2>
        <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-8 border-brand-primary border-opacity-50" />
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QRCodeScanner;
