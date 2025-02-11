// app/admin/coupons/CategorySelectorModal.tsx
import React, { useEffect, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { useCollection } from '@/app/hooks/useCollection';
import { SectionType, FireBaseDocument } from '@/app/utils/types';

interface CategorySelectorModalProps {
  initialSelected: (SectionType & FireBaseDocument)[];
  onClose: () => void;
  onConfirm: (selected: (SectionType & FireBaseDocument)[]) => void;
}

const CategorySelectorModal: React.FC<CategorySelectorModalProps> = ({ initialSelected, onClose, onConfirm }) => {
    const { getAllDocuments } = useCollection<SectionType>('siteSections');
    const [categories, setCategories] = useState<(SectionType & FireBaseDocument)[]>([]);
    const [selected, setSelected] = useState<(SectionType & FireBaseDocument)[]>(initialSelected);

    useEffect(() => {
        const fetchCategories = async() => {
            const docs = await getAllDocuments();
            setCategories(docs);
        };
        fetchCategories();
    }, [getAllDocuments]);

    const toggleSelect = (category: SectionType & FireBaseDocument) => {
        if (selected.find(item => item.id === category.id)) {
            setSelected(selected.filter(item => item.id !== category.id));
        } else {
            setSelected([...selected, category]);
        }
    };

    return (
        <ModalWrapper onClose={ onClose }>
            <h2 className="text-xl font-bold mb-4">Selecionar Categorias</h2>
            <div className="max-h-80 overflow-y-auto mb-4">
                { categories.map(category => (
                    <div
                        key={ category.id }
                        className={ `p-2 border rounded mb-2 cursor-pointer ${
                            selected.find(item => item.id === category.id) ? 'bg-blue-100' : ''
                        }` }
                        onClick={ () => toggleSelect(category) }
                    >
                        { category.sectionName }
                    </div>
                )) }
            </div>
            <div className="flex justify-end space-x-4">
                <button onClick={ onClose } className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
          Cancelar
                </button>
                <button onClick={ () => onConfirm(selected) } className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Confirmar
                </button>
            </div>
        </ModalWrapper>
    );
};

export default CategorySelectorModal;
