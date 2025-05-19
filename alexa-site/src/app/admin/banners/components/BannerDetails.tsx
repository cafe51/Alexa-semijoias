import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { Switch } from './Switch';
import { CheckIcon } from '@heroicons/react/24/outline';
import { BannersType, FireBaseDocument, BannerImageType, ImageUploadType, BannerFormData } from '@/app/utils/types';

interface BannerDetailsProps {
  banner: BannersType & FireBaseDocument;
  onUpdate: (id: string, formData: BannerFormData) => Promise<void>;
  onDelete: (banner: BannersType & FireBaseDocument) => void;
  onCancel: () => void;
  isUpdating: boolean; // Novo prop para controlar estado de atualização
}

const BannerDetails: React.FC<BannerDetailsProps> = ({
    banner,
    onUpdate,
    onDelete,
    onCancel,
    isUpdating,
}) => {
    const [formData, setFormData] = useState<BannerFormData>({
        bannerName: banner.bannerName,
        showBanner: banner.showBanner,
        pagePath: banner.pagePath || '',
        bannerImageDesktop: {
            file: null,
            preview: banner.bannerImageDesktop,
            isNew: false,
            path: banner.bannerImageDesktop,
        },
        bannerImageMobile: {
            file: null,
            preview: banner.bannerImageMobile,
            isNew: false,
            path: banner.bannerImageMobile,
        },
        bannerTablet: {
            file: null,
            preview: banner.bannerTablet || '',
            isNew: false,
            path: banner.bannerTablet,
        },
    });
  
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    
        // Limpar erro do campo quando ele for preenchido
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };
  
    const handleSwitchChange = () => {
        setFormData(prev => ({
            ...prev,
            showBanner: !prev.showBanner,
        }));
    };
  
    const handleImageChange = (imageType: BannerImageType, data: ImageUploadType) => {
        setFormData(prev => ({
            ...prev,
            [imageType]: data,
        }));
    
        // Limpar erro do campo quando uma imagem for adicionada
        if (errors[imageType]) {
            setErrors(prev => ({
                ...prev,
                [imageType]: '',
            }));
        }
    };
  
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
    
        if (!formData.bannerName.trim()) {
            newErrors.bannerName = 'Nome do banner é obrigatório';
        }
    
        if (!formData.bannerImageDesktop.preview) {
            newErrors.bannerImageDesktop = 'Imagem desktop é obrigatória';
        }
    
        if (!formData.bannerImageMobile.preview) {
            newErrors.bannerImageMobile = 'Imagem mobile é obrigatória';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
    
        if (!validateForm() || isUpdating) {
            return;
        }
    
        setIsSubmitting(true);
    
        try {
            await onUpdate(banner.id, formData);
        } catch (error) {
            console.error('Erro ao atualizar banner:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
  
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <form onSubmit={ handleSubmit }>
                <div className="mb-4">
                    <label htmlFor="bannerName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Banner <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="bannerName"
                        name="bannerName"
                        value={ formData.bannerName }
                        onChange={ handleInputChange }
                        disabled={ isUpdating }
                        className={ `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.bannerName ? 'border-red-500' : 'border-gray-300'
                        } ${isUpdating ? 'bg-gray-100 cursor-not-allowed' : ''}` }
                    />
                    { errors.bannerName && (
                        <p className="mt-1 text-sm text-red-500">{ errors.bannerName }</p>
                    ) }
                </div>
        
                <div className="mb-4">
                    <label htmlFor="pagePath" className="block text-sm font-medium text-gray-700 mb-1">
                        Caminho da Página (opcional)
                    </label>
                    <input
                        type="text"
                        id="pagePath"
                        name="pagePath"
                        value={ formData.pagePath }
                        onChange={ handleInputChange }
                        disabled={ isUpdating }
                        placeholder="/produtos/categoria"
                        className={ `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isUpdating ? 'bg-gray-100 cursor-not-allowed' : ''
                        }` }
                    />
                </div>
        
                <div className="mb-4">
                    <Switch
                        checked={ formData.showBanner }
                        onChange={ handleSwitchChange }
                        label="Exibir Banner"
                    />
                </div>
        
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <ImageUploader
                            label="Imagem Desktop"
                            imageType="bannerImageDesktop"
                            imageData={ formData.bannerImageDesktop }
                            onChange={ handleImageChange }
                            required
                            disabled={ isUpdating }
                        />
                        { errors.bannerImageDesktop && (
                            <p className="mt-1 text-sm text-red-500">{ errors.bannerImageDesktop }</p>
                        ) }
                    </div>
          
                    <div>
                        <ImageUploader
                            label="Imagem Mobile"
                            imageType="bannerImageMobile"
                            imageData={ formData.bannerImageMobile }
                            onChange={ handleImageChange }
                            required
                            disabled={ isUpdating }
                        />
                        { errors.bannerImageMobile && (
                            <p className="mt-1 text-sm text-red-500">{ errors.bannerImageMobile }</p>
                        ) }
                    </div>
          
                    <div>
                        <ImageUploader
                            label="Imagem Tablet (opcional)"
                            imageType="bannerTablet"
                            imageData={ formData.bannerTablet }
                            onChange={ handleImageChange }
                            disabled={ isUpdating }
                        />
                    </div>
                </div>
        
                <div className="flex flex-wrap justify-end gap-3">
                    <button
                        type="button"
                        onClick={ () => onDelete(banner) }
                        className={ `px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                        }` }
                        disabled={ isUpdating || isSubmitting }
                    >
                        Excluir
                    </button>
          
                    <button
                        type="button"
                        onClick={ onCancel }
                        className={ `px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                        }` }
                        disabled={ isUpdating || isSubmitting }
                    >
                        Cancelar
                    </button>
          
                    <button
                        type="submit"
                        className={ `px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center ${
                            isUpdating || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }` }
                        disabled={ isUpdating || isSubmitting }
                    >
                        { isUpdating || isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Salvar
                            </>
                        ) }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BannerDetails;
