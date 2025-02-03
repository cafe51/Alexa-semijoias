export function createSlugName(productName: string): string {
    return productName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .trim(); // Remove espaços no início e fim
}

export function revertSlugName(slug: string): string {
    return slug.replace(/-/g, ' ').trim().toLowerCase();
}