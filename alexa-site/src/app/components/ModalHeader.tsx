import { PiXBold } from 'react-icons/pi';

interface ModalHeaderProps {
    closeModelClick?: () => void;
    title?: string;
}

export default function ModalHeader({ title, closeModelClick }: ModalHeaderProps) {
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