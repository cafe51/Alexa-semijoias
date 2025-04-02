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
                'absolute top-[-4%] min-[440px]:top-[1%] md:top-[25%] lg:top-[-4%] left-[-6%] xl:left-[-2%] 2xl:left-[-3%] w-[50%] min-[440px]:w-[50%] sm:w-[50%] md:w-[40%] lg:w-[40%] xl:w-[26%] 2xl:w-[26%] aspect-square z-0',
            rotation: '-rotate-6',
        },
        {
            id: 'bracelet',
            src: 'https://firebasestorage.googleapis.com/v0/b/alexa-semijoias.appspot.com/o/images%2FPolish_20250323_164744883.jpg?alt=media&token=56e1534b-375a-4a50-b661-6124c18c8544',
            alt: 'Placeholder - Imagem de pulseira',
            containerClasses:
                'absolute bottom-[-6%] left-[1%] md:left-[10%] lg:left-[5%] xl:left-[10%] 2xl:left-[12%] w-[55%] min-[440px]:w-[62%] sm:w-[50%] md:w-[25%] lg:w-[28%] xl:w-[22%] 2xl:w-[23%]  aspect-square z-0',
            rotation: 'rotate-3',
        },
        {
            id: 'ring',
            src: 'https://firebasestorage.googleapis.com/v0/b/alexa-semijoias.appspot.com/o/images%2FImage_2024_12_12_18_18_29.jpg?alt=media&token=3c00470e-9e66-4cc9-93fc-9eb504abaf5b',
            alt: 'Placeholder - Imagem de anel',
            containerClasses:
                'absolute right-[-8%] xl:right-[-2%] top-[12%] min-[440px]:top-[10%] sm:top-[18%] md:top-[26%] lg:top-[40%] xl:top-1/3 w-[55%] min-[440px]:w-[55%] sm:w-[50%] md:w-[44%] lg:w-[45%] xl:w-[36%] 2xl:w-[38%] aspect-square transform -translate-y-1/2 z-0', 
            rotation: 'rotate-6',
        },
    ];

    return (
        // Ajustamos a div principal para que a área total seja equivalente à soma das duas partes do HeroSection.
        // A classe do container principal foi adaptada para simular a área total do HeroSection:
        // - Em telas menores (vertical): soma das alturas dos dois blocos do HeroSection.
        //    • Default: aspect-[8/13] (16/15 + 16/11 → 15/16 + 11/16 = 26/16 = 1.625, ou 8/13)
        //    • min-[440px]: aspect-[10/9] em cada bloco → soma resulta em 5/9
        //    • sm: Cada bloco passa a ter aspect-[10/7] → soma resulta em 5/7
        // - Em telas md e maiores (grid com duas colunas): o container ocupa a altura de uma célula
        //    • md: aspect-[3/5] na célula → overall = 6/5
        //    • lg: overall = 8/5
        //    • xl: overall = 5/2
        // cores pra diferenciar breakpoints em desenvolvimento:
        // bg-red-600
        // min-[440px]:bg-gray-200
        // sm:bg-white
        // md:bg-green-200
        // lg:bg-blue-300
        // xl:bg-[#F8C3D3]
        // 2xl:bg-yellow-200
        <div className="relative w-full overflow-hidden   bg-[#F8C3D3]/30

            aspect-[8/13] min-[440px]:aspect-[5/9] sm:aspect-[5/7] md:aspect-[6/5] lg:aspect-[8/5] xl:aspect-[5/2]">
            <div className="
            w-full h-full
            py-4 px-2
            min-[440px]:py-6 min-[440px]:px-4 
            sm:py-6 sm:px-4 
            md:py-6 md:px-4 
            lg:py-8 lg:px-4
            xl:p-6">
                <div className="relative flex flex-col items-center justify-center h-full w-full box-border
                    border-4 lg:border-8 border-[#C48B9F] border-double">
                    { /* Conteúdo de Texto Central – z-10 para ficar sobre as imagens */ }
                    <div className="
                    relative z-10 flex flex-col items-center justify-center text-center
                    border-4 lg:border-8 border-[#C48B9F] border-double
                    py-12 px-8
                    min-[440px]:py-12 min-[440px]:px-8 
                    sm:py-28 sm:px-32
                    md:py-28 md:px-40
                    lg:py-28 lg:px-60
                    xl:py-7 xl:px-80
                    2xl:py-20 2xl:px-96">
                        <h2 className="text-4xl min-[440px]:text-6xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-serif text-black font-medium">
                            GANHE
                        </h2>
                        <p className="text-6xl min-[440px]:text-8xl sm:text-8xl md:text-8xl lg:text-8xl xl:text-9xl font-bold font-serif text-black my-1 md:my-1.5">
                            10%
                        </p>
                        <p className="text-lg min-[440px]:text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl text-black mt-1 md:mt-1.5 font-medium">
                            Na primeira compra
                        </p>
                        <p className="text-lg min-[440px]:text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl text-black font-medium mb-1.5 md:mb-2">
                            com o cupom
                        </p>
                        { /* Caixa do Código do Cupom */ }
                        <div className="
                        inline-block bg-[#C48B9F]
                        px-4 py-2 
                        min-[440px]:px-6 min-[440px]:py-3
                        sm:px-6 sm:py-3
                        md:px-6 md:py-3
                        lg:px-6 lg:py-3
                        xl:px-10 xl:py-4
                        rounded-md shadow-sm">
                            <span className="
                            text-2xl
                            min-[440px]:text-4xl
                            sm:text-4xl
                            md:text-4xl
                            lg:text-4xl
                            xl:text-5xl
                            text-white
                            font-bold
                            tracking-wider
                            uppercase">
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
