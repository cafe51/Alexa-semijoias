import React, { useState, useEffect } from 'react';
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

const InfoItem = ({ icon, title, description }: InfoItemProps) => (
    <div className="flex items-center gap-3 justify-center">
        <div className="text-gray-700">
            { icon }
        </div>
        <div className="text-center sm:text-left">
            <h3 className="font-semibold text-sm sm:text-base">{ title }</h3>
            <p className="text-xs sm:text-sm text-gray-600">{ description }</p>
        </div>
    </div>
);

const MobileCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % BANNER_INFO.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="flex justify-center">
                <InfoItem { ...BANNER_INFO[currentIndex] } />
            </div>
            <div className="flex justify-center mt-3 gap-2">
                { BANNER_INFO.map((_, index) => (
                    <button
                        key={ index }
                        className={ `h-2 w-2 rounded-full transition-colors duration-300 ${
                            currentIndex === index ? 'bg-gray-600' : 'bg-gray-300'
                        }` }
                        onClick={ () => setCurrentIndex(index) }
                        aria-label={ `Ir para slide ${index + 1}` }
                    />
                )) }
            </div>
        </>
    );
};

const InfoBanner = () => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Renderiza um placeholder enquanto detecta o tamanho da tela
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
};

export default InfoBanner;
