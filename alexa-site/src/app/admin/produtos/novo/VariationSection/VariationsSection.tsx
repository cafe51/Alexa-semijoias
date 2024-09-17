// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationsSection.tsx
import CreateNewProductVariationForm from './CreateNewProductVariationForm';
import ProductVariationFormFilled from './ProductVariationFormFilled';
import { StateNewProductType, UseNewProductState } from '@/app/utils/types';
import { useVariationState } from '@/app/hooks/useVariationState';
import CreateVariationsForm from './CreateVariationsForm';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import VariationsList from './VariationsList';
import ProductVariationItemsList from './ProductVariationItemsList';

// const variations = [ 'tamanho', 'cor' ];

// const productVariations: VariationProductType[] = [
//     {
//         customProperties: { tamanho: 'pequeno', cor: 'verde', idade: '22', nacionalidade: 'brasileiro' },
//         defaultProperties: { estoque: 2, peso: 2, dimensions: { largura: 2, altura: 2, comprimento: 2 }, imageIndex: 0, sku: '1234', barCode: '111' },
//     },
//     {
//         customProperties: { tamanho: 'grande', cor: 'verde', idade: '44', nacionalidade: 'indiano' },
//         defaultProperties: { estoque: 2, peso: 2, dimensions: { largura: 2, altura: 2, comprimento: 2 }, imageIndex: 0, sku: '1236', barCode: '222' },
//     },
//     {
//         customProperties: { tamanho: 'médio', cor: 'amarelo', idade: '233', nacionalidade: 'americano' },
//         defaultProperties: { estoque: 2, peso: 2, dimensions: { largura: 2, altura: 2, comprimento: 2 }, imageIndex: 0, sku: '1235', barCode: '333' },
//     },
// ];

interface VariationsSectionProps { 
    state: StateNewProductType; 
    handlers: UseNewProductState;
  }

export default function VariationsSection({ state, handlers }: VariationsSectionProps) {
    const { variationsState, variationsHandlers } = useVariationState();
    
    const renderContent = () => {
        if (!state.variations || state.variations.length === 0) {
            return (
                <div className="mt-2 text-center w-full">
                    <button className="text-blue-500" onClick={ variationsHandlers.toggleVariationEditionModal }>
            Adicionar variações
                    </button>
                </div>
            );
        }

        return (
            <div className='flex flex-col gap-2'>
                <VariationsList
                    handleRemoveVariation={
                        (v: string) => variationsHandlers.handleRemoveVariation(v, state.variations, handlers, state)
                    }
                    variations={ state.variations }
                />
                <ProductVariationItemsList
                    handlers={ handlers }
                    images={ state.images }
                    productVariations={ state.productVariations }
                    setSelectedProductVariation={ variationsHandlers.setSelectedProductVariation }
                    toggleProductVariationEditionModal={ variationsHandlers.toggleProductVariationEditionModal }
                />
            </div>
        );
    };

    return (
        <section className="flex flex-col gap-2 p-4 border rounded-md bg-white w-full">
            <SlideInModal
                isOpen={ variationsState.showVariationEditionModal }
                closeModelClick={ variationsHandlers.toggleVariationEditionModal }
                fullWidth title='Criar Nova Variação'>
                <CreateVariationsForm
                    state={ state }
                    handlers={ handlers }
                    setProductVariationState={ variationsHandlers.setProductVariationState }
                    handleRemoveVariation={ (v: string) => variationsHandlers.handleRemoveVariation(v, state.variations, handlers, state) }
                />
                {
                    state.variations && state.variations.length > 0 && <CreateNewProductVariationForm
                        state={ state }
                        handlers={ handlers }
                        productVariationState={ variationsState.productVariationState }
                        setProductVariationState={ variationsHandlers.setProductVariationState }
                        toggleVariationEditionModal={ variationsHandlers.toggleVariationEditionModal }
                    />
                }
            </SlideInModal>

            <SlideInModal
                isOpen={ variationsState.showProductVariationEditionModal }
                closeModelClick={ variationsHandlers.toggleProductVariationEditionModal }
                fullWidth
                title='Editar Produto'>
                <ProductVariationFormFilled
                    state={ state }
                    handlers={ handlers }
                    images={ state.images }
                    productVariation={ variationsState.selectedProductVariation }
                    toggleProductVariationEditionModal={ variationsHandlers.toggleProductVariationEditionModal }
                    setSelectedProductVariation={ variationsHandlers.setSelectedProductVariation }
                    
                />
            </SlideInModal>

            <div className="flex justify-between">
                <h2 className="text-lg font-bold">Variações</h2>
                { state.variations && state.variations.length > 0 && (
                    <button className="text-blue-500" onClick={ variationsHandlers.toggleVariationEditionModal }>
            Criar Nova Variação
                    </button>
                ) }
            </div>
            <div className="border-t border-solid pt-4 w-full">{ renderContent() }</div>
        </section>
    );
}
