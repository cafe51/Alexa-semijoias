// Este é um módulo ES6
import { collection, getDocs, doc, Firestore, setDoc } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../src/app/firebase/config';
// import { ProductVariation } from '@/app/utils/types';
import { createSlugName, createSubsectionsWithSlug } from '@/app/utils/createSlugName';
import {  SectionType } from '../functions/src/types';

// Função principal que irá atualizar os documentos
export const updateProducts = async(db: Firestore = projectFirestoreDataBase) => {
    try {
        // sections: string[],
        // subsections?: string[], // do tipo 'sectionName:subsectionName'[]
        // categories: string[],
        // Referência para a coleção 'products'
        const sectionCollection = collection(db, 'siteSections');
        const sectionsSnapshot = await getDocs(sectionCollection);

        // const sectionWithSlugNameCollection = collection(db, 'siteSectionsWithSlugName');
        // const sectionsWithSlugNameSnapshot = await getDocs(sectionWithSlugNameCollection);
        
        const sectionsPromises = sectionsSnapshot.docs.map(async(docSnap) => {
            // const docRef = doc(db, 'siteSections', docSnap.id);
            const docRefOfSectionWithSlugName = doc(db, 'siteSectionsWithSlugName', docSnap.id);

            const section = docSnap.data() as SectionType;

            const sectionName = section.sectionName;
            const subsections = section.subsections;

            const newSubsections = subsections ? createSubsectionsWithSlug(subsections) : []; 
            const sectionSlugName = createSlugName(sectionName);

            return setDoc(docRefOfSectionWithSlugName, {
                sectionName,
                sectionSlugName,
                subsections: newSubsections,
            });

            // if(subsections && subsections.length > 0) {
            //     return updateDoc(docRef, {
            //         slugSectionName: slugSectionName,
            //         subsections: newSubsections,
            //     });
            // }
            // return updateDoc(docRef, {
            //     slugSectionName: slugSectionName,
            // });
        });

        // const productCollection = collection(db, 'products');
        // const productsSnapShot = await getDocs(productCollection);

        // const productsPromises = productsSnapShot.docs.map(async(docSnap) => {
        //     const docRef = doc(db, 'products', docSnap.id);
        //     const product = docSnap.data() as ProductBundleType;
        //     const subsections = product.subsections;
        //     const newSubsections = subsections?.map(subsection => {
        //         const subsectionName = subsection.split(':')[1];
        //         return `${subsection}:${createSlugName(subsectionName)}`;
        //     });
        //     return updateDoc(docRef, {
        //         subsections: newSubsections,
        //     });
        // });

        // Executa todas as promessas
        await Promise.all(sectionsPromises);
        // await Promise.all(productsPromises);

        console.log('Todos os produtos foram atualizados com sucesso.');

    } catch (error) {
        console.error('Erro ao atualizar produtos:', error);
        throw error;
    }
};
