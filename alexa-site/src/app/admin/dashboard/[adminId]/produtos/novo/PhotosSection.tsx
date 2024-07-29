// app/admin/dashboard/[adminId]/produtos/novo/PhotosSection.tsx

export default function PhotosSection() {
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Fotos</h2>
            <div className="mt-2">
                <div className="flex items-center  justify-center border-dashed border-2 border-gray-300 rounded-md p-4 text-center h-32">
                    <button className="text-blue-500">Adicione sua primeira foto</button>
                </div>
            </div>
        </section>
    );
}
