// src/app/components/PageContainer.tsx
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
    return (
        <div 
            className="min-h-screen bg-[#FAF9F6] text-[#333333] py-6 sm:py-8 px-3 sm:px-4 md:px-8 " 
            style={ { fontFamily: 'Montserrat, sans-serif' } }
        >
            <div className="max-w-7xl mx-auto">
                { children }
            </div>
        </div>
    );
}
