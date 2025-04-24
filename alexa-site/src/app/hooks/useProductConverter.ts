import { useEffect, useState } from 'react';
import { CategoryType, FireBaseDocument, ImageProductDataType, ProductBundleType, ProductVariation, ProductVariationsType, SectionSlugType, SectionType, StateNewProductType, VideoProductDataType } from '../utils/types';
import { useCollection } from './useCollection';
import useFirebaseUpload from './useFirebaseUpload';
import { getRandomBarCode } from '../utils/getRandomBarCode';
import { getRandomSku } from '../utils/getRandomSku';
import blankImage from '../../../public/blankImage.png';
import { Timestamp } from 'firebase/firestore';
import toTitleCase from '../utils/toTitleCase';
import keyWordsCreator from '../utils/keyWordsCreator';
import { createSlugName, createSubsectionsWithSlug } from '../utils/createSlugName';
import { useUserInfo } from './useUserInfo';

export function useProductConverter() {
    const { userInfo } = useUserInfo();
    const [siteSectionsFromFirebase, setSiteSectionsFromFirebase] = useState<(SectionType & FireBaseDocument)[]>([{ sectionName: '', id: '', exist: false }]);

    const { uploadImages, deleteImage, uploadVideo, deleteVideo } = useFirebaseUpload();
    const {
        addDocument: createNewSiteSectionDocument,
        updateDocumentField: updateSiteSectionDocumentField,
        getDocumentById: getSiteSectionDocumentById,
        getAllDocuments: getSiteSectionsFromFirebase,
    } = useCollection<SectionType>('siteSections');

    const {
        addDocument: createNewSiteSectionWithSlugNameDocument,
        updateDocumentField: updateSiteSectionWithSlugNameDocumentField,
        getAllDocuments: getSiteSectionsWithSlugNameFromFirebase,
    } = useCollection<SectionSlugType>('siteSectionsWithSlugName');

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

    const extractRandomIndex = (id: string): string => {
        // Pega o antepenúltimo e penúltimo dígitos do ID
        const digits = id.slice(-3, -1);
        return digits;
    };
    
    const hasProductVariations = (editableProduct: StateNewProductType, imagesData: ImageProductDataType[], productId: string): ProductBundleType => {
        let totalStock = 0;

        for (const pv of editableProduct.productVariations) {
            totalStock += pv.defaultProperties.estoque;
        }

        const { description, name, sections, value, variations, creationDate, subsections, categories, categoriesFromFirebase, collections, collectionsFromFirebase } = editableProduct;

        const categoriesFromFirebaseKeyWords = (categoriesFromFirebase && categoriesFromFirebase.length > 0) ? categoriesFromFirebase.map((cat) => keyWordsCreator(cat)).flat() : [];
        const categoriesKeyWords = (categories && categories.length > 0) ? categories.map((cat) => keyWordsCreator(cat)).flat() : [];
        const sectionsKeyWords = (sections && sections.length > 0) ? sections.map((sec) => keyWordsCreator(sec)).flat() : [];
        const subsectionsKeyWords = (subsections && subsections.length > 0) ? subsections.map((sub) => keyWordsCreator(sub.split(':')[1])).flat() : [];

        return {
            name: name.trim().toLowerCase(),
            slug: createSlugName(name.trim().toLowerCase()),
            keyWords: Array.from(new Set([
                ...keyWordsCreator(name.trim().toLowerCase()),
                ...categoriesFromFirebaseKeyWords,
                ...categoriesKeyWords,
                ...sectionsKeyWords,
                ...subsectionsKeyWords,
            ])),
            randomIndex: extractRandomIndex(productId),
            description: description.trim(),
            creationDate,
            subsections,
            updatingDate: userInfo?.email === 'cafecafe51@hotmail.com' ? editableProduct.updatingDate : Timestamp.now(),
            sections, value, variations,
            finalPrice: value.promotionalPrice && value.promotionalPrice > 0 ? value.promotionalPrice : value.price,
            promotional: !!value.promotionalPrice && value.promotionalPrice > 0,
            lancamento: editableProduct.moreOptions.find((mop) => mop.property === 'lancamento')!.isChecked,
            freeShipping: editableProduct.moreOptions.find((mop) => mop.property === 'freeShipping')!.isChecked,
            showProduct: editableProduct.moreOptions.find((mop) => mop.property === 'showProduct')!.isChecked,
            images: imagesData,
            categories: [...categories, ...editableProduct.categoriesFromFirebase],
            collections: [...collections, ...collectionsFromFirebase],
            videoUrl: editableProduct.video?.localUrl || null,

            estoqueTotal: totalStock,
            // images= images.map((image) => image.file),
    
            productVariations: editableProduct.productVariations.map((pv, index) => {
                
                
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { imageIndex, barCode, sku, ...restOfDefaultProperties } = pv.defaultProperties;
                
                const finalBarCode = (barCode && barCode.length > 0) ? barCode : getRandomBarCode(index);
                const skuGenerated = sku ? sku : getRandomSku(editableProduct.sections, finalBarCode, pv.customProperties);
                
                const imageVariation = imagesData.find((imageData) => imageData.index === imageIndex);
                return {

                    customProperties: { ...pv.customProperties },
                    ...restOfDefaultProperties,
                    image: imageVariation ? imageVariation.localUrl : blankImage.src,
                    productId,
                    name: editableProduct.name,
                    value: editableProduct.value,
                    sections: editableProduct.sections,
                    subsections: editableProduct.subsections,
                    categories: [...editableProduct.categories, ...editableProduct.categoriesFromFirebase],
                    collections: [...collections, ...collectionsFromFirebase],

                    sku: skuGenerated,
                    barcode: finalBarCode,

                };
            }),
        };
    };

    const hasNoProductVariations = (editableProduct: StateNewProductType, imagesData: ImageProductDataType[], productId: string): ProductBundleType => {
        const { description, name, sections, value, creationDate, subsections, categories, categoriesFromFirebase } = editableProduct;

        const codigoDeBarra = (editableProduct.barcode && editableProduct.barcode.length > 0) ? editableProduct.barcode : getRandomBarCode(0);
        const skuGenerated = editableProduct.sku ? editableProduct.sku : getRandomSku(editableProduct.sections, codigoDeBarra, undefined);

        const categoriesFromFirebaseKeyWords = (categoriesFromFirebase && categoriesFromFirebase.length > 0) ? categoriesFromFirebase.map((cat) => keyWordsCreator(cat)).flat() : [];
        const categoriesKeyWords = (categories && categories.length > 0) ? categories.map((cat) => keyWordsCreator(cat)).flat() : [];
        const sectionsKeyWords = (sections && sections.length > 0) ? sections.map((sec) => keyWordsCreator(sec)).flat() : [];
        const subsectionsKeyWords = (subsections && subsections.length > 0) ? subsections.map((sub) => keyWordsCreator(sub.split(':')[1])).flat() : [];

        return {
            slug: createSlugName(name.trim().toLowerCase()),
            name: name.trim().toLowerCase(),
            keyWords: Array.from(new Set([
                ...keyWordsCreator(name.trim().toLowerCase()),
                ...categoriesFromFirebaseKeyWords,
                ...categoriesKeyWords,
                ...sectionsKeyWords,
                ...subsectionsKeyWords,
            ])),
            randomIndex: extractRandomIndex(productId),
            description: description.trim(),
            creationDate,
            subsections,
            updatingDate: userInfo?.email === 'cafecafe51@hotmail.com' ? editableProduct.updatingDate : Timestamp.now(),
            finalPrice: value.promotionalPrice && value.promotionalPrice > 0 ? value.promotionalPrice : value.price,
            promotional: !!value.promotionalPrice && value.promotionalPrice > 0,
            sections,
            value,
            lancamento: editableProduct.moreOptions.find((mop) => mop.property === 'lancamento')!.isChecked,
            freeShipping: editableProduct.moreOptions.find((mop) => mop.property === 'freeShipping')!.isChecked,
            showProduct: editableProduct.moreOptions.find((mop) => mop.property === 'showProduct')!.isChecked,
            images: imagesData,
            categories: Array.from(new Set([...categories, ...categoriesFromFirebase])),
            collections: Array.from(new Set([...editableProduct.collections, ...editableProduct.collectionsFromFirebase])),
            videoUrl: editableProduct.video?.localUrl || null,
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
                    categories: Array.from(new Set([...categories, ...categoriesFromFirebase])),
                    collections: Array.from(new Set([...editableProduct.collections, ...editableProduct.collectionsFromFirebase])),
                    sections: editableProduct.sections,
                    subsections: editableProduct.subsections,
                },
            ],
        };
    };

    const finalTypeToEditableType = (finalProduct: ProductBundleType & FireBaseDocument): StateNewProductType => {
        const hasCustomProperties = finalProduct.variations && finalProduct.variations.length > 0;
        const theOnlyVariation = finalProduct.productVariations[0];

        // const subsectionsKeyWord = finalProduct.subsections ? finalProduct.subsections.map((sub: string) => sub.split(':')[1]) : [];

        return {
            ...finalProduct,
            name: toTitleCase(finalProduct.name.trim()),

            description: finalProduct.description.trim(),
            moreOptions: [
                { isChecked: finalProduct.showProduct, label: 'Exibir na minha loja', property: 'showProduct' },
                { isChecked: false, label: 'Esse produto possui frete grátis', property: 'freeShipping' },
                { isChecked: false, label: 'Marcar como lancamento', property: 'lancamento' },

            ],
            categoriesFromFirebase: finalProduct.categories,
            categories: [],
            collections: [],
            collectionsFromFirebase: finalProduct.collections || [],
            barcode: hasCustomProperties ? undefined : theOnlyVariation.barcode,
            dimensions: hasCustomProperties ? undefined: { ...theOnlyVariation.dimensions, peso: theOnlyVariation.peso },
            estoque: finalProduct.estoqueTotal,
            images: finalProduct.images, //////////////////
            video: finalProduct.videoUrl ? { file: undefined, localUrl: finalProduct.videoUrl } : null,
            productVariations: hasCustomProperties ? finalProduct.productVariations.map((pv) => {
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
                
            sku: hasCustomProperties ? undefined : theOnlyVariation.sku,
            variations: finalProduct.variations ? finalProduct.variations : [],
        };
    };

    const uploadAndGetAllImagesUrl = async(images: ImageProductDataType[], oldImages?: ImageProductDataType[]) => {
        // Se existirem imagens antigas que não estão mais presentes nas novas imagens, deletá-las
        if (oldImages) {
            const newImageUrls = new Set(images.filter(img => !img.file).map(img => img.localUrl));
            const imagesToDelete = oldImages.filter(oldImg => !newImageUrls.has(oldImg.localUrl));
            
            // Deletar imagens antigas que não estão mais sendo usadas
            await Promise.all(imagesToDelete.map(img => deleteImage(img.localUrl)));
        }

        // Upload das novas imagens
        const imagesWithFiles = images.filter((image) => image.file !== undefined) as {file: File, localUrl: string, index: number }[];
        const imagesFromFirebase = await uploadImages(imagesWithFiles);

        // Retornar array com imagens antigas mantidas + novas imagens
        return [
            ...images.filter((img) => img.file === undefined),
            ...imagesFromFirebase,
        ];
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
                            const siteSectionWithSlugNameDocument = await getSiteSectionsWithSlugNameFromFirebase(
                                [{ field: 'sectionName', operator: '==', value: siteSection.sectionName }],
                                1);
                            if(siteSectionDocument.subsections) { // caso o siteSection do firebase possua subsections
                                const subSectionsSet = new Set(siteSectionDocument.subsections);
                                siteSection.subsections.forEach((ss) => subSectionsSet.add(ss)); // add todas as subsections exceto as repetidas
                                const subSectionsUpdated = Array.from(subSectionsSet);
                                updateSiteSectionDocumentField(siteSection.id, 'subsections', subSectionsUpdated);

                                const newSubsectionsWithSlugName = subSectionsUpdated ? createSubsectionsWithSlug(subSectionsUpdated) : [];
                                updateSiteSectionWithSlugNameDocumentField(
                                    siteSectionWithSlugNameDocument[0].id,
                                    'subsections',
                                    newSubsectionsWithSlugName ? newSubsectionsWithSlugName : [],
                                );
                            } else { // caso o siteSection do firebase não possua subsections
                                updateSiteSectionDocumentField(siteSection.id, 'subsections', siteSection.subsections);

                                const newSubsectionsWithSlugName = siteSection.subsections ? createSubsectionsWithSlug(siteSection.subsections) : [];
                                updateSiteSectionWithSlugNameDocumentField(
                                    siteSectionWithSlugNameDocument[0].id,
                                    'subsections',
                                    newSubsectionsWithSlugName ? newSubsectionsWithSlugName : [],
                                );
                            }
                        }
                    }
                } else { // caso a siteSection não contenha exist (não exista no firebase)
                    createNewSiteSectionDocument(siteSection);
                    createNewSiteSectionWithSlugNameDocument({
                        sectionName: siteSection.sectionName,
                        sectionSlugName: createSlugName(siteSection.sectionName),
                        subsections: siteSection.subsections ? createSubsectionsWithSlug(siteSection.subsections) : [],
                    });
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

    const isThereACodeInTheFireStore = async(codeType: 'barCode' | 'sku', state: StateNewProductType) => { 
        const docsInFirestore = await getAllProductVariationsFromFirebase(
            [{ field: codeType, operator: '==', value: state[codeType === 'barCode' ? 'barcode' : 'sku'] }],
        );
        return docsInFirestore.length > 0;
    };

    const verifyFieldsOnFinishProductCreation = async(
        state: StateNewProductType,
        oldState: StateNewProductType,
        setFinishFormError: (errorMesage: string) => void,
    ) => {
        if(state.name.length === 0) {
            setFinishFormError('O nome do produto não pode estar vazio');
            return false;
        }
        if(state.description.length === 0) {
            setFinishFormError('A descrição do produto não pode estar vazia');
            return false;
        }

        if(state.sections.length === 0 || state.sectionsSite.length === 0) {
            setFinishFormError('É necessário selecionar pelo menos uma seção');
            return false;
        }

        if(state.productVariations.length === 0) {
            if(!state.barcode || state.barcode.length === 0) {
                setFinishFormError('Preencha o código de barras');
                return false;
            }
            if(!state.sku || state.sku.length === 0) {
                setFinishFormError('Preencha o SKU');
                return false;
            }
            if(oldState.barcode !== state.barcode) {
                const isThereAbarCodeInTheFirestore = await isThereACodeInTheFireStore('barCode', state);
                if(isThereAbarCodeInTheFirestore) {
                    setFinishFormError('Já existe um produto registrado com este código de barras');
                    return false;
                }
            }
            if(oldState.sku !== state.sku) {
                const isThereAskuInTheFirestore = await isThereACodeInTheFireStore('sku', state);
                if(isThereAskuInTheFirestore) {
                    setFinishFormError('Já existe um produto registrado com este sku');
                    return false;
                }
            }

        }

        if(state.productVariations.length > 0) {
            const hasError = state.productVariations.some(variation => {
                if(variation.defaultProperties?.barCode?.length === 0) {
                    return true;
                }
                if(variation.defaultProperties?.sku.length === 0) {
                    return true;
                }
                return false;
            });
            if(hasError) {
                setFinishFormError('Preencha todos os campos obrigatórios das variações');
                return false;
            }
        }

        return true;
    };

    const handleProductVideo = async(
        newVideo: VideoProductDataType | null,
        oldVideoUrl: string | null | undefined,
        productSlug: string,
        productBarcode: string,
    ): Promise<string | null> => {
        try {
            // Deletar vídeo antigo se foi removido ou substituído
            if (oldVideoUrl && (!newVideo?.localUrl || newVideo.localUrl !== oldVideoUrl)) {
                await deleteVideo(oldVideoUrl);
            }

            // Fazer upload do novo vídeo se existir
            if (newVideo?.file) {
                return await uploadVideo(newVideo.file, productSlug, productBarcode);
            }

            return newVideo?.localUrl || null;
        } catch (error) {
            console.error('Erro ao processar vídeo do produto:', error);
            throw error;
        }
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
            verifyFieldsOnFinishProductCreation,
            handleProductVideo, // Novo método adicionado
        },
    };
}
