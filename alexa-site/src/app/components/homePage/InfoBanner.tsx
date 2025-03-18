'use client';
import { memo, useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
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
        description: 'Em todos os produtos',
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

const MobileCarousel = memo(function MobileCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    return (
        <div className="embla" ref={ emblaRef }>
            <div className="embla__container  ">
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

MobileCarousel.displayName = 'MobileCarousel';


export default function InfoBanner2() {

    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
            
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    if (isMobile === null) {
        return (
            <div className="bg-gray-100 py-4 px-6 w-full">
                <div className="max-w-6xl mx-auto">
                    <div className="h-16 bg-skeleton animate-pulse rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 py-4 px-6 w-full">
            { isMobile ? (
                <MobileCarousel />
            ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300">
                    { BANNER_INFO.map((info, index) => (
                        <InfoItem key={ index } { ...info } />
                    )) }
                </div>
            ) }
        </div>
    );
}

