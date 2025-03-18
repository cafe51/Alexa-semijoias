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
  
    return (
        <div
            className={ 'embla-thumbs__slide'.concat(
                selected ? ' embla-thumbs__slide--selected' : '',
            ) }
        >
            <div
                onClick={ onClick }
                className="embla-thumbs__slide__number"
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
        <section className="emblaProductPage">
            <div className="embla__viewport" ref={ emblaMainRef }>
                <div className="embla__container">
                    { productData.images.map((image, index) => (
                        <div className="embla__slide" key={ index }>
                            <ImageCarouselProduct productData={ productData } image={ image } />
                        </div>
                    )) }
                </div>
            </div>

            <div className="embla-thumbs">
                <div className="embla-thumbs__viewport" ref={ emblaThumbsRef }>
                    <div className="embla-thumbs__container">
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
