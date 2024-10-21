import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    message ? <p className="text-red-500">{ message }</p> : null
);

export default ErrorMessage;
