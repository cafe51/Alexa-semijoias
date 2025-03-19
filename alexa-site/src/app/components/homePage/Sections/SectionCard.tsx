import Image from 'next/image';
import Link from 'next/link';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';
import { Card, CardContent } from '@/components/ui/card';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { getImageUrlFromFirebaseProductDocument } from '@/app/utils/getImageUrlFromFirebaseProductDocument';


interface SectionCardProps {
    product: (ProductBundleType & FireBaseDocument);
    containerClassName?: string;
  }
  

export default function SectionCard({ product, containerClassName = 'bg-skeleton' }: SectionCardProps) {
    const titleOfBanner = product?.sections[0] ? product.sections[0] : 'Alexa Semijoias';
    const linkToSection = product?.sections[0] ? `/section/${product.sections[0]}` : '/section';

    return (
        <Card className={ `${ containerClassName }  flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg shadow-none  bg-transparent border-none rounded-t-none rounded-b-sm` }>
            <CardContent className="relative md:w-full md:h-full aspect-[4/5] md:aspect-auto bg-skeleton">
                <Image
                    data-testid="product-link"
                    className='rounded-none object-cover scale-100'
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
                <div className="absolute inset-0 flex items-end justify-center text-center">
                    <div className="relative pb-6 md:pb-10 md:px-10">
                        <p className="font-semibold text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl pb-4 md:pb-6 tracking-wider">
                            { titleOfBanner.toUpperCase() }
                        </p>
                        <Link href={ linkToSection }>
                            <button className="text-base md:text-xl text-white underline">
                                Explorar
                            </button>
                        </Link>
                    </div>
                </div>
            </CardContent>

        </Card>
    );
}