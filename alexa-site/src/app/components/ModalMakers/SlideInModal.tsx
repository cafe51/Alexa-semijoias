import { useEffect } from 'react';
import ModalHeader from './ModalHeader';

interface SlideInModalProps {
    closeModelClick?: () => void;
    title?: string;
    children: React.ReactNode;
    isOpen: boolean;
    slideDirection?: 'left' | 'right';
    fullWidth?: boolean;
}


export default function SlideInModal({ children, closeModelClick, title, isOpen, slideDirection = 'right', fullWidth=false }: SlideInModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
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

    const slideInClass = isOpen ? 'translate-x-0' : (slideDirection === 'left' ? '-translate-x-full' : 'translate-x-full');

    return (
        <>
            { isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={ handleBackdropClick }
                ></div>
            ) }
            <div
                className={ `${ fullWidth ? 'w-full' : '' } fixed inset-y-0 ${slideDirection === 'left' ? 'left-0' : 'right-0'} z-50 transform transition-transform duration-300 ${slideInClass}` }
            >
                <div className="bg-white p-6 rounded-l-md shadow-md w-full max-h-screen overflow-hidden h-screen">
                    <ModalHeader closeModelClick={ closeModelClick } title={ title } />
                    <div className="overflow-auto max-h-[calc(80vh)] w-full">
                        { children }
                    </div>
                </div>
            </div>
        </>
    );
}
