import { FilterOptionForUseSnapshot, FireBaseDocument, ProductBundleType, SectionType } from '@/app/utils/types';
import { useNumberedPagination } from '@/app/hooks/useNumberedPagination';
import { useMemo } from 'react';

function ProductQuantityCardBySubsection({ sectionName, subsection }: { sectionName: string, subsection: string }) {
    const collectionName = useMemo(() => 'products', []);

    const filtros = useMemo<FilterOptionForUseSnapshot[] | null>(() => {
        const baseFilters: FilterOptionForUseSnapshot[] = [
            { field: 'subsections', operator: 'array-contains', value: `${sectionName}:${subsection}` },
        ];
        return baseFilters;
    }, []);
    const { totalDocuments } = useNumberedPagination<ProductBundleType>(collectionName, filtros);

    return (
        <div>{ `${subsection}` }  - <span className='font-bold'>{ `(${ totalDocuments })` }</span></div>
    );
}

function ProductQuantityCard({ siteSection }: { siteSection: SectionType & FireBaseDocument }) {
    const { sectionName, subsections } = siteSection;

    const collectionName = useMemo(() => 'products', []);

    const filtros = useMemo<FilterOptionForUseSnapshot[] | null>(() => {
        const baseFilters: FilterOptionForUseSnapshot[] = [
            { field: 'sections', operator: 'array-contains', value: sectionName },
        ];
        return baseFilters;
    }, []);
    const { totalDocuments } = useNumberedPagination<ProductBundleType>(collectionName, filtros);

    return (
        <div className='flex flex-col gap-3 p-4 border-2 border-[#C48B9F] rounded-lg hover:border-[#D4AF37] transition'>
            <div>
                { `${sectionName.toUpperCase()}` } - <span className='font-bold'>{ `(${ totalDocuments })` }</span>
            </div>
            { subsections && subsections.length > 0 &&
            <div className="flex flex-col gap-3 text-sm text-gray-500 ml-4 w-full">
                { subsections.map((subsection, i) => <ProductQuantityCardBySubsection key={ i } sectionName= { sectionName } subsection={ subsection } />) }
            </div> }
        </div>
    );
}

export default function ProductQuantitiesList({ siteSections }: { siteSections: (SectionType & FireBaseDocument)[] }) {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                { siteSections.map((siteSection) => (
                    <ProductQuantityCard key={ siteSection.id } siteSection={ siteSection } />
                )) }
            </div>
        </div>
    );
}