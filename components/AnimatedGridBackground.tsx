
import React, { useEffect, useRef } from 'react';

const AnimatedGridBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        // Hacker Terminal State
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const rows = Math.ceil(height / fontSize);

        // Matrix/Log content
        const hexChars = '0123456789ABCDEF';
        const operations = ['ENCRYPT', 'DECRYPT', 'BYPASS', 'OVERRIDE', 'ACCESS', 'PROXY', 'DAEMON', 'KERNEL', 'BUFFER'];

        const logs: { text: string, color: string, alpha: number }[] = [];
        const maxLogs = rows + 5;
        let frameCount = 0;

        const resize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', resize);

        const generateLog = () => {
            const type = Math.random() > 0.7 ? 'HEX' : 'OP';
            if (type === 'HEX') {
                let gl = '0x';
                for (let i = 0; i < 8; i++) gl += hexChars[Math.floor(Math.random() * 16)];
                gl += ' ';
                for (let i = 0; i < 8; i++) gl += hexChars[Math.floor(Math.random() * 16)];
                return {
                    text: `MEMADDR_${gl} :: [ALLOCATED]`,
                    color: '#0ea5e9', // Sky blue
                    alpha: 1
                };
            } else {
                const op = operations[Math.floor(Math.random() * operations.length)];
                const status = Math.random() > 0.1 ? 'OK' : 'ERR';
                const color = status === 'OK' ? '#22c55e' : '#ef4444'; // Green or Red
                return {
                    text: `>> EXEC_PROC: ${op}_V${Math.floor(Math.random() * 9)}.0 // STATUS: ${status}`,
                    color: color,
                    alpha: 1
                };
            }
        };

        // Pre-fill
        for (let i = 0; i < maxLogs; i++) {
            logs.push(generateLog());
        }

        const animate = () => {
            ctx.fillStyle = '#02040a'; // Deep black/blue
            ctx.fillRect(0, 0, width, height);

            ctx.font = `bold ${fontSize}px "Courier New", monospace`;

            // Draw Grid Overlay
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
            ctx.lineWidth = 1;
            const gridSize = 60;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }

            // Draw Logs
            logs.forEach((log, index) => {
                const y = (index + 1) * (fontSize + 6);
                ctx.fillStyle = log.color;
                ctx.globalAlpha = log.alpha;

                // Random glitch effect
                const xOffset = Math.random() > 0.98 ? (Math.random() * 10 - 5) : 20;

                ctx.fillText(log.text, xOffset, y);
            });
            ctx.globalAlpha = 1;

            // Scroll logic
            frameCount++;
            if (frameCount % 4 === 0) { // Speed of scroll
                logs.shift();
                logs.push(generateLog());
            }

            // Scanline effect
            const scanY = (frameCount * 2) % height;
            ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
            ctx.fillRect(0, scanY, width, 4);

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className={`w-full h-full bg-[#02040a] ${className}`} />;
};

export default AnimatedGridBackground;
