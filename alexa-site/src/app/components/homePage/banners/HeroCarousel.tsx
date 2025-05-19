'use client';
import useEmblaCarousel from 'embla-carousel-react';
import React, { useState, useEffect, useCallback } from 'react';
import FirstPurchaseBanner from './FirstPurchaseBanner';
import HeroSection from '../HeroSection';
import { BannersType, FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Autoplay from 'embla-carousel-autoplay';
import { NextButton, PrevButton } from '../../EmblaCarousel/EmblaCarouselArrowButtons';
import Banner from './Banner';

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
                            if (!banner.showBanner) return null;
                            if (!banner.bannerImageMobile) return null;
                            if (!banner.bannerImageDesktop) return null;
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
