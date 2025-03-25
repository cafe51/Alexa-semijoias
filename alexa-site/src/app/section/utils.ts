import { ProductsResponse } from '../services/products';
import { SITE_URL } from '../utils/constants';

export const fetchProductsData = async(
    sectionName?: string,
    subsection?: string,
    slug?: string,
    // collectionName?: string,
    // searchTerm?: string,
    // orderBy?: string,
    // direction?: string,
    // limit?: number,
) => {
    try {
        const params = new URLSearchParams();
        if (sectionName) params.append('section', sectionName);
        if (subsection) params.append('subsection', subsection);
        if (slug) params.append('slug', slug);

        // if (collectionName) params.append('collection', collectionName);
        // params.append('orderBy', orderBy);
        // params.append('direction', direction);
        // if (searchTerm) params.append('searchTerm', searchTerm);
        params.append('limit', '1');
        const response = await fetch(`${SITE_URL}/api/products?${params.toString()}`);
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', response);

        if (!response.ok) {
            throw new Error('Falha ao carregar produtos');
        }
        const data: ProductsResponse = await response.json();
        return data.products[0];
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
};