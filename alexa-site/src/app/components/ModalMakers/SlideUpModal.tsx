import { useEffect } from 'react';
import ModalHeader from './ModalHeader';

// Interface para o componente principal do modal
interface SlideUpModalProps {
    closeModelClick?: () => void;
    title?: string;
    children: React.ReactNode;
    isOpen: boolean;
}


export default function SlideUpModal({ children, closeModelClick, title, isOpen }: SlideUpModalProps) {
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

    // Função para fechar o modal ao clicar fora dele
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeModelClick) {
            closeModelClick();
        }
    };

    return (
        <>
            { isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={ handleBackdropClick }
                ></div>
            ) }
            <div
                className={ `fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ${
                    isOpen ? 'translate-y-0' : 'translate-y-full'
                }` }
            >
                <div className="bg-white p-6 rounded-t-md shadow-md w-full max-h-screen overflow-hidden">
                    <ModalHeader closeModelClick={ closeModelClick } title={ title } />
                    <div className="overflow-auto max-h-[calc(100vh-200px)] w-full">
                        { children }
                    </div>
                </div>
            </div>
        </>
    );
}
