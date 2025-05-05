// src/app/components/homePage/banners/MothersDayBanner.tsx
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import bgDesktopUrl from '../../../../../public/mothersBgDesktop.jpg';
import bgMobileUrl from '../../../../../public/mothersBgMobile.jpg';
import drawnHeartUrl from '../../../../../public/drawnHeart.png';
import { Pacifico, Cormorant_Garamond } from 'next/font/google';
import RoundedStar from './RoundedStar';

const pacifico = Pacifico({
    subsets: ['latin'],
    weight: '400',
});

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
});

const heartPendantUrl = 'https://firebasestorage.googleapis.com/v0/b/alexa-semijoias.appspot.com/o/images%2FPolish_20250323_210125696.jpg?alt=media&token=2efeb1d7-1bd3-427b-968a-6b15ccd18334';
const figuresPendantUrl = 'https://firebasestorage.googleapis.com/v0/b/alexa-semijoias.appspot.com/o/images%2FPolish_20250327_025912511.jpg?alt=media&token=d52d0870-3835-4e9e-9ca6-5af9a88de448';

const bgDesktopBlur = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=';
const bgMobileBlur = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=';

export default function MothersDayBanner() {
    // Definições de estilo para reutilização
    const textPink = 'text-[#D91F5F]';
    const buttonBg = 'bg-[#B76E8A]';
    const buttonHoverBg = 'hover:bg-[#a15f78]';

    return (
        <div className={ `relative w-full overflow-hidden
                    bg-red-200
        min-[440px]:bg-gray-200
        sm:bg-white
        md:bg-green-200
        lg:bg-blue-300
        xl:bg-[#F8C3D3]
        2xl:bg-yellow-200
        min-[1700px]:bg-orange-200

            aspect-[8/13] min-[440px]:aspect-[5/9] sm:aspect-[5/7] md:aspect-[6/5] lg:aspect-[8/5] xl:aspect-[5/2]` }>
            { /* Imagem de Fundo - Responsiva */ }
            <Image
                className="object-cover object-center hidden md:block z-0"
                src={ bgDesktopUrl }
                alt="Fundo do banner de Dia das Mães com flores e aquarela rosa - Desktop"
                fill
                priority
                quality={ 85 }
                placeholder="blur"
                blurDataURL={ bgDesktopBlur }
                sizes="(min-width: 768px) 100vw"
            />
            <Image
                className="object-cover object-center md:hidden z-0"
                src={ bgMobileUrl }
                alt="Fundo do banner de Dia das Mães com flores e aquarela rosa - Mobile"
                fill
                priority
                quality={ 85 }
                placeholder="blur"
                blurDataURL={ bgMobileBlur }
                sizes="(max-width: 767px) 100vw"
            />

            { /* Container do Conteúdo - Posicionado sobre o fundo */ }
            <div className="absolute inset-0 z-10 grid md:grid-cols-[40%_auto] items-center
            p-2
            sm:p-6
            md:p-8
            lg:p-10
            2xl:p-12
            min-[1700px]:p-14">

                { /* Seção de Texto e Botão (Esquerda no Desktop, Centro no Mobile) */ }
                <div className="relative flex flex-col items-center text-center h-full justify-center order-1 md:order-1 px-2 md:px-0">
                    { /* "Dia das" com fonte Pacifico */ }
                    <span className={ `relative z-10 ${textPink} ${pacifico.className}
                    px-4 py-1
                    text-xl
                    min-[440px]:text-2xl
                    sm:text-4xl
                    md:text-2xl
                    lg:text-3xl
                    xl:text-4xl
                    2xl:text-4xl
                    min-[1700px]:text-5xl
                    ` }>
                        Dia das
                    </span>
                    { /* "MÃES" com fonte Cormorant */ }
                    <h2 className={ `${cormorant.className} ${textPink} font-extralight
                    z-10
                    text-8xl
                    min-[440px]:text-9xl
                    sm:text-[180px]
                    md:text-8xl
                    lg:text-9xl
                    xl:text-[150px]
                    2xl:text-[180px]
                    min-[1700px]:text-[230px]
                    leading-none mb-2 sm:mb-3 md:mb-4` }>
                        MÃES
                    </h2>
                    { /* Demais textos com fonte Cormorant */ }
                    <p className={ `${cormorant.className} ${textPink}
                    z-10
                    text-2xl
                    min-[440px]:text-3xl
                    sm:text-4xl
                    md:text-xl
                    lg:text-2xl
                    xl:text-3xl
                    2xl:text-4xl
                    min-[1700px]:text-5xl
                    mb-1` }>
                        Peças com até
                    </p>
                    <p className={ `${cormorant.className} ${textPink}
                    z-10
                    mb-4
                    font-bold
                    text-5xl

                    min-[440px]:text-6xl

                    sm:text-7xl
                    sm:mb-5

                    md:text-5xl
                    md:mb-6

                    lg:text-6xl

                    xl:text-7xl
                    
                    2xl:text-7xl

                    min-[1700px]:text-8xl
                    ` }>
                        30% OFF
                    </p>
                    { /* Botão de ação permanece inalterado */ }
                    <Link href="/colecoes/dia-das-maes" passHref legacyBehavior>
                        <p className={ `
                            ${buttonBg} ${buttonHoverBg} text-white
                            font-semibold rounded-full shadow-md
                            text-lg
                            px-6 py-2

                            min-[440px]:text-xl

                            sm:text-2xl
                            sm:px-10 sm:py-4

                            md:text-lg
                            md:px-10 md:py-3

                            lg:text-xl
                            lg:px-12 lg:py-4

                            xl:text-2xl
                            xl:px-14 xl:py-4

                            2xl:text-3xl

                            min-[1700px]:text-3xl
                            min-[1700px]:px-18 min-[1700px]:py-6


                            transition-colors duration-300
                            inline-block z-30
                        ` }>
                            CONFIRA AQUI
                        </p>
                    </Link>
                </div>

                { /* Seção das Imagens dos Pingentes (Direita no Desktop, posicionadas abs no mobile) */ }
                <div className="relative w-full h-full order-2 md:order-2 hidden md:block">
                    { /* Pingente Coração */ }
                    <div className="absolute
                    top-[10%]
                    right-[35%]

                    md:top-[20%]
                    md:right-[48%]

                    lg:top-[30%]
                    lg:right-[48%]
                    
                    xl:top-[30%]
                    xl:right-[70%]

                    2xl:top-[30%]
                    2xl:right-[70%]

                    min-[1700px]:top-[30%]
                    min-[1700px]:right-[70%]

                    transform -translate-y-1/2 rotate-[-8deg]">
                        <RoundedStar imageUrl={ heartPendantUrl } className='
                        w-[45%]
                        sm:w-[40%]
                        md:w-[135%]
                        lg:w-[110%]
                        xl:w-[135%]
                        2xl:w-[145%]
                        min-[1700px]:w-[155%]'
                        />
                    </div>

                    { /* Pingente Figuras */ }
                    <div className="
                    absolute
                    bottom-[5%]
                    right-[5%]

                    md:bottom-[-5%]
                    md:right-[5%]

                    lg:bottom-[-5%]
                    lg:right-[10%]

                    xl:bottom-[-5%]
                    xl:right-[20%]

                    2xl:bottom-[-5%]
                    2xl:right-[30%]

                    min-[1700px]:bottom-[-5%]
                    min-[1700px]:right-[30%]

                    transform rotate-[5deg]">
                        <RoundedStar imageUrl={ figuresPendantUrl } className='
                        w-[45%]
                        sm:w-[40%]
                        md:w-[120%]
                        lg:w-[130%]
                        xl:w-[140%]
                        2xl:w-[175%]
                        min-[1700px]:w-[190%]'/>
                    </div>


                    { /* Coração Desenhado */ }
                    <div className="absolute
                    top-[50%]
                    right-[5%]
                    w-[40%]

                    md:right-[5%]
                    md:top-[40%]
                    md:w-[65%]

                    lg:right-[15%]
                    lg:top-[35%]
                    lg:w-[50%]

                    xl:right-[30%]
                    xl:top-[30%]
                    xl:w-[50%]

                    2xl:right-[30%]
                    2xl:top-[30%]
                    2xl:w-[50%]
                    
                    min-[1700px]:right-[30%]
                    min-[1700px]:top-[30%]
                    min-[1700px]:w-[50%]
                    aspect-[4/3] transform -translate-y-1/2 -rotate-[0deg] z-40">
                        <Image
                            src={ drawnHeartUrl }
                            alt="Desenho de coração rosa"
                            fill
                            className="object-contain opacity-80"
                            sizes="(min-width: 1280px) 12vw, (min-width: 1024px) 15vw, (min-width: 768px) 18vw, 0vw"
                        />
                    </div>
                </div>

                { /* Imagens posicionadas absolutamente para Telas Pequenas (< md) */ }
                <div className="absolute inset-0 z-10 block md:hidden pointer-events-none">
                    { /* Pingente Coração (Mobile) */ }
                    <div className="absolute
                    top-[20%]
                    right-[50%]

                    min-[440px]:top-[15%]
                    min-[440px]::right-[48%]

                    sm:top-[15%]
                    sm:right-[48%]

                    transform -translate-y-1/2 rotate-[-8deg]">
                        <RoundedStar imageUrl={ heartPendantUrl } className='
                        w-[100%]
                        min-[440px]:w-[100%]
                        sm:w-[80%]'
                        />
                    </div>

                    { /* Pingente Figuras (Mobile) */ }
                    <div className="
                    absolute
                    bottom-[1%]
                    right-[-35%]

                    min-[440px]:bottom-[1%]
                    min-[440px]:right-[-15%]

                    sm:bottom-[1%]
                    sm:right-[-8%]
 
                    transform
                    rotate-[5deg] pointer-events-auto">
                        <RoundedStar imageUrl={ figuresPendantUrl } className='
                        w-[55%]
                        min-[440px]:w-[80%]
                        sm:w-[80%]'
                        />
                    </div>

                    { /* Coração Desenhado (Mobile) */ }
                    <div className="
                    absolute
                    top-[55%]
                    right-[2%]
                    w-[35%]
                    sm:w-[30%]
                    aspect-[4/3]
                    transform -translate-y-1/2 -rotate-[15deg]">
                        <Image
                            src={ drawnHeartUrl }
                            alt="Desenho de coração rosa"
                            fill
                            className="object-contain opacity-80"
                            sizes="(max-width: 639px) 35vw, (max-width: 767px) 30vw, 0vw"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
