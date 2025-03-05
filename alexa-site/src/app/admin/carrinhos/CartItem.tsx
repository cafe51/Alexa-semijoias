// components/CartItem.tsx
import React from 'react';
import { useProduct } from './useProduct';
import { CartInfoType, ProductCartType } from '@/app/utils/types';

interface CartItemProps {
  item: CartInfoType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const { product, loading, error } = useProduct(item.productId);

    if (loading) return <p>Carregando produto...</p>;
    console.log('XXXXXXXXXXXXXXXx', error);
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
        <div className="flex items-center border-b py-2">
            <img src={ productCart.image } alt={ productCart.name } className="w-16 h-16 object-cover mr-4" />
            <div className="flex-1">
                <p className="font-bold">{ productCart.name }</p>
                <p>Quantidade: { productCart.quantidade }</p>
                <p>Preço unitário: R$ { productCart.value.price.toFixed(2) }</p>
            </div>
        </div>
    );
};

export default CartItem;
