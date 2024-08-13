//app/components/AdminHeader.tsx

'use client';
import { useEffect, useState } from 'react';
// import { FaRegUser } from 'react-icons/fa';
import { IoHomeSharp } from 'react-icons/io5';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { FaTag } from 'react-icons/fa6';

const AdminHeader = () => {
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

    const size = isScrolled ? 20 : 32;
    
    return (
        <header id="japhe" className={ `primColor fixed w-full transition-all duration-500 z-50  ${opacity}` } data-testid='full-header'>
            <div className={ `flex justify-between items-center px-8 md:px-16 ${height} md:py-0 w-full` }>
                <div className='flex justify-evenly  w-full'>
                    <IoHomeSharp className='' size={ size }/>
                    <MdOutlineAttachMoney className='' size={ size }/>
                    <FaTag className='' size={ size }/>
                </div>
            </div>
        </header>


    );
};

export default AdminHeader;
