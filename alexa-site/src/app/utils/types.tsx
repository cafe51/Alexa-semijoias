//app/utils/types.tsx
import { Timestamp, WhereFilterOp } from 'firebase/firestore';
import { SavedSubSectionType } from '../hooks/useSectionManagement';

export type CouponUsageType = {
    cupomId: string; // Referência ao ID do cupom
    userId: string; // ID do usuário que utilizou o cupom
    orderId: string; // ID do pedido onde o cupom foi aplicado
    dataUso: Timestamp; // Data de utilização do cupom
};

export type CouponValidationResponse = {
    valido: boolean;
    descontoAplicado?: number | 'freteGratis'; // Apenas se o cupom for válido
    mensagemErro?: string; // Se inválido, exibir o motivo do erro
    coupon?: CouponType;
};

export type CouponConditionType = {
    valorMinimoCompra?: number; // Ex: 100 para cupom válido apenas para compras acima de R$100
    categoriasPermitidas?: string[]; // IDs das categorias que podem usar o cupom
    produtosEspecificos?: string[]; // IDs de produtos que podem usar o cupom
    primeiraCompraApenas?: boolean; // O cupom é válido apenas para novos clientes?
    somenteUsuarios?: string[]; // Lista de userId que podem usar esse cupom
    textoExplicativo: string; // Mensagem personalizada sobre as condições do cupom
};

export type CouponType = {
    id: string; // ID do cupom (gerado automaticamente)
    codigo: string; // Código do cupom (único e case-insensitive)
    descricao: string; // Texto explicativo do cupom para exibição ao usuário
    tipo: 'percentual' | 'fixo' | 'freteGratis'; // Tipo de cupom
    valor: number; // Valor do desconto (% se for percentual, R$ se for fixo)
    
    dataInicio: Timestamp; // Data de início da validade
    dataExpiracao: Timestamp; // Data de expiração
    
    limiteUsoGlobal: number | null; // Número máximo de usos total (null = ilimitado)
    limiteUsoPorUsuario: number | null; // Número máximo de usos por cliente (null = ilimitado)

    condicoes: CouponConditionType; // Objeto que armazena todas as condições do cupom

    cumulativo: boolean; // Permite uso com outros cupons?
    
    status: 'ativo' | 'desativado'; // Estado atual do cupom

    criadoEm: Timestamp; // Data de criação
    atualizadoEm: Timestamp; // Última atualização
};


export type DadosDaEmpresaType = {
    nome: string;
    cnpj: string;
    razaoSocial: string;
    endereco: AddressType;
    cep: string;
    telefone: string;
}

export type FireBaseDocument = {
    exist: boolean,
    id: string,
}

export type OrderByOption = {
    field: string;
    direction: 'asc' | 'desc';
} | null;

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

export type ProductVariationsType = { //tipagem dos documentos da coleção productVariations
    productId: string;
    sku: string;
    barCode: string;
}

export type ImageProductDataType = {
    file?: File;
    localUrl: string; // é a url da imagem no firebase
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
    sections: string[], // valor sempre igual para todas as variações
    subsections?: string[], // do tipo 'sectionName:subsectionName'[] e sempre igual para todas as variações

    categories: string[], // valor sempre igual para todas as variações
    barcode: string, 
    customProperties?: { [key: string]: string }, // valor como: { 'cor': 'azul', 'tamanho': 'M' } as propriedades são customizadas no momento de criação do produto.
    dimensions: { largura: number, altura: number, comprimento: number }
    estoque: number,
    name: string, // valor sempre igual para todas as variações
    peso: number,
    sku: string,
    value: { price: number, promotionalPrice: number, cost: number } // valor sempre igual para todas as variações
    productId: string;
    image: string; // url com link para imagem no firebase, cada variação possui sua própria imagem
}

