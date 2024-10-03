//app/utils/types.tsx
import { Timestamp, WhereFilterOp } from 'firebase/firestore';
import { SavedSubSectionType } from '../hooks/useSectionManagement';

export type FireBaseDocument = {
    exist: boolean,
    id: string,
}

export type PaymentType = {
    id: string;
    userId: string,
    orderId: string,
    status: string,
    paymentMethod: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}


export type CheckboxData = {
    label: string;
    isChecked: boolean;
  }

export type CategoryType = {
    categoryName: string;
}

export type ProductVariationsType = {
    productId: string;
    sku: string;
    barCode: string;
}

export type ImageProductDataType = {
    file?: File;
    localUrl: string;
    index: number;
}

export type ProductDefaultPropertiesType = {
    estoque: number;
    peso: number;
    dimensions: {
        altura: number;
        largura: number;
        comprimento: number;
    };
    sku: string;
    barCode: string;
    imageIndex: number;
}

export type VariationProductType = {
    customProperties: { [key: string]: string },
    defaultProperties: ProductDefaultPropertiesType,
}

export type ProductVariation = {
    categories: string[],
    barcode: string, 
    customProperties?: { [key: string]: string },
    dimensions: { largura: number, altura: number, comprimento: number }
    estoque: number,
    name: string,
    peso: number,
    sku: string,
    value: { price: number, promotionalPrice: number, cost: number }
    productId: string;
    image: string;
}

export type ProductBundleType = {
    categories: string[],
    showProduct: boolean,
    freeShipping: boolean,
    lancamento: boolean,
    description: string;
    estoqueTotal: number,
    name: string;
    productVariations: ProductVariation[];

    creationDate: Timestamp;
    updatingDate: Timestamp;

    sections: string[],
    subsections?: string[], // do tipo 'sectionName:subsectionName'[]
    value: { price: number, promotionalPrice: number, cost: number }
    variations?: string[],
    images: ImageProductDataType[],

}

export type MoreOptionsType = { isChecked: boolean, label: string, property: string }

export type StateNewProductType = {
    id?: string;
    name: string;
    description: string;
    categories: string[],
    categoriesFromFirebase: string[],
    value: {
        price: number,
        promotionalPrice: number,
        cost: number,
    }
    sections: string[],
    subsections?: string[] | undefined, // do tipo 'sectionName:subsectionName'[]
    sectionsSite: ((SectionType & { exist?: boolean, id?: string })[] | never[]) 
    variations: string[],
    productVariations: VariationProductType[] | never[];
    estoque?: number | undefined,
    sku?: string | undefined,
    barcode?: string | undefined,
    dimensions?: { largura: number, altura: number, comprimento: number, peso: number } | undefined,
    images: ImageProductDataType[],
    moreOptions: MoreOptionsType[],

    creationDate: Timestamp,
    updatingDate: Timestamp,

}

export type SectionType = {
    sectionName: string,
    subsections?: string[] | null | undefined,
}

export type UseCheckoutStateType = {
    showFullOrderSummary: boolean;
    showLoginSection: boolean;
    editingAddressMode: boolean;
    selectedDeliveryOption: string | null;
    selectedPaymentOption: string | null;
    deliveryOption: DeliveryOptionType | null;
    address: AddressType;
};

export type ProductType = {
    categoria: string,
    descricao: string,
    desconto: number,
    exist: boolean,
    nome: string,
    image: string[],
    preco: number,
    estoque: number,
    lancamento: boolean,
}

export type DeliveryOptionType = {
    name: string;
    deliveryTime: number;
    price: number;
  }

export type FilterOptionForUseSnapshot = {
    field: string,
    operator: WhereFilterOp,
    value: string | number | string[] | number[]
};

export type FilterOption = { 
    field: string; 
    operator?: WhereFilterOp; 
    value?: string | number | string[] | number[]; 
    order?: 'asc' | 'desc'; // Adiciona a opção de ordenação
};

export type ProductCartType = {
    //o que vem de ProductVariation exceto desconto, lancamento e descrição
    // id: string,
    // exist: boolean,
    
    name: string,
    image: string,

    categories: string[]
    barcode: string,

    value: { price: number, promotionalPrice: number, cost: number }

    estoque: number,

    dimensions: { largura: number, altura: number, comprimento: number }
    peso: number;
    customProperties?: { [key: string]: string },


    //o que vem de CartInfoType
    productId: string,
    quantidade: number,
    userId: string,

    skuId: string,
}

export type CartInfoType = {
    // exist: boolean,
    // id: string,
    productId: string,
    quantidade: number,
    userId: string,

    skuId: string,
}

