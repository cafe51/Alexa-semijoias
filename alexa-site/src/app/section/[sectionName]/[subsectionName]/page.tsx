//app/section/[subsectionName]/page.tsx

import ProductsList from '../../../components/ProductList/ProductsList';
import SectionPageTitle from '../../SectionPageTitle';

export default function SubSection({ params: { sectionName, subsectionName } }: { params: { subsectionName: string, sectionName: string } }) {

    return (
        // <p>{ `${sectionName}:${decodeURIComponent(subsectionName)}` }</p>
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <div className="max-w-7xl mx-auto">
                <SectionPageTitle section={ sectionName } subsection={ decodeURIComponent(subsectionName) } />
                <ProductsList sectionName={ sectionName } subsection={ `${sectionName}:${decodeURIComponent(subsectionName)}` }/>
            </div>
        </div>
    );
}
