import React from 'react';

interface ProductSummaryProps {
  selectedOptions: { [key: string]: string };
}

const ProductSummary: React.FC<ProductSummaryProps> = ({ selectedOptions }) => (
    <div className="border p-4 mt-4">
        { Object.entries(selectedOptions).map(([key, value]) => (
            <div key={ key }>
                <strong>{ key }:</strong> { value }
            </div>
        )) }
    </div>
);

export default ProductSummary;
