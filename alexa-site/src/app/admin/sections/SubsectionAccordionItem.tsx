'use client';
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageInput } from './ImageInput';
import { SubsectionFormData } from '@/app/admin/sections/SectionForm';

interface SubsectionAccordionItemProps {
  index: number;
  subsection: SubsectionFormData;
  onUpdate: (field: keyof SubsectionFormData, value: string | File | null) => void;
  onRemove: () => void;
}

export const SubsectionAccordionItem: React.FC<SubsectionAccordionItemProps> = ({
    index,
    subsection,
    onUpdate,
    onRemove,
}) => {
    return (
        <AccordionItem value={ `sub-${index}` }>
            <div className="flex items-center justify-between w-full bg-gray-200 px-4">
                <AccordionTrigger className="flex-1 text-left w-44 md:w-80 ">
                    { subsection.name || 'Nova Subseção' }
                </AccordionTrigger>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={ (e) => {
                        e.stopPropagation();
                        onRemove();
                    } }
                >
          Remover
                </Button>
            </div>
            <AccordionContent>
                <div className="space-y-2 bg-gray-100 p-4 ">
                    <div>
                        <label className="block text-sm mb-1">Nome da Subseção</label>
                        <Input
                            className='bg-white'
                            value={ subsection.name }
                            onChange={ (e) => onUpdate('name', e.target.value) }
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Descrição da Subseção</label>
                        <textarea
                            value={ subsection.description }
                            onChange={ (e) => onUpdate('description', e.target.value) }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Imagem da Subseção</label>
                        <ImageInput
                            imageUrl={ subsection.imageUrl || null }
                            onFileSelect={ (file: File) => onUpdate('image', file) }
                            onClear={ () => onUpdate('image', null) }
                        />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
