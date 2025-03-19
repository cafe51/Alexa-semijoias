// src/app/components/homePage/HeroSection.tsx
// Removemos o 'use client' porque esse componente é estático e não interage com o estado
import Image from 'next/image';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';
// import bigHeroLogo from '@/../public/bigHeroLogo2.png';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import toTitleCase from '@/app/utils/toTitleCase';
import Link from 'next/link';
import { getImageUrlFromFirebaseProductDocument } from '@/app/utils/getImageUrlFromFirebaseProductDocument';


interface HeroSectionProps {
    lastAddProduct: ProductBundleType & FireBaseDocument | undefined;
}

export default function HeroSection({ lastAddProduct }: HeroSectionProps) {
    console.log('lastAddProduct', lastAddProduct);

    const subsectionExist = lastAddProduct?.subsections && lastAddProduct.subsections.length > 0;
    const subsectionName = subsectionExist ? lastAddProduct.subsections![0].split(':')[1] : undefined;
    const sectionExist = lastAddProduct?.sections && lastAddProduct.sections.length > 0;
    const sectionName = sectionExist ? lastAddProduct.sections[0] : undefined;

    const titleOfBanner = subsectionName ? subsectionName : sectionName ? sectionName : 'Alexa Semijoias';

    const linkToSection = (subsectionName && sectionName) ? `/section/${sectionName}/${subsectionName}` : sectionName ? `/section/${sectionName}` : '/section';

    return (
        <section className="w-full grid md:grid-cols-2">
            { /* Container principal com altura fixa para desktop */ }
            <div className="relative aspect-[10/9] md:aspect-[3/5] lg:aspect-[4/5] xl:aspect-[5/4] bg-skeleton">
                <Image
                    className="object-cover"
                    src={ getImageUrlFromFirebaseProductDocument(lastAddProduct) }
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
                { /* <div className="absolute inset-0 flex items-center justify-center">
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
                </div> */ }
            </div>
            { /* 3F4A2D */ }
            { /* C48B9F */ }
            {       
                <div className="relative aspect-[10/8] md:aspect-[3/5] lg:aspect-[4/5] xl:aspect-[5/4] bg-[#C48B9F] flex flex-col items-center justify-center gap-4">
                    <h3 className='text-white text-lg uppercase tracking-widest'>Semijoias de Verdade</h3>
                    <div className='justify-between flex flex-col items-center gap-4'>
                        <div className='text-center text-4xl md:text-5xl lg:text-6xl xl:text-7xl'>
                            <p className='text-white'>{ toTitleCase(titleOfBanner) }</p>
                            <p className='text-white'>Para Transformar</p>
                            <p className='text-white'>Seu Estilo</p>
                        </div>
                        <Link
                            href={ linkToSection }

                        >
                            <button
                                className='bg-white font-bold text-[#C48B9F] p-4 px-14 rounded-full md:text-xl  hover:bg-[#D4AF37] hover:text-white transition-colors duration-300'
                            > 
                            Descubra
                            </button>
                        </Link>

                    </div>
                </div>
            }
        </section>
    );
}
