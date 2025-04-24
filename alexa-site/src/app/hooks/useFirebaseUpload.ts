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
import { compressImage } from '../utils/compressImage';

const MAX_FILE_SIZE = 900 * 1024; // 300KB em bytes

const useFirebaseUpload = () => {
    const [progress, setProgress] = useState<number[]>([]);
    const [videoProgress, setVideoProgress] = useState<number>(0);

    const uploadVideo = async(videoFile: File, slug: string, barcode: string): Promise<string> => {
        const fileName = `video_${slug}_${barcode}`;
        const storageRef = ref(storage, `videos/productVideos/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setVideoProgress(progress);
                },
                (error) => {
                    console.error('Erro no upload do vídeo:', error);
                    reject(error);
                },
                async() => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                },
            );
        });
    };

    const deleteVideo = async(videoUrl: string) => {
        try {
            const url = new URL(videoUrl);
            const pathWithToken = url.pathname.split('/o/')[1];
            if (!pathWithToken) throw new Error('URL inválida');
            const path = decodeURIComponent(pathWithToken.split('?')[0]);
            const videoRef = ref(storage, path);
            await deleteObject(videoRef);
        } catch (error) {
            console.error('Erro ao deletar vídeo:', error);
            throw error;
        }
    };

    const uploadImages = async(
        images: { file: File; localUrl: string; index: number }[],
    ): Promise<ImageProductDataType[]> => {
    // Comprimir imagens (usando a nova função)
        const compressedImages = await Promise.all(
            images.map(async(image) => ({
                ...image,
                file: await compressImage(image.file, MAX_FILE_SIZE),
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

    return {
        uploadImages,
        deleteImage,
        uploadVideo,
        deleteVideo,
        progress,
        // Expor o estado de progresso do vídeo
        videoProgress: videoProgress, 
    };
};

export default useFirebaseUpload;
