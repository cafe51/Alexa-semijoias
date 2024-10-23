import { Card, CardContent } from '@/components/ui/card';
import blankImage from '@/../public/blankImage.jpg';
import Image from 'next/image';

export default function HomeProductCard({ product }: { product: number }){
    return (
        <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col">
            <CardContent className="p-0 relative aspect-square">
                <Image
                    src={ blankImage }
                    alt={ `Produto ${product}` }
                    className="w-full h-full object-cover"
                    sizes='3000px'
                />
            </CardContent>
            <div className="p-4 flex-grow">
                <h3 className="font-semibold text-base sm:text-lg mb-2">Joia Elegante { product }</h3>
                <p className="text-[#C48B9F] font-bold text-sm sm:text-base">R$ { (1000 * product).toLocaleString('pt-BR') }</p>
            </div>
        </Card>
    );
}