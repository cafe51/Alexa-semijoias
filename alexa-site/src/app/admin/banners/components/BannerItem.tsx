import { BannersType, FireBaseDocument } from '@/app/utils/types';
import { Switch } from './Switch';
import { TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface BannerItemProps {
  banner: BannersType & FireBaseDocument;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (banner: BannersType & FireBaseDocument) => void;
  onExpand: (banner: BannersType & FireBaseDocument) => void;
  isExpanded: boolean;
  isProcessing: boolean; // Novo prop para controlar estados de processamento
}

const BannerItem: React.FC<BannerItemProps> = ({
    banner,
    onToggleActive,
    onDelete,
    onExpand,
    isProcessing,
}) => {
    const handleToggleActive = () => {
        if (isProcessing) return; // Impedir interação durante processamento
        onToggleActive(banner.id!, !banner.showBanner);
    };

    const handleDelete = (e: React.MouseEvent) => {
        if (isProcessing) return; // Impedir interação durante processamento
        e.stopPropagation();
        onDelete(banner);
    };

    const handleExpand = () => {
        if (isProcessing) return; // Impedir interação durante processamento
        onExpand(banner);
    };

    return (
        <div className={ `border border-gray-200 rounded-lg mb-2 overflow-hidden ${isProcessing ? 'opacity-70' : ''}` }>
            <div 
                className={ `flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 
                           ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'} 
                           transition-colors` }
                onClick={ handleExpand }
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1 w-full sm:w-auto mb-3 sm:mb-0">
                    <div className="aspect-video h-16 relative bg-gray-100 rounded overflow-hidden w-full sm:w-auto">
                        { banner.bannerImageDesktop ? (
                            <Image
                                src={ banner.bannerImageDesktop }
                                alt={ banner.bannerName }
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sem imagem
                            </div>
                        ) }
                    </div>
          
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{ banner.bannerName }</h3>
                        <p className="text-sm text-gray-500">
                            Atualizado em: { banner.updatedAt.toDate().toLocaleDateString('pt-BR') }
                        </p>
                    </div>
                </div>
        
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <Switch 
                        checked={ banner.showBanner } 
                        onChange={ handleToggleActive }
                        label="Ativo"
                    />
          
                    <button
                        onClick={ handleDelete }
                        className={ `p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors
                                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}` }
                        title="Excluir banner"
                        disabled={ isProcessing }
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannerItem;