export type CartHistoryType = {
    name: string,
    image: string,

    categories: string[],
    barcode: string,

    value: { price: number, promotionalPrice: number, cost: number }
    
    customProperties?: { [key: string]: string },
    productId: string,
    quantidade: number,
    skuId: string,
}

type ValueType = {
    soma: number,
    frete: number,
    total: number
}

export type AddressType = {
    bairro: string,
    cep: string,
    complemento: string,
    ddd: string,
    gia: string,
    ibge: string,
    localidade: string,
    logradouro: string,
    numero: string,
    siafi: string,
    uf: string,
    unidade: string,
    referencia: string,
}

export type StatusType = 'aguardando pagamento' | 'preparando para o envio' | 'pedido enviado' | 'cancelado' | 'entregue';

export type PaymentResponseType = { qrCode: string, qrCodeBase64: string, ticketUrl: string }

export type OrderType = {
    cartSnapShot: CartHistoryType[],
    status: StatusType,
    valor: ValueType,
    userId: string,
    endereco: AddressType

    totalQuantity: number,
    paymentOption: string,
    deliveryOption: string,

    pixResponse?: PaymentResponseType | null;
    paymentId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type UserType = {
    nome: string,
    email: string,
    userId: string,
    cpf: string,
    tel: string,
    admin: boolean,
    
    address?: AddressType | null
}

export type RegisterFormInputType = {
    password: string,
    nome: string,
    email: string,
    tel: string
}

export type SiteSectionManagementType = {
    sectionList: SectionType[];
    savedSections: string[];
    savedSubSections: SavedSubSectionType[];
    selectedSection: SectionType | undefined;
    selectedSubSection: string | undefined;
    handleSectionClick: (section: SectionType) => void;
    handleSubSectionClick: (subsection: string) => void;
    addSectionOrSubSection: () => void;
    removeSectionOrSubSection: () => void;
}

export type UseProductDataHandlers = {
    hasNoProductVariations: (editableProduct: StateNewProductType, images: ImageProductDataType[], productId: string) => ProductBundleType;
    hasProductVariations: (editableProduct: StateNewProductType, images: ImageProductDataType[], productId: string) => ProductBundleType;
    uploadAndGetAllImagesUrl: (images: ImageProductDataType[]) => Promise<ImageProductDataType[]>;
    createOrUpdateCategories: (categories: string[]) => Promise<void>;
    createAndUpdateSiteSections: (sectionsSiteState: never[] | (SectionType & {
        exist?: boolean;
        id?: string;
    })[]) => Promise<void>;
    createOrUpdateProductVariations: (productId: string, variations: ProductVariation[]) => Promise<void>;
    verifyFieldsOnFinishProductCreation: (state: StateNewProductType, oldState: StateNewProductType, setFinishFormError: (errorMesage: string) => void) => Promise<boolean>
}

export type UseNewProductState = {
    handleNameChange: (name: string) => void;
    handleDescriptionChange: (description: string) => void;
    handleValueChange: (value: { price: number, promotionalPrice: number, cost: number, }) => void;
    handleStockQuantityChange: (estoque: number | undefined) => void;
    handleVariationsChange: (variations: string[] | never[]) => void;
    handleSkuChange: (sku: string) => void;
    handleBarcodeChange: (barcode: string) => void;
    handleDimensionsChange: (dimensions: { largura: number, altura: number, comprimento: number, peso: number }) => void;
    handleAddProductVariation: (productVariation: VariationProductType) => void;
    handleClearProductVariations: () => void;
    handleRemoveProductVariation: (productVariation: VariationProductType) => void;
    handleUpdateProductVariation: (oldVariation: VariationProductType, newVariation: VariationProductType) => void;
    handleAddNewVariationInAllProductVariations: (newVariation: string) => void;
    handleRemoveVariationInAllProductVariations: (variationToBeRemoved: string) => void;
    handleAddSectionsSite: (sections: SectionType[] | never[]) => void;
    handleAddSection: (sections: string[]) => void;
    handleAddSubSection: (sections: string[] | undefined) => void;
    handleAddCategories: (category: string) => void;
    handleSetCategoriesFromFb: (categories: string[]) => void;
    handleRemoveCategory: (category: string) => void;
    handleRemoveAllCategories: () => void;
    handleSetImages: (images: ImageProductDataType[]) => void;
    handleSetMoreOptions: (moreOptions: MoreOptionsType[]) => void;
    handleSetCreationDate: (creationDate: Timestamp) => void;
    handleSetUpdatingDate: (updatingDate: Timestamp) => void;
}