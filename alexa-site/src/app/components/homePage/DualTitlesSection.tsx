// src/app/components/homePage/DualTitlesSection.tsx
import Image from 'next/image';
import heroBannerLarge from '@/../public/heroBannerLarge.webp';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import toTitleCase from '@/app/utils/toTitleCase';
import { getImageUrlFromFirebaseProductDocument } from '@/app/utils/getImageUrlFromFirebaseProductDocument';
import Link from 'next/link';
import { createSlugName } from '@/app/utils/createSlugName';

interface DualTitlesSectionProps {
    products: (ProductBundleType & FireBaseDocument)[]
}

const TITLES = ['O presente perfeito, a joia ideal.', 'Beleza que transcende, joias que inspiram.'];

function BannerTitle({ title, section }: { title: string, section: string }) {
    return (
        <div className="absolute inset-0 flex items-end text-center justify-center">
            <div className="relative pb-6 md:pb-10 md:px-10  ">
                <p className='font-semibold text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl pb-4 md:pb-6 tracking-wider'>{ toTitleCase(title) }</p> 
                <Link href={ `/section/${createSlugName(section)}` } className='text-base md:text-xl text-white underline'>
                    <button className='text-base md:text-xl text-white underline'>Comprar { toTitleCase(section) }</button>
                </Link>
            </div>
        </div>
    );
}

export default function DualTitlesSection({ products }: DualTitlesSectionProps) {
    console.log('products', products);

    return (
        <section className="w-full grid md:grid-cols-2">
            {
                products.map((product, index) => (
                    <div key={ product.id } className="relative aspect-square md:aspect-[3/5] lg:aspect-[4/5] xl:aspect-[5/4] bg-skeleton">
                        <Image
                            className="object-cover"
                            src={ getImageUrlFromFirebaseProductDocument(product) }
                            title="Banner Principal Alexa Semijoias"
                            alt="Banner Principal Alexa Semijoias"
                            priority
                            sizes="1000px"
                            quality={ 80 }
                            fill
                            placeholder="blur"
                            blurDataURL={ heroBannerLarge.blurDataURL }
                        />
                        
                        <BannerTitle title={ TITLES[index] } section={ product.sections[0] } />
                    </div>
                ))
            }
        </section>
    );
}
