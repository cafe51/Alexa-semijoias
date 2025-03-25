'use client';
import React, { useRef } from 'react';

export interface ImageInputProps {
  imageUrl?: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ imageUrl, onFileSelect, onClear }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div 
            className="relative w-32 h-32 border-dashed border-2 border-gray-300 flex items-center justify-center cursor-pointer bg-white"
            onClick={ handleClick }
        >
            { imageUrl ? (
                <img src={ imageUrl } alt="Selecionada" className="w-full h-full object-cover" />
            ) : (
                <div className="text-gray-500">Sem Imagem</div>
            ) }
            { imageUrl && (
                <button
                    type="button"
                    className="absolute top-1 right-1 bg-white rounded-full p-1 text-xs"
                    onClick={ (e) => { e.stopPropagation(); onClear(); } }
                >
          X
                </button>
            ) }
            <input type="file" accept="image/*" ref={ fileInputRef } onChange={ handleChange } className="hidden" />
        </div>
    );
};
