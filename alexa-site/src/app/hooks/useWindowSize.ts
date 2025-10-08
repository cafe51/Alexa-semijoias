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

            // Só atualiza se o screenSize realmente mudou
            setWindowSize(prev => {
                if (prev.screenSize !== screenSize) {
                    return { width, screenSize };
                }
                return prev;
            });
        }

        // Debounce para evitar múltiplas chamadas
        let timeoutId: NodeJS.Timeout;
        function debouncedHandleResize() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 150);
        }

        window.addEventListener('resize', debouncedHandleResize);
        handleResize(); // Chamada inicial

        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    return windowSize;
};
