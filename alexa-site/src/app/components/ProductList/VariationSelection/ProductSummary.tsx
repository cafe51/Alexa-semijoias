import React from 'react';

interface ProductSummaryProps {
  selectedOptions: { [key: string]: string };
}

const ProductSummary: React.FC<ProductSummaryProps> = ({ selectedOptions }) => (
    <div className="flex flex-col gap-2 justify-center items-start p-2 ">
        { Object.entries(selectedOptions).map(([key, value]) => (
            <div key={ key }>
                <strong>{ key }:</strong> { value }
            </div>
        )) }
    </div>
);

export default ProductSummary;
