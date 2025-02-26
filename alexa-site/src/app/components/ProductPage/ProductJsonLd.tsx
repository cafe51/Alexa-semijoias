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
    // Define todas as imagens ou fallback
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

    // Define a cor base e material com base nas seções
    const baseColor = product.sections.includes('joias em aço inox') ? 'Prata' : 'Dourado';
    const material = product.sections.includes('joias em aço inox') ? 'Aço Inox' : 'Metal banhado a ouro 18k';

    // Configuração dos detalhes de frete para frete gratuito
    // OBS.: Se o valor do frete for relativo à localização (por exemplo, calculado a partir do CEP do comprador),
    // não é possível definir um valor fixo em shippingDetails. Neste caso, recomenda-se omitir shippingDetails
    // dos dados estruturados ou definir uma taxa padrão para uma região ampla.
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

    // Função auxiliar para gerar a oferta para cada variação
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
            hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'BR',
                merchantReturnDays: 30,
                merchantReturnLink: 'https://www.alexasemijoias.com.br/garantia',
                refundType: 'https://schema.org/FullRefund',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
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

    // Propriedades comuns a todos os modelos
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
        category: mainCategory,
        material,
        manufacturer: {
            '@type': 'Organization',
            name: 'Alexa Semijoias',
        },
        // Embora o hasMerchantReturnPolicy também esteja incluído dentro de offers,
        // pode ser mantido aqui para reforçar as informações comuns.
        hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'BR',
            merchantReturnDays: 30,
            merchantReturnLink: 'https://www.alexasemijoias.com.br/garantia',
            refundType: 'https://schema.org/FullRefund',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
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
            hasVariant: product.productVariations.map((variation) => {
                // Se existir a chave "cor" em customProperties, combina a cor base com o valor customizado
                const variantColor =
          variation.customProperties && variation.customProperties.cor
              ? `${baseColor}/${variation.customProperties.cor}`
              : baseColor;
                return {
                    '@type': 'Product',
                    name: toTitleCase(product.name),
                    sku: variation.sku,
                    image: variation.image || images[0],
                    color: variantColor,
                    weight: {
                        '@type': 'QuantitativeValue',
                        value: variation.peso,
                        unitCode: 'GRM',
                    },
                    offers: createOffer(variation.estoque),
                };
            }),
        };

        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={ { __html: JSON.stringify(productGroup) } }
            />
        );
    } else {
    // Caso haja somente uma variação
        const variation = product.productVariations[0];
        const variantColor =
      variation.customProperties && variation.customProperties.cor
          ? `${baseColor}/${variation.customProperties.cor}`
          : baseColor;
        const productData = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            '@id': product.id,
            url: productPageUrl,
            ...commonProperties,
            sku: variation.sku,
            color: variantColor,
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
