import { FireBaseDocument, SectionType } from '@/app/utils/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeleteSectionConfirmationDialogProps {
    deleteModalOpen: boolean;
    setDeleteModalOpen: (value: boolean) => void;
    deleteType: 'section' | 'subsection' | null
    sectionToDelete: (SectionType & FireBaseDocument) | null
    subsectionToDelete: string | null;
    affectedCount: number;
    confirmDelete: () => void;
}

export default function DeleteSectionConfirmationDialog({
    deleteModalOpen,
    setDeleteModalOpen,
    deleteType,
    sectionToDelete,
    subsectionToDelete,
    affectedCount,
    confirmDelete,
}: DeleteSectionConfirmationDialogProps) {
    return (
        <Dialog open={ deleteModalOpen } onOpenChange={ setDeleteModalOpen }>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmação de Exclusão</DialogTitle>
                </DialogHeader>
                <DialogDescription className="mt-2">
                    { deleteType === 'section' ? (
                        <div>
                            <p>
                                Você está prestes a deletar a seção <strong>{ sectionToDelete?.sectionName }</strong>.
                            </p>
                            { sectionToDelete?.subsections && sectionToDelete.subsections.length > 0 && (
                                <p>
                                    As seguintes subseções serão removidas: { sectionToDelete.subsections.join(', ') }
                                </p>
                            ) }
                            <p>
                                Produtos afetados: <strong>{ affectedCount }</strong>
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p>
                                Você está prestes a deletar a subseção <strong>{ subsectionToDelete }</strong> da seção{ ' ' }
                                <strong>{ sectionToDelete?.sectionName }</strong>.
                            </p>
                            <p>
                                Produtos afetados: <strong>{ affectedCount }</strong>
                            </p>
                        </div>
                    ) }
                </DialogDescription>
                <DialogFooter className="mt-4">
                    <Button variant="destructive" onClick={ confirmDelete }>
                        Confirmar
                    </Button>
                    <Button variant="outline" onClick={ () => setDeleteModalOpen(false) }>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}