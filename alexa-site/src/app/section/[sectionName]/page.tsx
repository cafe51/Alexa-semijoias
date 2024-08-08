//app/aneis/page.tsx

import ProductsList from '../../components/ProductsList';

export default function Section({ params }: { params: { sectionName: string } }) {
    return (
        <ProductsList productType={ params.sectionName } />
    );
}
