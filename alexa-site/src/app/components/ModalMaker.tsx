import { PiXBold } from 'react-icons/pi';

interface ModalHeaderProps {
    closeModelClick?: () => void;
    title?: string;
}

interface ModalMakerProps extends ModalHeaderProps {
    children: React.ReactNode;
}

function ModalHeader({ title, closeModelClick }: ModalHeaderProps) {
    return (
        <div className="flex justify-between mb-4 min-h-7 w-full">
            <div className='self-center w-full'>
                <h3 className="text-lg font-bold">{ title }</h3>
            </div>
            <button
                className="px-2 rounded-md bg-gray-200"
                onClick={ closeModelClick }
            >
                <PiXBold />
            </button>
        </div>
    );
}

export default function ModalMaker({ children, closeModelClick, title }: ModalMakerProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full">
            <div className="bg-white p-6 rounded-md shadow-md max-w-xs w-full max-h-screen relative overflow-hidden">
                <ModalHeader closeModelClick={ closeModelClick } title={ title }/>
                <div className="overflow-auto max-h-[calc(100vh-200px)] w-full">
                    { children }
                </div>
            </div>
        </div>
    );
}