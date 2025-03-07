// app/checkout/OrderSummarySection/SummaryCard.tsx
import { CartHistoryType } from '@/app/utils/types';
import Image from 'next/image';
import blankImage from '../../../../public/blankImage.png';
import toTitleCase from '@/app/utils/toTitleCase';
import CartCardPrice from '@/app/carrinho/CartCardPrice';
import DisplayCustomProperties from '@/app/components/DisplayCustomProperties';


export default function SummaryCard({ produto }: { produto: CartHistoryType }) {

    const { quantidade, name, image, value, customProperties } = produto;

    // const precoCheio = formatPrice(promotionalPrice > 0 ? (promotionalPrice * quantidade) : (price * quantidade));

    return (
        <div className="flex items-start justify-start border-b py-2 gap-2">
            { /* <img src={ productCart.image } alt={ productCart.name } className="w-16 h-16 object-cover mr-4 aspect-[4/5]" /> */ }
            <div className="relative w-[clamp(60px,12vw,120px)] aspect-[4/5] flex-shrink-0">
                <Image
                    src={ image ? image : blankImage }
                    alt="Foto da peça"
                    priority
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, (max-width: 1024px) 220px, 220px"
                />
            </div>
            <div className="flex-1 ">
                <p className="font-bold bg-gray-200">{ toTitleCase(name) }</p>
                { customProperties &&  <DisplayCustomProperties customProperties={ customProperties } /> }
                <p>Quantidade: <span className='font-bold'>{ quantidade }</span></p>
                <CartCardPrice quantidade={ quantidade } value={ value } />
            </div>
        </div>
    );
}