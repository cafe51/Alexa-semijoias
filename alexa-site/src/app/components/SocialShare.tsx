// src/app/components/SocialShare.tsx
'use client';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function SocialShare() {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.alexasemijoias.com.br';
  
    return (
        <div className="flex space-x-4 my-6">
            <a
                href={ `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}` }
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#333333] hover:text-[#4267B2] transition-colors"
            >
                <Facebook size={ 24 } />
            </a>
            <a
                href={ `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}` }
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#333333] hover:text-[#1DA1F2] transition-colors"
            >
                <Twitter size={ 24 } />
            </a>
            <a
                href={ `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}` }
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#333333] hover:text-[#0077B5] transition-colors"
            >
                <Linkedin size={ 24 } />
            </a>
            <a
                href="https://www.instagram.com/alexa.semijoias"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#333333] hover:text-[#E1306C] transition-colors"
            >
                <Instagram size={ 24 } />
            </a>
        </div>
    );
}
