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
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo avec image */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="MDG"
              width={32}
              height={32}
              className="object-contain"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="text-xl font-bold" style={{ color: '#ffffff' }}>
              MDG Unity Gaming
            </span>
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    pathname === link.href
                      ? 'font-semibold'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: pathname === link.href ? '#f8c741' : 'transparent',
                    color: pathname === link.href ? '#292929' : '#ffffff'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Menu mobile button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: '#ffffff' }}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: '#f8c741' }}>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    pathname === link.href
                      ? 'font-semibold'
                      : ''
                  }`}
                  style={{
                    backgroundColor: pathname === link.href ? '#f8c741' : 'transparent',
                    color: pathname === link.href ? '#292929' : '#ffffff'
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}