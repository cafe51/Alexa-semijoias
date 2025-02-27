import ModalHeader from './ModalHeader';


interface ModalMakerProps {
    children: React.ReactNode;
    closeModelClick?: () => void;
    title?: string;
}



export default function ModalMaker({ children, closeModelClick, title }: ModalMakerProps) {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeModelClick) {
            closeModelClick();
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full px-4" onClick={ handleBackdropClick }>
            <div className="bg-white p-6 rounded-md shadow-md w-full md:w-2/3 lg:w-1/3 max-h-screen relative overflow-hidden">
                <ModalHeader closeModelClick={ closeModelClick } title={ title }/>
                <div className="overflow-auto max-h-[calc(100vh-200px)] w-full">
                    { children }
                </div>
            </div>
        </div>
    );
}