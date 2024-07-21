// app/checkout/AddressSection/AddressSectionPending.tsx

export default function AddressSectionPending() {
    return(

        <section className='flex flex-col w-full bg-gray-100 border-gray-200 p-2 border-2 rounded-lg px-6'>
            <div className='flex flex-col p-2'>
                <p className="font-bold text-gray-500">Endereço de entrega</p>
                <div className='flex gap-1'>
                    <p className= 'text-gray-400'>Aguardando preenchimento de dados cadastrais</p>
                </div>
            </div>

        </section>
    );
}