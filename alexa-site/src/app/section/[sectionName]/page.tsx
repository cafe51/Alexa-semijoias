//app/section/[sectionName]/page.tsx
'use client';
import { useCollection } from '@/app/hooks/useCollection';
import { useEffect, useState } from 'react';
import ProductsList from '../../components/ProductList/ProductsList';
import SectionPageTitle from '../SectionPageTitle';
import { SectionType } from '@/app/utils/types';
import { useRouter } from 'next/navigation';

export default function Section({ params }: { params: { sectionName: string } }) {
    const { getAllDocuments: getAllSections } = useCollection<SectionType>('siteSections');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchDataFromFb() {
            setLoading(true);
            const sectionOnFirebase = await getAllSections([{ field: 'sectionName', operator: '==', value: decodeURIComponent(params.sectionName) }]);
            console.log('SEEEEEEECTION', sectionOnFirebase);

            if (sectionOnFirebase.length === 0) {
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
                { !loading && <SectionPageTitle section={ decodeURIComponent(params.sectionName) } /> }
                <ProductsList sectionName={ decodeURIComponent(params.sectionName) } />
            </div>
        </div>
    );
}
