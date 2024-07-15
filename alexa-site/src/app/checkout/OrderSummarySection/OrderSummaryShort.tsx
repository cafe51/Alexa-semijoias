interface OrderSummaryShortProps {
    setShowFullOrderSummary: (option: boolean) => void;
}

export default function OrderSummaryShort({ setShowFullOrderSummary }: OrderSummaryShortProps) {
    return (
        <section
            className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded'
            onClick={ () => { setShowFullOrderSummary(true); } }
        >
            <div className='flex justify-between w-full'>
                <p>Ver resumo</p>
                <p>R$ 156,00</p>
            </div>
        </section>
    );
}