// src/app/components/PageContainer.tsx
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
    return (
        <div 
            className="min-h-screen bg-[#FAF9F6] text-[#333333] w-full pb-8 md:pb-12 lg:pb-16 xl:pb-18" 
            style={ { fontFamily: 'Montserrat, sans-serif' } }
        >
            <div className="mx-auto w-full">
                { children }
            </div>
        </div>
    );
}
