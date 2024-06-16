//app/components/FullHeader.tsx

'use client';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { FaRegUser } from 'react-icons/fa';
import SearchBar from './SearchBar';
import Link from 'next/link';
import CartIcon from './CartIcon';
import { useAuthContext } from '../hooks/useAuthContext';


const FullHeader = () => {
    const{ user } = useAuthContext();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [ pathLoginAccount, setPathLoginAccount] = useState('minha-conta');
  
    const handleScroll = () => {
        const offset = window.scrollY;
        offset > 100 ? setIsScrolled(true) : setIsScrolled(false);
    };

    useEffect(() => {
        console.log('bem vindo', user);
        if (!user) {
            try {
                setPathLoginAccount('login');
            } catch (e) {
                console.error('Invalid JSON in localStorage:', e);
            }
        } else {
            setPathLoginAccount('minha-conta');
        }
    }, [user]);

    
  
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, []);

    const opacity = isScrolled ? 'primColorTransparent' : '';
    const height = isScrolled ? 'py-2' : 'py-6';
    
    return (
        <header id="japhe" className={ `primColor fixed w-full transition-all duration-500 z-50  ${opacity}` }>
            <div className={ `flex justify-between items-center px-8 md:px-16 ${height} md:py-0` }>
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
                <Link className="text-2xl font-bold"  href={ '/' }>Alexa</Link>
                <div className='flex gap-4'>
                    <Link className=""  href={ `/${pathLoginAccount}` }><FaRegUser className='' size={ 24 } /></Link>
                    <CartIcon />
                </div>
            </div>
            <SearchBar />
            
        </header>


    );
};

export default FullHeader;





