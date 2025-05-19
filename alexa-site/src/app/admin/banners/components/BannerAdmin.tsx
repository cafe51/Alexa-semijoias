'use client';
import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useFirebaseStorage } from '../hooks/useFirebaseStorage';
import BannerList from './BannerList';
import BannerDetails from './BannerDetails';
import CreateBannerModal from './CreateBannerModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { BannersType, FireBaseDocument, BannerFormData } from '@/app/utils/types';
import { useCollection } from '@/app/hooks/useCollection';

const BannerAdmin: React.FC = () => {
    const [banners, setBanners] = useState<(BannersType & FireBaseDocument)[]>([]);
    const [expandedBannerId, setExpandedBannerId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedBanner, setSelectedBanner] = useState<(BannersType & FireBaseDocument) | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const { getAllDocuments, addDocument, updateDocumentField, deleteDocument } = useCollection<BannersType>('banners');
    const { uploadImage, deleteImage } = useFirebaseStorage();
    // Estados para controlar operações de atualização e criação
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    // Carregar banners
    const loadBanners = async() => {
        setIsLoading(true);
        try {
            const orderByOption = { field: 'updatedAt', direction: 'desc' as const };
            const bannersData = await getAllDocuments(null, undefined, orderByOption);
            setBanners(bannersData);
        } catch (error) {
            console.error('Erro ao carregar banners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBanners();
    }, []);

    // Expandir/retrair detalhes do banner
    const handleExpandBanner = (banner: BannersType & FireBaseDocument) => {
        // Não permitir expandir durante operações de atualização
        if (isUpdating || isCreating) return;
        setExpandedBannerId(prev => prev === banner.id ? null : banner.id);
    };

    // Alternar ativação do banner
    const handleToggleActive = async(id: string, isActive: boolean) => {
        // Não permitir alternar durante operações de atualização
        if (isUpdating || isCreating) return;
        
        setIsUpdating(true);
        try {
            await updateDocumentField(id, 'showBanner', isActive);
            await updateDocumentField(id, 'updatedAt', Timestamp.now());

            // Atualizar estado local
            setBanners(prev => 
                prev.map(banner => 
                    banner.id === id 
                        ? { ...banner, showBanner: isActive, updatedAt: Timestamp.now() } 
                        : banner,
                ),
            );
        } catch (error) {
            console.error('Erro ao atualizar status do banner:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Abrir modal de confirmação de exclusão
    const handleDeleteClick = (banner: BannersType & FireBaseDocument) => {
        // Não permitir excluir durante operações de atualização
        if (isUpdating || isCreating) return;
        
        setSelectedBanner(banner);
        setIsDeleteModalOpen(true);
    };

    // Excluir banner
    const handleConfirmDelete = async() => {
        if (!selectedBanner) return;
    
        setIsDeleting(true);
        try {
            // Excluir imagens do storage
            if (selectedBanner.bannerImageDesktop) {
                await deleteImage(selectedBanner.bannerImageDesktop);
            }
      
            if (selectedBanner.bannerImageMobile) {
                await deleteImage(selectedBanner.bannerImageMobile);
            }
      
            if (selectedBanner.bannerTablet) {
                await deleteImage(selectedBanner.bannerTablet);
            }
      
            // Excluir documento do Firestore
            await deleteDocument(selectedBanner.id);
      
            // Atualizar estado local
            setBanners(prev => prev.filter(banner => banner.id !== selectedBanner.id));
            setExpandedBannerId(null);
            setIsDeleteModalOpen(false);
            setSelectedBanner(null);
        } catch (error) {
            console.error('Erro ao excluir banner:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Processar upload de imagens
    const processImageUploads = async(
        bannerName: string,
        formData: BannerFormData,
    ) => {
        const imageUpdates: Partial<BannersType> = {};
    
        // Processar imagem desktop
        if (formData.bannerImageDesktop.file) {
            // Se houver uma nova imagem, fazer upload
            const desktopUrl = await uploadImage(
                formData.bannerImageDesktop.file,
                bannerName,
                'bannerImageDesktop',
            );
            imageUpdates.bannerImageDesktop = desktopUrl;
      
            // Se havia uma imagem antiga e ela foi substituída, excluí-la
            if (formData.bannerImageDesktop.path && formData.bannerImageDesktop.isNew) {
                await deleteImage(formData.bannerImageDesktop.path);
            }
        } else if (formData.bannerImageDesktop.path === '') {
            // Se a imagem foi removida e não substituída
            imageUpdates.bannerImageDesktop = '';
        }
    
        // Processar imagem mobile
        if (formData.bannerImageMobile.file) {
            const mobileUrl = await uploadImage(
                formData.bannerImageMobile.file,
                bannerName,
                'bannerImageMobile',
            );
            imageUpdates.bannerImageMobile = mobileUrl;
      
            if (formData.bannerImageMobile.path && formData.bannerImageMobile.isNew) {
                await deleteImage(formData.bannerImageMobile.path);
            }
        } else if (formData.bannerImageMobile.path === '') {
            imageUpdates.bannerImageMobile = '';
        }
    
        // Processar imagem tablet (opcional)
        if (formData.bannerTablet.file) {
            const tabletUrl = await uploadImage(
                formData.bannerTablet.file,
                bannerName,
                'bannerTablet',
            );
            imageUpdates.bannerTablet = tabletUrl;
      
            if (formData.bannerTablet.path && formData.bannerTablet.isNew) {
                await deleteImage(formData.bannerTablet.path);
            }
        } else if (formData.bannerTablet.path === '') {
            imageUpdates.bannerTablet = '';
        }
    
        return imageUpdates;
    };

    // Atualizar banner
    const handleUpdateBanner = async(id: string, formData: BannerFormData) => {
        setIsUpdating(true);
        try {
            // Processar uploads de imagens
            const imageUpdates = await processImageUploads(formData.bannerName, formData);
      
            await updateDocumentField(id, 'bannerName', formData.bannerName);
            await updateDocumentField(id, 'showBanner', formData.showBanner);
            await updateDocumentField(id, 'pagePath', formData.pagePath);
            await updateDocumentField(id, 'updatedAt', Timestamp.now());
      
            // Atualizar campos de texto e status
            for (const [key, value] of Object.entries(imageUpdates)) {
                await updateDocumentField(id, key, value);
            }
      
            // Recarregar banners para atualizar a lista
            await loadBanners();
            // Fechar detalhes expandidos
            setExpandedBannerId(null);
        } catch (error) {
            console.error('Erro ao atualizar banner:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Criar novo banner
    const handleCreateBanner = async(formData: BannerFormData) => {
        setIsCreating(true);
        try {
            // Criar documento inicial para obter ID
            const now = Timestamp.now();
            const newBanner: BannersType = {
                bannerName: formData.bannerName,
                showBanner: formData.showBanner,
                bannerImageDesktop: '',
                bannerImageMobile: '',
                bannerTablet: '',
                pagePath: formData.pagePath || '',
                createdAt: now,
                updatedAt: now,
            };
      
            // Adicionar documento ao Firestore
            const createdBanner = await addDocument(newBanner);

            if (!createdBanner) {
                console.error('Banner recém-criado não encontrado.', createdBanner);
                throw new Error('Banner recém-criado não encontrado.');
            }

            // Processar uploads de imagens
            const imageUpdates = await processImageUploads(
                formData.bannerName,
                formData,
            );
      
            // Atualizar imagens
            for (const [key, value] of Object.entries(imageUpdates)) {
                if(value) {
                    await updateDocumentField(createdBanner.id, key, value);
                }
            }
        
            // Recarregar banners para atualizar a lista
            await loadBanners();
      
            // Fechar modal de criação
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Erro ao criar banner:', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            { /* Overlay de carregamento global */ }
            { (isUpdating || isCreating) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-lg font-medium text-gray-700">
                            { isCreating ? 'Criando banner...' : 'Atualizando banner...' }
                        </p>
                    </div>
                </div>
            ) }
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Banners</h1>
        
                <button
                    onClick={ () => setIsCreateModalOpen(true) }
                    disabled={ isUpdating || isCreating }
                    className={ `px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center transition-opacity ${
                        (isUpdating || isCreating) ? 'opacity-50 cursor-not-allowed' : ''
                    }` }
                >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Novo Banner
                </button>
            </div>
      
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                    <BannerList
                        banners={ banners }
                        onToggleActive={ handleToggleActive }
                        onDelete={ handleDeleteClick }
                        onExpand={ handleExpandBanner }
                        expandedBannerId={ expandedBannerId }
                        isLoading={ isLoading }
                        isProcessing={ isUpdating || isCreating }
                    />
                </div>
            </div>
      
            { expandedBannerId && (
                <div className="mt-4">
                    { banners
                        .filter(banner => banner.id === expandedBannerId)
                        .map(banner => (
                            <BannerDetails
                                key={ banner.id }
                                banner={ banner }
                                onUpdate={ handleUpdateBanner }
                                onDelete={ handleDeleteClick }
                                onCancel={ () => setExpandedBannerId(null) }
                                isUpdating={ isUpdating }
                            />
                        )) }
                </div>
            ) }
      
            { /* Modal de criação de banner */ }
            <CreateBannerModal
                isOpen={ isCreateModalOpen }
                onClose={ () => setIsCreateModalOpen(false) }
                onCreate={ handleCreateBanner }
                isCreating={ isCreating }
            />
      
            { /* Modal de confirmação de exclusão */ }
            <DeleteConfirmationModal
                isOpen={ isDeleteModalOpen }
                banner={ selectedBanner }
                onClose={ () => setIsDeleteModalOpen(false) }
                onConfirm={ handleConfirmDelete }
                isDeleting={ isDeleting }
            />
        </div>
    );
};

export default BannerAdmin;
