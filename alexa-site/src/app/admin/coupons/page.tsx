// app/admin/coupons/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { CouponType, FireBaseDocument } from '@/app/utils/types';
import { useCollection } from '@/app/hooks/useCollection';
import CouponForm from './CouponForm';

const CouponAdminPage = () => {
    const { getAllDocuments, deleteDocument, addDocument, updateDocumentField } = useCollection<CouponType>('cupons');
    const [coupons, setCoupons] = useState<(CouponType & FireBaseDocument)[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<(CouponType & FireBaseDocument) | null>(null);

    const fetchCoupons = async() => {
        setLoading(true);
        try {
            const docs = await getAllDocuments();
            setCoupons(docs);
        } catch (error) {
            console.error('Erro ao buscar cupons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async(id: string) => {
        if (confirm('Tem certeza que deseja excluir esse cupom?')) {
            await deleteDocument(id);
            fetchCoupons();
        }
    };

    const handleEdit = (coupon: CouponType & FireBaseDocument) => {
        setEditingCoupon(coupon);
        setFormOpen(true);
    };

    const handleNew = () => {
        setEditingCoupon(null);
        setFormOpen(true);
    };

    const handleFormSubmit = async(data: CouponType) => {
        if (editingCoupon) {
            // Atualização: utilizamos updateDocumentField para cada campo (você pode ajustar para atualizar o documento inteiro)
            for (const key in data) {
                await updateDocumentField(editingCoupon.id, key, (data as any)[key]);
            }
        } else {
            const now = new Date(); // Aqui, idealmente, utilize Timestamp.fromDate(new Date())
            await addDocument({
                ...data,
                criadoEm: now as any,
                atualizadoEm: now as any,
            });
        }
        setFormOpen(false);
        fetchCoupons();
    };

    const handleFormCancel = () => {
        setFormOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciamento de Cupons</h1>
            <button
                className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 transition-colors"
                onClick={ handleNew }
            >
        Criar Novo Cupom
            </button>

            { loading ? (
                <p>Carregando cupons...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Código</th>
                                <th className="px-4 py-2 border">Descrição</th>
                                <th className="px-4 py-2 border">Tipo</th>
                                <th className="px-4 py-2 border">Valor</th>
                                <th className="px-4 py-2 border">Validade</th>
                                <th className="px-4 py-2 border">Limite Uso<br />(Global/Usuário)</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            { coupons.map((coupon) => (
                                <tr key={ coupon.id } className="text-center">
                                    <td className="px-4 py-2 border">{ coupon.codigo }</td>
                                    <td className="px-4 py-2 border">{ coupon.descricao }</td>
                                    <td className="px-4 py-2 border">{ coupon.tipo }</td>
                                    <td className="px-4 py-2 border">{ coupon.valor }</td>
                                    <td className="px-4 py-2 border">
                                        { new Date(coupon.dataInicio.seconds * 1000).toLocaleDateString() } - { new Date(coupon.dataExpiracao.seconds * 1000).toLocaleDateString() }
                                    </td>
                                    <td className="px-4 py-2 border">
                                        { coupon.limiteUsoGlobal ?? 'Ilimitado' } / { coupon.limiteUsoPorUsuario ?? 'Ilimitado' }
                                    </td>
                                    <td className="px-4 py-2 border">{ coupon.status }</td>
                                    <td className="px-4 py-2 border space-x-2">
                                        <button onClick={ () => handleEdit(coupon) } className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">
                      Editar
                                        </button>
                                        <button onClick={ () => handleDelete(coupon.id) } className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">
                      Excluir
                                        </button>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            ) }

            { formOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-3xl">
                        <CouponForm 
                            initialData={ editingCoupon } 
                            onSubmit={ handleFormSubmit } 
                            onCancel={ handleFormCancel } 
                        />
                    </div>
                </div>
            ) }
        </div>
    );
};

export default CouponAdminPage;
