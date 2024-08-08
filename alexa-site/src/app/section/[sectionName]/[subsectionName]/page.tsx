//app/section/[subsectionName]/page.tsx

import ProductsList from '../../../components/ProductsList';

export default function SubSection({ params: { sectionName, subsectionName } }: { params: { subsectionName: string, sectionName: string } }) {

    return (
        // <p>{ `${sectionName}:${decodeURIComponent(subsectionName)}` }</p>
        <ProductsList sectionName={ sectionName } subsection={ `${sectionName}:${decodeURIComponent(subsectionName)}` }/>
    );
}
