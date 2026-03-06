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
    ],
    
    socials: [
      { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=100064234201184&locale=fr_FR', label: 'Facebook' },
    ]
  };

  return (
    <footer style={{ backgroundColor: '#292929', color: '#ffffff' }}>
      {/* Wave decoration en haut */}
      <div className="w-full overflow-hidden" style={{ backgroundColor: '#f8c741' }}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" 
            fill="#292929" 
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-6 md:col-span-1">
            <div className="flex items-center space-x-3">
             
<div className="w-10 h-10 relative">
  <Image 
    src="/logo.png" 
    alt="MDG Logo" 
    width={50} 
    height={50}
    className="object-contain"
  />
</div>
              <span className="text-3xl font-bold" style={{ color: '#f8c741' }}>
                MDG Unity Gaming
              </span>
            </div>
            <p className="text-base opacity-80 leading-relaxed">
              La première plateforme de tournois exclusivement. 
              Rejoignez une communauté de joueur passionnés et compétitifs !
            </p>
            <div className="flex space-x-4 pt-6">
              {liens.socials.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full transition-all hover:scale-110"
                    style={{ backgroundColor: '#f8c741' }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#292929' }} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block"></div>

          <div className="md:text-right">
            <h3 className="text-xl font-semibold mb-6" style={{ color: '#f8c741' }}>Plateforme</h3>
            <ul className="space-y-4">
              {liens.plateforme.map((lien, index) => (
                <li key={index}>
                  <Link 
                    href={lien.href}
                    className="text-lg hover:opacity-80 transition-opacity"
                    style={{ color: '#ffffff' }}
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
        <div className="border-t-2 my-12" style={{ borderColor: '#f8c741' }}></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-base opacity-80">
          <p className="mb-4 md:mb-0">© {currentYear} MDG Unity Gaming. Tous droits réservés.</p>
          <p className="flex items-center gap-2">
            Created by <span className="font-bold text-lg" style={{ color: '#f8c741' }}>Dalia</span>
            <Heart className="w-4 h-4 ml-1" style={{ color: '#f8c741' }} />
          </p>
        </div>
      </div>
    </footer>
  );
}