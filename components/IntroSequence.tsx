import React from 'react';
import ScrollImageSequence from './ScrollImageSequence';

const IntroSequence: React.FC = () => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const distance = isMobile ? 2500 : 4000;

    return (
        <div className="relative bg-[#020202]" style={{ height: `calc(100vh + ${distance}px)` }}>
            <div className="sticky top-0 h-screen sm:h-[100dvh] w-full overflow-hidden">
                <ScrollImageSequence
                    src="/video-frames/"
                    frameCount={192}
                    className="w-full h-full"
                    scrollDistance={distance}
                />

                {/* Overlay to fade out to black at the end */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020202] pointer-events-none"></div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce text-xs tracking-widest uppercase">
                    Scroll to Initialize
                </div>
            </div>
        </div>
    );
};

export default IntroSequence;
