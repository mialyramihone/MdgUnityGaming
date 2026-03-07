'use client';

import Link from 'next/link';
import { Facebook, Heart } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const liens = {
    plateforme: [
      { label: 'Accueil', href: '/' },
      { label: 'Tournois', href: '/tournoi' },
      { label: 'Admin', href: '/admin' },
    ]
  };

  return (
    <footer className="bg-black -900 border-t border-black -800">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <Image 
                src="/logo.png" 
                alt="MDG Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-lg font-medium text-white -800">
              MDG Unity Gaming
            </span>
          </div>

          {/* Liens */}
          <div className="flex gap-6">
            {liens.plateforme.map((lien, index) => (
              <Link 
                key={index}
                href={lien.href}
                className="text-sm text-white -500 hover:text-[#f8c741] transition-colors"
              >
                {lien.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <a
            href="https://www.facebook.com/profile.php?id=100064234201184&locale=fr_FR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white -400 hover:text-[rgb(255,190,10)] transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>

        {/* Ligne fine */}
        <div className="border-t border-white -100 my-6"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© {currentYear} MDG Unity Gaming. Tous droits réservés.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            <Heart className="w-3 h-3 text-[#f8c741]" /> Created by Dalia
          </p>
        </div>
      </div>
    </footer>
  );
}