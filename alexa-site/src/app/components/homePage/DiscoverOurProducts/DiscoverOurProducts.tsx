'use client';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import DiscoverOurProductsButtonsCarousel from './DiscoverOurProductsButtonsCarousel';
import DiscoverOurProductsImagesCarousel from './DiscoverOurProductsImagesCarousel';

interface DiscoverOurProductsProps {
    products: (ProductBundleType & FireBaseDocument)[]
    sections: string[]
}

export default function DiscoverOurProducts({ products, sections }: DiscoverOurProductsProps) {
    return (
        <section className="pt-14 md:flex md:flex-col md:items-center md:justify-center"> 
            <h1 className="text-2xl sm:text-3xl text-center mb-6 sm:mb-8 md:mb-12">Descubra Nossas Peças</h1>

            <DiscoverOurProductsButtonsCarousel sections={ sections }/>

            <DiscoverOurProductsImagesCarousel products={ products }/>
            <div className='flex justify-center items-center my-6 '> 
                <button className='px-6 p-4 bg-black text-white rounded-full'>Ver todos</button>
            </div>

        </section>
    );
}

