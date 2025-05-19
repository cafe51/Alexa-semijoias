import { useState } from 'react';
import { uploadImage, deleteImage } from '../../../firebase/storageUtils';
import { createSlugName } from '@/app/utils/createSlugName';

export const useFirebaseStorage = () => {
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}${month}${year}`;
    };

    const uploadBannerImage = async(
        file: File,
        bannerName: string,
        imageType: string,
    ): Promise<string> => {
        setLoading(true);
        setError(null);
    
        try {
            const currentDate = new Date();
            const formattedDate = formatDate(currentDate);
            const slugName = createSlugName(bannerName);
      
            // Criar caminho para a pasta do banner
            const folderPath = `bannerImages/${slugName}-${formattedDate}`;
      
            // Criar nome do arquivo
            const fileName = `${slugName}-${imageType}-${formattedDate}.jpg`;
            const filePath = `${folderPath}/${fileName}`;
      
            // Usar a função uploadImage do storageUtils
            const downloadURL = await uploadImage(file, filePath);
            
            setProgress(100);
            setLoading(false);
            return downloadURL;
        } catch (err: any) {
            setError('Erro ao fazer upload da imagem: ' + err.message);
            setLoading(false);
            throw err;
        }
    };

    const deleteBannerImage = async(imageUrl: string): Promise<void> => {
        if (!imageUrl) return;
    
        try {
            // Usar a função deleteImage do storageUtils
            await deleteImage(imageUrl);
        } catch (err: any) {
            setError('Erro ao excluir a imagem: ' + err.message);
            throw err;
        }
    };

    return {
        progress,
        error,
        loading,
        uploadImage: uploadBannerImage,
        deleteImage: deleteBannerImage,
    };
};
