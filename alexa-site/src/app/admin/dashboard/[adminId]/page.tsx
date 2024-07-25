'use client';

export default function DashboardInitialPage({ params }: { params: { adminId: string } }) {
    return (
        <p className='text-black'>Olá, { params.adminId } </p>
    );
}