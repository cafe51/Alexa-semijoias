import React, { useState } from 'react';
import { useCategoryManager } from '@/app/hooks/useCategoryManager';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Image from 'next/image';
import toTitleCase from '@/app/utils/toTitleCase';
import blankImage from '../../../../public/blankImage.png';
import { formatPrice } from '@/app/utils/formatPrice';

const CategoryManager = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ name: string; count: number } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showingProducts, setShowingProducts] = useState<(ProductBundleType & FireBaseDocument)[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const {
        categories,
        isLoading,
        error,
        deleteCategory,
        getProductsByCategory,
    } = useCategoryManager();

    const handleCategoryClick = async(categoryName: string) => {
        try {
            setIsLoadingProducts(true);
            const products = await getProductsByCategory(categoryName);
            setShowingProducts(products);
            setSelectedCategory({ 
                name: categoryName,
                count: products.length, 
            });
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleDeleteClick = (categoryName: string, productCount: number) => {
        setSelectedCategory({ 
            name: categoryName, 
            count: productCount,
        });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async() => {
        if (selectedCategory) {
            try {
                await deleteCategory(selectedCategory.name);
                setShowDeleteModal(false);
                setSelectedCategory(null);
                setShowingProducts([]);
            } catch (err) {
                console.error('Erro ao deletar categoria:', err);
            }
        }
    };

    return (
        <>
            <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        Gerenciar Categorias
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Gerenciador de Categorias</DialogTitle>
                    </DialogHeader>

                    { isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <LoadingIndicator />
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center p-4">
                            { error }
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-4">Lista de Categorias</h3>
                                <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-2">
                                    { categories.map((category) => (
                                        <div
                                            key={ category.categoryName }
                                            className={ `flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 ${
                                                selectedCategory?.name === category.categoryName 
                                                    ? 'bg-gray-200 border-l-4 border-[#D4AF37] shadow-sm' 
                                                    : ''
                                            }` }
                                        >
                                            <button
                                                onClick={ () => handleCategoryClick(category.categoryName) }
                                                className="flex-1 text-left"
                                            >
                                                { category.categoryName } ({ category.productCount })
                                            </button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={ () => handleDeleteClick(category.categoryName, category.productCount) }
                                            >
                                                Excluir
                                            </Button>
                                        </div>
                                    )) }
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-4">{ selectedCategory ? `Produtos da Categoria: ${selectedCategory.name}` : 'Selecione uma categoria' }</h3>
                                { isLoadingProducts ? (
                                    <div className="flex justify-center items-center h-40">
                                        <LoadingIndicator />
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[80vh] overflow-y-auto">
                                        { showingProducts.map((product) => (
                                            <div
                                                key={ product.id }
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <div className="flex flex-col gap-4 p-4 bg-white shadow-lg rounded-lg transition transform hover:scale-105 ">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-bold text-[#333333]">{ toTitleCase(product.name) }</p>
                                                    </div>
            
                                                    <div
                                                        className="relative rounded-lg h-20 w-20 overflow-hidden bg-gray-100"
                                                    >
                                                        <Image
                                                            className="object-cover w-full h-full"
                                                            src={ product.images?.[0]?.localUrl || blankImage }
                                                            alt="Foto do produto"
                                                            fill
                                                            // loading="lazy"
                                                            priority
                                                            sizes='300px'
                                                        />
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[#333333]">Estoque: <span className="font-bold">{ product.estoqueTotal }</span></p>
                                                        <p className="text-[#D4AF37] font-bold">{ formatPrice(product.value.price) }</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )) }
                                        { showingProducts.length === 0 && (
                                            <p className="text-gray-500 text-center">
                                                Selecione uma categoria para ver os produtos
                                            </p>
                                        ) }
                                    </div>
                                ) }
                            </div>
                        </div>
                    ) }
                </DialogContent>
            </Dialog>

            { selectedCategory && (
                <DeleteConfirmationModal
                    isOpen={ showDeleteModal }
                    onClose={ () => setShowDeleteModal(false) }
                    onConfirm={ handleConfirmDelete }
                    categoryName={ selectedCategory.name }
                    productCount={ selectedCategory.count }
                />
            ) }
        </>
    );
};

export default CategoryManager;
