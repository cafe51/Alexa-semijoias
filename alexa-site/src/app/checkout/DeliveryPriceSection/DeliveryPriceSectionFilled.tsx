const type = 'PAC';
const price = 29.45;
const term = 22;

export default function DeliveryPriceSectionFilled() {
    return(

        <section className='flex flex-col w-full bg-green-50 text-green-700 border-green-200 p-2 border-2 rounded-lg px-6'>
            <div className='flex justify-between w-full'>
                <p className="font-bold text-green-700">FRETE</p>
                <p
                    className='text-blue-400 text-sm w-full text-end'
                >
                            Alterar frete
                </p>
            </div>
            <div className='flex flex-col p-2'>
                <div className='flex gap-2 font-extrabold'>
                    <span>{ type }</span>
                    <span> - </span>
                    <span>{ 'R$' + price.toFixed(2) }</span>
                </div>
                <div className='flex gap-1'>

                    <p className= 'text-green-700'>{ 'Até' }</p>
                    <span className="font-extrabold" >{ term }</span>
                    <p className= 'text-green-700'> { (term === 1 ? ' dia útil' : ' dias úteis') }</p>
                </div>
            </div>

        </section>
    );
}