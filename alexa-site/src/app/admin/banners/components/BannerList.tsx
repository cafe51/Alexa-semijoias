import { BannersType, FireBaseDocument } from '@/app/utils/types';
import BannerItem from './BannerItem';

interface BannerListProps {
  banners: (BannersType & FireBaseDocument)[];
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
  onDelete: (banner: BannersType & FireBaseDocument) => void;
  onExpand: (banner: BannersType & FireBaseDocument) => void;
  expandedBannerId: string | null;
  isLoading: boolean;
  isProcessing: boolean; // Novo prop para controlar estados de processamento
}

const BannerList: React.FC<BannerListProps> = ({
    banners,
    onToggleActive,
    onDelete,
    onExpand,
    expandedBannerId,
    isLoading,
    isProcessing,
}) => {
    // Ordenar banners por data de atualização (mais recente primeiro)
    const sortedBanners = [...banners].sort((a, b) => {
        return b.updatedAt.toMillis() - a.updatedAt.toMillis();
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (sortedBanners.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Nenhum banner cadastrado. Clique em &rdquo;Novo Banner&rdquo; para adicionar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            { sortedBanners.map((banner) => (
                <BannerItem
                    key={ banner.id }
                    banner={ banner }
                    onToggleActive={ onToggleActive }
                    onDelete={ onDelete }
                    onExpand={ onExpand }
                    isExpanded={ expandedBannerId === banner.id }
                    isProcessing={ isProcessing }
                />
            )) }
        </div>
    );
};

export default BannerList;
