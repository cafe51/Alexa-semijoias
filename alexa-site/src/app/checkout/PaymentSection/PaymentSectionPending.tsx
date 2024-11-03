// app/checkout/PaymentSection/PaymentSectionPending.tsx

export default function PaymentSectionPending() {
    return(

        <section className='flex flex-col w-full bg-gray-100 border-gray-200 p-2 border-2 rounded-lg px-6 md:*:text-2xl'>
            <div className='flex flex-col p-2'>
                <p className="font-bold text-gray-500">Forma de pagamento</p>
                <div className='flex gap-1'>
                    <p className= 'text-gray-400'>Aguardando seleção de frete</p>
                </div>
            </div>

        </section>
    );
}