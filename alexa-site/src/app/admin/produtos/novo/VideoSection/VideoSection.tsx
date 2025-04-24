'use client';
import React from 'react';
import { VideoProductDataType } from '@/app/utils/types';

interface VideoSectionProps {
  video: VideoProductDataType | null;
  handleSetVideo: (video: VideoProductDataType | null) => void;
}

export default function VideoSection({
    video,
    handleSetVideo,
}: VideoSectionProps) {
    const handleVideoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            handleSetVideo({ file, localUrl });
        }
    };

    const removeVideo = () => {
        handleSetVideo(null);
    };

    return (
        <section className="p-4 border rounded-md bg-white">
            <div className="mb-4">
                <h2 className="text-xl font-bold">Vídeo</h2>
                <p className="text-sm text-gray-500 mt-1">
          Adicione um vídeo do produto (máximo 1)
                </p>
            </div>

            <div className="flex items-center gap-4">
                { video ? (
                    <div className="relative">
                        <video
                            src={ video.localUrl }
                            controls
                            className="h-48 w-48 object-cover rounded-lg"
                        />
                        <button
                            onClick={ removeVideo }
                            className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 bg-white text-red-500 rounded-full p-1 shadow-lg hover:text-red-700 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <label className="cursor-pointer">
                        <div className="h-48 w-48 border-2 border-dashed border-blue-400 flex justify-center items-center rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="h-8 w-8 text-blue-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                        <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={ handleVideoChange }
                        />
                    </label>
                ) }
            </div>
        </section>
    );
}
