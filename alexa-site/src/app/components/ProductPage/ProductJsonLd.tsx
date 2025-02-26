'use client';

import toTitleCase from '@/app/utils/toTitleCase';
import { ProductBundleType } from '@/app/utils/types';
import { FireBaseDocument } from '@/app/utils/types';
import { getGoogleProductCategory } from '@/app/utils/getGoogleProductCategory';

interface ProductJsonLdProps {
  product: ProductBundleType & FireBaseDocument;
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
    const mainImage = product.images[0]?.localUrl || 'https://www.alexasemijoias.com.br/favicon.ico';
    const subsectionName = product.subsections ? product.subsections[0].split(':')[1] : '';

    // Determina a cor do produto com base no nome ou outra lógica
    // Exemplo: se o nome conter "aço", definimos como "Prata", caso contrário, "Dourado"
    const color = product.sections.includes('joias em aço inox') ? 'Prata' : 'Dourado';
    const material = product.sections.includes('joias em aço inox') ? 'Aço Inox' : 'Metal banhado a ouro 18k';

    // Configuração dos detalhes do frete de acordo com o preço do produto
    let shippingDetails;
    if (product.value.price >= 350) {
    // Frete gratuito para todo o Brasil
        shippingDetails = {
            '@type': 'OfferShippingDetails',
            'shippingRate': {
                '@type': 'MonetaryAmount',
                'value': 0,
                'currency': 'BRL',
            },
            'shippingDestination': {
                '@type': 'DefinedRegion',
                'addressCountry': 'BR',
            },
        };
    } else if (product.value.price >= 200) {
    // Frete gratuito para a região sudeste (SP, RJ, MG, ES)
        shippingDetails = {
            '@type': 'OfferShippingDetails',
            'shippingRate': {
                '@type': 'MonetaryAmount',
                'value': 0,
                'currency': 'BRL',
            },
            'shippingDestination': {
                '@type': 'DefinedRegion',
                'addressCountry': 'BR',
                'addressRegion': ['SP', 'RJ', 'MG', 'ES'],
            },
        };
    }

    // Configuração do objeto de oferta
    const offer: any = {
        '@type': 'Offer',
        'url': `https://www.alexasemijoias.com.br/product/${product.slug}`,
        // Se estiver em promoção, o preço ativo será o promocional; caso contrário, o preço normal
        'price': product.promotional && product.value.promotionalPrice ? product.value.promotionalPrice : product.value.price,
        'priceCurrency': 'BRL',
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': product.estoqueTotal > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'seller': {
            '@type': 'Organization',
            'name': 'Alexa Semijoias',
            'url': 'https://www.alexasemijoias.com.br',
        },
        ...(shippingDetails ? { shippingDetails } : {}),
    };

    // Se o produto estiver em promoção, adiciona a especificação de preço para o preço tachado
    if (product.promotional && product.value.promotionalPrice) {
        offer['priceSpecification'] = [
            {
                '@type': 'UnitPriceSpecification',
                'price': product.value.promotionalPrice,
                'priceCurrency': 'BRL',
            },
            {
                '@type': 'UnitPriceSpecification',
                'priceType': 'https://schema.org/StrikethroughPrice',
                'price': product.value.price,
                'priceCurrency': 'BRL',
            },
        ];
    }

    // Construção do objeto JSON‑LD do produto
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': product.id,
        'name': toTitleCase(product.name),
        'description': product.description.split('.')[0] || product.description,
        'keywords': [
            ...new Set([
                product.sections[0],
                subsectionName,
                ...(product.categories || []),
                'semijoias',
                'joias',
                'acessórios',
                'folheados',
                'presentes',
            ]),
        ].join(', '),
        'url': `https://www.alexasemijoias.com.br/product/${product.slug}`,
        'image': mainImage,
        'brand': {
            '@type': 'Brand',
            'name': 'Alexa Semijoias',
            'url': 'https://www.alexasemijoias.com.br',
        },
        // Propriedade audience com PeopleAudience para especificar o público-alvo
        'audience': {
            '@type': 'PeopleAudience',
            'suggestedGender': 'https://schema.org/Female',
            'suggestedMinAge': 13,
            'suggestedMaxAge': 99,
        },
        // Propriedade color para especificar a cor do produto
        'color': color,
        'category': product.sections[0],
        'weight': {
            '@type': 'QuantitativeValue',
            'value': product.productVariations[0].peso,
            'unitCode': 'GRM',
        },
        'material': material,
        'itemCondition': 'https://schema.org/NewCondition',
        'manufacturer': {
            '@type': 'Organization',
            'name': 'Alexa Semijoias',
        },
        'hasMerchantReturnPolicy': {
            '@type': 'MerchantReturnPolicy',
            'applicableCountry': 'BR',
            'merchantReturnDays': 30,
            'merchantReturnLink': 'https://www.alexasemijoias.com.br/garantia',
            'refundType': 'https://schema.org/FullRefund',
        },
        'offers': offer,
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
