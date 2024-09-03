import { ImageProductDataType, StateNewProductType } from '@/app/utils/types';

interface PhotosSectionProps {
    state: StateNewProductType;
    handleSetImages: (images: ImageProductDataType[]) => void;
}

export default function PhotosSection({ state, handleSetImages }: PhotosSectionProps) {
    const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = await Promise.all(
                Array.from(files).map(async(file, index) => {
                    const croppedFile = await cropToSquare(file);
                    return {
                        file: croppedFile,
                        localUrl: URL.createObjectURL(croppedFile),
                        index: state.images.length + index,
                    };
                }),
            );
            handleSetImages([...state.images, ...newImages]);
            e.target.value = ''; // Limpa o input para permitir o upload da mesma imagem novamente se necessário.
        }
    };

    const cropToSquare = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const img = document.createElement('img');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const size = Math.min(img.width, img.height);
                canvas.width = size;
                canvas.height = size;

                if (ctx) {
                    ctx.drawImage(
                        img,
                        (img.width - size) / 2,
                        (img.height - size) / 2,
                        size,
                        size,
                        0,
                        0,
                        size,
                        size,
                    );

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const croppedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });
                            resolve(croppedFile);
                        }
                    }, file.type);
                }
            };
        });
    };

    const removeImage = (index: number) => {
        const imagesFromState = [...state.images].filter((image) => image.index !== index);
        const imagesWithNewIndex = imagesFromState.map((imageFromState) => {
            if(imageFromState.index > index){
                return { ...imageFromState, index: imageFromState.index -= 1 };
            } else {
                return imageFromState;
            }
        });
        // for(const imageFromState of imagesFromState) {
        //     if(imageFromState.index > index) {
        //         imageFromState.index -= 1;
        //     }
        // }
        handleSetImages(imagesWithNewIndex);
    };

    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-xl font-bold mb-4">Fotos</h2>
            <div className="flex flex-wrap gap-4 items-center">
                { state.images.map((image, index) => (
                    <div key={ index } className="relative">
                        <img src={ image.localUrl } alt={ `product image ${index}` } className="h-32 w-32 object-cover rounded-lg" />
                        <button
                            onClick={ () => removeImage(image.index) }
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
