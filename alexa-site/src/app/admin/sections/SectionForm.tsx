'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FireBaseDocument, SectionType } from '@/app/utils/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Accordion } from '@/components/ui/accordion';
import { ImageInput } from './ImageInput';
import { SubsectionAccordionItem } from './SubsectionAccordionItem';

export interface SubsectionFormData {
  name: string;
  description: string;
  image: File | null;
  imageUrl?: string | null;
}

export interface SectionFormData {
  sectionName: string;
  sectionDescription: string;
  sectionImage: File | null;
  sectionImageUrl?: string | null;
  subsections: SubsectionFormData[];
}

interface SectionFormProps {
  showForm: boolean;
  setShowForm: (showForm: boolean) => void;
  editingSection: (SectionType & FireBaseDocument) | null;
  setEditingSection: (value: (SectionType & FireBaseDocument) | null) => void;
  formData: SectionFormData;
  setFormData: (value: SectionFormData) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleFormChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubsectionChange: (index: number, field: keyof SubsectionFormData, value: string | File | null) => void;
  handleAddSubsectionInput: () => void;
  handleRemoveSubsectionInput: (index: number) => void;
  isSubmitting: boolean;
}

export default function SectionForm({
    editingSection,
    formData,
    setFormData,
    handleSubmit,
    handleFormChange,
    handleSubsectionChange,
    handleAddSubsectionInput,
    handleRemoveSubsectionInput,
    showForm,
    setShowForm,
    isSubmitting,
}: SectionFormProps) {
    const [sectionImagePreview, setSectionImagePreview] = useState<string | null>(formData.sectionImageUrl || null);

    useEffect(() => {
        setSectionImagePreview(formData.sectionImageUrl || null);
    }, [formData.sectionImageUrl]);

    return (
        <Dialog open={ showForm } onOpenChange={ setShowForm }>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ editingSection ? 'Editar Seção' : 'Adicionar Nova Seção' }</DialogTitle>
                </DialogHeader>
                <form onSubmit={ handleSubmit } className="space-y-4 mt-4 overflow-auto max-h-[80vh]">
                    <div>
                        <label className="block mb-1">Nome da Seção</label>
                        <Input
                            name="sectionName"
                            value={ formData.sectionName }
                            onChange={ handleFormChange }
                            required
                            disabled={ isSubmitting }
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Descrição da Seção</label>
                        <textarea
                            name="sectionDescription"
                            value={ formData.sectionDescription }
                            onChange={ handleFormChange }
                            className="w-full p-2 border rounded"
                            disabled={ isSubmitting }
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Imagem da Seção</label>
                        <ImageInput
                            imageUrl={ sectionImagePreview }
                            onFileSelect={ (file: File) => {
                                const preview = URL.createObjectURL(file);
                                setSectionImagePreview(preview);
                                setFormData({
                                    ...formData,
                                    sectionImage: file,
                                });
                            } }
                            onClear={ () => {
                                setSectionImagePreview(null);
                                setFormData({
                                    ...formData,
                                    sectionImage: null,
                                });
                            } }
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Subseções</label>
                        <Accordion type="single" collapsible className="space-y-2">
                            { formData.subsections.map((sub, idx) => (
                                <SubsectionAccordionItem
                                    key={ idx }
                                    index={ idx }
                                    subsection={ sub }
                                    onUpdate={ (field: keyof SubsectionFormData, value: string | File | null) => {
                                        if (field === 'image') {
                                            if (value instanceof File) {
                                                const preview = URL.createObjectURL(value);
                                                // Atualiza tanto o arquivo quanto o preview
                                                handleSubsectionChange(idx, 'image', value);
                                                handleSubsectionChange(idx, 'imageUrl', preview);
                                            } else {
                                                handleSubsectionChange(idx, 'image', null);
                                                handleSubsectionChange(idx, 'imageUrl', null);
                                            }
                                        } else {
                                            handleSubsectionChange(idx, field, value);
                                        }
                                    } }
                                    onRemove={ () => handleRemoveSubsectionInput(idx) }
                                />
                            )) }
                        </Accordion>
                        <Button type="button" variant="outline" size="sm" onClick={ handleAddSubsectionInput } disabled={ isSubmitting }>
              Adicionar Subseção
                        </Button>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="submit" disabled={ isSubmitting }>
                            { isSubmitting ? 'Processando...' : editingSection ? 'Atualizar' : 'Criar' }
                        </Button>
                        <Button type="button" variant="outline" onClick={ () => setShowForm(false) } disabled={ isSubmitting }>
              Cancelar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
