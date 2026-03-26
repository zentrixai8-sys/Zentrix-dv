
import React from 'react';
import { Zap } from 'lucide-react';
import ScrollImageSequence from './ScrollImageSequence';
import WalkingAIAgent from './WalkingAIAgent';

const IntroSequence: React.FC = () => {
    const [isMobile, setIsMobile] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const distance = isMobile ? 2500 : 4000;

    const handleProgress = (progress: number) => {
        if (progress > 0.1 && !isLoaded) {
            setIsLoaded(true);
        }
    };

    return (
        <div className="relative bg-[#020202] overflow-hidden" style={{ height: `calc(100vh + ${distance}px)` }}>
            {/* Immersive Tech Background */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '60px 60px' }}></div>
            </div>

            <div className="sticky top-0 h-screen sm:h-[100dvh] w-full flex items-center justify-center overflow-hidden z-10 p-6 md:p-20">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full max-w-7xl items-center gap-10 md:gap-20">
                    
                    {/* Left Side: 3D Hologram Video */}
                    <div className={`relative z-20 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <div className="hologram-3d relative w-full aspect-video md:aspect-[4/3] bg-zinc-900/40 backdrop-blur-2xl rounded-[1.5rem] overflow-hidden border border-cyan-500/30">
                            {/* Reflection effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-white/5 pointer-events-none z-10"></div>
                            
                            <ScrollImageSequence
                                src="/video-frames/"
                                frameCount={192}
                                className="w-full h-full object-cover opacity-80"
                                scrollDistance={distance}
                                onProgress={handleProgress}
                            />
                            
                            {/* Tracking UI */}
                            <div className="absolute bottom-4 left-6 flex items-center gap-2 mono-space text-[8px] text-cyan-400/50 z-20">
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
                                <span className="tracking-[0.2em]">ROBOT_OS_INITIALIZED_SCAN...</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Walking AI Agent */}
                    <div className="relative h-full w-full flex items-center justify-center md:justify-start">
                        {isLoaded && <WalkingAIAgent />}
                    </div>
                </div>

                {!isLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020202] z-50">
                        <div className="w-24 h-[1px] bg-cyan-900/30 mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-cyan-500 animate-loading-bar"></div>
                        </div>
                        <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.6em] animate-pulse">
                            Loading Neural Interface
                        </div>
                    </div>
                )}

                {/* Overlay to fade out to black at the end */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020202] pointer-events-none z-30"></div>

                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-cyan-400/30 animate-bounce text-[9px] tracking-[0.5em] uppercase transition-opacity duration-1000 z-40 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    Scroll to Engage AI
                </div>
            </div>
        </div>
    );
};

export default IntroSequence;
