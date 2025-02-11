// app/admin/coupons/ModalWrapper.tsx
import React from 'react';

interface ModalWrapperProps {
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ onClose, children }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative p-6 overflow-y-auto max-h-full">
                <button
                    onClick={ onClose }
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none text-2xl"
                    aria-label="Fechar"
                >
          &times;
                </button>
                { children }
            </div>
        </div>
    );
};

export default ModalWrapper;
