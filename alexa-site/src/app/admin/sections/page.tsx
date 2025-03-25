'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import { SectionType, SectionSlugType, ProductBundleType, FireBaseDocument } from '@/app/utils/types';
import { createSlugName, createSubsectionsWithSlug } from '@/app/utils/createSlugName';
import { Button } from '@/components/ui/button';
import { useSectionUpdates } from '@/app/hooks/useSectionUpdates';
import { where } from 'firebase/firestore';
import DeleteSectionConfirmationDialog from './DeleteSectionConfirmationDialog';
import SectionForm, { SectionFormData, SubsectionFormData } from './SectionForm';
import SectionCard from './SectionCard';
import { toast } from '@/hooks/use-toast';
import { uploadImage, deleteImage, getImageFileName } from '@/app/firebase/storageUtils';

const SectionsManagement: React.FC = () => {
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

    const [sections, setSections] = useState<(SectionType & FireBaseDocument)[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingSection, setEditingSection] = useState<(SectionType & FireBaseDocument) | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [sectionToDelete, setSectionToDelete] = useState<(SectionType & FireBaseDocument) | null>(null);
    const [deleteType, setDeleteType] = useState<'section' | 'subsection' | null>(null);
    const [subsectionToDelete, setSubsectionToDelete] = useState<string | null>(null);
    const [affectedCount, setAffectedCount] = useState<number>(0);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [formData, setFormData] = useState<SectionFormData>({
        sectionName: '',
        sectionDescription: '',
        sectionImage: null,
        sectionImageUrl: '',
        subsections: [],
    });

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

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (name === 'sectionImage' && files) {
            setFormData((prev) => ({ ...prev, sectionImage: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubsectionChange = (index: number, field: keyof SubsectionFormData, value: string | File | null) => {
        setFormData((prev) => {
            const updatedSubs = [...prev.subsections];
            updatedSubs[index] = { ...updatedSubs[index], [field]: value };
            return { ...prev, subsections: updatedSubs };
        });
    };

    const handleAddSubsectionInput = () => {
        setFormData((prev) => ({
            ...prev,
            subsections: [...prev.subsections, { name: '', description: '', image: null }],
        }));
    };

    const handleRemoveSubsectionInput = (index: number) => {
        setFormData((prev) => {
            const updatedSubs = [...prev.subsections];
            updatedSubs.splice(index, 1);
            return { ...prev, subsections: updatedSubs };
        });
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.sectionName.trim()) return;
        setIsSubmitting(true);

        try {
            let sectionImageUrl = formData.sectionImageUrl || '';
            // Se houver um novo arquivo de imagem para a seção, faz o upload usando o nome customizado
            if (formData.sectionImage) {
                const id = editingSection ? editingSection.id : crypto.randomUUID();
                const fileName = getImageFileName(formData.sectionName);
                const path = `sections/${id}/${fileName}`;
                sectionImageUrl = await uploadImage(formData.sectionImage, path);
            } else if (!formData.sectionImage && !formData.sectionImageUrl && editingSection && editingSection.imagesAndDescriptions?.sectionImage) {
                // Se o admin removeu a imagem, deleta a imagem antiga
                await deleteImage(editingSection.imagesAndDescriptions.sectionImage);
            }

            // Para cada subseção, faz upload da imagem (se houver) com o nome customizado
            const subsectionsData = await Promise.all(
                formData.subsections.map(async(sub) => {
                    let subImageUrl = sub.imageUrl || '';
                    if (sub.image) {
                        const id = editingSection ? editingSection.id : crypto.randomUUID();
                        const fileName = getImageFileName(formData.sectionName, sub.name);
                        const path = `sections/${id}/subsections/${fileName}`;
                        subImageUrl = await uploadImage(sub.image, path);
                    } else if (!sub.image && !sub.imageUrl && editingSection) {
                        // Se a imagem foi removida durante a edição, deleta a imagem antiga
                        const subMedia = editingSection.imagesAndDescriptions?.subsectionImagesAndDescriptions?.find(s => s.subsectionName === sub.name);
                        if (subMedia?.subsectionImage) {
                            await deleteImage(subMedia.subsectionImage);
                        }
                    }
                    return {
                        subsectionName: sub.name,
                        subsectionDescription: sub.description,
                        subsectionImage: subImageUrl,
                    };
                }),
            );

            if (editingSection) {
                await updateDocumentField(editingSection.id, 'sectionName', formData.sectionName);
                await updateDocumentField(editingSection.id, 'subsections', formData.subsections.map(sub => sub.name));

                await updateDocumentField(editingSection.id, 'imagesAndDescriptions', {
                    sectionImage: sectionImageUrl || null,
                    sectionDescription: formData.sectionDescription || null,
                    subsectionImagesAndDescriptions: subsectionsData,
                });

                const slugName = createSlugName(formData.sectionName);
                await sectionSlugCollection.addDocument(
                    {
                        sectionName: formData.sectionName,
                        sectionSlugName: slugName,
                        subsections: formData.subsections.length > 0 ? createSubsectionsWithSlug(formData.subsections.map(s => s.name)) : [],
                    },
                    editingSection.id,
                );

                await updateProductsOnSectionNameChange(editingSection.sectionName, formData.sectionName);
                await updateProductsOnSubsectionsChange(editingSection.sectionName, editingSection.subsections || [], formData.subsections.map(s => s.name));

                toast({
                    title: 'Seção atualizada',
                    description: 'A seção foi atualizada com sucesso.',
                });
            } else {
                const newId = crypto.randomUUID();
                const newSection: SectionType = {
                    sectionName: formData.sectionName,
                    subsections: formData.subsections.map(sub => sub.name),
                    imagesAndDescriptions: {
                        sectionImage: sectionImageUrl || null,
                        sectionDescription: formData.sectionDescription || null,
                        subsectionImagesAndDescriptions: subsectionsData,
                    },
                };
                await addDocument(newSection, newId);

                const slugName = createSlugName(formData.sectionName);
                const newSectionSlug: SectionSlugType = {
                    sectionName: formData.sectionName,
                    sectionSlugName: slugName,
                    subsections: formData.subsections.length > 0 ? createSubsectionsWithSlug(formData.subsections.map(s => s.name)) : [],
                };
                await sectionSlugCollection.addDocument(newSectionSlug, newId);

                toast({
                    title: 'Seção criada',
                    description: 'A nova seção foi criada com sucesso.',
                });
            }
            await fetchSections();
            setShowForm(false);
            setEditingSection(null);
            setFormData({
                sectionName: '',
                sectionDescription: '',
                sectionImage: null,
                sectionImageUrl: '',
                subsections: [],
            });
        } catch (error) {
            console.error('Erro ao criar/atualizar seção:', error);
            toast({
                title: editingSection ? 'Erro ao atualizar seção' : 'Erro ao criar seção',
                description: 'Ocorreu um erro durante a operação.',
                variant: 'destructive',
            });
        }
        setIsSubmitting(false);
    };

    const handleEditSection = (section: SectionType & FireBaseDocument) => {
        setEditingSection(section);
        setFormData({
            sectionName: section.sectionName,
            sectionDescription: section.imagesAndDescriptions?.sectionDescription || '',
            sectionImage: null,
            sectionImageUrl: section.imagesAndDescriptions?.sectionImage || '',
            subsections: section.subsections
                ? section.subsections.map((subName) => {
                    const subMedia = section.imagesAndDescriptions?.subsectionImagesAndDescriptions?.find(
                        (s) => s.subsectionName === subName,
                    );
                    return {
                        name: subName,
                        description: subMedia?.subsectionDescription || '',
                        image: null,
                        imageUrl: subMedia?.subsectionImage || '',
                    };
                })
                : [],
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

    const deleteSectionImages = async(section: SectionType & FireBaseDocument) => {
        if (section.imagesAndDescriptions?.sectionImage) {
            await deleteImage(section.imagesAndDescriptions.sectionImage);
        }
        if (section.imagesAndDescriptions?.subsectionImagesAndDescriptions) {
            await Promise.all(
                section.imagesAndDescriptions.subsectionImagesAndDescriptions.map(async(sub) => {
                    if (sub.subsectionImage) {
                        await deleteImage(sub.subsectionImage);
                    }
                }),
            );
        }
    };

    const deleteSubsectionImage = async(section: SectionType & FireBaseDocument, subsectionName: string) => {
        const subMedia = section.imagesAndDescriptions?.subsectionImagesAndDescriptions?.find(
            (s) => s.subsectionName === subsectionName,
        );
        if (subMedia && subMedia.subsectionImage) {
            await deleteImage(subMedia.subsectionImage);
        }
    };

    const confirmDelete = async() => {
        if (!sectionToDelete || !deleteType) return;
        setIsDeleting(true);
        try {
            if (deleteType === 'section') {
                await deleteSectionImages(sectionToDelete);
                await removeSectionFromProducts(sectionToDelete.sectionName);
                await deleteDocument(sectionToDelete.id);
                await sectionSlugCollection.deleteDocument(sectionToDelete.id);
                toast({
                    title: 'Seção deletada',
                    description: 'A seção e suas subseções foram removidas com sucesso.',
                });
            } else if (deleteType === 'subsection' && subsectionToDelete) {
                await deleteSubsectionImage(sectionToDelete, subsectionToDelete);
                const updatedSubs = (sectionToDelete.subsections || []).filter((s) => s !== subsectionToDelete);
                if (updatedSubs.length !== (sectionToDelete.subsections || []).length) {
                    await updateDocumentField(sectionToDelete.id, 'subsections', updatedSubs);
                }
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
                    setFormData({
                        sectionName: '',
                        sectionDescription: '',
                        sectionImage: null,
                        sectionImageUrl: '',
                        subsections: [],
                    });
                } }
            >
        Adicionar Nova Seção
            </Button>

            { loading ? (
                <p>Carregando...</p>
            ) : (
                <SectionCard handleDelete={ handleDelete } handleEditSection={ handleEditSection } sections={ sections } />
            ) }

            { showForm && (
                <SectionForm
                    showForm={ showForm }
                    setShowForm={ setShowForm }
                    editingSection={ editingSection }
                    setEditingSection={ setEditingSection }
                    formData={ formData }
                    setFormData={ setFormData }
                    handleSubmit={ handleSubmit }
                    handleFormChange={ handleFormChange }
                    handleSubsectionChange={ handleSubsectionChange }
                    handleAddSubsectionInput={ handleAddSubsectionInput }
                    handleRemoveSubsectionInput={ handleRemoveSubsectionInput }
                    isSubmitting={ isSubmitting }
                />
            ) }

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
