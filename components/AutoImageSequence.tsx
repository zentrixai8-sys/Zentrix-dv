import React, { useEffect, useRef, useState } from 'react';

interface AutoImageSequenceProps {
    src: string; // Base path for images (e.g., "/video-frames/")
    frameCount: number; // Total number of frames (e.g., 192)
    startFrame?: number;
    className?: string;
    fps?: number; // Frames per second
}

const AutoImageSequence: React.FC<AutoImageSequenceProps> = ({
    src,
    frameCount,
    startFrame = 1,
    className = "",
    fps = 30
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const currentFrameRef = useRef(0);
    const lastDrawTimeRef = useRef(0);
    const animationRef = useRef<number>();

    // Preload images
    useEffect(() => {
        let loaded = 0;
        const imgArray: HTMLImageElement[] = [];

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const frameNumber = (startFrame + i).toString().padStart(5, '0');
            img.src = `${src}${frameNumber}.jpg`;
            img.onload = () => {
                loaded++;
                setLoadedCount(loaded);
            };
            img.onerror = (e) => {
                console.error(`Failed to load image: ${img.src}`, e);
            };
            imgArray.push(img);
        }
        setImages(imgArray);
    }, [src, frameCount, startFrame]);

    // Draw frame
    const drawFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = images[index];

        if (canvas && ctx && img && img.complete) {
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.width;
            const ih = img.height;

            // Crop or Scale logic
            const r = Math.max(cw / iw, ch / ih);
            const nw = iw * r;
            const nh = ih * r;
            const cx = (cw - nw) / 2;
            const cy = (ch - nh) / 2;

            ctx.clearRect(0, 0, cw, ch);
            if (img.naturalWidth > 0) {
                try {
                    ctx.drawImage(img, cx, cy, nw, nh);
                } catch (err) {
                    console.error("Error drawing image frame:", err);
                }
            }
        }
    };

    // Auto-play loop
    useEffect(() => {
        const frameInterval = 1000 / fps;

        const loop = (timestamp: number) => {
            if (!lastDrawTimeRef.current) lastDrawTimeRef.current = timestamp;
            const elapsed = timestamp - lastDrawTimeRef.current;

            if (elapsed > frameInterval && images.length > 0) {
                currentFrameRef.current = (currentFrameRef.current + 1) % images.length;
                drawFrame(currentFrameRef.current);
                lastDrawTimeRef.current = timestamp - (elapsed % frameInterval);
            }

            animationRef.current = requestAnimationFrame(loop);
        };

        if (images.length > 0) {
            animationRef.current = requestAnimationFrame(loop);
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [images, fps]);

    // Handle canvas sizing
    useEffect(() => {
        const resizeCanvas = () => {
            if (canvasRef.current && containerRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
                if (images.length > 0) drawFrame(currentFrameRef.current);
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [images]);

    return (
        <div ref={containerRef} className={`w-full h-full relative ${className}`}>
            <canvas
                ref={canvasRef}
                className={`block w-full h-full object-cover transition-opacity duration-1000 ${loadedCount > 10 ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Loading Skeleton */}
            {loadedCount <= 10 && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 animate-pulse">
                    <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default AutoImageSequence;
