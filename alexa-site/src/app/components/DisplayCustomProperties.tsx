import React from 'react';

interface DisplayCustomPropertiesProps {
  customProperties: { [key: string]: string };
}

export default function DisplayCustomProperties({ customProperties }: DisplayCustomPropertiesProps) {
    return (
        <div className='flex flex-col rounded-lg text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl space-y-1 md:space-y-2'>
            { customProperties &&
        Object.entries(customProperties)
            .sort()
            .map(([key, value]) => {
                return (
                    <div key={ key } className="flex gap-2 items-center">
                        <span className="text-gray-600">{ key }:</span>
                        <span className='font-bold'>
                            { typeof value === 'string' ? value : 'Value not a string' }
                        </span>
                    </div>
                );
            }) }
        </div>
    );
}