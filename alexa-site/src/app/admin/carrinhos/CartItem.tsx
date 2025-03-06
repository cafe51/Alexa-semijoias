// components/CartItem.tsx
import { useProduct } from './useProduct';
import { CartInfoType, ProductCartType } from '@/app/utils/types';
import DisplayCustomProperties from '@/app/components/DisplayCustomProperties';
import Image from 'next/image';
import blankImage from '../../../../public/blankImage.png';



interface CartItemProps {
  item: CartInfoType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const { product, loading, error } = useProduct(item.productId);

    if (loading) return <p>Carregando produto...</p>;
    console.log('XXXXXXXXXXXXXXXx', product?.id);
    if (error || !product || !product.exist || product.productVariations?.length === 0 || !product.productVariations) return <p>Erro ao carregar produto.</p>;

    // Busca a variação que corresponde ao sku do item
    const variation = product.productVariations.find(v => v.sku === item.skuId);
    if (!variation) return <p>Variação não encontrada.</p>;

    // Cria o objeto do tipo ProductCartType
    const productCart: ProductCartType = {
        name: variation.name,
        image: variation.image,
        categories: variation.categories,
        barcode: variation.barcode,
        value: variation.value,
        estoque: variation.estoque,
        dimensions: variation.dimensions,
        peso: variation.peso,
        customProperties: variation.customProperties,
        sections: variation.sections,
        subsections: variation.subsections,
        productId: item.productId,
        quantidade: item.quantidade,
        userId: item.userId,
        skuId: item.skuId,
    };

    return (
        <div className="flex items-center border-b py-2 gap-2">
            { /* <img src={ productCart.image } alt={ productCart.name } className="w-16 h-16 object-cover mr-4 aspect-[4/5]" /> */ }
            <div className="relative w-[clamp(45px,9vw,90px)] aspect-[4/5] flex-shrink-0">
                <Image
                    src={ productCart.image ? productCart.image : blankImage }
                    alt="Foto da peça"
                    priority
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, (max-width: 1024px) 220px, 220px"
                />
            </div>
            <div className="flex-1">
                <p className="font-bold bg-gray-200">{ productCart.name }</p>
                { productCart.customProperties &&  <DisplayCustomProperties customProperties={ productCart.customProperties } /> }
                <p>Quantidade: <span className='font-bold'>{ productCart.quantidade }</span></p>
                <p>Preço unitário: R$ <span className='font-bold'>{ productCart.value.price.toFixed(2) }</span></p>
            </div>
        </div>
    );
};

export default CartItem;
