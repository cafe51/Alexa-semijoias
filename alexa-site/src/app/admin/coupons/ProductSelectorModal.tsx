// app/admin/coupons/ProductSelectorModal.tsx
import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import { useProducts } from '@/app/hooks/useProducts';
import { ProductBundleType, FireBaseDocument } from '@/app/utils/types';
import ButtonPaginator from '@/app/components/ButtonPaginator';

interface ProductSelectorModalProps {
  initialSelected: (ProductBundleType & FireBaseDocument)[];
  onClose: () => void;
  onConfirm: (selected: (ProductBundleType & FireBaseDocument)[]) => void;
}

const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({ initialSelected, onClose, onConfirm }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmedSearchTerm, setConfirmedSearchTerm] = useState('');
    const [selected, setSelected] = useState<(ProductBundleType & FireBaseDocument)[]>(initialSelected);
    const [productsList, setProductsList] = useState<(ProductBundleType & FireBaseDocument)[]>([]);

    // Ref para o container de listagem para preservar o scroll

    // O hook useProducts só realizará a busca se confirmedSearchTerm não estiver vazio.
    const { products, loadMore, hasMore, isLoading } = useProducts({ searchTerm: confirmedSearchTerm });

    useEffect(() => {
        setProductsList(products);
    }, [products]);

    // Alterna a seleção do produto: se já estiver selecionado, remove-o; caso contrário, adiciona-o.
    const handleToggleProduct = (product: ProductBundleType & FireBaseDocument) => {
        if (selected.find(item => item.id === product.id)) {
            setSelected(selected.filter(item => item.id !== product.id));
        } else {
            setSelected([...selected, product]);
        }
    };

    // Função para apenas adicionar o produto (usada caso o clique seja feito no botão, sem "toggle")
    const handleSelectProduct = (product: ProductBundleType & FireBaseDocument) => {
        if (!selected.find(item => item.id === product.id)) {
            setSelected([...selected, product]);
        }
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
          Digite um termo de pesquisa e clique em  `&ldquo;`Pesquisar`&ldquo;` para ver os produtos.
                </p>
            ) : (
                <div className="max-h-60 overflow-y-auto mb-4">
                    { (
                        productsList.map(product => {
                            const isSelected = !!selected.find(item => item.id === product.id);
                            return (
                                <div
                                    key={ product.id }
                                    className={ `flex items-center justify-between p-2 border rounded mb-2 cursor-pointer ${
                                        isSelected ? 'bg-green-100' : ''
                                    }` }
                                    onClick={ () => handleToggleProduct(product) }
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
                                    { isSelected ? (
                                        <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded">Selecionado</span>
                                    ) : (
                                        <button
                                            onClick={ e => {
                                                e.stopPropagation();
                                                handleSelectProduct(product);
                                            } }
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                        >
                      Selecionar
                                        </button>
                                    ) }
                                </div>
                            );
                        })
                    ) }
                </div>
            ) }
            { confirmedSearchTerm !== '' && products.length > 0 && hasMore && (
                <ButtonPaginator loadMore={ loadMore } isLoading={ isLoading }>
                          Carregar mais
                </ButtonPaginator>
            ) }
            <div className="flex justify-end">
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
