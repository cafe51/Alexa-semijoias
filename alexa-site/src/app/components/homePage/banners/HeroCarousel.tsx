'use client';
import useEmblaCarousel from 'embla-carousel-react';
import React, { useState, useEffect, useCallback } from 'react';
import FirstPurchaseBanner from './FirstPurchaseBanner';
import HeroSection from '../HeroSection';
import { BannersType, FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Autoplay from 'embla-carousel-autoplay';
import { NextButton, PrevButton } from '../../EmblaCarousel/EmblaCarouselArrowButtons';
import Banner from './Banner';

// const bannersMock = [
//     {
//         bannerName: 'Banner do Dia das Mães',
//         bannerImageMobile: 'https://lojavivara.vtexassets.com/assets/vtex.file-manager-graphql/images/6716819b-59a3-4cdf-866b-69652d51aff4___75e7ecbd6feb45ea9d6ed51808a65cc4.png',
//         bannerImageDesktop: 'https://lojavivara.vtexassets.com/assets/vtex.file-manager-graphql/images/2c634d56-e8f2-4a17-b117-31ae02db40c9___d742c12155483336707ddeda3b477115.png',
//         bannerTablet: 'https://lojavivara.vtexassets.com/assets/vtex.file-manager-graphql/images/786357eb-e801-49a3-847e-bcf6fc875c9c___4d4e4bc18a567f020eb2e9fdc3e315de.jpg',
//         pagePath: 'colecoes/dia-das-maes',
//     },
// ];

interface HeroSectionProps {
  lastAddProduct: ProductBundleType & FireBaseDocument | undefined;
  banners: (BannersType & FireBaseDocument)[] | undefined;
}

export default function HeroCarousel({ lastAddProduct, banners }: HeroSectionProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 800000, stopOnInteraction: false })]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        emblaApi?.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (emblaApi) {
            setScrollSnaps(emblaApi.scrollSnapList());
            emblaApi.on('select', onSelect);
            onSelect();
        }
    }, [emblaApi, onSelect]);

    return (
        <section className="relative mx-auto" >
            { /* Container principal com as variáveis CSS necessárias */ }
            <div
                ref={ emblaRef }
                className="w-full mx-auto overflow-hidden"
                style={ {
                    '--slide-height': '19rem',
                    '--slide-spacing': '1rem',
                    '--slide-size': '100%',
                } as React.CSSProperties }
            >
                { /* Container dos slides */ }
                <div
                    className="flex ml-[calc(var(--slide-spacing)*-1)]"
                    style={ { touchAction: 'pan-y pinch-zoom', backfaceVisibility: 'hidden' } }
                >
                    <div className="flex-[0_0_var(--slide-size)] pl-[var(--slide-spacing)]">
                        <FirstPurchaseBanner />
                    </div>
                    <div className="flex-[0_0_var(--slide-size)] pl-[var(--slide-spacing)]">
                        <HeroSection lastAddProduct={ lastAddProduct } />
                    </div>
                    {
                        banners && banners.length > 0 && banners.map((banner, index) => {
                            return (
                                <div key={ index } className="flex-[0_0_var(--slide-size)] pl-[var(--slide-spacing)]">
                                    <Banner
                                        bannerName={ banner.bannerName }
                                        bannerImageMobile={ banner.bannerImageMobile }
                                        bannerImageDesktop={ banner.bannerImageDesktop }
                                        bannerTablet={ banner.bannerTablet }
                                        pagePath={ banner.pagePath }
                                    />
                                </div>
                            );
                        },
                        )
                    }
                </div>
            </div>

            { /* Botões de navegação */ }
            <PrevButton onClick={ scrollPrev } />
            <NextButton onClick={ scrollNext }/>

            { /* Dot Navigation */ }
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
                { scrollSnaps.map((_, index) => (
                    <button
                        key={ index }
                        className={ `w-3 h-3 rounded-full transition-colors duration-300 ${
                            index === selectedIndex ? 'bg-white' : 'bg-gray-400'
                        }` }
                        onClick={ () => emblaApi?.scrollTo(index) }
                    />
                )) }
            </div>
        </section>
    );
}
