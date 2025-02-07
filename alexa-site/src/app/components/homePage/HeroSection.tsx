// src/app/components/homePage/HeroSection.tsx
'use client';

import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import heroBannerLarge from '@/../public/heroBannerLarge.png';
import bigHeroLogo from '@/../public/bigHeroLogo2.png';

export default function HeroSection() {
    const isSmallScreen = useMediaQuery({ minWidth: 10, maxWidth: 640 });

    return (
        <section className="relative w-full">
            { /* Container principal com altura fixa para desktop */ }
            <div className="relative w-full h-[30vh] md:h-[50vh] bg-skeleton">
                <Image
                    className="object-cover"
                    src={ heroBannerLarge }
                    alt="Banner Principal Alexa Semijoias"
                    priority
                    sizes='3000px'
                    quality={ 100 }
                    fill
                    placeholder="blur"
                    blurDataURL={ heroBannerLarge.blurDataURL }
                />
                
                { /* Container do logo centralizado */ }
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[90%] md:w-[60%] lg:w-[50%] aspect-[3/1]">
                        <Image
                            className="object-contain"
                            src={ bigHeroLogo }
                            alt="Logo Alexa Semijoias"
                            priority
                            sizes="(max-width: 640px) 90vw, (max-width: 1300px) 60vw, 50vw"
                            quality={ isSmallScreen ? 30 : 100 }
                            fill
                            placeholder="blur"
                            blurDataURL={ bigHeroLogo.blurDataURL }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
