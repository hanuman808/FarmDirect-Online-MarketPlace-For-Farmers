"use client";

import { IconCamera, IconCapture, IconUpload, IconX } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";

interface CameraFeedProps {
    onCapture?: (imageData: string) => void;
}

const CameraFeed = ({ onCapture }: CameraFeedProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                await videoRef.current.play(); // Explicitly play the video
                setStream(mediaStream);
                setIsStreaming(true);
                toast.success("Camera started");
            }
        } catch (error) {
            console.error("Camera access error:", error);
            toast.error("Cannot access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
            setIsStreaming(false);
            toast.success("Camera stopped");
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                const imageData = canvas.toDataURL("image/png");
                setCapturedImage(imageData);

                if (onCapture) {
                    onCapture(imageData);
                }

                toast.success("Image captured!");
            }
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target?.result as string;
                setCapturedImage(imageData);

                if (onCapture) {
                    onCapture(imageData);
                }

                toast.success("Image uploaded!");
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="space-y-4">
            {/* Video Feed */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {isStreaming ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="text-xs font-bold text-white">LIVE</span>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <IconCamera size={48} className="mb-3 opacity-30" />
                        <p className="text-sm font-medium">Camera Off</p>
                    </div>
                )}
            </div>

            {/* Hidden Canvas for Capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
                {!isStreaming ? (
                    <button
                        onClick={startCamera}
                        className="btn bg-green-600 text-white hover:bg-green-700 border-none rounded-lg font-medium flex items-center gap-2"
                    >
                        <IconCamera size={18} />
                        Start Camera
                    </button>
                ) : (
                    <>
                        <button
                            onClick={captureImage}
                            className="btn bg-green-600 text-white hover:bg-green-700 border-none rounded-lg font-medium flex items-center gap-2"
                        >
                            <IconCapture size={18} />
                            Capture Photo
                        </button>
                        <button
                            onClick={stopCamera}
                            className="btn bg-red-600 text-white hover:bg-red-700 border-none rounded-lg font-medium flex items-center gap-2"
                        >
                            <IconX size={18} />
                            Stop
                        </button>
                    </>
                )}

                <label className="btn btn-outline border-gray-300 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2 cursor-pointer">
                    <IconUpload size={18} />
                    Upload Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Captured Image Preview */}
            {capturedImage && (
                <div className="relative">
                    <p className="text-xs font-medium text-gray-500 mb-2">Captured Image</p>
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                        <img src={capturedImage} alt="Captured" className="w-full h-auto" />
                        <button
                            onClick={() => setCapturedImage(null)}
                            className="absolute top-3 right-3 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center"
                        >
                            <IconX size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraFeed;
