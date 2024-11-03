import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';

const FullHeader: React.FC = () => {
    const [isMobile, setIsMobile] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const router = useRouter();
      
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const headerHeight = Math.max(60, 100 - scrollPosition * 0.2);
    const headerOpacity = Math.max(0.8, 1 - scrollPosition * 0.002);

    const headerMobileStyle = 'flex items-center justify-between';
    const headerDesktopStyle = 'shadow-lg';

    return (
        <>
            <header
                className={ `fixed top-0 left-0 right-0 px-4 z-50 bg-white  ${ isMobile ? headerMobileStyle : headerDesktopStyle }` }
                style={ {
                    height: isMobile ? `${headerHeight}px` : 'auto',
                    backgroundColor: isMobile ? `rgba(255,255,255, ${headerOpacity})` : 'white',
                } }
            >

                <div className="cursor-pointer py-4 w-full flex items-center justify-center" onClick={ () => router.push('/') }>
                    <Logo isMobile={ isMobile ? true : false } />
                </div>

            </header>
            { /* Espaçador para empurrar o conteúdo para baixo do header fixo */ }
            <div 
                style={ { 
                    height: isMobile ? `${headerHeight + 10}px` : `${headerHeight + 64}px`,
                } } 
            />
        </>
    );
};

export default FullHeader;