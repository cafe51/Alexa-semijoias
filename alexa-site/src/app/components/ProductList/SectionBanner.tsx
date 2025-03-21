// src/app/components/ProductList/SectionBanner.tsx

import Image from 'next/image';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';

import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import toTitleCase from '@/app/utils/toTitleCase';
import { getImageUrlFromFirebaseProductDocument } from '@/app/utils/getImageUrlFromFirebaseProductDocument';
import { shortenText } from '@/app/utils/shortenText';
import Breadcrumbs from '../Breadcrumbs';
import { getBreadcrumbItems } from '@/app/utils/breadcrumbUtils';


interface SectionBannerProps {
    lastAddProduct: ProductBundleType & FireBaseDocument | undefined;
    sectionName?: string;
    subsection?: string;
}

export default function SectionBanner({ lastAddProduct, sectionName, subsection }: SectionBannerProps) {
    const title = subsection ? subsection : sectionName ? sectionName : 'Alexa Semijoias';

    return (
        <section className="w-full grid md:grid-cols-[40%_auto] overflow-hidden pt-2 ">
            {       
                <div className='hidden md:flex flex-col justify-between relative aspect-[10/8] md:aspect-auto  bg-[#C48B9F] w-full '>
                    <div className="w-full pr-4 md:pr-8 lg:pr-12 xl:pr-16 pt-4 text-white">
                        <Breadcrumbs items={ getBreadcrumbItems(sectionName, subsection) } textColorAllWhite/>
                    </div>
                    <div className='flex flex-col justify-start items-start text-start text-lg px-4 md:p-8 lg:p-12 xl:p-16 gap-4'>
                        <p className='text-white lg:text-7xl'>{ toTitleCase(title) }</p> 
                        { lastAddProduct && <p className='text-white text-sm md:text-base lg:text-lg xl:text-xl'>{ shortenText(lastAddProduct.description, 400) }</p> }
                    </div>
                </div>
            }

            { /* Container principal com altura fixa para desktop */ }
            <div className="relative aspect-[4/5] md:aspect-[3/5] lg:aspect-[4/5] xl:aspect-[5/3] bg-skeleton">
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
                <div className="absolute md:hidden inset-0 flex flex-col items-between justify-between h-full "> 
                    <div className="w-full pr-4 md:pr-8 lg:pr-12 xl:pr-16 pt-4 bg-black/30">
                        <Breadcrumbs items={ getBreadcrumbItems(sectionName, subsection) } textColorAllWhite/>
                    </div>
                        
                    <div className='flex flex-col justify-center h-full bg-black/20'>
                        <div className='flex flex-col justify-center md:justify-start items-center md:items-start text-center md:text-start text-lg px-4 md:p-8 lg:p-12 xl:p-16 gap-4'>
                            <p className='text-white text-4xl lg:text-7xl'>{ toTitleCase(title) }</p> 
                            { lastAddProduct && <p className='text-white text-base md:text-base'>{ shortenText(lastAddProduct.description, 400) }</p> }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
