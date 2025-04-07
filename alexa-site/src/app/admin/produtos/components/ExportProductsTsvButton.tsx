// src/app/components/ExportProductsTsvButton.tsx
'use client';

import React, { useState } from 'react';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ProductBundleType } from '@/app/utils/types';
import toTitleCase from '@/app/utils/toTitleCase';

interface ModalErrorProps {
  message: string;
  onClose: () => void;
}

function ModalError({ message, onClose }: ModalErrorProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4">Erro</h2>
                <p className="mb-4">{ message }</p>
                <button
                    onClick={ onClose }
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
          Fechar
                </button>
            </div>
        </div>
    );
}

// Função auxiliar para truncar a descrição em até 160 caracteres
function truncateDescription(desc: string): string {
    return desc.length > 160 ? desc.slice(0, 157) + '...' : desc;
}

// Função auxiliar para encapsular e escapar valores (para preservar integridade de campos com vírgulas, quebras de linha etc.)
const escapeAndQuote = (value: any): string => {
    if (value === null || value === undefined) {
        return '""';
    }
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
};

export default function ExportProductsTsvButton() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleDownload = async() => {
        setLoading(true);
        setErrorMessage(null);
        try {
            // Buscar todos os produtos ativos (showProduct == true)
            const productsRef = collection(projectFirestoreDataBase, 'products');
            const productsQuery = query(productsRef, where('showProduct', '==', true));
            const productsSnapshot = await getDocs(productsQuery);

            const products: (ProductBundleType & { id: string })[] = [];
            productsSnapshot.forEach((doc) => {
                const data = doc.data() as ProductBundleType;
                products.push({ ...data, id: doc.id });
            });

            // Define a ordem e os nomes das colunas conforme o padrão do Google Merchant
            const headerFields = [
                'title',
                'id',
                'price',
                'condition',
                'availability',
                'channel',
                'feed label',
                'language',
                'additional image link',
                'age group',
                'all clicks',
                'brand',
                'color',
                'description',
                'image link',
                'item group id',
                'link',
                'material',
                'shipping(country)',
            ];

            const header = headerFields.map(escapeAndQuote).join('\t');

            // Mapeia cada produto para os campos do TSV utilizando os mesmos critérios do seu JSON-LD
            const rows = products.map((product) => {
                // Título com formatação (toTitleCase)
                const title = toTitleCase(product.name);
                // ID do documento
                const id = product.id;
                // Preço: se houver promoção, usa o valor promocional; caso contrário, o preço normal, seguido de " BRL"
                const basePrice =
          product.promotional && product.value.promotionalPrice
              ? product.value.promotionalPrice
              : product.value.price;
                const price = `${basePrice} BRL`;
                // Condição: sempre "new"
                const condition = 'new';
                // Disponibilidade: com base no estoque total
                const availability = product.estoqueTotal > 0 ? 'in stock' : 'out of stock';
                // Channel: "Online" (com letra maiúscula)
                const channel = 'Online';
                // Feed label: definido como "BR"
                const feedLabel = 'BR';
                // Language: definido como "pt"
                const language = 'pt';
                // Additional image link: se houver mais de uma imagem, junta os links (a partir do segundo) separados por vírgula; se não, fica como null
                let additionalImageLink = null;
                if (product.images && product.images.length > 1) {
                    additionalImageLink = product.images.slice(1).map((img) => img.localUrl).join(',');
                }
                // Age group: definido como "adult"
                const ageGroup = 'adult';
                // All clicks: sempre "0"
                const allClicks = '0';
                // Brand: "Alexa Semijoias"
                const brand = 'Alexa Semijoias';
                // Cor: se a seção inclui "joias em aço inox", baseColor é "prata"; senão, "dourado". Se a variação tiver propriedade customizada "cor", concatenamos
                let baseColor = product.sections.includes('joias em aço inox') ? 'prata' : 'dourado';
                if (
                    product.productVariations.length > 0 &&
          product.productVariations[0].customProperties &&
          product.productVariations[0].customProperties.cor
                ) {
                    baseColor = `${baseColor}/${product.productVariations[0].customProperties.cor.toLowerCase()}`;
                }
                // Descrição: truncada para até 160 caracteres
                const description = truncateDescription(product.description);
                // Image link: utiliza a primeira imagem ou fallback
                const imageLink =
          product.images && product.images.length > 0
              ? product.images[0].localUrl
              : 'https://www.alexasemijoias.com.br/favicon.ico';
                // Item group id: se houver mais de uma variação, usa product.id; senão, null
                const itemGroupId = product.productVariations.length > 1 ? product.id : null;
                // Link canônico, utilizando o slug do produto
                const link = `https://www.alexasemijoias.com.br/product/${product.slug}`;
                // Material: seguindo o JSON-LD, se o produto for de "joias em aço inox", material é null; caso contrário, "metal"
                const material = product.sections.includes('joias em aço inox') ? null : 'metal';
                // Shipping(country): definido como "BR"
                const shippingCountry = 'BR';

                const fields = [
                    title,
                    id,
                    price,
                    condition,
                    availability,
                    channel,
                    feedLabel,
                    language,
                    additionalImageLink,
                    ageGroup,
                    allClicks,
                    brand,
                    baseColor,
                    description,
                    imageLink,
                    itemGroupId,
                    link,
                    material,
                    shippingCountry,
                ];

                return fields.map(escapeAndQuote).join('\t');
            });

            // Junta o cabeçalho com as linhas, utilizando \r\n para as quebras de linha e adicionando o BOM para UTF-8
            const tsvContent = '\uFEFF' + [header, ...rows].join('\r\n');

            // Cria um Blob e dispara o download
            const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const linkElement = document.createElement('a');
            linkElement.href = url;
            linkElement.download = 'products.tsv';
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Erro ao buscar produtos:', error);
            setErrorMessage(error.message || 'Erro desconhecido ao buscar produtos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={ handleDownload }
                disabled={ loading }
                className="btn-export px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                { loading ? 'Carregando...' : 'Exportar Produtos (.tsv)' }
            </button>
            { errorMessage && (
                <ModalError message={ errorMessage } onClose={ () => setErrorMessage(null) } />
            ) }
        </div>
    );
}
