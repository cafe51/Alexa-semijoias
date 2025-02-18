// src/app/utils/getGoogleProductCategory.ts
import { ProductBundleType } from './types';

export function getGoogleProductCategory(product: ProductBundleType): number {
    // Pega o primeiro valor de sections (convertido para minúsculas)
    let category = product.sections[0]?.toLowerCase() || '';
  
    // Se a seção for "joias em aço inox", tenta obter a categoria pela subseção
    if (category === 'joias em aço inox') {
        if (product.subsections && product.subsections.length > 0) {
            const parts = product.subsections[0].split(':');
            if (parts.length > 1) {
                category = parts[1].trim().toLowerCase();
            }
        }
    }

    // Mapeia a categoria para os códigos possíveis
    switch (category) {
    case 'anéis':
    case 'aneis': // caso sem acento
        return 200;
    case 'pulseiras':
        return 191;
    case 'brincos':
        return 194;
    case 'colares':
        return 196;
    case 'conjuntos':
        return 6463;
    case 'tornozeleiras':
        return 189;
    default:
        // Caso nenhum mapeamento seja encontrado, retorna o código padrão 188
        return 188;
    }
}
