import { FaTrashAlt } from 'react-icons/fa';

interface RemoveProductVariationButtonProps {
    onClick?: () => void;
}

export default function RemoveProductVariationButton({ onClick }: RemoveProductVariationButtonProps) {
    return(
        <div className=''>
            <button className='text-red-500' onClick={ onClick }>
                <FaTrashAlt size={ 24 }/>
            </button>
        </div>
    );
}