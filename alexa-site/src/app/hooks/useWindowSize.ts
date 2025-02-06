// useWindowSize.ts
'use client';
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number | undefined;
  screenSize: 'mobile' | 'medium' | 'desktop';
}

export const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: undefined,
        screenSize: 'mobile',
    });

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            let screenSize: 'mobile' | 'medium' | 'desktop';
            
            if (width < 640) { // sm breakpoint
                screenSize = 'mobile';
            } else if (width < 1024) { // lg breakpoint
                screenSize = 'medium';
            } else {
                screenSize = 'desktop';
            }

            setWindowSize({
                width: width,
                screenSize: screenSize,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};
