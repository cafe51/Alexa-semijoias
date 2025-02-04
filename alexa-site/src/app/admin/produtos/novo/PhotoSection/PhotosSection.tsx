import { ImageProductDataType, StateNewProductType } from '@/app/utils/types';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';

interface PhotosSectionProps {
    state: StateNewProductType;
    handleSetImages: (images: ImageProductDataType[]) => void;
}

function hashString(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) + hash + str.charCodeAt(i); // hash * 33 + c
    }
    return hash.toString();
}

export default function PhotosSection({ state, handleSetImages }: PhotosSectionProps) {
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(state.images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Atualiza os índices após a reordenação
        const updatedItems = items.map((item, index) => ({
            ...item,
            index,
        }));

        handleSetImages(updatedItems);
    };

    const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = await Promise.all(
                Array.from(files).map(async(file, index) => {
                    return {
                        file,
                        localUrl: URL.createObjectURL(file),
                        index: state.images.length + index,
                    };
                }),
            );
            handleSetImages([...state.images, ...newImages]);
            e.target.value = ''; // Limpa o input para permitir o upload da mesma imagem novamente se necessário.
        }
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

        handleSetImages(imagesWithNewIndex);
    };

    return (
        <section className="p-4 border rounded-md bg-white">
            <div className="mb-4">
                <h2 className="text-xl font-bold">Fotos</h2>
                <p className="text-sm text-gray-500 mt-1">Arraste as imagens para reordená-las</p>
            </div>
            <DragDropContext onDragEnd={ onDragEnd }>
                <StrictModeDroppable droppableId="photos" direction="horizontal">
                    { (provided) => (
                        <div 
                            className="flex flex-wrap gap-4 items-center" 
                            { ...provided.droppableProps }
                            ref={ provided.innerRef }
                        >
                            { state.images.map((image, index) => (
                                <Draggable
                                    key={ `image-${hashString(image.localUrl)}` }
                                    draggableId={ `image-${hashString(image.localUrl)}` }
                                    index={ index }
                                >
                                    { (provided) => (
                                        <div
                                            ref={ provided.innerRef }
                                            { ...provided.draggableProps }
                                            { ...provided.dragHandleProps }
                                            className="relative transition-transform"
                                            style={ provided.draggableProps.style }
                                        >
                                            <img 
                                                src={ image.localUrl } 
                                                alt={ `product image ${index}` } 
                                                className="h-32 w-32 object-cover rounded-lg cursor-move hover:opacity-80 transition-opacity shadow-sm hover:shadow-md" 
                                            />
                                            <button
                                                onClick={ () => removeImage(image.index) }
                                                className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 bg-white text-red-500 rounded-full p-1 shadow-lg hover:text-red-700 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) }
                                </Draggable>
                            )) }
                            { provided.placeholder }
                            <label className="cursor-pointer">
                                <div className="h-32 w-32 border-2 border-dashed border-blue-400 flex justify-center items-center rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8 text-blue-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <input type="file" multiple className="hidden" onChange={ handleImageChange } />
                            </label>
                        </div>
                    ) }
                </StrictModeDroppable>
            </DragDropContext>
        </section>
    );
}
