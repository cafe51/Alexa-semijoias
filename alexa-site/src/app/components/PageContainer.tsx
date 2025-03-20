// src/app/components/PageContainer.tsx
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
    return (
        <div 
            className="min-h-screen bg-[#FAF9F6] text-[#333333] w-full" 
            style={ { fontFamily: 'Montserrat, sans-serif' } }
        >
            <div className="mx-auto w-full">
                { children }
            </div>
        </div>
    );
}
