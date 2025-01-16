//app/section/[subsectionName]/page.tsx
'use client';
import { useCollection } from '@/app/hooks/useCollection';
import { useEffect, useState } from 'react';
import ProductsList from '../../../components/ProductList/ProductsList';
import SectionPageTitle from '../../SectionPageTitle';
import { SectionType } from '@/app/utils/types';
import { useRouter } from 'next/navigation';

export default function SubSection({ params: { sectionName, subsectionName } }: { params: { subsectionName: string, sectionName: string } }) {
    const { getAllDocuments: getAllSections } = useCollection<SectionType>('siteSections');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchDataFromFb() {
            setLoading(true);

            const sectionOnFirebase = await getAllSections([{ field: 'sectionName', operator: '==', value: decodeURIComponent(sectionName) }]);
            
            if (sectionOnFirebase.length === 0 || !sectionOnFirebase[0].subsections?.includes(decodeURIComponent(subsectionName))) {
                router.push('/');
            }
            setLoading(false);

            return sectionOnFirebase;
        }
        fetchDataFromFb();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <div className="max-w-7xl mx-auto">
                { !loading && <SectionPageTitle section={ decodeURIComponent(sectionName) } subsection={ decodeURIComponent(subsectionName) } /> }
                <ProductsList sectionName={ decodeURIComponent(sectionName) } subsection={ `${decodeURIComponent(sectionName)}:${decodeURIComponent(subsectionName)}` }/>
            </div>
        </div>
    );
}
