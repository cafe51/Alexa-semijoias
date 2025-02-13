// app/checkout/DeliveryPriceSection/DeliveryPriceSectionFilled.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/app/utils/formatPrice';

interface DeliveryPriceSectionFilledProps {
    type: string;
    price: number;
    term: number;
    handleOptionChange: () => void;
}


export default function DeliveryPriceSectionFilled({
    handleOptionChange,
    price,
    term,
    type,
} : DeliveryPriceSectionFilledProps) {


    return(
        <Card className="border-[#F8C3D3] shadow-md rounded">
            <CardHeader className="secColor text-[#333333]">
                <CardTitle className="flex justify-between">
                    <span className="text-xl">FRETE</span>

                    <p className='text-[#D4AF37] text-sm w-full text-end md:text-lg cursor-pointer' onClick={ handleOptionChange }>
                    Alterar frete
                    </p>    
                </CardTitle>
    
            </CardHeader>
            <CardContent className="pt-4 md:text-lg">
                <div className='flex flex-col p-2'>
                    <div className='flex gap-2'>
                        <span className='font-semibold'>{ type }</span>
                        <span> - </span>
                        <span>{ formatPrice(price) }</span>
                    </div>
                    <div className='flex gap-1'>

                        <p className= 'text-[#D4AF37]'>{ 'Até' }</p>
                        <span className="font-semibold" >{ term }</span>
                        <p className= 'text-[#D4AF37]'> { (term === 1 ? ' dia útil' : ' dias úteis') }</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}