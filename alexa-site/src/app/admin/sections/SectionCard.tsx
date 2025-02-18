import { FireBaseDocument, SectionType } from '@/app/utils/types';
import { Button } from '@/components/ui/button';

interface SectionCardProps {
    sections: (SectionType & FireBaseDocument)[];
    handleEditSection: (section: SectionType & FireBaseDocument) => void;
    handleDelete: (section: SectionType & FireBaseDocument, type: 'section' | 'subsection', subsection?: string) => Promise<void>
}

export default function SectionCard({ sections, handleEditSection, handleDelete }: SectionCardProps) {
    return (
        <div className="mt-4 space-y-4 w-full">
            { sections.map((section) => (
                <div key={ section.id } className="border p-4 rounded bg-white shadow-lg min-h-[150px] w-full">
                    <div className="flex justify-between items-stretch w-full">
                        <div className="flex flex-col min-h-[150px] w-full text-center">
                            <div className='flex w-full justify-between -200'> 
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={ () => handleEditSection(section) }
                                >
                                    Editar
                                </Button>
                                <h2 className="text-xl font-semibold">{ section.sectionName }</h2>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={ () => handleDelete(section, 'section') }
                                    className="mt-auto"
                                >
                                    Deletar
                                </Button>

                            </div>
                            { section.subsections && section.subsections.length > 0 && (
                                <ul className="flex flex-col items-center justify-center text-center w-full h-full gap-2">
                                    { section.subsections.map((sub, idx) => (
                                        <li key={ idx } className="flex items-center justify-between">
                                            <span>{ sub }</span>
                                        </li>
                                    )) }
                                </ul>
                            ) }
                        </div>
                    </div>
                </div>
            )) }
        </div>
    ); 
}