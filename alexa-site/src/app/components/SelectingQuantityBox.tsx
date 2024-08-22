interface SelectingQuantityBoxProps {
    quantity: number;
    removeOne: () => void;
    addOne: () => void;
    stock: number,

}

export default function SelectingQuantityBox({ quantity, removeOne, addOne, stock } : SelectingQuantityBoxProps) {
    return (
        <div className="flex items-center secColor rounded">
            <button
                className="px-4 py-1 text-white text-lg primColor rounded hover:bg-pink-400 border-solid border-2 borderColor disabled:bg-pink-200"
                onClick={ (quantity <= 1) ? (() => null) : removeOne }
                disabled={ quantity <= 1 }
            >
        -
            </button>
            <span className="px-4 p-1 bg-white gray-300 border-solid border-2 borderColor border-x-0" >
                { quantity }
            </span>
            <button
                className="px-4 py-1  text-white text-lg primColor rounded hover:bg-pink-400 border-solid border-2 borderColor disabled:bg-pink-200"
                onClick={ (quantity >= stock) ? (() => null) : addOne }
                disabled={ quantity >= stock }
            >
        +
            </button>
        </div>
    );
}