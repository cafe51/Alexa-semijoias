import React, { useState, useEffect } from 'react';
import { Truck, CreditCard, Shield } from 'lucide-react';

const InfoBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const bannerInfo = [
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
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isMobile) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % bannerInfo.length);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [isMobile]);

    const InfoItem = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) => (
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

    return (
        <div className="bg-gray-100 py-4 px-6 w-full">
            { isMobile ? (
                <div className="flex justify-center">
                    <InfoItem { ...bannerInfo[currentIndex] } />
                </div>
            ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    { bannerInfo.map((info, index) => (
                        <InfoItem key={ index } { ...info } />
                    )) }
                </div>
            ) }
      
            { isMobile && (
                <div className="flex justify-center mt-3 gap-2">
                    { bannerInfo.map((_, index) => (
                        <button
                            key={ index }
                            className={ `h-2 w-2 rounded-full ${
                                currentIndex === index ? 'bg-gray-600' : 'bg-gray-300'
                            }` }
                            onClick={ () => setCurrentIndex(index) }
                        />
                    )) }
                </div>
            ) }
        </div>
    );
};

export default InfoBanner;