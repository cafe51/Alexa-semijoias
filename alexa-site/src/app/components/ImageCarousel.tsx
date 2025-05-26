import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from '@/components/ui/card';
import blankImage from '../../../public/blankImage.png';
import { NextButton, PrevButton } from './EmblaCarousel/EmblaCarouselArrowButtons';

interface ImageCarouselProps {
  productData: ProductBundleType & FireBaseDocument;
  options?: EmblaOptionsType;
}

function ImageCarouselProduct({
    productData,
    image,
}: {
  productData: ProductBundleType & FireBaseDocument;
  image: ProductBundleType['images'][0];
}) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg shadow-none bg-transparent border-none rounded-t-none rounded-b-sm">
            <CardContent className="p-0 flex flex-col h-full">
                <div className="relative aspect-[4/5] xl:aspect-square ">
                    <div className="relative w-full h-full bg-skeleton">
                        <Image
                            data-testid="product-link"
                            className={ `rounded-none object-cover scale-100 ${
                                productData.estoqueTotal <= 0 ? 'opacity-50' : ''
                            }` }
                            src={
                                productData.images && productData.images[0]
                                    ? image.localUrl
                                    : blankImage.src
                            }
                            alt={ `Foto de ${productData.name}` }
                            title={ `Foto de ${productData.name}` }
                            sizes="3000px"
                            fill
                            placeholder="blur"
                            blurDataURL={ blankImage.src }
                            quality={ 75 }
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

type ThumbProps = {
  selected: boolean;
  productData: ProductBundleType & FireBaseDocument;
  image: ProductBundleType['images'][0];
  onClick: () => void;
};

export const Thumb: React.FC<ThumbProps> = ({ selected, productData, image, onClick }) => {
    const emblaThumbsSlideClassName =
    'min-w-0 flex-[0_0_22%] pl-[var(--thumbs-slide-spacing)] min-[576px]:flex-[0_0_25%] ' +
    'lg:flex-[0_0_auto] lg:w-full lg:pt-[var(--thumbs-slide-spacing)] lg:pl-0 ' +
    (selected ? 'text-[var(--text-body)]' : '');

    return (
        <div className={ emblaThumbsSlideClassName }>
            <button
                onClick={ onClick }
                type="button"
                className="rounded-[1.8rem] bg-transparent touch-manipulation inline-flex items-center justify-center w-full h-[var(--thumbs-slide-height)] text-[1.8rem] font-semibold border-0 p-0 m-0 cursor-pointer select-none"
                style={ {
                    WebkitTapHighlightColor: 'rgba(var(--text-high-contrast-rgb-value), 0.5)',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    textDecoration: 'none',
                    boxShadow: 'inset 0 0 0 0.2rem var(--detail-medium-contrast)',
                    color: 'var(--detail-high-contrast)',
                } }
            >
                <div className="relative w-full h-full bg-skeleton">
                    <Image
                        data-testid="product-link"
                        className={ `rounded-none object-cover scale-100 ${
                            productData.estoqueTotal <= 0 ? 'opacity-50' : ''
                        }` }
                        src={
                            productData.images && productData.images[0]
                                ? image.localUrl
                                : blankImage.src
                        }
                        alt={ `Foto de ${productData.name}` }
                        title={ `Foto de ${productData.name}` }
                        sizes="3000px"
                        fill
                        placeholder="blur"
                        blurDataURL={ blankImage.src }
                        quality={ 75 }
                    />
                </div>
            </button>
        </div>
    );
};

export default function ImageCarousel({ productData, options }: ImageCarouselProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true,
    });

    const scrollPrev = useCallback(() => {
        emblaMainApi?.scrollPrev();
    }, [emblaMainApi]);

    const scrollNext = useCallback(() => {
        emblaMainApi?.scrollNext();
    }, [emblaMainApi]);

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi],
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        const index = emblaMainApi.selectedScrollSnap();
        setSelectedIndex(index);
        emblaThumbsApi.scrollTo(index);
    }, [emblaMainApi, emblaThumbsApi]);

    useEffect(() => {
        if (emblaMainApi) {
            setScrollSnaps(emblaMainApi.scrollSnapList());
            emblaMainApi.on('select', onSelect);
            onSelect();
        }
    }, [emblaMainApi, onSelect]);

    useEffect(() => {
        if (!emblaMainApi) return;
        onSelect();
        emblaMainApi.on('select', onSelect).on('reInit', onSelect);
    }, [emblaMainApi, onSelect]);

    return (
        <section
            className="max-w-[70rem] mx-auto"
            style={ {
                '--slide-height': '19rem',
                '--slide-spacing': '1rem',
                '--slide-size': '100%',
                '--slide-spacing-sm': '1.6rem',
                '--slide-size-sm': '100%',
                '--slide-spacing-lg': '2rem',
                '--slide-size-lg': '100%',
            } as React.CSSProperties }
        >
            <div className="flex flex-col lg:flex-row">
                <div
                    className="order-2 lg:order-1 lg:w-[15%] lg:mr-[var(--thumbs-slide-spacing)] mt-[var(--thumbs-slide-spacing)] lg:mt-0"
                    style={ {
                        '--thumbs-slide-spacing': '0.8rem',
                        '--thumbs-slide-height': '6rem',
                    } as React.CSSProperties }
                >
                    <div className="overflow-hidden" ref={ emblaThumbsRef }>
                        <div className="flex flex-row lg:flex-col ml-[calc(var(--thumbs-slide-spacing)*-1)] lg:ml-0 lg:mt-[calc(var(--thumbs-slide-spacing)*-1)]">
                            { productData.images &&
                productData.images.length > 1 &&
                productData.images.map((image, index) => (
                    <Thumb
                        key={ index }
                        onClick={ () => onThumbClick(index) }
                        selected={ index === selectedIndex }
                        image={ image }
                        productData={ productData }
                    />
                )) }
                        </div>
                    </div>
                </div>

                <div className="order-1 lg:order-2 lg:w-[80%]">
                    <div className="overflow-hidden relative" ref={ emblaMainRef }>
                        <div
                            className="flex ml-[calc(var(--slide-spacing)*-1)] min-[750px]:ml-[calc(var(--slide-spacing-sm)*-1)] min-[1200px]:ml-[calc(var(--slide-spacing-lg)*-1)]"
                            style={ { touchAction: 'pan-y pinch-zoom', backfaceVisibility: 'hidden' } }
                        >
                            { productData.images.map((image, index) => (
                                <div
                                    key={ index }
                                    className={
                                        'min-w-0 pl-[var(--slide-spacing)] flex-[0_0_var(--slide-size)] ' +
                    'min-[750px]:pl-[var(--slide-spacing-sm)] min-[750px]:flex-[0_0_var(--slide-size-sm)] ' +
                    'min-[1200px]:pl-[var(--slide-spacing-lg)] min-[1200px]:flex-[0_0_var(--slide-size-lg)]'
                                    }
                                >
                                    <ImageCarouselProduct productData={ productData } image={ image } />
                                </div>
                            )) }
                        </div>
                        { /* Dot Navigation sobreposta à imagem */ }
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                            { scrollSnaps.map((_, index) => (
                                <button
                                    key={ index }
                                    className={ `w-3 h-3 rounded-full transition-colors duration-300 ${
                                        index === selectedIndex ? 'bg-white' : 'bg-gray-400'
                                    }` }
                                    onClick={ () => emblaMainApi?.scrollTo(index) }
                                />
                            )) }
                        </div>
                        { /* Botões de navegação sobrepostos */ }
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                            <PrevButton onClick={ scrollPrev } />
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                            <NextButton onClick={ scrollNext } />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
