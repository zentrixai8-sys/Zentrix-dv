import React, { useEffect, useRef, useState } from 'react';

interface ScrollImageSequenceProps {
    src: string; // Base path for images (e.g., "/video-frames/")
    frameCount: number; // Total number of frames (e.g., 192)
    startFrame?: number;
    className?: string;
    scrollDistance?: number; // Distance in pixels to complete the animation
    onProgress?: (progress: number) => void;
}

const ScrollImageSequence: React.FC<ScrollImageSequenceProps> = ({
    src,
    frameCount,
    startFrame = 1,
    className = "",
    scrollDistance = 3000,
    onProgress
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

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
                if (onProgress) {
                    onProgress(loaded / frameCount);
                }
            };
            img.onerror = (e) => {
                console.error(`Failed to load image: ${img.src}`, e);
            };
            imgArray.push(img);
        }
        setImages(imgArray);
        console.log(`Started loading ${frameCount} images from ${src}`);
    }, [src, frameCount, startFrame]);

    // Draw frame
    const drawFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = images[index];

        if (canvas && ctx && img && img.complete) {
            // Calculate dimensions
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.width;
            const ih = img.height;

            // Check if mobile (width < 768px)
            const isMobile = cw < 768;

            // Determine dimensions
            let nw, nh, cx, cy;

            if (isMobile) {
                // Mobile: Force Stretch to Fill (Reels style, no bars, no crop)
                // This distorts aspect ratio but satisfies "Full Screen" + "No Crop"
                nw = cw;
                nh = ch;
                cx = 0;
                cy = 0;
            } else {
                // Desktop: Cover (Math.max) for immersive feel
                const r = Math.max(cw / iw, ch / ih);
                nw = iw * r;
                nh = ih * r;
                cx = (cw - nw) / 2;
                cy = (ch - nh) / 2;
            }

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

    console.log("ScrollImageSequence v2 active");

    // Scroll listener
    useEffect(() => {
        let rafId: number;

        const handleScroll = () => {
            if (!containerRef.current) return;

            // Using requestAnimationFrame for smooth performance on mobile
            rafId = requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const animationScrollDistance = scrollDistance;
                const progress = Math.min(Math.max(scrollY / animationScrollDistance, 0), 1);

                const frameIndex = Math.min(
                    Math.floor(progress * (frameCount - 1)),
                    frameCount - 1
                );

                setCurrentFrameIndex(frameIndex);
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', () => drawFrame(currentFrameIndex));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', () => drawFrame(currentFrameIndex));
            cancelAnimationFrame(rafId);
        };
    }, [frameCount, currentFrameIndex, scrollDistance]);

    // Redraw when frame changes or images load
    useEffect(() => {
        if (images.length > 0) {
            drawFrame(currentFrameIndex);
        }
    }, [currentFrameIndex, images, loadedCount]);

    // Handle canvas sizing
    useEffect(() => {
        const resizeCanvas = () => {
            if (canvasRef.current && containerRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
                drawFrame(currentFrameIndex);
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    return (
        <div ref={containerRef} className={`w-full h-full ${className}`}>
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover"
            />
        </div>
    );
};

export default ScrollImageSequence;
