import { projectFirestoreDataBase } from '@/app/firebase/config';
import { CouponType, FireBaseDocument } from '@/app/utils/types';
import { 
    collection, 
    query, 
    where, 
    getDocs,
    doc,
    runTransaction, 
} from 'firebase/firestore';

export async function updateProductStock(productId: string, skuId: string,quantity: number,operation: '+' | '-') {
    const productRef = doc(projectFirestoreDataBase, 'products', productId);
    
    await runTransaction(projectFirestoreDataBase, async(transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
            throw new Error(`Product ${productId} not found`);
        }

        const productData = productDoc.data();
        const variationIndex = productData.productVariations.findIndex((v: any) => v.sku === skuId);
        
        if (variationIndex === -1) {
            throw new Error(`SKU ${skuId} not found in product ${productId}`);
        }

        const newStock = operation === '+' 
            ? productData.productVariations[variationIndex].estoque + quantity
            : productData.productVariations[variationIndex].estoque - quantity;

        if (newStock < 0) {
            throw new Error(`Insufficient stock for product ${productId}, SKU ${skuId}`);
        }

        productData.productVariations[variationIndex].estoque = newStock;
        productData.estoqueTotal = operation === '+'
            ? productData.estoqueTotal + quantity
            : productData.estoqueTotal - quantity;

        transaction.update(productRef, productData);
    });
}

export async function updateCuponsDocStock(cuponId: string, operation: '+' | '-') {
    const cuponRef = doc(projectFirestoreDataBase, 'cupons', cuponId);
    await runTransaction(projectFirestoreDataBase, async(transaction) => {
        const cuponDoc = await transaction.get(cuponRef);
        if (!cuponDoc.exists()) {
            throw new Error(`Cupom ${cuponId} not found`);
        }

        const cuponData = cuponDoc.data() as CouponType & FireBaseDocument;
        if(cuponData.limiteUsoGlobal !== null) {
            const newStock = operation === '+' 
                ? cuponData.limiteUsoGlobal + 1
                : cuponData.limiteUsoGlobal - 1;

            cuponData.limiteUsoGlobal = newStock;
            transaction.update(cuponRef, cuponData);
        }

    });
}

/** Deleta o(s) documento(s) de couponUsages com base no campo cuponId */
export async function deleteCouponUsageDoc(orderId: string) {
    // Executa a query fora da transação para obter os documentos correspondentes ao cuponId
    const couponUsageQuery = query(
        collection(projectFirestoreDataBase, 'couponUsages'),
        where('orderId', '==', orderId),
    );
  
    const querySnapshot = await getDocs(couponUsageQuery);
  
    if (querySnapshot.empty) {
        throw new Error(`Cupom usage com orderId ${orderId} não encontrado`);
    }
  
    // Agora executa a transação para deletar cada documento encontrado
    await runTransaction(projectFirestoreDataBase, async(transaction) => {
        for (const docSnap of querySnapshot.docs) {
            const docRef = docSnap.ref;
            // (Opcional) Leitura do documento dentro da transação para garantir a consistência
            await transaction.get(docRef);
            transaction.delete(docRef);
        }
    });
}