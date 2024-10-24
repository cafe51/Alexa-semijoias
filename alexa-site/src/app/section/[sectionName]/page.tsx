//app/section/[sectionName]/page.tsx
'use client';
import { useEffect } from 'react';
import ProductsList from '../../components/ProductList/ProductsList';
import SectionPageTitle from '../SectionPageTitle';

export default function Section({ params }: { params: { sectionName: string } }) {

    useEffect(() => {
        console.log('XXXXXXXXXXXXXXX', params.sectionName);
        console.log('YYYYYYYYYYYYY', decodeURIComponent(params.sectionName));
    }, [params.sectionName]);
    
    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <div className="max-w-7xl mx-auto">
                <SectionPageTitle section={ decodeURIComponent(params.sectionName) } />
                <ProductsList sectionName={ decodeURIComponent(params.sectionName) } />
            </div>
        </div>
    );
}
