import Image from 'next/image';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { BannerImageType, ImageUploadType } from '@/app/utils/types';

interface ImageUploaderProps {
  label: string;
  imageType: BannerImageType;
  imageData: ImageUploadType;
  onChange: (imageType: BannerImageType, data: ImageUploadType) => void;
  required?: boolean;
  disabled?: boolean; // Novo prop para controlar estado de desabilitado
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    label,
    imageType,
    imageData,
    onChange,
    required = false,
    disabled = false,
}) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
      
            reader.onload = (event) => {
                if (event.target?.result) {
                    onChange(imageType, {
                        file,
                        preview: event.target.result as string,
                        isNew: true,
                    });
                }
            };
      
            reader.readAsDataURL(file);
        }
    };
  
    const handleRemoveImage = () => {
        if (disabled) return;
        
        onChange(imageType, {
            file: null,
            preview: '',
            isNew: false,
            path: imageData.path,
        });
    };
  
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                { label } { required && <span className="text-red-500">*</span> }
            </label>
      
            { imageData.preview ? (
                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                    <Image 
                        src={ imageData.preview }
                        alt={ label }
                        fill
                        className="object-contain"
                    />
                    { !disabled && (
                        <button
                            type="button"
                            onClick={ handleRemoveImage }
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    ) }
                </div>
            ) : (
                <div 
                    className={ `w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center 
                              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'} 
                              transition-colors` }
                    onClick={ () => !disabled && document.getElementById(`file-${imageType}`)?.click() }
                >
                    <PlusIcon className={ `h-12 w-12 ${disabled ? 'text-gray-300' : 'text-gray-400'}` } />
                    <p className="text-sm text-gray-500 mt-2">
                        { disabled ? 'Upload desabilitado' : 'Clique para adicionar imagem' }
                    </p>
                    <input
                        type="file"
                        id={ `file-${imageType}` }
                        accept="image/*"
                        className="hidden"
                        onChange={ handleFileChange }
                        disabled={ disabled }
                    />
                </div>
            ) }
        </div>
    );
};

export default ImageUploader;
