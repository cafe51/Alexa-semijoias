'use client';
import { memo } from 'react';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { Truck, CreditCard, Shield } from 'lucide-react';


const BANNER_INFO = [
    {
        icon: <Truck className="w-6 h-6" />,
        title: 'Frete Acessível',
        description: 'Enviamos para todo o Brasil',
    },
    {
        icon: <CreditCard className="w-6 h-6" />,
        title: '6x sem juros',
        description: 'Em todas peças',
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: 'Compre com segurança',
        description: 'Site 100% protegido',
    },
] as const;

interface InfoItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const InfoItem = memo(({ icon, title, description }: InfoItemProps) => (
    <div className="flex items-center gap-3 justify-center">
        <div className="text-gray-700">
            { icon }
        </div>
        <div className="text-center sm:text-left">
            <h3 className="font-semibold text-sm sm:text-base">{ title }</h3>
            <p className="text-xs sm:text-sm text-gray-600">{ description }</p>
        </div>
    </div>
));

InfoItem.displayName = 'InfoItem';

const InfoCarousel = memo(function MobileCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'center' }, [AutoScroll({
        playOnInit: true, stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
    })]);

    return (
        <div className="emblaInfoBanner md:flex md:items-center md:justify-center" ref={ emblaRef }>
            <div className="embla__container md:w-1/2">
                {
                    BANNER_INFO.map((info, index) => {

                        return (
                            <div className="flex-none basis-full max-w-full py-4 px-6 bg-gray-100" key={ index }>
                                <InfoItem key={ index } { ...info } />
                            </div>
                        );
                    })
                }

            </div>
        </div>
    );
});

InfoCarousel.displayName = 'InfoCarousel';


export default function InfoBanner2() {
    return (
        <div className="bg-gray-100 py-4 px-6 w-full">
            <InfoCarousel />
        </div>
    );
}

