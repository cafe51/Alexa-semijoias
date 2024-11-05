// app/recuperar-senha/page.tsx

import PasswordResetForm from '@/app/components/PasswordResetForm';

const PasswordResetPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <PasswordResetForm />
        </div>
    );
};

export default PasswordResetPage;
