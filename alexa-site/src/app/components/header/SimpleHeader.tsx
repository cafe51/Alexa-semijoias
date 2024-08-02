//app/components/SimpleHeader.tsx

'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SimpleHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
  
    const handleScroll = () => {
        const offset = window.scrollY;
        offset > 100 ? setIsScrolled(true) : setIsScrolled(false);
    };
  
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, []);

    const opacity = isScrolled ? 'primColorTransparent' : '';
    const height = isScrolled ? 'py-2' : 'py-6';
    
    return (
        <header id="japhe" className={ `primColor fixed w-full transition-all duration-500 z-50  ${opacity} flex justify-center items-center` } data-testid='simple-header'>
            <div className={ `flex justify-center items-center px-8 md:px-16 ${height} md:py-0` }>
                <Link className="text-2xl font-bold"  href={ '/' }>Alexa</Link>
            </div>
        </header>


    );
};

export default SimpleHeader;
