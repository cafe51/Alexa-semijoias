import { adminDb } from '@/app/firebase/admin-config';
import { CouponType, FireBaseDocument, ProductBundleType } from '@/app/utils/types';

/**
 * Atualiza o estoque de um produto com base na variação (SKU)
 */
export async function updateProductStock(
    productId: string,
    skuId: string,
    quantity: number,
    operation: '+' | '-',
) {
    const productRef = adminDb.collection('products').doc(productId);

    await adminDb.runTransaction(async(transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists) {
            throw new Error(`Product ${productId} not found`);
        }

        const productData = productDoc.data() as ProductBundleType & FireBaseDocument;
        const variationIndex = productData.productVariations.findIndex(
            (v) => v.sku === skuId,
        );

        if (variationIndex === -1) {
            throw new Error(`SKU ${skuId} not found in product ${productId}`);
        }

        const currentStock = productData.productVariations[variationIndex].estoque;
        const newStock =
      operation === '+'
          ? currentStock + quantity
          : currentStock - quantity;

        if (newStock < 0) {
            throw new Error(
                `Insufficient stock for product ${productId}, SKU ${skuId}`,
            );
        }

        productData.productVariations[variationIndex].estoque = newStock;
        productData.estoqueTotal =
      operation === '+'
          ? productData.estoqueTotal + quantity
          : productData.estoqueTotal - quantity;

        transaction.update(productRef, productData);
    });
}

/**
 * Atualiza o estoque (limite de uso) de um cupom
 */
export async function updateCuponsDocStock(
    cuponId: string,
    operation: '+' | '-',
) {
    const cuponRef = adminDb.collection('cupons').doc(cuponId);

    await adminDb.runTransaction(async(transaction) => {
        const cuponDoc = await transaction.get(cuponRef);
        if (!cuponDoc.exists) {
            throw new Error(`Cupom ${cuponId} not found`);
        }

        const cuponData = cuponDoc.data() as CouponType & FireBaseDocument;
        if (cuponData.limiteUsoGlobal !== null) {
            const newStock =
        operation === '+'
            ? cuponData.limiteUsoGlobal + 1
            : cuponData.limiteUsoGlobal - 1;

            cuponData.limiteUsoGlobal = newStock;
            transaction.update(cuponRef, cuponData);
        }
    });
}

/**
 * Deleta os documentos de `couponUsages` com base no campo orderId
 */
// export async function deleteCouponUsageDoc(orderId: string) {
//     try {
        
//         const couponUsageQuerySnapshot = await adminDb
//             .collection('couponUsages')
//             .where('orderId', '==', orderId)
//             .get();
    
//         if (couponUsageQuerySnapshot.empty) {
//             throw new Error(`Cupom usage com orderId ${orderId} não encontrado`);
//         }
    
//         await adminDb.runTransaction(async(transaction) => {
//             couponUsageQuerySnapshot.docs.forEach((docSnap) => {
//                 transaction.delete(docSnap.ref);
//             });
//         });
//     } catch (error) {
//         console.error('Erro ao deletar documento de uso de cupom usando orderId = ' + orderId + ':', error);
//         throw error;
//     }
// }
