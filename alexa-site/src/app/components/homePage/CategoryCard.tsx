import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import blankImage from '@/../public/blankImage.jpg';

export default function CategoryCard({ category }: { category: string }) {
    return (
        <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
            <CardContent className="p-0 relative aspect-square">
                <Image
                    src={ blankImage }
                    alt={ category }
                    className="w-full h-full object-cover"
                    sizes='3000px'
                />
            </CardContent>
            <div className="p-4 text-center bg-[#C48B9F]">
                <h3 className="font-semibold text-xl text-white">
                    { category }
                </h3>
            </div>
        </Card>
    );
}