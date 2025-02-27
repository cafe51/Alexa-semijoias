export default function OutOfStockLayer({ outOfStock }: { outOfStock: boolean }) {
    return (
        outOfStock ?
            (
                <div className="absolute top-0 right-0 w-52 h-52 overflow-hidden z-40">
                    <div className="bg-[#C48B9F] bg-opacity-100 text-white font-bold py-1 text-center transform rotate-45 translate-y-8 translate-x-6 w-60">
                    ESGOTADO
                    </div>
                </div>
            )
            : (<></>)
    
    );
}