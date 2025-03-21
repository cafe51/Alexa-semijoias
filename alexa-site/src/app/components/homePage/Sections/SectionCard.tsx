import Image from 'next/image';
import Link from 'next/link';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';
import { Card, CardContent } from '@/components/ui/card';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { getImageUrlFromFirebaseProductDocument } from '@/app/utils/getImageUrlFromFirebaseProductDocument';
import { createSlugName } from '@/app/utils/createSlugName';



interface SectionCardProps {
    product: (ProductBundleType & FireBaseDocument);
    containerClassName?: string;
    homePage?: boolean;
  }
  

export default function SectionCard({ product, containerClassName = 'bg-skeleton', homePage=false }: SectionCardProps) {
    const titleOfBanner = product?.sections[0] ? product.sections[0] : 'Alexa Semijoias';
    const linkToSection = product?.sections[0] ? `/section/${createSlugName(product.sections[0])}` : '/section';

    return (
        <Card className={ `${ containerClassName } flex flex-col h-full overflow-hidden transition-shadow  duration-300 hover:shadow-lg shadow-none  bg-transparent border-none rounded-none` }>
            <CardContent className={ `relative md:w-full md:h-full aspect-[4/5] ${ homePage ? 'md:aspect-auto' : '' }  bg-skeleton hover:scale-110 transition-transform duration-300 hover:shadow-lg shadow-none` }>
                <Image
                    data-testid="product-link"
                    className='rounded-none object-cover scale-100 '
                    src={ getImageUrlFromFirebaseProductDocument(product) }
                    alt={ `Imagem da seção de ${titleOfBanner}` } 
                    title={ `Imagem da seção de ${titleOfBanner}` }
                    sizes={ '3000px' }
                    fill
                    placeholder="blur" // melhora a percepção de carregamento
                    blurDataURL={ heroBannerLarge.blurDataURL }
                    // loading={ homePage ? 'eager' : 'lazy' }
                    quality={ 75 } // reduz um pouco a qualidade para diminuir o tamanho do arquivo
                />
                <Link href={ linkToSection } className="absolute inset-0 flex items-end justify-center text-center bg-black/20">
                    <div className="relative pb-6 md:pb-10 md:px-10">
                        <p className="font-semibold text-white text-2xl md:text-4xl lg:text-5xl xl:text-6xl pb-4 md:pb-6 tracking-wider">
                            { titleOfBanner.toUpperCase() }
                        </p>
                    </div>
                </Link>
            </CardContent>

        </Card>
    );
}