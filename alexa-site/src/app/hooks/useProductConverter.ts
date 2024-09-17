import { useEffect, useState } from 'react';
import { CategoryType, FireBaseDocument, ImageProductDataType, ProductBundleType, ProductVariation, ProductVariationsType, SectionType, StateNewProductType } from '../utils/types';
import { useCollection } from './useCollection';
import useFirebaseUpload from './useFirebaseUpload';
import { getRandomBarCode } from '../utils/getRandomBarCode';
import { getRandomSku } from '../utils/getRandomSku';
import blankImage from '../../../public/blankImage.jpg';
import { Timestamp } from 'firebase/firestore';

export function useProductConverter() {
    const [siteSectionsFromFirebase, setSiteSectionsFromFirebase] = useState<(SectionType & FireBaseDocument)[]>([{ sectionName: '', id: '', exist: false }]);

    const { uploadImages } = useFirebaseUpload();
    const {
        addDocument: createNewSiteSectionDocument,
        updateDocumentField: updateSiteSectionDocumentField,
        getDocumentById: getSiteSectionDocumentById,
        getAllDocuments: getSiteSectionsFromFirebase,
    } = useCollection<SectionType>('siteSections');

    const {
        getAllDocuments: getAllCategoriesFromFirebase,
        addDocument: createNewCategoryDocument,
    } = useCollection<CategoryType>('categories');

    const {
        getAllDocuments: getAllProductVariationsFromFirebase,
        addDocument: createNewProductVariationDocument,
        deleteDocument: deleteProductVariationDocument,
    } = useCollection<ProductVariationsType>('productVariations');



    useEffect(() => {
        const fetchFromFirebase = async() => {
            const siteSectionsRes = await getSiteSectionsFromFirebase();
            setSiteSectionsFromFirebase(siteSectionsRes);
        };

        fetchFromFirebase();
    }, []);
    
    const hasProductVariations = (editableProduct: StateNewProductType, imagesData: ImageProductDataType[], productId: string): ProductBundleType => {
        let totalStock = 0;

        for (const pv of editableProduct.productVariations) {
            totalStock += pv.defaultProperties.estoque;
        }

        const { description, name, sections, value, variations, creationDate, subsections } = editableProduct;

        return {
            name: name.trim(),
            description: description.trim(),
            creationDate,
            subsections,
            updatingDate: Timestamp.now(),
            sections, value, variations,
            lancamento: editableProduct.moreOptions.find((mop) => mop.property === 'lancamento')!.isChecked,
            freeShipping: editableProduct.moreOptions.find((mop) => mop.property === 'freeShipping')!.isChecked,
            showProduct: editableProduct.moreOptions.find((mop) => mop.property === 'showProduct')!.isChecked,
            images: imagesData,
            categories: [...editableProduct.categories, ...editableProduct.categoriesFromFirebase],
            estoqueTotal: totalStock,
            // images= images.map((image) => image.file),
    
            productVariations: editableProduct.productVariations.map((pv, index) => {
                const codigoDeBarra = (pv.defaultProperties.barCode && pv.defaultProperties.barCode.length > 0) ? pv.defaultProperties.barCode : getRandomBarCode(index);

                const skuGenerated = pv.defaultProperties.sku ? pv.defaultProperties.sku : getRandomSku(editableProduct.sections, codigoDeBarra, pv.customProperties);

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { imageIndex, ...restOfDefaultProperties } = pv.defaultProperties;
                const imageVariation = imagesData.find((imageData) => imageData.index === imageIndex);
                return {

                    customProperties: { ...pv.customProperties },
                    ...restOfDefaultProperties,
                    image: imageVariation ? imageVariation.localUrl : blankImage.src,
                    productId,
                    name: editableProduct.name,
                    value: editableProduct.value,
                    categories: [...editableProduct.categories, ...editableProduct.categoriesFromFirebase],
                    sku: skuGenerated,
                    barcode: codigoDeBarra,

                };
            }),
        };
    };

    const hasNoProductVariations = (editableProduct: StateNewProductType, imagesData: ImageProductDataType[], productId: string): ProductBundleType => {
        const { description, name, sections, value, variations, creationDate, subsections } = editableProduct;

        const codigoDeBarra = (editableProduct.barcode && editableProduct.barcode.length > 0) ? editableProduct.barcode : getRandomBarCode(0);
        const skuGenerated = editableProduct.sku ? editableProduct.sku : getRandomSku(editableProduct.sections, codigoDeBarra, undefined);

        return {
            name: name.trim(),
            description: description.trim(),
            creationDate,
            subsections,
            updatingDate: Timestamp.now(),
            sections, value, variations,
            lancamento: editableProduct.moreOptions.find((mop) => mop.property === 'lancamento')!.isChecked,
            freeShipping: editableProduct.moreOptions.find((mop) => mop.property === 'freeShipping')!.isChecked,
            showProduct: editableProduct.moreOptions.find((mop) => mop.property === 'showProduct')!.isChecked,
            images: imagesData,
            categories: [...editableProduct.categories, ...editableProduct.categoriesFromFirebase],
            estoqueTotal: editableProduct.estoque ? editableProduct.estoque : 0,
            productVariations: [
                {   productId,
                    image: imagesData && imagesData[0] ? imagesData[0].localUrl : blankImage.src,
                    estoque: editableProduct.estoque ? editableProduct.estoque : 0,
                    peso: editableProduct.dimensions && editableProduct.dimensions.peso ? editableProduct.dimensions.peso : 0,
                    name: editableProduct.name,
                    value: editableProduct.value,
                    dimensions: editableProduct.dimensions
                        ? {
                            largura: editableProduct.dimensions.largura,
                            altura: editableProduct.dimensions.altura,
                            comprimento: editableProduct.dimensions.comprimento,
                        } : {
                            largura: 0,
                            altura: 0,
                            comprimento: 0,
                        },
                    sku: skuGenerated,
                    barcode: codigoDeBarra,
                    categories: [...editableProduct.categories, ...editableProduct.categoriesFromFirebase],
                },
            ],
        };
    };

    const finalTypeToEditableType = (finalProduct: ProductBundleType & FireBaseDocument): StateNewProductType => {
        const hasMoreThanOneVariation = finalProduct.productVariations.length > 1;
        const theOnlyVariation = finalProduct.productVariations[0];
        return {
            ...finalProduct,
            name: finalProduct.name.trim(),
            description: finalProduct.description.trim(),
            moreOptions: [
                { isChecked: finalProduct.showProduct, label: 'Exibir na minha loja', property: 'showProduct' },
                { isChecked: false, label: 'Esse produto possui frete grátis', property: 'freeShipping' },
                { isChecked: false, label: 'Marcar como lancamento', property: 'lancamento' },

            ],
            categoriesFromFirebase: finalProduct.categories,
            barcode: hasMoreThanOneVariation ? undefined : theOnlyVariation.barcode,
            categories: [],
            dimensions: hasMoreThanOneVariation ? undefined: { ...theOnlyVariation.dimensions, peso: theOnlyVariation.peso },
            estoque: finalProduct.estoqueTotal,
            images: finalProduct.images, //////////////////
            productVariations: hasMoreThanOneVariation ? finalProduct.productVariations.map((pv) => {
                const foundedImage = finalProduct.images.find((image) => image.localUrl === pv.image);

                return {
                    customProperties: pv.customProperties!,
                    defaultProperties: {
                        dimensions: pv.dimensions,
                        estoque: pv.estoque,
                        imageIndex: foundedImage ? foundedImage.index : 0,
                        peso: pv.peso,
                        barCode: pv.barcode,
                        sku: pv.sku,
                    },
                };}) : [], 
            sectionsSite: siteSectionsFromFirebase
                .filter((ssfb) => finalProduct.sections.includes(ssfb.sectionName))
                .map(({ exist, id, sectionName }) => {
                    return {
                        exist,
                        id,
                        sectionName,
                        subsections: (finalProduct.subsections && finalProduct.subsections.length > 0)
                            ? finalProduct.subsections.filter((sbs) => {
                                return sbs.split(':')[0] === sectionName;
                            }).map((sbsf) => sbsf.split(':')[1])
                            : [],
                    };
                }),
                
            sku: hasMoreThanOneVariation ? undefined : theOnlyVariation.sku,
            variations: finalProduct.variations ? finalProduct.variations : [],
        };
    };

    const uploadAndGetAllImagesUrl = async(images: ImageProductDataType[]) => {
        const imagesFromStateClone1 = [...images];
        const imagesFromStateClone2 = [...images];

        const imagesWithFiles = imagesFromStateClone1.filter((image) => image.file !== undefined) as {file: File, localUrl: string, index: number }[]; // filtra as imagens locais
        const imagesFromFirebase = await uploadImages(imagesWithFiles); // upa as imagens locais e pega o link delas
        return [
            ...imagesFromStateClone2
                .filter((img) => img.file === undefined), //imagens antigas
            ...imagesFromFirebase, //novas imagens
        ]; // junta todos os links, antigos e novos
    };

    const createOrUpdateCategories = async(categories: string[]) => {
        if(!categories || categories.length === 0) return;
        const existingCategories = await getAllCategoriesFromFirebase();
        const existingCategoryNames = new Set(existingCategories.map(cat => cat.categoryName));
      
        for (const category of categories) {
            if (!existingCategoryNames.has(category)) {
                await createNewCategoryDocument({ categoryName: category });
            }
        }
    };

    const createAndUpdateSiteSections = async(sectionsSiteState: never[] | (SectionType & { exist?: boolean; id?: string; })[]) => {
        if(sectionsSiteState && sectionsSiteState.length > 0) {
            for(const siteSection of sectionsSiteState) {
                if(siteSection.exist && siteSection.id) { // caso a siteSection contenha exist e id (exista no firebase)
                    if(siteSection.subsections) { // caso o siteSection possua subsections
                        const siteSectionDocument = await getSiteSectionDocumentById(siteSection.id); // procura o siteSection equivalente no firebase
                        if(siteSectionDocument.exist) { // caso seja achado o siteSection equivalente no firebase
                            if(siteSectionDocument.subsections) { // caso o siteSection do firebase possua subsections
                                const subSectionsSet = new Set(siteSectionDocument.subsections);
                                siteSection.subsections.forEach((ss) => subSectionsSet.add(ss)); // add todas as subsections exceto as repetidas
                                const subSectionsUpdated = Array.from(subSectionsSet);
                                updateSiteSectionDocumentField(siteSection.id, 'subsections', subSectionsUpdated);
                            } else { // caso o siteSection do firebase não possua subsections
                                updateSiteSectionDocumentField(siteSection.id, 'subsections', siteSection.subsections);
                            }
                        }
                    }
                } else { // caso a siteSection não contenha exist (não exista no firebase)
                    createNewSiteSectionDocument(siteSection);
                }
            }
        }
    };

    const createOrUpdateProductVariations = async(productId: string, variations: ProductVariation[]) => {
        const existingVariations = await getAllProductVariationsFromFirebase([{ field: 'productId', operator: '==', value: productId }]);

        if(existingVariations && existingVariations.length > 0) {
            await Promise.all(existingVariations.map((pv) => deleteProductVariationDocument(pv.id)));
        }
        await Promise.all(variations.map((pv) => {
            createNewProductVariationDocument({
                barCode: pv.barcode,
                sku: pv.sku,
                productId: productId,
            });
        }));
    };

    return {
        useProductDataHandlers: {
            hasProductVariations,
            hasNoProductVariations,
            finalTypeToEditableType,
            uploadAndGetAllImagesUrl,
            createAndUpdateSiteSections,
            createOrUpdateCategories,
            createOrUpdateProductVariations,
        },

    };
} 