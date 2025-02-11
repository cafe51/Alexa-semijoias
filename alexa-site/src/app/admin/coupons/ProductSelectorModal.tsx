// app/admin/coupons/ProductSelectorModal.tsx
import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { useProducts } from '@/app/hooks/useProducts';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';

interface ProductSelectorModalProps {
  initialSelected: (ProductBundleType & FireBaseDocument)[];
  onClose: () => void;
  onConfirm: (selected: (ProductBundleType & FireBaseDocument)[]) => void;
}

const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({ initialSelected, onClose, onConfirm }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmedSearchTerm, setConfirmedSearchTerm] = useState('');
    const [selected, setSelected] = useState<(ProductBundleType & FireBaseDocument)[]>(initialSelected);
  
    // O hook só realizará a busca se confirmedSearchTerm não estiver vazio.
    const { products, isLoading, loadMore } = useProducts({ searchTerm: confirmedSearchTerm });

    const handleSelectProduct = (product: ProductBundleType & FireBaseDocument) => {
        if (!selected.find(item => item.id === product.id)) {
            setSelected([...selected, product]);
        }
    };

    const handleRemoveProduct = (id: string) => {
        setSelected(selected.filter(product => product.id !== id));
    };

    const triggerSearch = () => {
        setConfirmedSearchTerm(searchTerm.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            triggerSearch();
        }
    };

    return (
        <ModalWrapper onClose={ onClose }>
            <h2 className="text-xl font-bold mb-4">Selecionar Produtos</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={ searchTerm }
                    onChange={ e => setSearchTerm(e.target.value) }
                    onKeyDown={ handleKeyDown }
                    placeholder="Digite o nome do produto"
                    className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={ triggerSearch }
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
          Pesquisar
                </button>
            </div>
            { confirmedSearchTerm === '' ? (
                <p className="text-gray-600">
          Digite um termo de pesquisa e clique em `&quot;`Pesquisar`&quot;` para ver os produtos.
                </p>
            ) : (
                <div className="max-h-60 overflow-y-auto mb-4">
                    { isLoading ? (
                        <p>Carregando produtos...</p>
                    ) : (
                        products.map(product => (
                            <div
                                key={ product.id }
                                className="flex items-center justify-between p-2 border rounded mb-2"
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={ product.images?.[0]?.localUrl || '/placeholder.png' }
                                        alt={ product.name }
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-semibold">{ product.name }</p>
                                        <p className="text-sm text-gray-600">Estoque: { product.estoqueTotal }</p>
                                        <p className="text-sm text-gray-600">Preço: R$ { product.finalPrice }</p>
                                    </div>
                                </div>
                                <button
                                    onClick={ () => handleSelectProduct(product) }
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                >
                  Selecionar
                                </button>
                            </div>
                        ))
                    ) }
                </div>
            ) }
            { confirmedSearchTerm !== '' && products.length > 0 && (
                <button
                    onClick={ loadMore }
                    className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
          Carregar mais
                </button>
            ) }
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Produtos Selecionados:</h3>
                { selected.length === 0 ? (
                    <p>Nenhum produto selecionado.</p>
                ) : (
                    <div className="space-y-2">
                        { selected.map(product => (
                            <div
                                key={ product.id }
                                className="flex items-center justify-between p-2 border rounded"
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={ product.images?.[0]?.localUrl || '/placeholder.png' }
                                        alt={ product.name }
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-semibold">{ product.name }</p>
                                        <p className="text-sm text-gray-600">Estoque: { product.estoqueTotal }</p>
                                        <p className="text-sm text-gray-600">Preço: R$ { product.finalPrice }</p>
                                    </div>
                                </div>
                                <button
                                    onClick={ () => handleRemoveProduct(product.id) }
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                  Remover
                                </button>
                            </div>
                        )) }
                    </div>
                ) }
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    onClick={ onClose }
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
          Cancelar
                </button>
                <button
                    onClick={ () => onConfirm(selected) }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
          Confirmar
                </button>
            </div>
        </ModalWrapper>
    );
};

export default ProductSelectorModal;
