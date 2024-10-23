// Este é um módulo ES6
import { collection, getDocs, updateDoc, doc, Firestore } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../src/app/firebase/config'; // Importando o Firestore já configurado

type ProductBundleType = {
  value: { price: number; promotionalPrice: number; cost: number };
  finalPrice?: number; // Nova chave que vamos adicionar
};

// Função principal que irá atualizar os documentos
export const updateProducts = async(db: Firestore = projectFirestoreDataBase) => {
    const productsCollection = collection(db, 'products'); // Coleção no Firestore
    const snapshot = await getDocs(productsCollection); // Busca todos os documentos

    const promises = snapshot.docs.map(async(docSnap) => {
        const data = docSnap.data() as ProductBundleType;

        // Calcula o valor de 'finalPrice' com base nas regras fornecidas
        const finalPrice =
      data.value.promotionalPrice && data.value.promotionalPrice > 0
          ? data.value.promotionalPrice
          : data.value.price;

        // Atualiza o documento com a nova chave 'finalPrice'
        const docRef = doc(db, 'products', docSnap.id);
        return updateDoc(docRef, { finalPrice });
    });

    try {
        await Promise.all(promises); // Executa todas as operações de forma assíncrona
        console.log('Todos os produtos foram atualizados com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar produtos:', error);
        throw error; // Propaga o erro para ser tratado na API route
    }
};

// Se o arquivo for executado diretamente, chama a função
if (require.main === module) {
    updateProducts().catch((err) => console.error('Erro fatal:', err));
}
