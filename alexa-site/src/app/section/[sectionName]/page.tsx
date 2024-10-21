//app/section/[sectionName]/page.tsx

import ProductsList from '../../components/ProductList/ProductsList';
import SectionPageTitle from '../SectionPageTitle';

export default function Section({ params }: { params: { sectionName: string } }) {
    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <div className="max-w-7xl mx-auto">
                <SectionPageTitle section={ params.sectionName } />
                <ProductsList sectionName={ params.sectionName } />
            </div>
        </div>
    );
}
