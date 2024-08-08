//app/section/[sectionName]/page.tsx

import ProductsList from '../../components/ProductsList';

export default function Section({ params }: { params: { sectionName: string } }) {
    return (
        <ProductsList sectionName={ params.sectionName } />
    );
}
