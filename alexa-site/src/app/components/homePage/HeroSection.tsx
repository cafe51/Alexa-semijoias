// src/app/components/homePage/HeroSection.tsx
import Image from 'next/image';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';
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

    const linkToSection = (subsectionName && sectionName)
        ? `/section/${sectionName}/${subsectionName}`
        : sectionName ? `/section/${sectionName}` : '/section';

    return (
        <section className="w-full grid md:grid-cols-2 overflow-hidden">
            { /* Container da imagem */ }
            <div className="relative
            aspect-[16/15]
            min-[440px]:aspect-[10/9]
            
            sm:aspect-[10/7]
            md:aspect-[3/5]
            lg:aspect-[4/5]
            xl:aspect-[5/4]
            bg-skeleton">
                <Image
                    className="object-cover"
                    src={ getImageUrlFromFirebaseProductDocument(lastAddProduct) }
                    title="Banner Principal Alexa Semijoias"
                    alt="Banner Principal Alexa Semijoias"
                    priority
                    sizes="1000px"
                    quality={ 80 }
                    fill
                    placeholder="blur"
                    blurDataURL={ heroBannerLarge.blurDataURL }
                />
            </div>
            { /* Container com fundo e efeito de borda interna */ }
            <div className="
            relative
            aspect-[16/11] bg-[#C48B9F]
            min-[440px]:aspect-[10/9] 

            sm:aspect-[10/7] 
            md:aspect-[3/5]
            lg:aspect-[4/5] 
            xl:aspect-[5/4]
            p-2 md:p-6">
                <div className="relative flex flex-col items-center justify-center gap-1 min-[440px]:gap-4 h-full w-full box-border border-4 border-[#F8C3D3] border-double ">
                    <h3 className="text-white text-xs min-[440px]:text-base md:text-lg lg:text-lg xl:text-xl uppercase tracking-widest">
                        Semijoias de Verdade
                    </h3>
                    <div className="flex flex-col items-center justify-around gap-4">
                        <div className="text-center ">
                            <p className="text-white text-2xl min-[440px]:text-4xl md:text-4xl lg:text-5xl xl:text-7xl mb-2 xl:mb-4">{ toTitleCase(titleOfBanner) }</p> 
                            <p className="text-white text-xl min-[440px]:text-3xl md:text-3xl lg:text-4xl xl:text-6xl">Para Transformar</p>
                            <p className="text-white text-xl min-[440px]:text-3xl md:text-3xl lg:text-4xl xl:text-6xl">Seu Estilo</p>
                        </div>
                        <Link href={ linkToSection }>
                            <button className="
                            bg-white font-bold text-[#C48B9F]
                            p-4 px-14 rounded-full
                            min-[440px]:text-xl 
                            hover:bg-[#D4AF37] hover:text-white transition-colors duration-300">
                                Descubra
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
