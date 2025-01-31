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
        '@id': product.id,
        'productID': variation.sku,
        'name': product.name,
        'description': product.description,
        'url': `https://www.alexasemijoias.com.br/product/${product.slug}`,
        'image': mainImage,
        'brand': {
            '@type': 'Brand',
            'name': 'Alexa Semijoias',
            'url': 'https://www.alexasemijoias.com.br',
        },
        'category': product.categories.join(', '),
        'material': 'Semijoia',
        'itemCondition': 'https://schema.org/NewCondition',
        'manufacturer': {
            '@type': 'Organization',
            'name': 'Alexa Semijoias',
        },

        'offers': {
            '@type': 'Offer',
            'url': `https://www.alexasemijoias.com.br/product/${product.slug}`,
            'price': variation.value.price.toString(),
            'priceCurrency': 'BRL',
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': variation.estoque > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            'seller': {
                '@type': 'Organization',
                'name': 'Alexa Semijoias',
                'url': 'https://www.alexasemijoias.com.br',
            },
        },
        'additionalProperty': [
            {
                '@type': 'PropertyValue',
                'propertyID': 'item_group_id',
                'value': product.id,
            },
            {
                '@type': 'PropertyValue',
                'propertyID': 'categories',
                'value': product.categories.join(', '),
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
