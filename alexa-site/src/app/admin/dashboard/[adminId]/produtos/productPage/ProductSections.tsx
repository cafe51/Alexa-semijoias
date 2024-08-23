export default function ProductSections({ sections, subsections }: {sections: string[], subsections?: string[]}) {
    return (
        <div className='flex flex-col gap-4 bg-yellow-200 p-2 '>

            <p className='text-bold'>Seções</p>

            { sections.map((section, index) => {
                return (
                    <div key={ index } className='flex flex-col gap-2 w-full'>
                        <div>
                            <p className='bg-red-200 p-2'>{ section }</p>

                            <div className='flex flex-wrap gap-2'>
                                {
                                    subsections && subsections
                                        .filter((ss) => ss.split(':')[0] === section)
                                        .map((ssFiltered) => {
                                            return (
                                                <div key={ ssFiltered + section } className='bg-blue-300 p-2' >
                                                    <p> { ssFiltered.split(':')[1] } </p>
                                                </div>
                                            );
                                        })
                                }
                            </div>

                        </div>
                    </div>
                );
            }) }
        </div>
    );
}