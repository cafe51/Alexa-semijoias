import { useEffect, useState } from 'react';
import { FireBaseDocument, ProductBundleType, SectionType, StateNewProductType } from '../utils/types';
import { useCollection } from './useCollection';
import useFirebaseUpload from './useFirebaseUpload';
import { getRandomBarCode } from '../utils/getRandomBarCode';
import { getRandomSku } from '../utils/getRandomSku';

export function useProductConverter() {
    const [siteSectionsFromFirebase, setSiteSectionsFromFirebase] = useState<(SectionType & FireBaseDocument)[]>([{ sectionName: '', id: '', exist: false }]);

    const { uploadImages } = useFirebaseUpload();
    const {
        addDocument: createNewSiteSectionDocument,
        updateDocumentField: updateSiteSectionDocumentField,
        getDocumentById: getSiteSectionDocumentById,
    } = useCollection<SectionType>('siteSections');

    const { getAllDocuments: getSiteSectionsFromFirebase } = useCollection<SectionType>('siteSections');

    useEffect(() => {
        const fetchFromFirebase = async() => {
            const siteSectionsRes = await getSiteSectionsFromFirebase();
            setSiteSectionsFromFirebase(siteSectionsRes);
        };

        fetchFromFirebase();
    }, []);


    
    const hasProductVariations = (editableProduct: StateNewProductType, imageUrls: string[], productId: string): ProductBundleType => {
        let totalStock = 0;

        for (const pv of editableProduct.productVariations) {
            totalStock += pv.defaultProperties.estoque;
        }

        return {
            ...editableProduct,
            name: editableProduct.name,
            showProduct: true,
            images: imageUrls,
            categories: [...editableProduct.categories, ...editableProduct.categoriesFromFirebase],
            estoqueTotal: totalStock,
            // images= editableProduct.images.map((image) => image.file),
    
            productVariations: editableProduct.productVariations.map((pv, index) => {
                const codigoDeBarra = (pv.defaultProperties.barcode && pv.defaultProperties.barcode.length > 0) ? pv.defaultProperties.barcode : getRandomBarCode(index);

                const skuGenerated = pv.defaultProperties.sku ? pv.defaultProperties.sku : getRandomSku(editableProduct.sections, pv.customProperties, codigoDeBarra);

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { imageIndex, ...restOfDefaultProperties } = pv.defaultProperties;
                return {

                    customProperties: { ...pv.customProperties },
                    ...restOfDefaultProperties,
                    image: imageUrls[imageIndex],
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

    const hasNoProductVariations = (editableProduct: StateNewProductType, imageUrls: string[], productId: string): ProductBundleType => {
        const codigoDeBarra = (editableProduct.barcode && editableProduct.barcode.length > 0) ? editableProduct.barcode : getRandomBarCode(0);

        const skuGenerated = editableProduct.sku ? editableProduct.sku : getRandomSku(editableProduct.sections, editableProduct.productVariations[0].customProperties, codigoDeBarra);

        return {
            ...editableProduct,
            showProduct: true,
            images: imageUrls,
            categories: [...editableProduct.categories, ...editableProduct.categoriesFromFirebase],
            estoqueTotal: editableProduct.estoque ? editableProduct.estoque : 0,
            productVariations: [
                {   productId,
                    image: imageUrls && imageUrls[0] ? imageUrls[0] : '',
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
            categoriesFromFirebase: finalProduct.categories,
            barcode: hasMoreThanOneVariation ? undefined : theOnlyVariation.barcode,
            categories: [],
            dimensions: hasMoreThanOneVariation ? undefined: { ...theOnlyVariation.dimensions, peso: theOnlyVariation.peso },
            estoque: finalProduct.estoqueTotal,
            images: finalProduct.images.map((img) => ({ localUrl: img })), //////////////////
            productVariations: hasMoreThanOneVariation ? finalProduct.productVariations.map((pv) => ({
                customProperties: pv.customProperties!,
                defaultProperties: {
                    dimensions: pv.dimensions,
                    estoque: pv.estoque,
                    imageIndex: finalProduct.images.indexOf(pv.image) !== -1 ? finalProduct.images.indexOf(pv.image) : 0,
                    peso: pv.peso,
                    barcode: pv.barcode,
                    sku: pv.sku,
                },
            })) : [], 
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

    const uploadAndGetAllImagesUrl = async(images: { file?: File; localUrl: string; }[]) => {
        const imagesFromStateClone1 = [...images];
        const imagesFromStateClone2 = [...images];

        const imageFiles = imagesFromStateClone1.filter((image) => image.file !== undefined).map((imagWithFile) => imagWithFile.file) as File[]; // filtra as imagens locais
        const imageUrls = await uploadImages(imageFiles); // upa as imagens locais e pega o link delas
        return [
            ...imagesFromStateClone2
                .filter((img) => img.file === undefined)
                .map((imagWithNoFile) => imagWithNoFile.localUrl), //imagens antigas
            ...imageUrls, //novas imagens
        ]; // junta todos os links, antigos e novos
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

    return {
        useProductDataHandlers: {
            hasProductVariations,
            hasNoProductVariations,
            finalTypeToEditableType,
            uploadAndGetAllImagesUrl,
            createAndUpdateSiteSections,
        },

    };
} 