export type ProductBundleType = {
    name: string;
    slug: string;
    categories: string[],
    showProduct: boolean,
    freeShipping: boolean,
    lancamento: boolean,
    description: string;
    estoqueTotal: number,
    productVariations: ProductVariation[];

    randomIndex: string;

    promotional: boolean;
    finalPrice: number;

    creationDate: Timestamp;
    updatingDate: Timestamp;

    sections: string[],
    subsections?: string[], // do tipo 'sectionName:subsectionName'[]
    value: { price: number, promotionalPrice: number, cost: number }
    variations?: string[],
    images: ImageProductDataType[], // array com todas as imagens de todas as variações

    keyWords?: string[],

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

export type SectionSlugType = { // tipagem dos documentos da coleção siteSectionsWithSlugName
    sectionName: string,
    sectionSlugName: string,
    subsections?: {
        subsectionName: string,
        subsectionSlugName: string,
    }[],
}

export type SectionType = { //tipagem dos documentos da coleção siteSections
    sectionName: string,
    subsections?: string[] | null | undefined, // do tipo 'subsectionName'[]
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


export type DeliveryOptionType = {
    name: string;
    deliveryTime: number;
    price: number;
}

export type FilterOptionForUseSnapshot = {
    field: string,
    operator: WhereFilterOp,
    value: string | number | string[] | number[] | boolean
};

export type FilterOption = { 
    field: string; 
    operator?: WhereFilterOp; 
    value?: string | number | string[] | number[] | boolean | Timestamp; 
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

    sections: string[],
    subsections?: string[], // do tipo 'sectionName:subsectionName'[]


    //o que vem de CartInfoType
    productId: string,
    quantidade: number,
    userId: string,

    skuId: string,
}

export type CartInfoType = {
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

export type ValueType = {
    soma: number,
    frete: number,
    total: number
}

export type ShippingOptionType = {
    id: string;
    name: string;
    price: number;
    days: number;
}


export type ViaCepResponse = {
    bairro: string;
    cep: string;
    complemento: string;
    ddd: string;

    estado: string;
    gia: string;
    ibge: string;
    localidade: string;

    logradouro: string;
    regiao: string;
    siafi: string;

    uf: string;
    unidade: string;
    erro?: boolean;
};

export type SortOption = {
    value: string;
    label: string;
    orderBy: string;
    direction: 'asc' | 'desc';
};

export type AddressType = { numero: string, referencia: string } & ViaCepResponse;

export type StatusType = 'aguardando pagamento' | 'preparando para o envio' | 'pedido enviado' | 'cancelado' | 'entregue';

export type PixPaymentResponseType = { qrCode: string, qrCodeBase64: string, ticketUrl: string }

export type OrderType = {
    cartSnapShot: CartHistoryType[],
    status: StatusType,
    valor: ValueType,
    couponId?: string | null,
    userId: string,
    endereco: AddressType

    totalQuantity: number,
    paymentOption: string,
    deliveryOption: DeliveryOptionType,

    installments?: number | null,

    pixResponse?: PixPaymentResponseType | null;
    paymentId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type UserType = {
    nome: string,
    email: string,
    userId: string,
    cpf: string,
    phone?: string,
    admin: boolean,
    createdAt: Timestamp,
    address?: AddressType | null
}

export type RegisterFormInputType = {
    password: string,
    nome: string,
    cpf: string,
    email: string,
    phone: string
}

export type PaymentResponseType = {
    id: number,
    shipping_amount: number,
    statement_descriptor: string,
    status: 'rejected' | 'approved' | 'in_process pending' | 'pending' | 'authorized',
    transaction_amount: number,
    installments: number,
    date_created: string,
    date_last_updated: string,
    date_of_expiration: string,
    transaction_details: {
        installment_amount: number,
        overpaid_amount: number,
        total_paid_amount: number
    },
    payment_method_id: string,
    payment_type_id: string,
    payer: {
        identification: { number: string | null, type: string | null },
        entity_type: null,
        phone: { number: string | null, extension: string | null, area_code: string | null },
        last_name: string | null,
        id: string,
        type: string | null,
        first_name: string | null,
        email: string | null
    },
    notification_url: string,
    operation_type: string,
    point_of_interaction: {
        transaction_data: {
            qr_code: string,
            qr_code_base64: string,
            ticket_url: string,
        },
    }

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
    uploadAndGetAllImagesUrl: (images: ImageProductDataType[], oldImages?: ImageProductDataType[]) => Promise<ImageProductDataType[]>;
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
