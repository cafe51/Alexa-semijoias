'use client';
//src/app/components/homePage/HeroSection.tsx
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import heroBannerSmall from '@/../public/heroBannerSmall.png';
import heroBannerLarge from '@/../public/heroBannerLarge.png';
import heroBannerMedium from '@/../public/heroBannerMedium.png';
import bigHeroLogo from '@/../public/bigHeroLogo2.png';
// import mediumHeroLogo from '@/../public/mediumHeroLogo.png';
// import smallHeroLogo from '@/../public/smallHeroLogo.png';


// import { Diamond } from 'lucide-react';

export default function HeroSection() {
    // Hook para verificar tamanho da tela
    const isLargeScreen = useMediaQuery({ minWidth: 1300 });
    const isMediumScreen = useMediaQuery({ minWidth: 640, maxWidth: 1300 });
    // h-[50vh] sm:h-[60vh] md:h-[70vh] 

    // Define a imagem com base nos breakpoints de tela
    const backgroundImage = isLargeScreen
        ? heroBannerLarge
        : isMediumScreen
            ? heroBannerMedium
            : heroBannerSmall;


    // const heroLogoImage = isLargeScreen
    //     ? bigHeroLogo
    //     : isMediumScreen
    //         ? mediumHeroLogo
    //         : smallHeroLogo;

    return (
        <section className="relative flex flex-col justify-center ">
            { /* Seleciona a imagem com base no tamanho da tela */ }
            <div className="p-0 flex flex-col h-full z-0">
                <div className='relative aspect-square md:h-[70vh]'>
                    <Image
                        className='rounded-lg rounded-b-none object-cover scale-100'
                        src={ backgroundImage }
                        alt="Hero Banner"
                        priority
                        sizes="2200px"
                        fill
                    />
                </div>
            </div>
            <div className="absolute w-full h-full flex flex-col items-center justify-center pt-32"> 
                <div className="flex flex-col items-center justify-center text-center w-full">

                    {
                        //         <>
                        //             <Diamond className="text-white" size={ isLargeScreen ? 80 : 60 } />
                        //             <span className={ `text-white  ${isLargeScreen ? 'text-7xl' : isMediumScreen ? 'text-6xl' : 'text-5xl'}` }>
                        // ALEXA
                        //             </span>
                        //         </>   
                        <div className="pt-8 flex flex-col h-full z-10">
                            <div className='relative aspect-square h-36 md:h-72 lg:h-96'>
                                <Image
                                    className='rounded-lg rounded-b-none object-cover scale-100'
                                    src={ bigHeroLogo }
                                    alt="Hero Banner"
                                    priority
                                    sizes="2200px"
                                    fill
                                />
                            </div>
                        </div>
      
                    }
                </div>
            </div>
        </section>
        
    );
}
