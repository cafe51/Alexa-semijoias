// src/hooks/useFirebaseUpload.ts
import { useState } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const useFirebaseUpload = () => {
    const [progress, setProgress] = useState<number[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const uploadImages = async(files: File[]): Promise<string[]> => {
        const urls: string[] = [];
        const progresses: number[] = new Array(files.length).fill(0);

        const uploadPromises = files.map((file, index) => {
            return new Promise<void>((resolve, reject) => {
                const storageRef = ref(storage, `images/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

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
                        urls.push(downloadURL);
                        setImageUrls([...urls]);
                        resolve();
                    },
                );
            });
        });

        await Promise.all(uploadPromises); // Aguarda até que todas as promessas sejam resolvidas
        return urls;
    };

    return { uploadImages, progress, imageUrls };
};

export default useFirebaseUpload;
