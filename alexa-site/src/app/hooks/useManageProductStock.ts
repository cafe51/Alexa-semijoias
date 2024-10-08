// app/hooks/useCollection.ts
import { ProductBundleType } from '../utils/types';
import { useCollection } from './useCollection';

export const useManageProductStock = () => {
    const { updateDocumentField: updateProductBundleDocument, getDocumentById: getProductBundleDocumentById  } = useCollection<ProductBundleType>('products');

    const updateTheProductDocumentStock = async(productId: string, skuId: string, quantity: number, operator: '+' | '-') => {
        try {
            // 1. Recuperar o documento do produto
            const product = await getProductBundleDocumentById(productId);
            console.log('productId', productId);
            if (!product.exist) throw new Error('Product not found');

            // 2. Encontrar a variação específica
            const variationIndex = product.productVariations.findIndex(v => v.sku === skuId);
            if (variationIndex === -1) throw new Error('Product variation not found');

            // 3. Atualizar o estoque da variação e o estoque total
            const updatedVariations = [...product.productVariations];

            let updatedStockTotal = 0;

            if (operator === '+') {
                updatedVariations[variationIndex].estoque += quantity;
                updatedStockTotal = product.estoqueTotal + quantity;
            } 

            if (operator === '-') {
                updatedVariations[variationIndex].estoque -= quantity;
                updatedStockTotal = product.estoqueTotal - quantity;
            } 


            // 4. Enviar as atualizações para o Firebase
            await updateProductBundleDocument(productId, 'productVariations', updatedVariations);
            await updateProductBundleDocument(productId, 'estoqueTotal', updatedStockTotal);

            console.log('Estoque atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar estoque:', error);
        }
    };
    
    return { updateTheProductDocumentStock };
};