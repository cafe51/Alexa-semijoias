// src/app/components/homePage/HeroSection.tsx
// Removemos o 'use client' porque esse componente é estático e não interage com o estado
import Image from 'next/image';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';
import bigHeroLogo from '@/../public/bigHeroLogo2.png';

export default function HeroSection() {
    return (
        <section className="relative w-full">
            { /* Container principal com altura fixa para desktop */ }
            <div className="relative w-[100%] h-[30vh] md:h-[50vh] bg-skeleton">
                <Image
                    className="object-cover"
                    src={ heroBannerLarge }
                    title="Banner Principal Alexa Semijoias"
                    alt="Banner Principal Alexa Semijoias"
                    priority
                    // Usamos "100vw" para informar que a imagem ocupa toda a largura da viewport
                    sizes="1000px"
                    quality={ 80 } // Se possível, teste reduzir um pouco esse valor (ex: 75) sem comprometer a qualidade visual
                    fill
                    placeholder="blur"
                    blurDataURL={ heroBannerLarge.blurDataURL }
                />
        
                { /* Container do logo centralizado */ }
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[90%] md:w-[60%] lg:w-[50%] aspect-[3/1]">
                        <Image
                            className="object-contain"
                            title="Logo Alexa Semijoias"
                            src={ bigHeroLogo }
                            alt="Logo Alexa Semijoias"
                            priority
                            sizes="(max-width: 640px) 90vw, (max-width: 1300px) 60vw, 50vw"
                            quality={ 100 }
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
