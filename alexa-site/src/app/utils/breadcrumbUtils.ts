// src/app/utils/breadcrumbUtils.ts
import toTitleCase from './toTitleCase';
import { createSlugName } from './createSlugName';
import { SITE_URL } from './constants';

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function getBreadcrumbItems(section?: string | undefined, subsection?: string): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [
        { name: 'Início', url: SITE_URL },
        { name: toTitleCase(section || 'produtos'), url: `${SITE_URL}/section/${createSlugName(section || '')}` },
    ];
    if (section && subsection) {
        items.push({ name: toTitleCase(subsection), url: `${SITE_URL}/section/${createSlugName(section)}/${createSlugName(subsection)}` });
    }
    return items;
}

// Nova função para breadcrumbs na página do produto
export function getProductBreadcrumbItems(section: string, subsection: string | null, productName: string): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [
        { name: 'Início', url: SITE_URL },
        { name: toTitleCase(section), url: `${SITE_URL}/section/${createSlugName(section)}` },
    ];
    if (subsection) {
        items.push({ name: toTitleCase(subsection), url: `${SITE_URL}/section/${createSlugName(section)}/${createSlugName(subsection)}` });
    }
    // Item atual (produto) – não será renderizado como link
    items.push({ name: toTitleCase(productName), url: `${SITE_URL}/product/${createSlugName(productName)}` });
    return items;
}

export function generateBreadcrumbJsonLD(items: BreadcrumbItem[]): string {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    });
}
