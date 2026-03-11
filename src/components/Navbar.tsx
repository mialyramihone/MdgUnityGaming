'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Trophy, Shield, Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/tournoi', label: 'Tournois', icon: Trophy },
    { href: '/admin', label: 'Admin', icon: Shield },
  ];

  return (
    <nav style={{ backgroundColor: '#292929', borderBottom: '2px solid #f8c741' }} className="sticky top-0 z-50">
      <div className="container mx-auto px-2 xs:px-3 sm:px-4">
        <div className="flex justify-between items-center h-12 xs:h-14 sm:h-16">
          
          
          <Link href="/" className="flex items-center gap-1 xs:gap-2 sm:gap-3 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="MDG"
              width={24}
              height={24}
              className="object-contain xs:w-7 xs:h-7 sm:w-8 sm:h-8"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="text-xs xs:text-sm sm:text-base md:text-xl font-bold truncate max-w-[130px] xs:max-w-[160px] sm:max-w-[200px] md:max-w-none" 
                  style={{ color: '#ffffff' }}>
              MDG Unity Gaming
            </span>
          </Link>

          <div className="hidden md:flex space-x-1 lg:space-x-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg transition-all text-xs lg:text-sm ${
                    pathname === link.href
                      ? 'font-semibold'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: pathname === link.href ? '#f8c741' : 'transparent',
                    color: pathname === link.href ? '#292929' : '#ffffff'
                  }}
                >
                  <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden lg:inline">{link.label}</span>
                  <span className="lg:hidden">{link.label.slice(0, 3)}</span>
                </Link>
              );
            })}
          </div>


          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 xs:p-2 rounded-lg"
            style={{ color: '#ffffff' }}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 xs:w-6 xs:h-6" />
            ) : (
              <Menu className="w-5 h-5 xs:w-6 xs:h-6" />
            )}
          </button>
        </div>


        {isMenuOpen && (
          <div className="md:hidden py-2 xs:py-3 sm:py-4 border-t" style={{ borderColor: '#f8c741' }}>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg transition-all text-xs xs:text-sm ${
                    pathname === link.href
                      ? 'font-semibold'
                      : ''
                  }`}
                  style={{
                    backgroundColor: pathname === link.href ? '#f8c741' : 'transparent',
                    color: pathname === link.href ? '#292929' : '#ffffff'
                  }}
                >
                  <Icon className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @media (max-width: 385px) {
          .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
}