'use client';
import React, { useState, useEffect } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import { SectionType, SectionSlugType, ProductBundleType, FireBaseDocument } from '@/app/utils/types';
import { createSlugName, createSubsectionsWithSlug } from '@/app/utils/createSlugName';
import { Button } from '@/components/ui/button';
import { useSectionUpdates } from '@/app/hooks/useSectionUpdates';
import { where } from 'firebase/firestore';
import DeleteSectionConfirmationDialog from './DeleteSectionConfirmationDialog';
import SectionForm from './SectionForm';
import SectionCard from './SectionCard';
import { toast } from '@/hooks/use-toast'; // Supondo que você possua um hook de toast

const SectionsManagement: React.FC = () => {
    // Instâncias dos hooks para as coleções
    const {
        getAllDocuments,
        addDocument,
        updateDocumentField,
        deleteDocument,
    } = useCollection<SectionType>('siteSections');
    const sectionSlugCollection = useCollection<SectionSlugType>('siteSectionsWithSlugName');
    const productsCollectionForCount = useCollection<ProductBundleType>('products');

    const {
        updateProductsOnSectionNameChange,
        updateProductsOnSubsectionsChange,
        removeSectionFromProducts,
        removeSubsectionFromProducts,
    } = useSectionUpdates();

    // Estado dos documentos – cada documento já inclui os dados de FireBaseDocument
    const [sections, setSections] = useState<(SectionType & FireBaseDocument)[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingSection, setEditingSection] = useState<(SectionType & FireBaseDocument) | null>(null);
    const [formData, setFormData] = useState<{ sectionName: string; subsections: string[] }>({
        sectionName: '',
        subsections: [],
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [sectionToDelete, setSectionToDelete] = useState<(SectionType & FireBaseDocument) | null>(null);
    const [deleteType, setDeleteType] = useState<'section' | 'subsection' | null>(null);
    const [subsectionToDelete, setSubsectionToDelete] = useState<string | null>(null);
    const [affectedCount, setAffectedCount] = useState<number>(0);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async() => {
        setLoading(true);
        try {
            const docs = await getAllDocuments();
            setSections(docs);
        } catch (error) {
            console.error('Erro ao buscar seções:', error);
            toast({
                title: 'Erro ao buscar seções',
                description: 'Ocorreu um erro ao carregar as seções. Tente novamente.',
                variant: 'destructive',
            });
        }
        setLoading(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddSubsectionInput = () => {
        setFormData((prev) => ({ ...prev, subsections: [...prev.subsections, ''] }));
    };

    const handleSubsectionChange = (index: number, value: string) => {
        const newSubs = [...formData.subsections];
        newSubs[index] = value;
        setFormData((prev) => ({ ...prev, subsections: newSubs }));
    };

    const handleRemoveSubsectionInput = (index: number) => {
        const newSubs = [...formData.subsections];
        newSubs.splice(index, 1);
        setFormData((prev) => ({ ...prev, subsections: newSubs }));
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.sectionName.trim()) return;
        setIsSubmitting(true);
        // Sempre envia um array válido (mesmo que vazio)
        const validSubs = formData.subsections;

        if (editingSection) {
            try {
                // Atualiza a coleção siteSections
                await updateDocumentField(editingSection.id, 'sectionName', formData.sectionName);
                await updateDocumentField(editingSection.id, 'subsections', validSubs);

                // Atualiza o documento correspondente em siteSectionsWithSlugName
                const slugName = createSlugName(formData.sectionName);
                await sectionSlugCollection.addDocument(
                    {
                        sectionName: formData.sectionName,
                        sectionSlugName: slugName,
                        subsections: validSubs.length > 0 ? createSubsectionsWithSlug(validSubs) : [],
                    },
                    editingSection.id,
                );

                // Atualiza os produtos associados à seção
                await updateProductsOnSectionNameChange(editingSection.sectionName, formData.sectionName);
                await updateProductsOnSubsectionsChange(
                    editingSection.sectionName,
                    editingSection.subsections || [],
                    validSubs,
                );

                toast({
                    title: 'Seção atualizada',
                    description: 'A seção foi atualizada com sucesso.',
                });
                await fetchSections();
                setShowForm(false);
                setEditingSection(null);
                setFormData({ sectionName: '', subsections: [] });
            } catch (error) {
                console.error('Erro ao atualizar seção:', error);
                toast({
                    title: 'Erro ao atualizar seção',
                    description: 'Ocorreu um erro ao atualizar a seção.',
                    variant: 'destructive',
                });
            }
        } else {
            try {
                const newId = crypto.randomUUID();
                const newSection: SectionType = {
                    sectionName: formData.sectionName,
                    subsections: validSubs,
                };
                await addDocument(newSection, newId);

                const slugName = createSlugName(formData.sectionName);
                const newSectionSlug: SectionSlugType = {
                    sectionName: formData.sectionName,
                    sectionSlugName: slugName,
                    subsections: validSubs.length > 0 ? createSubsectionsWithSlug(validSubs) : [],
                };
                await sectionSlugCollection.addDocument(newSectionSlug, newId);

                toast({
                    title: 'Seção criada',
                    description: 'A nova seção foi criada com sucesso.',
                });
                await fetchSections();
                setShowForm(false);
                setFormData({ sectionName: '', subsections: [] });
            } catch (error) {
                console.error('Erro ao criar nova seção:', error);
                toast({
                    title: 'Erro ao criar seção',
                    description: 'Ocorreu um erro ao criar a nova seção.',
                    variant: 'destructive',
                });
            }
        }
        setIsSubmitting(false);
    };

    const handleEditSection = (section: SectionType & FireBaseDocument) => {
        setEditingSection(section);
        setFormData({
            sectionName: section.sectionName,
            subsections: section.subsections || [],
        });
        setShowForm(true);
    };

    const handleDelete = async(
        section: SectionType & FireBaseDocument,
        type: 'section' | 'subsection',
        subsection?: string,
    ) => {
        setSectionToDelete(section);
        setDeleteType(type);
        if (type === 'subsection' && subsection) {
            setSubsectionToDelete(subsection);
            const count = await productsCollectionForCount.getCount([
                where('subsections', 'array-contains', `${section.sectionName}:${subsection}`),
            ]);
            setAffectedCount(count);
        } else {
            const count = await productsCollectionForCount.getCount([
                where('sections', 'array-contains', `${section.sectionName}`),
            ]);
            setAffectedCount(count);
        }
        setDeleteModalOpen(true);
    };

    const confirmDelete = async() => {
        if (!sectionToDelete || !deleteType) return;
        setIsDeleting(true);
        try {
            if (deleteType === 'section') {
                await removeSectionFromProducts(sectionToDelete.sectionName);
                await deleteDocument(sectionToDelete.id);
                await sectionSlugCollection.deleteDocument(sectionToDelete.id);
                toast({
                    title: 'Seção deletada',
                    description: 'A seção e suas subseções foram removidas com sucesso.',
                });
            } else if (deleteType === 'subsection' && subsectionToDelete) {
                const updatedSubs = (sectionToDelete.subsections || []).filter((s) => s !== subsectionToDelete);
                if (updatedSubs.length !== (sectionToDelete.subsections || []).length) {
                    await updateDocumentField(sectionToDelete.id, 'subsections', updatedSubs);
                }
                // Usa o getDocumentById do sectionSlugCollection para obter os dados corretos
                const slugDoc = await sectionSlugCollection.getDocumentById(sectionToDelete.id);
                if (slugDoc.exist && slugDoc.subsections) {
                    const updatedSlugSubs = slugDoc.subsections.filter((s) => {
                        if (typeof s === 'object' && s !== null && 'subsectionName' in s) {
                            return s.subsectionName !== subsectionToDelete;
                        }
                        return true;
                    });
                    if (updatedSlugSubs.length !== slugDoc.subsections.length) {
                        await sectionSlugCollection.updateDocumentField(
                            sectionToDelete.id,
                            'subsections',
                            updatedSlugSubs,
                        );
                    }
                }
                await removeSubsectionFromProducts(sectionToDelete.sectionName, subsectionToDelete);
                toast({
                    title: 'Subseção deletada',
                    description: 'A subseção foi removida com sucesso.',
                });
            }
            await fetchSections();
        } catch (error) {
            console.error('Erro ao deletar:', error);
            toast({
                title: 'Erro ao deletar',
                description: 'Ocorreu um erro ao deletar a seção/subseção.',
                variant: 'destructive',
            });
        }
        setIsDeleting(false);
        setDeleteModalOpen(false);
        setSectionToDelete(null);
        setDeleteType(null);
        setSubsectionToDelete(null);
        setAffectedCount(0);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciamento de Seções e Subseções</h1>
            <Button
                onClick={ () => {
                    setShowForm(true);
                    setEditingSection(null);
                    setFormData({ sectionName: '', subsections: [] });
                } }
            >
        Adicionar Nova Seção
            </Button>

            { loading ? (
                <p>Carregando...</p>
            ) : (
                <SectionCard handleDelete={ handleDelete } handleEditSection={ handleEditSection } sections={ sections } />
            ) }

            { /** Modal do formulário */ }
            { showForm && (
                <SectionForm
                    showForm={ showForm }
                    setShowForm={ setShowForm }
                    editingSection={ editingSection }
                    setEditingSection={ setEditingSection }
                    setFormData={ setFormData }
                    formData={ formData }
                    handleSubmit={ handleSubmit }
                    handleFormChange={ handleFormChange }
                    handleSubsectionChange={ handleSubsectionChange }
                    handleAddSubsectionInput={ handleAddSubsectionInput }
                    handleRemoveSubsectionInput={ handleRemoveSubsectionInput }
                    isSubmitting={ isSubmitting }
                />
            ) }

            { /** Modal de confirmação */ }
            { deleteModalOpen && (
                <DeleteSectionConfirmationDialog
                    deleteModalOpen={ deleteModalOpen }
                    setDeleteModalOpen={ setDeleteModalOpen }
                    deleteType={ deleteType }
                    sectionToDelete={ sectionToDelete }
                    subsectionToDelete={ subsectionToDelete }
                    affectedCount={ affectedCount }
                    confirmDelete={ confirmDelete }
                    isProcessing={ isDeleting }
                />
            ) }
        </div>
    );
};

export default SectionsManagement;
