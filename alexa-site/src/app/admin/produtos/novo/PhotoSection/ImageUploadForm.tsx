import React, { useState } from 'react';

export default function ImageUploadForm() {
    // Usando um estado único para armazenar o arquivo e o URL da imagem local
    const [images, setImages] = useState<{ file: File, localUrl: string }[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => ({
                file,
                localUrl: URL.createObjectURL(file),
            }));
            setImages(prevImages => [...prevImages, ...newImages]);
            e.target.value = ''; // Limpa o input para permitir o upload da mesma imagem novamente se necessário.
        }
    };

    const removeImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-4 items-center">
                { images.map((image, index) => (
                    <div key={ index } className="relative">
                        <img src={ image.localUrl } alt={ `product image ${index}` } className="h-32 w-32 object-cover rounded-lg" />
                        <button
                            onClick={ () => removeImage(index) }
                            className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 bg-white text-red-500 rounded-full p-1 shadow-lg hover:text-red-700 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )) }
                <label className="cursor-pointer">
                    <div className="h-32 w-32 border-2 border-dashed border-blue-400 flex justify-center items-center rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <input type="file" multiple className="hidden" onChange={ handleImageChange } />
                </label>
            </div>

        </div>
    );
}
