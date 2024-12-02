//app/components/AdminHeader.tsx

'use client';
import { useEffect, useState } from 'react';
import { IoHomeSharp } from 'react-icons/io5';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { FaTag } from 'react-icons/fa6';
import { FiLogOut } from 'react-icons/fi';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { useRouter } from 'next/navigation';

const AdminHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isAdmin, isLoading } = useAuthContext();
    const { logout } = useLogout();
    const router = useRouter();
  
    const handleScroll = () => {
        const offset = window.scrollY;
        offset > 100 ? setIsScrolled(true) : setIsScrolled(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        console.log('AdminHeader - user:', user);
        console.log('AdminHeader - isAdmin:', isAdmin);
        console.log('AdminHeader - isLoading:', isLoading);
        if (!isLoading && (!user || !isAdmin)) {
            router.push('/');
        }
    }, [user, isAdmin, isLoading, router]);

    const handleLogout = async() => {
        await logout();
        router.push('/');
    };

    const opacity = isScrolled ? 'primColorTransparent' : '';
    const height = isScrolled ? 'py-2' : 'py-6';
    const size = isScrolled ? 20 : 32;
    
    if (isLoading) return null; // ou um componente de carregamento
    if (!user || !isAdmin) return null;

    return (
        <header className={ `primColor fixed w-full transition-all duration-500 z-50 ${opacity} mb-20` } data-testid='full-header'>
            <div className={ `flex justify-between items-center px-8 md:px-16 ${height} md:py-0 w-full` }>
                <div className='flex justify-evenly w-full'>
                    <IoHomeSharp className='cursor-pointer' size={ size } onClick={ () => router.push('/admin') }/>
                    <MdOutlineAttachMoney className='cursor-pointer' size={ size } onClick={ () => router.push('/admin/vendas') }/>
                    <FaTag className='cursor-pointer' size={ size } onClick={ () => router.push('/admin/produtos') }/>
                    <FiLogOut className='cursor-pointer' size={ size } onClick={ handleLogout }/>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
