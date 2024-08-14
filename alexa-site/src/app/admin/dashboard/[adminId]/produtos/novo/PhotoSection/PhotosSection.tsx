// app/admin/dashboard/[adminId]/produtos/novo/PhotosSection.tsx
import { StateNewProductType } from '@/app/utils/types';

interface PhotosSectionProps {
    state: StateNewProductType;
    handleSetImages: (images: {
        file: File;
        localUrl: string;
    }[]) => void
}

export default function PhotosSection({ state, handleSetImages }: PhotosSectionProps) {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => ({
                file,
                localUrl: URL.createObjectURL(file),
            }));
            handleSetImages([...state.images, ...newImages]);
            e.target.value = ''; // Limpa o input para permitir o upload da mesma imagem novamente se necessário.
        }
    };
    
    const removeImage = (index: number) => {
        const imagesClone = [...state.images];
        const imagesFiltered = imagesClone.filter((_, i) => i !== index);
        handleSetImages(imagesFiltered);

    };
    
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-xl font-bold mb-4">Fotos</h2>
            <div className="flex flex-wrap gap-4 items-center">
                { state.images.map((image, index) => (
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
        </section>
    );
}
