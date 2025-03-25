import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/**
 * Gera o nome do arquivo de imagem usando o padrão:
 * Para imagem de seção: [sectionName]&image.jpg
 * Para imagem de subseção: [sectionName]&[subsectionName]&image.jpg
 */
export const getImageFileName = (sectionName: string, subsectionName?: string): string => {
    if (subsectionName) {
        return `${sectionName}&${subsectionName}&image.jpg`;
    }
    return `${sectionName}&image.jpg`;
};

/**
 * Faz o upload de um arquivo para o Firebase Storage em um caminho específico.
 * Retorna a URL pública da imagem.
 */
export const uploadImage = async(file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

/**
 * Deleta uma imagem do Firebase Storage dado o URL da imagem.
 */
export const deleteImage = async(imageUrl: string): Promise<void> => {
    const storage = getStorage();
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
};
