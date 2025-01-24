// src/app/components/ProductPage/ProductJsonLd.tsx

'use client';

import { ProductBundleType, ProductVariation } from '@/app/utils/types';
import { FireBaseDocument } from '@/app/utils/types';

interface ProductJsonLdProps {
    product: ProductBundleType & FireBaseDocument;
    selectedVariation?: ProductVariation;
}

export default function ProductJsonLd({ product, selectedVariation }: ProductJsonLdProps) {
    // Pega a primeira variação se nenhuma estiver selecionada
    const variation = selectedVariation || product.productVariations[0];
    
    // Constrói a URL da imagem principal
    const mainImage = product.images[0]?.localUrl || '';

    // Constrói o objeto JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'productID': variation.sku,
        'name': product.name,
        'description': product.description,
        'url': typeof window !== 'undefined' ? window.location.href : '',
        'image': mainImage,
        'brand': 'Alexa Semijoias', // Nome da marca fixo
        'offers': [
            {
                '@type': 'Offer',
                'price': variation.value.price.toString(),
                'priceCurrency': 'BRL',
                'itemCondition': 'https://schema.org/NewCondition',
                'availability': variation.estoque > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
        ],
        'additionalProperty': [
            {
                '@type': 'PropertyValue',
                'propertyID': 'item_group_id',
                'value': product.id, // ID do produto como group ID
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={ { __html: JSON.stringify(jsonLd) } }
        />
    );
}
