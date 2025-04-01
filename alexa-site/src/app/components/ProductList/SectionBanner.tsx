// src/app/components/ProductList/SectionBanner.tsx

import Image from 'next/image';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';

import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import toTitleCase from '@/app/utils/toTitleCase';
import { getImageUrlFromFirebaseProductDocument } from '@/app/utils/getImageUrlFromFirebaseProductDocument';
import { shortenText } from '@/app/utils/shortenText';
import Breadcrumbs from '../Breadcrumbs';
import { BreadcrumbItem, getBreadcrumbItems, getCollectionBreadcrumbItems } from '@/app/utils/breadcrumbUtils';
import ShareSection from '../ProductPage/ShareSection';
import { createSlugName } from '@/app/utils/createSlugName';
import { SITE_URL } from '@/app/utils/constants';

interface SectionBannerProps {
    bannerImage?: string | null;
    bannerDescription?: string | null;
    lastAddProduct: ProductBundleType & FireBaseDocument | undefined;
    sectionName?: string;
    subsection?: string;
    collectionName?: string;
}

export default function SectionBanner({
    bannerImage,
    bannerDescription,
    lastAddProduct,
    sectionName,
    subsection,
    collectionName,
}: SectionBannerProps) {
    const description = bannerDescription
        ? bannerDescription
        : lastAddProduct ? shortenText(lastAddProduct.description, 400) : '';

    const imageUrl = bannerImage ? bannerImage : getImageUrlFromFirebaseProductDocument(lastAddProduct);
    
    let linkToShareSection = `${SITE_URL}/section`;
    let breadCrumbItems: BreadcrumbItem[] = getBreadcrumbItems();
    let title: string = 'Alexa Semijoias';
    if (!sectionName && !subsection && collectionName) {
        linkToShareSection = `${SITE_URL}/colecoes/${createSlugName(collectionName)}`;
        breadCrumbItems = getCollectionBreadcrumbItems(collectionName);
        title = collectionName;
    }
    if (sectionName && !subsection && !collectionName) {
        linkToShareSection = `${SITE_URL}/section/${createSlugName(sectionName)}`;
        breadCrumbItems = getBreadcrumbItems(sectionName);
        title = sectionName;
    }
    if (sectionName && subsection && !collectionName) {
        linkToShareSection = `${SITE_URL}/section/${createSlugName(sectionName)}/${createSlugName(subsection)}`;
        breadCrumbItems = getBreadcrumbItems(sectionName, subsection);
        title = subsection;
    }

    return (
        <section className="w-full grid md:grid-cols-[50%_auto] overflow-hidden pt-2 ">
            {       
                // Renderização para telas maiores com borda interna na área de cor C48B9F
                <div className="hidden md:flex flex-col justify-between relative aspect-[10/8] p-6 md:aspect-auto bg-[#C48B9F] w-full ">
                    <div className="relative flex flex-col justify-between h-full w-full box-border border-4 border-[#F8C3D3] border-double">
                        <div className="w-full flex justify-between items-center pr-2 md:pr-4 lg:pr-6 xl:pr-8 pt-4 text-white">  
                            <Breadcrumbs items={ breadCrumbItems } textColorAllWhite/>
                            <div className="text-white">
                                <ShareSection
                                    url={ linkToShareSection }
                                    callToAction="Compartilhe"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start text-start text-lg px-4 md:p-8 lg:p-12 xl:p-16 gap-4">
                            <p className="text-white md:text-5xl lg:text-7xl">{ toTitleCase(title) }</p> 
                            <p className="text-white text-sm md:text-base lg:text-lg xl:text-xl">{ description }</p>
                        </div>
                    </div>
                </div>
            }

            { /* Container principal com altura fixa para desktop */ }
            <div className="relative aspect-[4/5] md:aspect-[3/5] lg:aspect-[4/5] xl:aspect-[5/4] bg-skeleton">
                <Image
                    className="object-cover"
                    src={ imageUrl }
                    title="Banner Principal Alexa Semijoias"
                    alt="Banner Principal Alexa Semijoias"
                    priority
                    sizes="1000px"
                    quality={ 80 }
                    fill
                    placeholder="blur"
                    blurDataURL={ heroBannerLarge.blurDataURL }
                />
                
                { /* Container do logo centralizado para mobile */ }
                <div className="absolute md:hidden inset-0 flex flex-col items-between justify-between h-full "> 
                    <div className="w-full flex justify-between items-center pr-4 md:pr-8 lg:pr-12 xl:pr-16 pt-4 bg-black/30">
                        <Breadcrumbs items={ breadCrumbItems } textColorAllWhite/>
                    </div>
                        
                    <div className="flex flex-col justify-center h-full bg-black/20">
                        <div className="flex flex-col justify-center md:justify-start items-center md:items-start text-center md:text-start text-lg p-4 md:p-8 lg:p-12 xl:p-16 gap-4 bg-black/10">
                            <p className="text-white text-4xl lg:text-7xl">{ toTitleCase(title) }</p> 
                            <p className="text-white text-base md:text-base">{ description }</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-end items-end p-4 w-full bg-black/30">
                        <div className="text-white">
                            <ShareSection
                                url={ linkToShareSection }
                                callToAction="Compartilhe"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
