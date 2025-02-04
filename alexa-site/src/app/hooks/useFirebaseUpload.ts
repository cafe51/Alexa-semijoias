// src/hooks/useFirebaseUpload.ts
import { useState } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { ImageProductDataType } from '../utils/types';

const MAX_FILE_SIZE = 300 * 1024; // 300KB em bytes

const compressImage = async(file: File): Promise<File> => {
    // Se o arquivo já for menor que 300KB, retorna ele mesmo
    if (file.size <= MAX_FILE_SIZE) {
        return file;
    }

    // Criar URL temporária para a imagem
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Não foi possível obter o contexto do canvas');
    }

    // Definir dimensões iniciais do canvas
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    // Desenhar imagem no canvas
    ctx.drawImage(imageBitmap, 0, 0);

    // Tentar diferentes qualidades até conseguir um arquivo menor que 300KB
    let quality = 0.7;
    let compressedFile: File | null = null;

    while (quality > 0.1) {
        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality);
        });

        if (blob.size <= MAX_FILE_SIZE) {
            compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
            break;
        }

        quality -= 0.1;
    }

    // Se mesmo com qualidade mínima o arquivo ainda for grande, reduzir dimensões
    if (!compressedFile) {
        const scale = Math.sqrt(MAX_FILE_SIZE / file.size);
        canvas.width = Math.floor(imageBitmap.width * scale);
        canvas.height = Math.floor(imageBitmap.height * scale);
        ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.7);
        });

        compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
    }

    return compressedFile;
};


const useFirebaseUpload = () => {
    const [progress, setProgress] = useState<number[]>([]);

    const uploadImages = async(images: { file: File; localUrl: string; index: number }[]): Promise<ImageProductDataType[]> => {
        // Comprimir imagens antes do upload
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
                if(!image || !image.file) {
                    throw new Error(`invalid image file at index ${ image.localUrl }`);
                }
                const storageRef = ref(storage, `images/${image.file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, image.file);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        progresses[index] = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress([...progresses]);
                    },
                    (error) => {
                        console.error(error);
                        reject(error);
                    },
                    async() => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        imagesFromFirebase.push({ localUrl: downloadURL, index: image.index });
                        resolve();
                    },
                );

            });
        });

        await Promise.all(uploadPromises); // Aguarda até que todas as promessas sejam resolvidas
        return imagesFromFirebase;
    };

    const deleteImage = async(imageUrl: string) => {
        try {
            // Extrair o nome do arquivo da URL do Firebase Storage
            const url = new URL(imageUrl);
            const pathWithToken = url.pathname.split('/o/')[1]; // Remove /v0/b/[bucket]/o/
            if (!pathWithToken) {
                throw new Error('URL inválida');
            }
            const path = decodeURIComponent(pathWithToken.split('?')[0]); // Remove o token
            const imageRef = ref(storage, path);
            await deleteObject(imageRef);
        } catch (error) {
            console.error('Erro ao deletar imagem:', error);
            throw error;
        }
    };

    return { uploadImages, deleteImage, progress  };
};

export default useFirebaseUpload;
