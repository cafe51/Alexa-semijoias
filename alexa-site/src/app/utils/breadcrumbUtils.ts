// src/app/utils/breadcrumbUtils.ts
import toTitleCase from './toTitleCase';
import { createSlugName } from './createSlugName';

export type BreadcrumbItem = {
  name: string;
  url: string;
};

const BASE_URL = 'https://www.alexasemijoias.com.br';

export function getBreadcrumbItems(section: string, subsection?: string): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [
        { name: 'Início', url: BASE_URL },
        { name: toTitleCase(section), url: `${BASE_URL}/section/${createSlugName(section)}` },
    ];
    if (subsection) {
        items.push({ name: toTitleCase(subsection), url: `${BASE_URL}/section/${createSlugName(section)}/${createSlugName(subsection)}` });
    }
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
