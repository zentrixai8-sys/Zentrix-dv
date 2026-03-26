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

    // URL for the very first frame to act as an instant poster/backdrop
    const posterSrc = `${src}${startFrame.toString().padStart(5, '0')}.jpg`;

    // Preload images
    useEffect(() => {
        let loaded = 0;
        const imgArray: HTMLImageElement[] = [];
        let isMounted = true;

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            const frameNumber = (startFrame + i).toString().padStart(5, '0');
            img.src = `${src}${frameNumber}.jpg`;
            img.onload = () => {
                if (isMounted) {
                    loaded++;
                    setLoadedCount(loaded);
                }
            };
            imgArray.push(img);
        }
        setImages(imgArray);

        return () => {
            isMounted = false;
        };
    }, [src, frameCount, startFrame]);

    // Draw frame
    const drawFrame = (index: number) => {
        if (!images || images.length === 0) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = images[index];

        // ONLY clear and draw if the image is actually fully loaded
        // This prevents the canvas from stuttering/flashing black!
        if (canvas && ctx && img && img.complete && img.naturalWidth > 0) {
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.width;
            const ih = img.height;

            const r = Math.max(cw / iw, ch / ih);
            const nw = iw * r;
            const nh = ih * r;
            const cx = (cw - nw) / 2;
            const cy = (ch - nh) / 2;

            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(img, cx, cy, nw, nh);
        }
    };

    // Auto-play loop
    useEffect(() => {
        if (images.length === 0) return;
        
        const frameInterval = 1000 / fps;

        const loop = (timestamp: number) => {
            if (!lastDrawTimeRef.current) lastDrawTimeRef.current = timestamp;
            const elapsed = timestamp - lastDrawTimeRef.current;

            if (elapsed > frameInterval) {
                const nextFrame = (currentFrameRef.current + 1) % images.length;
                
                // Smart "Buffering": Only advance the animation if the next frame has finished downloading.
                if (images[nextFrame] && images[nextFrame].complete) {
                    currentFrameRef.current = nextFrame;
                    drawFrame(currentFrameRef.current);
                }
                
                lastDrawTimeRef.current = timestamp - (elapsed % frameInterval);
            }

            animationRef.current = requestAnimationFrame(loop);
        };

        animationRef.current = requestAnimationFrame(loop);

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
        <div ref={containerRef} className={`w-full h-full relative bg-[#020202] ${className}`}>
            {/* 1. Instant Poster Image: The browser native <img> tag loads the first frame instantly on DOM load */}
            <img 
                src={posterSrc} 
                alt="Robot Sequence Start" 
                className="absolute inset-0 block w-full h-full object-cover"
                // @ts-ignore
                fetchpriority="high"
            />
            
            {/* 2. Animation Canvas: Sits on top of the static poster and smoothly begins playing when ready */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block w-full h-full object-cover"
            />
        </div>
    );
};

export default AutoImageSequence;
