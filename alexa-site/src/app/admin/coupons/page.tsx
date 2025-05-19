// app/admin/coupons/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { CouponType, FireBaseDocument } from '@/app/utils/types';
import { useCollection } from '@/app/hooks/useCollection';
import CouponForm from './CouponForm';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import ToggleSwitch from '../components/ToggleSwitch';
import DesktopCouponTable from './DesktopCouponTable';
import MobileCouponList from './MobileCouponList';
import MobileCouponDetails from './MobileCouponDetails';
import { Timestamp } from 'firebase/firestore';

type SortOption =
  | 'codigoAsc'
  | 'codigoDesc'
  | 'dataExpiracaoAsc'
  | 'dataExpiracaoDesc'
  | 'descontoAsc'
  | 'descontoDesc'
  | 'quantidade'
  | 'newest'
  | 'oldest';

type TipoFilter = 'todos' | 'percentual' | 'fixo' | 'freteGratis';

const CouponAdminPage = () => {
    const { getAllDocuments, deleteDocument, addDocument, updateDocumentField, getDocumentById } =
    useCollection<CouponType>('cupons');

    const [coupons, setCoupons] = useState<(CouponType & FireBaseDocument)[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Estados para modais de formulário (edição/criação) e detalhes
    const [formOpen, setFormOpen] = useState(false);
    const [mobileEditModalOpen, setMobileEditModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<(CouponType & FireBaseDocument) | null>(null);
    const [selectedCoupon, setSelectedCoupon] = useState<(CouponType & FireBaseDocument) | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    // Estados dos controles de listagem
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [showInactive, setShowInactive] = useState(true);
    const [couponTipoFilter, setCouponTipoFilter] = useState<TipoFilter>('todos');

    // Estado para detectar se é mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    const handleDelete = async(coupon: CouponType & FireBaseDocument) => {
        if (confirm('Tem certeza que deseja excluir esse cupom?')) {
            await deleteDocument(coupon.id);
            fetchCoupons();
        }
    };

    const handleEdit = (coupon: CouponType & FireBaseDocument) => {
        setEditingCoupon(coupon);
        if (isMobile) {
            setMobileEditModalOpen(true);
        } else {
            setFormOpen(true);
        }
    };

    const handleNew = () => {
        setEditingCoupon(null);
        if (isMobile) {
            setMobileEditModalOpen(true);
        } else {
            setFormOpen(true);
        }
    };

    const getDiscountValue = (coupon: CouponType & FireBaseDocument) => {
        return coupon.tipo === 'freteGratis' ? 0 : coupon.valor;
    };

    const filteredCoupons = coupons.filter((coupon) => {
        const statusOk = showInactive ? true : coupon.status === 'ativo' && coupon.dataExpiracao.toDate() >= new Date();
        const tipoOk = couponTipoFilter === 'todos' ? true : coupon.tipo === couponTipoFilter;
        return statusOk && tipoOk;
    });

    const sortCoupons = (list: (CouponType & FireBaseDocument)[]) => {
        const sorted = [...list];
        switch (sortOption) {
        case 'newest':
            sorted.sort((a, b) => b.atualizadoEm.seconds - a.atualizadoEm.seconds);
            break;
        case 'oldest':
            sorted.sort((a, b) => a.atualizadoEm.seconds - b.atualizadoEm.seconds);
            break;
        case 'codigoAsc':
            sorted.sort((a, b) => a.codigo.localeCompare(b.codigo));
            break;
        case 'codigoDesc':
            sorted.sort((a, b) => b.codigo.localeCompare(a.codigo));
            break;
        case 'dataExpiracaoAsc':
            sorted.sort((a, b) => a.dataExpiracao.seconds - b.dataExpiracao.seconds);
            break;
        case 'dataExpiracaoDesc':
            sorted.sort((a, b) => b.dataExpiracao.seconds - a.dataExpiracao.seconds);
            break;
        case 'descontoAsc':
            sorted.sort((a, b) => getDiscountValue(a) - getDiscountValue(b));
            break;
        case 'descontoDesc':
            sorted.sort((a, b) => getDiscountValue(b) - getDiscountValue(a));
            break;
        case 'quantidade':
            sorted.sort((a, b) => {
                const aQty = a.limiteUsoGlobal ?? 0;
                const bQty = b.limiteUsoGlobal ?? 0;
                return bQty - aQty;
            });
            break;
        default:
            break;
        }
        return sorted;
    };

    const sortedCoupons = sortCoupons(filteredCoupons);

    const updateCouponStatus = async(
        coupon: CouponType & FireBaseDocument,
        newStatus: 'ativo' | 'desativado',
    ) => {
        try {
            await updateDocumentField(coupon.id, 'status', newStatus);
            setCoupons((prev) =>
                prev.map((c) => (c.id === coupon.id ? { ...c, status: newStatus } : c)),
            );
            if (selectedCoupon && selectedCoupon.id === coupon.id) {
                setSelectedCoupon({ ...selectedCoupon, status: newStatus });
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const handleFormSubmit = async(data: CouponType) => {
        if (!editingCoupon) {
            try {
                const existing = await getDocumentById(data.id);
                if (existing && existing.exist) {
                    alert('Já existe um cupom com esse código. Por favor, escolha outro código.');
                    return;
                }
            } catch (error) {
                console.error('Erro na verificação de existência:', error);
                return;
            }
            const now = Timestamp.now();
            await addDocument(
                {
                    ...data,
                    criadoEm: now,
                    atualizadoEm: now,
                },
                data.id,
            );
        } else {
            if (editingCoupon.id !== data.id) {
                try {
                    const oldDoc = await getDocumentById(editingCoupon.id);
                    await deleteDocument(editingCoupon.id);
                    await addDocument(
                        {
                            ...data,
                            criadoEm: oldDoc.criadoEm,
                            atualizadoEm: Timestamp.now(),
                        },
                        data.id,
                    );
                } catch (error) {
                    console.error('Erro ao atualizar o cupom com novo ID:', error);
                    return;
                }
            } else {
                for (const key in data) {
                    await updateDocumentField(editingCoupon.id, key, (data as any)[key]);
                }
            }
        }
        setFormOpen(false);
        setMobileEditModalOpen(false);
        fetchCoupons();
    };

    const handleFormCancel = () => {
        setFormOpen(false);
        setMobileEditModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciamento de Cupons</h1>

            { /* Filtros e ordenação */ }
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-10">
                <div className="flex flex-wrap items-center gap-2">
                    <label className="font-semibold">Ordenar por:</label>
                    <select
                        value={ sortOption }
                        onChange={ (e) => setSortOption(e.target.value as SortOption) }
                        className="border rounded p-1"
                    >
                        <option value="newest">Recente</option>
                        <option value="oldest">Antigo</option>
                        <option value="codigoAsc">Código (A-Z)</option>
                        <option value="codigoDesc">Código (Z-A)</option>
                        <option value="dataExpiracaoAsc">Validade (Mais antigo primeiro)</option>
                        <option value="dataExpiracaoDesc">Validade (Mais novo primeiro)</option>
                        <option value="descontoAsc">Desconto (Menor primeiro)</option>
                        <option value="descontoDesc">Desconto (Maior primeiro)</option>
                        <option value="quantidade">Quantidade (Limite Global)</option>
                    </select>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="font-semibold">Filtrar por Tipo:</label>
                    <select
                        value={ couponTipoFilter }
                        onChange={ (e) => setCouponTipoFilter(e.target.value as TipoFilter) }
                        className="border rounded p-1"
                    >
                        <option value="todos">Mostrar Todos</option>
                        <option value="percentual">Somente Percentual</option>
                        <option value="fixo">Somente Fixo</option>
                        <option value="freteGratis">Somente Frete Grátis</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold">Mostrar Inativos</label>
                    <ToggleSwitch checked={ showInactive } onChange={ setShowInactive } />
                </div>
                <button
                    onClick={ handleNew }
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                    Criar Novo Cupom
                </button>
            </div>

            { /* Desktop: Tabela */ }
            <div className="hidden md:block overflow-x-auto">
                { loading ? (
                    <div className="flex justify-center items-center p-4">
                        <span>Carregando...</span>
                    </div>
                ) : (
                    <DesktopCouponTable
                        coupons={ sortedCoupons }
                        onEdit={ handleEdit }
                        onDelete={ handleDelete }
                    />
                ) }
            </div>

            { /* Mobile: Lista de cupons */ }
            <div className="block md:hidden">
                { loading ? (
                    <div className="flex justify-center items-center p-4">
                        <span>Carregando...</span>
                    </div>
                ) : (
                    <MobileCouponList
                        coupons={ sortedCoupons }
                        onEdit={ handleEdit }
                        onDelete={ handleDelete }
                        onViewDetails={ (coupon) => {
                            setSelectedCoupon(coupon);
                            setDetailsModalOpen(true);
                        } }
                    />
                ) }
            </div>

            { /* Modal para edição/criação */ }
            { (!isMobile && formOpen) && (
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
            { isMobile && mobileEditModalOpen && (
                <SlideInModal
                    isOpen={ mobileEditModalOpen }
                    closeModelClick={ handleFormCancel }
                    title={ editingCoupon ? 'Editar Cupom' : 'Criar Novo Cupom' }
                    slideDirection="right"
                    fullWidth
                >
                    <CouponForm
                        initialData={ editingCoupon }
                        onSubmit={ handleFormSubmit }
                        onCancel={ handleFormCancel }
                    />
                </SlideInModal>
            ) }

            { /* Modal para detalhes no mobile */ }
            <SlideInModal
                isOpen={ detailsModalOpen }
                closeModelClick={ () => {
                    setDetailsModalOpen(false);
                    setSelectedCoupon(null);
                } }
                title="Detalhes do Cupom"
                slideDirection="left"
                fullWidth
            >
                { selectedCoupon && (
                    <MobileCouponDetails
                        coupon={ selectedCoupon }
                        onStatusToggle={ (newStatus) => updateCouponStatus(selectedCoupon, newStatus) }
                    />
                ) }
            </SlideInModal>
        </div>
    );
};

export default CouponAdminPage;
