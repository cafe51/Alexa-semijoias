// src/hooks/useFirebaseUpload.ts
import { useState } from 'react';
import { storage, projectFirestoreDataBase } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const useFirebaseUpload = () => {
    const [progress, setProgress] = useState<number[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const uploadImages = (files: File[], docId: string, collection: string) => {
        const urls: string[] = [];
        const progresses: number[] = new Array(files.length).fill(0);

        files.forEach((file, index) => {
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
                },
                async() => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    urls.push(downloadURL);
                    setImageUrls([...urls]);

                    if (urls.length === files.length) {
                        await saveImagesUrlsToFirestore(urls, docId, collection);
                    }
                },
            );
        });
    };

    const saveImagesUrlsToFirestore = async(urls: string[], docId: string, collection: string) => {
        const docRef = doc(projectFirestoreDataBase, collection, docId);
        await setDoc(docRef, { images: urls }, { merge: true });
    };

    return { uploadImages, progress, imageUrls };
};

export default useFirebaseUpload;
