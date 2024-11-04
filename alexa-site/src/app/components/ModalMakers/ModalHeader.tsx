import { PiXBold } from 'react-icons/pi';

interface ModalHeaderProps {
    closeModelClick?: () => void;
    title?: string;
}

export default function ModalHeader({ title, closeModelClick }: ModalHeaderProps) {
    return (
        <div className="flex justify-center w-full mb-4 min-h-7 ">
            <div className="">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold px-8 pt-4">{ title }</h3>
            </div>

            <button
                className="absolute top-4 right-4 px-2 rounded-md "
                onClick={ closeModelClick }
            >
                <PiXBold size={ 24 } />
            </button>
        </div>

    );
}