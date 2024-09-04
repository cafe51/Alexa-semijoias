import ResponsiveCarousel from '@/app/components/ResponsiveCarousel';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import ProductSections from './ProductSections';
import { marginProfitValue } from '@/app/utils/marginProfitValue';
import formatPrice from '@/app/utils/formatPrice';

export default function DashboardProductDetails({ product }: {product:  ProductBundleType & FireBaseDocument}) {
    return (
        <section className='flex flex-col gap-4 w-full'>
            <div className='flex flex-wrap gap-2'>
                { product.categories.map((category) => <div key={ category } className='p-2 bg-green-600 rounded'><p className='text-white'>{ category }</p></div>) }
            </div>

            <p className='text-2xl font-semibold w-full'>{ product.name }</p>

            <ResponsiveCarousel productData={ product } />

            <div className=''>
                <p>{ product.description }</p>
            </div>

            <div className='flex flex-col gap-2'>
                <p>Preço: <span>{ formatPrice(product.value.price) }</span></p>
                <p>Preço Promocional: <span>{ formatPrice(product.value.promotionalPrice) }</span></p>
                <p>Custo: <span>{ formatPrice(product.value.cost) }</span></p>
                <p>Margem de Lucro: <span>{ marginProfitValue(product.value) ? marginProfitValue(product.value).toFixed(2) : 0 }</span> %</p>
                <p>Estoque Total: <span>{ product.estoqueTotal }</span></p>
            </div>

            <ProductSections sections={ product.sections } subsections={ product.subsections } />
        </section>
    );
}
