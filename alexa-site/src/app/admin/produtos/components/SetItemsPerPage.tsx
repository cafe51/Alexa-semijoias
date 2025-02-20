// src/app/admin/produtos/components/SetItemsPerPage.tsx
interface SetItemsPerPageProps {
    itemsPerPage: number | 'all';
    setItemsPerPage: (value: number | 'all') => void;
    disablePaginationSizeChange: boolean;
}

export default function SetItemsPerPage({ itemsPerPage, setItemsPerPage, disablePaginationSizeChange }: SetItemsPerPageProps) {
    return (
        <div className="flex flex-col justify-center">
            <label className="font-bold text-[#333333]">Mostrar</label>
            <select
                value={ itemsPerPage === 'all' ? 'all' : itemsPerPage.toString() }
                disabled={ disablePaginationSizeChange }
                onChange={ (e) => {
                    const value = e.target.value;
                    if (value === 'all') {
                        setItemsPerPage('all');
                    } else {
                        setItemsPerPage(parseInt(value));
                    }
                } }
                className="
                mt-1 p-2 border border-[#C48B9F] rounded-md
                disabled:cursor-not-allowed
                disabled:border-[#C48B9F]/50
                disabled:text-[#C48B9F]/50
                disabled:hover:bg-transparent
                disabled:hover:text-[#C48B9F]/50
                "
            >
                <option value="10">10 por página</option>
                <option value="50">50 por página</option>
                <option value="100">100 por página</option>
                <option value="all">Todos</option>
            </select>
        </div>
    );
}