import imageCompression from 'browser-image-compression';

/**
 * Comprime a imagem se ela for maior que 300KB.
 * Usa a biblioteca browser-image-compression para manter a melhor qualidade possível.
 */
export const compressImage = async(file: File, maxFileSize: number): Promise<File> => {
    // Se a imagem já for pequena, não comprime.
    if (file.size <= maxFileSize) {
        return file;
    }

    // Opções para o imageCompression
    const options = {
        maxSizeMB: 0.9, // 300KB = 0.3MB
        maxWidthOrHeight: 1920, // Opcional: defina um tamanho máximo para largura ou altura se desejar
        useWebWorker: true,
    // Você pode definir onProgress se quiser acompanhar o progresso da compressão
    // onProgress: (progress) => console.log(`Compressão: ${progress}%`),
    };

    try {
        const compressedFile = await imageCompression(file, options);
        // Caso a compressão não tenha atingido o tamanho desejado, pode-se logar um aviso
        if (compressedFile.size > maxFileSize) {
            console.warn(
                `Imagem comprimida ainda tem ${Math.round(
                    compressedFile.size / 1024,
                )}KB, que é superior a 300KB`,
            );
        }
        return compressedFile;
    } catch (error) {
        console.error('Erro ao comprimir imagem:', error);
        throw error;
    }
};
