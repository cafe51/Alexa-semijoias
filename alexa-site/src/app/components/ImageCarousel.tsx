import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from '@/components/ui/card';
import blankImage from '../../../public/blankImage.png';


interface ImageCarouselProps {
    productData: (ProductBundleType & FireBaseDocument);
    options?: EmblaOptionsType;
    
}

function ImageCarouselProduct({ productData, image }: { productData: ProductBundleType & FireBaseDocument; image: ProductBundleType['images'][0] }) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg shadow-none  bg-transparent border-none rounded-t-none rounded-b-sm">
            <CardContent className="p-0 flex flex-col h-full ">
                <div
                    className="relative aspect-[4/5]"
                >
                    <div className="relative w-full h-full bg-skeleton">
                        <Image
                            data-testid="product-link"
                            className={ `rounded-none object-cover scale-100 ${productData.estoqueTotal <= 0 ? 'opacity-50' : ''}` }
                            src={
                                productData.images && productData.images[0]
                                    ? image.localUrl
                                    : blankImage.src
                            }
                            alt={ `Foto de ${productData.name}` }
                            title={ `Foto de ${productData.name}` }
                            sizes={ '3000px' }
                            fill
                            placeholder="blur" // melhora a percepção de carregamento
                            blurDataURL={ blankImage.src }
                            // loading={ homePage ? 'eager' : 'lazy' }
                            quality={ 75 } // reduz um pouco a qualidade para diminuir o tamanho do arquivo
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

type PropType = {
    selected: boolean
    productData: (ProductBundleType & FireBaseDocument);
    image: ProductBundleType['images'][0];
    onClick: () => void
  }
  
export const Thumb: React.FC<PropType> = (props) => {
    const { selected, productData, image, onClick } = props;
  
    const emblaThumbsSlideClassName = 'min-w-0 flex-[0_0_22%] pl-[var(--thumbs-slide-spacing)] ' + 'min-[576px]:flex-[0_0_15%]';

    return (
        <div
            className={ emblaThumbsSlideClassName.concat(
                selected ? ' text-[var(--text-body)]' : '',
            ) }
        >
            <button
                onClick={ onClick }
                type='button'
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
                        className={ `rounded-none object-cover scale-100 ${productData.estoqueTotal <= 0 ? 'opacity-50' : ''}` }
                        src={
                            productData.images && productData.images[0]
                                ? image.localUrl
                                : blankImage.src
                        }
                        alt={ `Foto de ${productData.name}` }
                        title={ `Foto de ${productData.name}` }
                        sizes={ '3000px' }
                        fill
                        placeholder="blur" // melhora a percepção de carregamento
                        blurDataURL={ blankImage.src }
                        // loading={ homePage ? 'eager' : 'lazy' }
                        quality={ 75 } // reduz um pouco a qualidade para diminuir o tamanho do arquivo
                    />
                </div>
            </button>
        </div>
    );
};
  


export default function ImageCarousel({ productData, options }: ImageCarouselProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true,
    });

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi],
    );
    
    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);
    
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
                '--slide-size-sm': '100%', // calc(100% / 1) equivale a 100%
                '--slide-spacing-lg': '2rem',
                '--slide-size-lg': '100%',
            } as React.CSSProperties }
        >
            <div className="overflow-hidden" ref={ emblaMainRef }>
                <div
                    className="flex ml-[calc(var(--slide-spacing)*-1)] min-[750px]:ml-[calc(var(--slide-spacing-sm)*-1)] min-[1200px]:ml-[calc(var(--slide-spacing-lg)*-1)]"
                    style={ { touchAction: 'pan-y pinch-zoom', backfaceVisibility: 'hidden' } }
                >
                    { productData.images.map((image, index) => (
                        <div
                            key={ index }
                            className={
                                'min-w-0 ' +
                                'pl-[var(--slide-spacing)] ' +
                                'flex-[0_0_var(--slide-size)] ' +
                                'min-[750px]:pl-[var(--slide-spacing-sm)] ' +
                                'min-[750px]:flex-[0_0_var(--slide-size-sm)] ' +
                                'min-[1200px]:pl-[var(--slide-spacing-lg)] ' +
                                'min-[1200px]:flex-[0_0_var(--slide-size-lg)]'
                            }
                        >
                            <ImageCarouselProduct productData={ productData } image={ image } />
                        </div>
                    )) }
                </div>
            </div>

            <div
                className="mt-[var(--thumbs-slide-spacing)]"
                style={ {
                    '--thumbs-slide-spacing': '0.8rem',
                    '--thumbs-slide-height': '6rem',
                } as React.CSSProperties }
            >
                <div className="overflow-hidden" ref={ emblaThumbsRef }>
                    <div className="flex flex-row ml-[calc(var(--thumbs-slide-spacing)*-1)]">
                        { productData.images.map((image, index) => (
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
            
        </section>
    );
}
