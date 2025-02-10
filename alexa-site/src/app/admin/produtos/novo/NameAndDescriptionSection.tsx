// app/admin/dashboard/[adminId]/produtos/novo/NameAndDescriptionSection.tsx
import { useState } from 'react';
import { StateNewProductType, UseNewProductState } from '@/app/utils/types';

interface NameAndDescriptionSectionProps {
  state: StateNewProductType;
  handlers: UseNewProductState;
}

export default function NameAndDescriptionSection({ state, handlers }: NameAndDescriptionSectionProps) {
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedDescriptions, setGeneratedDescriptions] = useState<string[]>([]);

    // Função para converter um File para Base64
    const getBase64 = (file: File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    // Converte apenas as duas primeiras imagens (ordenadas pelo index)
    // Se a propriedade file existir, converte para Base64; caso contrário, utiliza o localUrl.
    const convertImagesToBase64 = async(): Promise<string[]> => {
    // Ordena e seleciona as duas primeiras imagens (index 0 e 1)
        const selectedImages = [...state.images]
            .sort((a, b) => a.index - b.index)
            .slice(0, 2);
      
        const imagesData = await Promise.all(
            selectedImages.map(async(image) => {
                if (image.file) {
                    try {
                        return await getBase64(image.file);
                    } catch (err) {
                        console.error('Erro convertendo imagem para Base64:', err);
                        return '';
                    }
                } else {
                    // Se não houver file, assume que o localUrl é uma URL pública (por exemplo, no Firebase)
                    return image.localUrl;
                }
            }),
        );
        return imagesData.filter((img) => img !== '');
    };

    // Função para gerar uma descrição única, evitando repetições
    const generateUniqueDescription = async(attempt = 0): Promise<string | null> => {
        if (attempt > 3) {
            setError('Não foi possível gerar uma descrição única. Tente novamente mais tarde.');
            return null;
        }

        // Converte as duas primeiras imagens para Base64 ou usa a URL disponível
        const imagesData = await convertImagesToBase64();

        const payload = {
            title: state.name,
            images: imagesData,
            previousDescriptions: generatedDescriptions,
        };

        try {
            const response = await fetch('/api/generate-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                setError('Erro ao gerar descrição. Tente novamente.');
                return null;
            }

            const data = await response.json();
            const newDescription = data.description as string;

            // Se a nova descrição já foi gerada anteriormente, tenta novamente
            if (generatedDescriptions.includes(newDescription)) {
                return generateUniqueDescription(attempt + 1);
            }

            return newDescription;
        } catch (err) {
            console.error(err);
            setError('Erro na conexão com o serviço de geração.');
            return null;
        }
    };

    // Handler do botão que gera a descrição
    const handleGenerateDescription = async() => {
        setError(null);
        if (state.images.length === 0) {
            setError('Adicione imagens para gerar a descrição.');
            return;
        }

        setGenerating(true);
        const newDescription = await generateUniqueDescription();
        if (newDescription) {
            handlers.handleDescriptionChange(newDescription);
            setGeneratedDescriptions((prev) => [...prev, newDescription]);
        }
        setGenerating(false);
    };

    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Nome e descrição</h2>
      
            <div className="mt-2">
                <label className="block text-sm font-medium" htmlFor="name">Nome</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={ state.name }
                    onChange={ (e) => handlers.handleNameChange(e.target.value) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="Nome do produto"
                />
            </div>
      
            <div className="mt-2">
                <label className="block text-sm font-medium" htmlFor="description">Descrição</label>
                <textarea
                    id="description"
                    name="description"
                    value={ state.description }
                    onChange={ (e) => handlers.handleDescriptionChange(e.target.value) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md min-h-44"
                    placeholder="Descrição do produto"
                />
            </div>

            { error && <p className="text-red-500 mt-2">{ error }</p> }

            <button
                onClick={ handleGenerateDescription }
                className={ `mt-2 px-4 py-2 rounded bg-blue-500 text-white ${state.images.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}` }
            >
                { generating ? 'Gerando...' : 'Gerar descrição' }
            </button>
        </section>
    );
}
