'use client';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { FiShoppingCart } from 'react-icons/fi';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
  
    const handleScroll = () => {
        const offset = window.scrollY;
        offset > 100 ? setIsScrolled(true) : setIsScrolled(false);
    };
  
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, []);

    const opacity = isScrolled ? 'bg-opacity-80' : '';
    
    return (
        <header id="japhe" className={ `primColor fixed w-full transition-all duration-500 z-50  ${opacity}` }>
            <div className="flex justify-between items-center px-8 md:px-16 py-6 md:py-0">
                {
                    !isMenuOpen
                        ?
                        <button
                            className="md:hidden block"
                            onClick={ () => setIsMenuOpen(!isMenuOpen) }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M6 18L18 6M6 6l12 12" />
                        </svg>
                }
                <Navbar isMenuOpen={ isMenuOpen } setIsMenuOpen={ setIsMenuOpen } />
                <div className=''>
                    <a 
                        href="#japhe" 
                        className="text-2xl font-bold" 
                        onClick={ (e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        } }
                    >
                        Alexa
                    </a>
                </div>
                <div className=''>
                    <a 
                        href="#japhe" 
                        className="text-2xl font-bold" 
                        onClick={ (e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        } }
                    >
                        <FiShoppingCart size={ 24 }/>

                        
                    </a>
                </div>
                
            </div>
            
        </header>


    );
};

export default Header;