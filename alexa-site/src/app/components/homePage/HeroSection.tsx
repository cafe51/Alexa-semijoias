'use client';
//src/app/components/homePage/HeroSection.tsx
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import heroBannerSmall from '@/../public/heroBannerSmall.png';
import heroBannerLarge from '@/../public/heroBannerLarge.png';
import heroBannerMedium from '@/../public/heroBannerMedium.png';
import bigHeroLogo from '@/../public/bigHeroLogo2.png';

export default function HeroSection() {
    // Hook para verificar tamanho da tela
    const isLargeScreen = useMediaQuery({ minWidth: 1300 });
    const isMediumScreen = useMediaQuery({ minWidth: 640, maxWidth: 1300 });

    // Define a imagem com base nos breakpoints de tela
    const backgroundImage = isLargeScreen
        ? heroBannerLarge
        : isMediumScreen
            ? heroBannerMedium
            : heroBannerSmall;

    return (
        <section className="relative w-full">
            { /* Container principal com altura fixa para desktop */ }
            <div className="relative w-full h-[30vh] md:h-[50vh] bg-skeleton">
                <Image
                    className="object-cover loading"
                    src={ backgroundImage }
                    alt="Banner Principal Alexa Semijoias"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1300px) 100vw, 1300px"
                    quality={ 90 }
                    fill
                    onLoad={ (event) => {
                        const img = event.target as HTMLImageElement;
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    } }
                />
                
                { /* Container do logo centralizado */ }
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[90%] md:w-[60%] lg:w-[50%] aspect-[3/1] ">
                        <Image
                            className="object-contain "
                            src={ bigHeroLogo }
                            alt="Logo Alexa Semijoias"
                            priority
                            sizes="(max-width: 640px) 90vw, (max-width: 1300px) 60vw, 50vw"
                            quality={ 90 }
                            fill
                            onLoad={ (event) => {
                                const img = event.target as HTMLImageElement;
                                img.classList.remove('loading');
                                img.classList.add('loaded');
                            } }
                        />
                    </div>
                </div>
            </div>
        </section>
        
    );
}
