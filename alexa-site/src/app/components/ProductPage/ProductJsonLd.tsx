// src/app/components/ProductPage/ProductJsonLd.tsx
'use client';

import toTitleCase from '@/app/utils/toTitleCase';
import { ProductBundleType } from '@/app/utils/types';
import { FireBaseDocument } from '@/app/utils/types';
import { getGoogleProductCategory } from '@/app/utils/getGoogleProductCategory';

interface ProductJsonLdProps {
    product: ProductBundleType & FireBaseDocument;
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
    // Usa a variação selecionada ou a primeira
    
    // URL da imagem principal
    const mainImage = product.images[0]?.localUrl || 'https://www.alexasemijoias.com.br/favicon.ico';

    const subsectionName = product.subsections ? product.subsections[0].split(':')[1] : '';

    // Constrói o objeto JSON‑LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': product.id,
        'content_id': product.id,
        'productID': product.id,
        'name': toTitleCase(product.name),
        'description': product.description.split('.')[0] || product.description,
        'keywords': [...new Set([product.sections[0], subsectionName, ...(product.categories || []), ...product.categories,  'semijoias', 'joias', 'acessórios', 'folheados', 'presentes'])].join(', '),
        'url': `https://www.alexasemijoias.com.br/product/${product.slug}`,
        'image': mainImage,
        'brand': {
            '@type': 'Brand',
            'name': 'Alexa Semijoias',
            'url': 'https://www.alexasemijoias.com.br',
        },
        'category': product.sections[0],
        'weight': {
            '@type': 'QuantitativeValue',
            'value': product.productVariations[0].peso,
        },
        'material': 'Semijoia, banho ouro 18k, aço inox',
        'itemCondition': 'https://schema.org/NewCondition',
        'manufacturer': {
            '@type': 'Organization',
            'name': 'Alexa Semijoias',
        },
        'hasMerchantReturnPolicy': {
            '@type': 'MerchantReturnPolicy',
            'applicableCountry': 'BR',
            'merchantReturnDays': '30',
            'merchantReturnLink': 'https://www.alexasemijoias.com.br/garantia',
            'refundType': 'https://schema.org/FullRefund',
        },
        
        'offers': {
            '@type': 'Offer',
            'url': `https://www.alexasemijoias.com.br/product/${product.slug}`,
            'price': product.value.price,
            'priceCurrency': 'BRL',
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': product.estoqueTotal > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
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
            {
                '@type': 'PropertyValue',
                'propertyID': 'google_product_category',
                'value': getGoogleProductCategory(product).toString(),
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
