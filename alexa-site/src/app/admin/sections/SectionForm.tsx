import { FireBaseDocument, SectionType } from '@/app/utils/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface SectionFormProps {
    showForm: boolean,
    setShowForm: (showForm: boolean) => void,
    editingSection: (SectionType & FireBaseDocument) | null;
    setEditingSection: (value: (SectionType & FireBaseDocument) | null) => void;
    setFormData: (value: { sectionName: string, subsections: string[] }) => void;
    formData: { sectionName: string, subsections: string[] };
    handleSubmit: (e: React.FormEvent) => void;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubsectionChange: (index: number, value: string) => void;
    handleAddSubsectionInput: () => void;
    handleRemoveSubsectionInput: (index: number) => void;
}

export default function SectionForm({
    editingSection,
    formData,
    handleSubmit,
    handleFormChange,
    handleSubsectionChange,
    handleAddSubsectionInput,
    handleRemoveSubsectionInput,
    showForm,
    setShowForm,
}: SectionFormProps) {
    return (
        <div>
            (
            <Dialog open={ showForm } onOpenChange={ setShowForm }>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{ editingSection ? 'Editar Seção' : 'Adicionar Nova Seção' }</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={ handleSubmit } className="space-y-4 mt-4">
                        <div>
                            <label className="block mb-1">Nome da Seção</label>
                            <Input name="sectionName" value={ formData.sectionName } onChange={ handleFormChange } required />
                        </div>
                        <div>
                            <label className="block mb-1">Subseções</label>
                            { formData.subsections.map((sub, idx) => (
                                <div key={ idx } className="flex items-center space-x-2 mb-2">
                                    <Input
                                        value={ sub }
                                        onChange={ (e) => handleSubsectionChange(idx, e.target.value) }
                                        placeholder="Nome da Subseção"
                                    />
                                    <Button variant="destructive" size="sm" onClick={ () => handleRemoveSubsectionInput(idx) }>
                      Remover
                                    </Button>
                                </div>
                            )) }
                            <Button type="button" variant="outline" size="sm" onClick={ handleAddSubsectionInput }>
                  Adicionar Subseção
                            </Button>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="submit">{ editingSection ? 'Atualizar' : 'Criar' }</Button>
                            <Button type="button" variant="outline" onClick={ () => setShowForm(false) }>
                  Cancelar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            )
        </div>
    );
}