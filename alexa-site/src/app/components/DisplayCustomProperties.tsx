export default function DisplayCustomProperties({ customProperties }: {customProperties: { [key: string]: string }}) {
    return (
        <div className='flex flex-col rounded-lg text-xs ' >
            {
                customProperties && Object.entries(customProperties).sort().map(([key, value]) => {
                    return (
                        <div key={ key } className="flex gap-2">
                            <span >{ key }:</span>
                            <span className='font-bold'>{ typeof value === 'string' ? value : 'Value not a string' }</span>
                        </div>
                    );
                })
            }
        </div>
    );
}