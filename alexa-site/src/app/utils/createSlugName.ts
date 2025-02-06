import { SectionSlugType, SectionType } from './types';

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

export const isSlugSubsectionPresent = (siteSection: SectionType, slugToCheck: string) => siteSection.subsections?.some(subsection => {
    const slug = subsection.split(':')[1]; // Extrai o slug da string
    return slug === slugToCheck;
});

export function findSubsectionName(section: SectionType, slug: string): string | undefined {
    if (section.subsections) {
        for (const subsection of section.subsections) {
            const [name, subsectionSlug] = subsection.split(':');
            if (subsectionSlug === slug) {
                return name;
            }
        }
    }
    return undefined; // Retorna undefined se o slug não for encontrado
}

export function createSubsectionsWithSlug(subsections: string[]): SectionSlugType['subsections'] {
    return subsections.map((subsection) => {
        return {
            subsectionName: subsection,
            subsectionSlugName: createSlugName(subsection),
        };
    });
}