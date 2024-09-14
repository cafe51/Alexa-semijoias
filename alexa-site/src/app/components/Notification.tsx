import React, { useEffect, useState } from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className={ `fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg` }>
            <p className='text-white'>{ message }</p>
            <button onClick={ onClose } className="absolute top-1 right-1 text-white">&times;</button>
        </div>
    );
};

export default Notification;