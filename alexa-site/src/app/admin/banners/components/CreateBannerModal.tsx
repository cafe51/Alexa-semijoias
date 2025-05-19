import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { Switch } from './Switch';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { BannerFormData, BannerImageType, ImageUploadType } from '@/app/utils/types';

interface CreateBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: BannerFormData) => Promise<void>;
  isCreating: boolean; // Novo prop para controlar estado de criação
}

const CreateBannerModal: React.FC<CreateBannerModalProps> = ({
    isOpen,
    onClose,
    onCreate,
    isCreating,
}) => {
    const initialFormData: BannerFormData = {
        bannerName: '',
        showBanner: true,
        pagePath: '',
        bannerImageDesktop: {
            file: null,
            preview: '',
            isNew: false,
        },
        bannerImageMobile: {
            file: null,
            preview: '',
            isNew: false,
        },
        bannerTablet: {
            file: null,
            preview: '',
            isNew: false,
        },
    };
  
    const [formData, setFormData] = useState<BannerFormData>(initialFormData);
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
    
        if (!validateForm() || isCreating) {
            return;
        }
    
        setIsSubmitting(true);
    
        try {
            await onCreate(formData);
            // Resetar formulário após criação bem-sucedida
            setFormData(initialFormData);
            onClose();
        } catch (error) {
            console.error('Erro ao criar banner:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
  
    if (!isOpen) return null;
  
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
        
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Criar Novo Banner</h3>
                            <button
                                type="button"
                                onClick={ onClose }
                                disabled={ isCreating }
                                className={ `text-gray-400 hover:text-gray-500 focus:outline-none ${
                                    isCreating ? 'opacity-50 cursor-not-allowed' : ''
                                }` }
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
            
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
                                    disabled={ isCreating }
                                    className={ `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.bannerName ? 'border-red-500' : 'border-gray-300'
                                    } ${isCreating ? 'bg-gray-100 cursor-not-allowed' : ''}` }
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
                                    disabled={ isCreating }
                                    placeholder="/produtos/categoria"
                                    className={ `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        isCreating ? 'bg-gray-100 cursor-not-allowed' : ''
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
                                        disabled={ isCreating }
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
                                        disabled={ isCreating }
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
                                        disabled={ isCreating }
                                    />
                                </div>
                            </div>
              
                            <div className="flex flex-wrap justify-end gap-3 mt-5">
                                <button
                                    type="button"
                                    onClick={ onClose }
                                    className={ `px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isCreating || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }` }
                                    disabled={ isCreating || isSubmitting }
                                >
                                    Cancelar
                                </button>
                
                                <button
                                    type="submit"
                                    className={ `px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center ${
                                        isCreating || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }` }
                                    disabled={ isCreating || isSubmitting }
                                >
                                    { isCreating || isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Criando...
                                        </>
                                    ) : (
                                        <>
                                            <CheckIcon className="h-4 w-4 mr-1" />
                                            Criar Banner
                                        </>
                                    ) }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBannerModal;
