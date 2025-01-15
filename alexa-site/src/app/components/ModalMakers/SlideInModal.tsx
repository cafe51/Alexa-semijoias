import { useEffect, useState } from 'react';
import ModalHeader from './ModalHeader';

interface SlideInModalProps {
    closeModelClick?: () => void;
    title?: string;
    children: React.ReactNode;
    isOpen: boolean;
    slideDirection?: 'left' | 'right';
    fullWidth?: boolean;
}

export default function SlideInModal({ children, closeModelClick, title, isOpen, slideDirection = 'right', fullWidth = false }: SlideInModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setIsMounted(true), 50); // Inicia a animação
            document.body.style.overflow = 'hidden';
        } else {
            setIsMounted(false); // Inicia a animação de deslize para fora
            setTimeout(() => setShouldRender(false), 300); // Desmonta após a animação
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeModelClick) {
            closeModelClick();
        }
    };

    if (!shouldRender) return null;

    const slideInClass = isMounted ? 'translate-x-0' : (slideDirection === 'left' ? '-translate-x-full' : 'translate-x-full');

    return (
        <>
            <div
                className={ `fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}` }
                onClick={ handleBackdropClick }
            ></div>
            <div
                className={ `${fullWidth ? 'w-full' : 'md:w-1/3'} fixed inset-y-0 ${slideDirection === 'left' ? 'left-0' : 'right-0'} z-50 transform transition-transform duration-300 ${slideInClass}` }
            >
                <div className="bg-white p-0 rounded-l-md shadow-md w-full max-h-screen overflow-hidden h-screen">
                    <ModalHeader closeModelClick={ closeModelClick } title={ title } />
                    <div className="overflow-auto max-h-[calc(80vh)] w-full">
                        { children }
                    </div>
                </div>
            </div>
        </>
    );
}
