// src/hooks/useFirebaseUpload.ts
import { useState } from 'react';
import { storage } from '../firebase/config';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { ImageProductDataType } from '../utils/types';
import imageCompression from 'browser-image-compression';

const MAX_FILE_SIZE = 300 * 1024; // 300KB em bytes

/**
 * Comprime a imagem se ela for maior que 300KB.
 * Usa a biblioteca browser-image-compression para manter a melhor qualidade possível.
 */
const compressImage = async(file: File): Promise<File> => {
    // Se a imagem já for pequena, não comprime.
    if (file.size <= MAX_FILE_SIZE) {
        return file;
    }

    // Opções para o imageCompression
    const options = {
        maxSizeMB: 0.3, // 300KB = 0.3MB
        maxWidthOrHeight: 1920, // Opcional: defina um tamanho máximo para largura ou altura se desejar
        useWebWorker: true,
    // Você pode definir onProgress se quiser acompanhar o progresso da compressão
    // onProgress: (progress) => console.log(`Compressão: ${progress}%`),
    };

    try {
        const compressedFile = await imageCompression(file, options);
        // Caso a compressão não tenha atingido o tamanho desejado, pode-se logar um aviso
        if (compressedFile.size > MAX_FILE_SIZE) {
            console.warn(
                `Imagem comprimida ainda tem ${Math.round(
                    compressedFile.size / 1024,
                )}KB, que é superior a 300KB`,
            );
        }
        return compressedFile;
    } catch (error) {
        console.error('Erro ao comprimir imagem:', error);
        throw error;
    }
};

const useFirebaseUpload = () => {
    const [progress, setProgress] = useState<number[]>([]);

    const uploadImages = async(
        images: { file: File; localUrl: string; index: number }[],
    ): Promise<ImageProductDataType[]> => {
    // Comprimir imagens (usando a nova função)
        const compressedImages = await Promise.all(
            images.map(async(image) => ({
                ...image,
                file: await compressImage(image.file),
            })),
        );
        const imagesFromFirebase: ImageProductDataType[] = [];
        const progresses: number[] = new Array(images.length).fill(0);

        const uploadPromises = compressedImages.map((image, index) => {
            return new Promise<void>((resolve, reject) => {
                if (!image || !image.file) {
                    reject(new Error(`Arquivo de imagem inválido no índice ${image.index}`));
                    return;
                }
                const storageRef = ref(storage, `images/${image.file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, image.file);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        progresses[index] =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress([...progresses]);
                    },
                    (error) => {
                        console.error(error);
                        reject(error);
                    },
                    async() => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        imagesFromFirebase.push({
                            localUrl: downloadURL,
                            index: image.index,
                        });
                        resolve();
                    },
                );
            });
        });

        await Promise.all(uploadPromises);
        return imagesFromFirebase;
    };

    const deleteImage = async(imageUrl: string) => {
        try {
            // Extrai o nome do arquivo da URL do Firebase Storage
            const url = new URL(imageUrl);
            const pathWithToken = url.pathname.split('/o/')[1];
            if (!pathWithToken) {
                throw new Error('URL inválida');
            }
            const path = decodeURIComponent(pathWithToken.split('?')[0]);
            const imageRef = ref(storage, path);
            await deleteObject(imageRef);
        } catch (error) {
            console.error('Erro ao deletar imagem:', error);
            throw error;
        }
    };

    return { uploadImages, deleteImage, progress };
};

export default useFirebaseUpload;
