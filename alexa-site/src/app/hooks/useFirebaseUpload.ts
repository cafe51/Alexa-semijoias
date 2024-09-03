// src/hooks/useFirebaseUpload.ts
import { useState } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ImageProductDataType } from '../utils/types';


const useFirebaseUpload = () => {
    const [progress, setProgress] = useState<number[]>([]);

    const uploadImages = async(images: { file: File; localUrl: string; index: number }[]): Promise<ImageProductDataType[]> => {
        const imagesFromFirebase: ImageProductDataType[] = [];
        const progresses: number[] = new Array(images.length).fill(0);

        const uploadPromises = images.map((image, index) => {
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

    return { uploadImages, progress  };
};

export default useFirebaseUpload;
