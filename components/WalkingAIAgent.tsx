
import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

const WalkingAIAgent: React.FC = () => {
    const [phase, setPhase] = useState<'idle' | 'walking-in' | 'waving' | 'walking-out'>('idle');
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        // Start walking in after a short delay
        const timer1 = setTimeout(() => setPhase('walking-in'), 500);
        
        // After walking in (2s animation), start waving
        const timer2 = setTimeout(() => {
            setPhase('waving');
            setShowText(true);
        }, 2500);

        // After waving for 2.5s, walk out
        const timer3 = setTimeout(() => {
            setShowText(false);
            setPhase('walking-out');
        }, 5000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    const getAnimationClass = () => {
        switch (phase) {
            case 'walking-in': return 'animate-character-walk-in';
            case 'walking-out': return 'animate-character-walk-out';
            default: return '';
        }
    };

    return (
        <div className={`relative w-80 h-[500px] flex justify-center items-center ${getAnimationClass()}`}>
            {/* Speech Bubble */}
            {showText && (
                <div className="absolute top-10 right-4 animate-speech-bubble z-40">
                    <div className="relative bg-white/10 backdrop-blur-xl text-white px-5 py-3 rounded-2xl rounded-br-none text-sm font-bold tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.3)] border border-cyan-400/50">
                        HI! I'M ZENTRIXS AI
                        <div className="absolute bottom-[-8px] right-0 w-4 h-4 bg-white/10 backdrop-blur-xl border-b border-r border-cyan-400/50 rounded-br-md clip-path-[polygon(100%_0,0_0,100%_100%)]"></div>
                    </div>
                </div>
            )}

            {/* Spline 3D Scene Wrapper - Using wave animation on the inner container if needed */}
            <div className={`w-full h-full transform scale-125 ${phase === 'waving' ? 'animate-wave' : ''}`}>
                <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
            </div>

            {/* Shadow beneath character */}
            <div className="absolute bottom-10 w-48 h-6 bg-cyan-900/40 blur-2xl rounded-full z-0 pointer-events-none"></div>
        </div>
    );
};

export default WalkingAIAgent;
