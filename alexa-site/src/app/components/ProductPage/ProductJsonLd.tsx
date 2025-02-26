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
    // Conjunto de imagens: usa todas se disponíveis, ou fallback
    const images =
    product.images && product.images.length > 0
        ? product.images.map((img) => img.localUrl)
        : ['https://www.alexasemijoias.com.br/favicon.ico'];

    // Cria uma descrição resumida (até 160 caracteres)
    const description =
    product.description.length > 160
        ? product.description.slice(0, 157) + '...'
        : product.description;

    const mainCategory = product.sections[0] || '';
    const subsectionName = product.subsections ? product.subsections[0].split(':')[1] : '';

    // Define cor e material com base na seção
    const color = product.sections.includes('joias em aço inox') ? 'Prata' : 'Dourado';
    const material = product.sections.includes('joias em aço inox') ? 'Aço Inox' : 'Metal banhado a ouro 18k';

    // Configura detalhes de frete com base no preço do produto
    let shippingDetails: any;
    if (product.value.price >= 350) {
        shippingDetails = {
            '@type': 'OfferShippingDetails',
            shippingRate: {
                '@type': 'MonetaryAmount',
                value: 0,
                currency: 'BRL',
            },
            shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: 'BR',
            },
        };
    } else if (product.value.price >= 200) {
        shippingDetails = {
            '@type': 'OfferShippingDetails',
            shippingRate: {
                '@type': 'MonetaryAmount',
                value: 0,
                currency: 'BRL',
            },
            shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: 'BR',
                addressRegion: ['SP', 'RJ', 'MG', 'ES'],
            },
        };
    }

    // Função auxiliar para criar a oferta com preço, disponibilidade e, se for o caso, especificação de preços promocionais
    function createOffer(estoque: number) {
        const basePrice =
      product.promotional && product.value.promotionalPrice
          ? product.value.promotionalPrice
          : product.value.price;
        const offer: any = {
            '@type': 'Offer',
            url: `https://www.alexasemijoias.com.br/product/${product.slug}`,
            price: basePrice,
            priceCurrency: 'BRL',
            itemCondition: 'https://schema.org/NewCondition',
            availability: estoque > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'Alexa Semijoias',
                url: 'https://www.alexasemijoias.com.br',
            },
            ...(shippingDetails ? { shippingDetails } : {}),
        };
        if (product.promotional && product.value.promotionalPrice) {
            offer.priceSpecification = [
                {
                    '@type': 'UnitPriceSpecification',
                    price: product.value.promotionalPrice,
                    priceCurrency: 'BRL',
                },
                {
                    '@type': 'UnitPriceSpecification',
                    priceType: 'https://schema.org/StrikethroughPrice',
                    price: product.value.price,
                    priceCurrency: 'BRL',
                },
            ];
        }
        return offer;
    }

    // Propriedades comuns a todos os modelos (ProductGroup e Product)
    const commonProperties = {
        name: toTitleCase(product.name),
        description,
        image: images,
        brand: {
            '@type': 'Brand',
            name: 'Alexa Semijoias',
            url: 'https://www.alexasemijoias.com.br',
        },
        audience: {
            '@type': 'PeopleAudience',
            suggestedGender: 'https://schema.org/Female',
            suggestedMinAge: 13,
            suggestedMaxAge: 99,
        },
        color,
        category: mainCategory,
        material,
        manufacturer: {
            '@type': 'Organization',
            name: 'Alexa Semijoias',
        },
        hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'BR',
            merchantReturnDays: 30,
            merchantReturnLink: 'https://www.alexasemijoias.com.br/garantia',
            refundType: 'https://schema.org/FullRefund',
        },
        additionalProperty: [
            {
                '@type': 'PropertyValue',
                propertyID: 'item_group_id',
                value: product.id,
            },
            {
                '@type': 'PropertyValue',
                propertyID: 'categories',
                value: product.categories.join(', '),
            },
            {
                '@type': 'PropertyValue',
                propertyID: 'google_product_category',
                value: getGoogleProductCategory(product).toString(),
            },
        ],
        keywords: [
            mainCategory,
            subsectionName,
            ...(product.categories || []),
            'semijoias',
            'joias',
            'acessórios',
            'folheados',
            'presentes',
        ].join(', '),
    };

    const productPageUrl = `https://www.alexasemijoias.com.br/product/${product.slug}`;

    // Se houver mais de uma variação, utiliza o modelo ProductGroup
    if (product.productVariations.length > 1) {
        const productGroup = {
            '@context': 'https://schema.org',
            '@type': 'ProductGroup',
            '@id': product.id,
            url: productPageUrl,
            ...commonProperties,
            hasVariant: product.productVariations.map((variation) => ({
                '@type': 'Product',
                name: toTitleCase(product.name),
                sku: variation.sku,
                image: variation.image || images[0],
                weight: {
                    '@type': 'QuantitativeValue',
                    value: variation.peso,
                    unitCode: 'GRM',
                },
                offers: createOffer(variation.estoque),
            })),
        };

        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={ { __html: JSON.stringify(productGroup) } }
            />
        );
    } else {
    // Caso haja somente uma variação, gera o JSON‑LD no formato Product
        const variation = product.productVariations[0];
        const productData = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            '@id': product.id,
            url: productPageUrl,
            ...commonProperties,
            sku: variation.sku,
            weight: {
                '@type': 'QuantitativeValue',
                value: variation.peso,
                unitCode: 'GRM',
            },
            offers: createOffer(variation.estoque),
        };

        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={ { __html: JSON.stringify(productData) } }
            />
        );
    }
}
