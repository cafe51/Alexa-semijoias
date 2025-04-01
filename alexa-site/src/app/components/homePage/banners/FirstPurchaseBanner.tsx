// src/app/components/homePage/FirstPurchaseBanner.tsx
import Image from 'next/image';
import React from 'react';

// URL da imagem placeholder para desenvolvimento
const placeholderImageUrl =
    'https://firebasestorage.googleapis.com/v0/b/alexa-semijoias.appspot.com/o/images%2FPolish_20250329_213739144.jpg?alt=media&token=051f542e-d2d4-4796-9011-be66d3cc63e9';

export default function FirstPurchaseBanner() {
    const images = [
        {
            id: 'earring',
            src: placeholderImageUrl,
            alt: 'Placeholder - Imagem de brinco',
            // Ajuste fino das porcentagens pode ser necessário
            containerClasses:
                'absolute top-[-4%] left-[-6%] w-[28%] sm:w-[26%] md:w-[30%] lg:w-[40%] xl:w-[28%] aspect-square z-0',
            rotation: '-rotate-6',
        },
        {
            id: 'bracelet',
            src: 'https://firebasestorage.googleapis.com/v0/b/alexa-semijoias.appspot.com/o/images%2FPolish_20250323_164744883.jpg?alt=media&token=56e1534b-375a-4a50-b661-6124c18c8544',
            alt: 'Placeholder - Imagem de pulseira',
            containerClasses:
                'absolute bottom-[-6%] left-[1%] xl:left-[14%] w-[24%] sm:w-[22%] md:w-[25%] lg:w-[28%] xl:w-[23%] aspect-square z-0',
            rotation: 'rotate-3',
        },
        {
            id: 'ring',
            src: 'https://firebasestorage.googleapis.com/v0/b/alexa-semijoias.appspot.com/o/images%2FImage_2024_12_12_18_18_29.jpg?alt=media&token=3c00470e-9e66-4cc9-93fc-9eb504abaf5b',
            alt: 'Placeholder - Imagem de anel',
            containerClasses:
                'absolute top-1/2 right-[-8%] sm:right-[-10%] xl:right-[-2%] w-[36%] sm:w-[34%] md:w-[38%] lg:w-[36%] xl:w-[38%] aspect-square transform -translate-y-1/2 z-0', 
            rotation: 'rotate-6',
        },
    ];

    return (
        // Ajustamos a div principal para que a área total seja equivalente à soma das duas partes do HeroSection.
        // Em telas pequenas, usamos "aspect-[10/19]" pois no HeroSection a primeira parte tem aspect-[10/9] (altura = 9/10 da largura)
        // e a segunda é quadrada (altura = 1×largura), totalizando 9/10 + 1 = 1.9×largura.
        // Em telas md, lg e xl, as proporções passam a ser definidas pela altura dos itens do grid:
        // - md: Cada célula tem "aspect-[3/5]", resultando em uma altura total de (5/3)×(w/2) = 5/6×w, ou seja, aspect ratio geral de 6/5.
        // - lg: Com "aspect-[4/5]" nas células, a proporção geral é 8/5.
        // - xl: Com "aspect-[5/4]" nas células, a proporção geral é 5/2.
        <div className="relative w-full overflow-hidden bg-[#F8C3D3] border border-[#C48B9F]
            aspect-[10/19] md:aspect-[6/5] lg:aspect-[8/5] xl:aspect-[5/2]">
            <div className="w-full h-full p-1 md:p-2 lg:p-4 xl:p-6">
                <div className="relative flex flex-col items-center justify-center h-full w-full box-border
                    border-2 md:border-4 lg:border-8 border-[#C48B9F] border-double">
                    { /* Conteúdo de Texto Central – z-10 para ficar sobre as imagens */ }
                    <div className="relative z-10 flex flex-col items-center justify-center text-center
                    border-2 md:border-4 lg:border-8  border-[#C48B9F] border-double md:p-2 lg:p-4 xl:py-20 xl:px-96">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-serif text-black font-medium">
                            GANHE
                        </h2>
                        <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold font-serif text-black my-1 md:my-1.5">
                            10%
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-3xl text-black mt-1 md:mt-1.5 font-medium">
                            Na primeira compra
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-3xl text-black font-medium mb-1.5 md:mb-2">
                            com o cupom
                        </p>
                        { /* Caixa do Código do Cupom */ }
                        <div className="inline-block bg-[#C48B9F] py-1 px-3 md:py-1.5 md:px-5 lg:px-6 xl:px-10 xl:py-4 rounded-md shadow-sm">
                            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-5xl text-white font-bold tracking-wider uppercase">
                                SEJALEXA10
                            </span>
                        </div>
                    </div>

                    { /* Imagens posicionadas absolutamente */ }
                    { images.map((img) => (
                        <div key={ img.id } className={ `${img.containerClasses} ${img.rotation || ''} z-30` }>
                            <div className="relative w-full h-full rounded-full overflow-hidden border-2 md:border-3 border-white shadow-lg ">
                                <Image
                                    src={ img.src }
                                    alt={ img.alt }
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 30vw, (max-width: 1200px) 25vw, 20vw"
                                    quality={ 75 }
                                />
                            </div>
                        </div>
                    )) }
                </div>
            </div>
        </div>
    );
}
