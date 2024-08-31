export function normalizeString(string: string) {
    // Normaliza a string para a forma decomposta, separando os caracteres base dos diacríticos
    const textoSemAcento = string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Converte todos os caracteres para minúsculo
    return textoSemAcento.toLowerCase();
}