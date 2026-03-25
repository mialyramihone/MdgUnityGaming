'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Calendar, Clock, Gamepad2, Users, ArrowRight, Sun, Trophy, X } from 'lucide-react';
import Image from 'next/image';

interface Tournoi {
  id: number;
  titre: string;
  jeu: string;
  format: string;
  heure: string;
  mode: string;
  places: number | string;
  date: string;
  status: string;
}

export default function Accueil() {
  const [tournoisEnVedette] = useState<Tournoi[]>([
    {
      id: 2,
      titre: 'The Tournament saison 4',
      jeu: 'Free Fire',
      format: 'Squad',
      heure: '21:00',
      mode: 'Battle Royale',
      places: 'Illimité',
      date: '2026-03-23',
      status: 'ouvert'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero section responsive */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#ffc629] to-[#ffb909]">
        <div className="relative container mx-auto px-3 xs:px-4 py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1 xs:gap-2 bg-white/20 backdrop-blur-sm px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full mb-4 xs:mb-5 sm:mb-6 md:mb-8 border border-white/30">
              <Sun className="w-3 h-3 xs:w-4 xs:h-4 text-white" />
              <span className="text-[10px] xs:text-xs sm:text-sm text-white">MDG Unity Gaming</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 xs:mb-4 sm:mb-5 md:mb-6 drop-shadow-lg">
              Là où les
              <br />
              <span className="text-[#363225]">talents</span>
              <br />
              <span>s'épanouissent</span>
            </h1>

            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 xs:mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-2">
              La première plateforme de tournois gaming. Rejoignez une communauté passionnée et compétitive !
            </p>

            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 justify-center px-2">
              <Link 
                href="/tournoi" 
                className="group px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4 bg-[#f8c741] text-amber-900 rounded-full font-semibold text-xs xs:text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-1 xs:gap-2"
              >
                <span>Explorer</span>
                <span className="hidden xs:inline">les tournois</span>
                <ArrowRight className="w-3 h-3 xs:w-4 xs:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/classement" 
                className="px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-xs xs:text-sm sm:text-base md:text-lg border-2 border-white/30 hover:bg-white/30 transition-all"
              >
                Classement
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bannière jeux défilante responsive */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f8c741] to-[#ffd966] py-2 xs:py-3 sm:py-4">
        <div className="absolute left-0 top-0 bottom-0 w-8 xs:w-12 sm:w-16 md:w-20 bg-gradient-to-r from-[#f8c741] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 xs:w-12 sm:w-16 md:w-20 bg-gradient-to-l from-[#ffd966] to-transparent z-10"></div>

        <div className="flex whitespace-nowrap animate-scroll w-max">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="flex items-center">
              <span className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg mx-1 xs:mx-2 sm:mx-3">FREE FIRE</span>
              <span className="text-white text-xs xs:text-sm sm:text-base md:text-lg mx-0.5 xs:mx-1">•</span>
              <span className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg mx-1 xs:mx-2 sm:mx-3">BLOOD STRIKE</span>
              <span className="text-white text-xs xs:text-sm sm:text-base md:text-lg mx-0.5 xs:mx-1">•</span>
              <span className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg mx-1 xs:mx-2 sm:mx-3">MLBB</span>
              <span className="text-white text-xs xs:text-sm sm:text-base md:text-lg mx-0.5 xs:mx-1">•</span>
              <span className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg mx-1 xs:mx-2 sm:mx-3">PUBG</span>
              <span className="text-white text-xs xs:text-sm sm:text-base md:text-lg mx-0.5 xs:mx-1">•</span>
              <span className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg mx-1 xs:mx-2 sm:mx-3">GENSHIN</span>
              <span className="text-white text-xs xs:text-sm sm:text-base md:text-lg mx-0.5 xs:mx-1">•</span>
              <span className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg mx-1 xs:mx-2 sm:mx-3">ROBLOX</span>
              <span className="text-white text-xs xs:text-sm sm:text-base md:text-lg mx-0.5 xs:mx-1">•</span>
              <span className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg mx-1 xs:mx-2 sm:mx-3">VALORANT</span>
              <span className="text-white text-xs xs:text-sm sm:text-base md:text-lg mx-0.5 xs:mx-1">•</span>
              <span className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg mx-1 xs:mx-2 sm:mx-3">FARLIGHT</span>
              <span className="text-white text-xs xs:text-sm sm:text-base md:text-lg mx-0.5 xs:mx-1">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section Comment ça marche responsive */}
      <div className="container mx-auto px-3 xs:px-4 py-8 xs:py-10 sm:py-12 md:py-16">
        <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 xs:mb-3 sm:mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xs xs:text-sm sm:text-base md:text-xl text-gray-500">
            Rejoindre un tournoi en 3 étapes simples
          </p>
        </div>
        
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 xs:gap-3 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {[1, 2, 3].map((num) => (
            <div key={num} className="text-center">
              <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-[#f8c741]/10 rounded-full flex items-center justify-center mx-auto mb-2 xs:mb-3 sm:mb-4">
                <span className="text-lg xs:text-xl sm:text-2xl font-bold text-[#f8c741]">{num}</span>
              </div>
              <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1">
                {num === 1 ? "Inscris-toi" : num === 2 ? "Choisis ton tournoi" : "Joue et gagne"}
              </h3>
              <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500">
                {num === 1 ? "Crée ton compte gratuitement" : 
                 num === 2 ? "Parmi nos nombreux tournois" : 
                 "Affronte les meilleurs et remporte des prix"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Séparateur décoratif responsive */}
      <div className="relative flex items-center justify-center my-6 xs:my-8 sm:my-10 md:my-12">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#f8c741] to-transparent"></div>
        <div className="mx-2 xs:mx-3 sm:mx-4 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-[#f8c741]/10 rounded-full flex items-center justify-center">
          <Gamepad2 className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 text-[#f8c741]" />
        </div>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#f8c741] to-transparent"></div>
      </div>

      {/* Section Tournois à venir responsive */}
      <div className="container mx-auto px-3 xs:px-4 py-8 xs:py-10 sm:py-12 md:py-16 lg:py-24">
        <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 xs:mb-3 sm:mb-4">
            Tournois à venir
          </h2>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto">
            Découvrez nos prochains tournois et laissez vos talents s'épanouir
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {tournoisEnVedette.map((tournoi) => (
            <div 
              key={tournoi.id}
              className="group relative h-64 xs:h-72 sm:h-80 md:h-96 rounded-xl xs:rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0">
                <Image
                  src="/images/freefire-bg.jpg"
                  alt={tournoi.jeu}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 385px) 100vw, (max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>

              <div className="relative h-full flex flex-col justify-end p-3 xs:p-4 sm:p-5 md:p-6 text-white">
                <div className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4">
                  <span className="px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 bg-[#f8c741] text-black font-bold text-[8px] xs:text-[10px] sm:text-xs rounded-full">
                    TOURNOI
                  </span>
                </div>

                <div className="mb-1 xs:mb-2 sm:mb-3">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-[#f8c741] font-bold uppercase tracking-wider">
                    {tournoi.jeu}
                  </span>
                </div>

                <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-black mb-1 xs:mb-2 sm:mb-3">
                  {tournoi.titre}
                </h3>

                <div className="flex items-center gap-1 xs:gap-2 mb-2 xs:mb-3 sm:mb-4">
                  <Calendar className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#f8c741]" />
                  <span className="text-[10px] xs:text-xs sm:text-sm">
                    {new Date(tournoi.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <Link 
                  href={`/tournoiDetail/${tournoi.id}`}
                  className="inline-flex items-center justify-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-[#f8c741] text-black font-bold rounded-full text-[10px] xs:text-xs sm:text-sm hover:bg-white transition-all w-fit"
                >
                  <span>S'inscrire</span>
                  <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section CTA avec image responsive */}
      <div className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-r from-[#f8c741]/10 to-[#ff8c42]/10">
        <div className="container mx-auto px-3 xs:px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12 items-center">
              <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] order-1">
                <Image
                  src="/images/freefire-character1.png"
                  alt="Gamer"
                  fill
                  className="object-contain"
                  sizes="(max-width: 385px) 100vw, (max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              <div className="order-2 text-center md:text-left">
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-800 mb-2 xs:mb-3 sm:mb-4">
                  PRÊT À
                  <br />
                  <span className="text-[#f8c741]">DOMINER</span>
                  <br />
                  LE JEU ?
                </h2>
                
                <p className="text-gray-500 mb-3 xs:mb-4 sm:mb-5 md:mb-6 text-xs xs:text-sm sm:text-base md:text-lg">
                  Rejoins l'arène et prouve ta valeur face aux meilleurs joueurs
                </p>

                <div className="flex justify-center md:justify-start gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                  <div>
                    <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-[#f8c741]">2</div>
                    <div className="text-[10px] xs:text-xs sm:text-sm text-gray-500">Tournois</div>
                  </div>
                  <div className="w-px h-6 xs:h-7 sm:h-8 md:h-10 bg-gray-200"></div>
                  <div>
                    <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-black text-[#f8c741]">8</div>
                    <div className="text-[10px] xs:text-xs sm:text-sm text-gray-500">Jeux</div>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start">
                  <Link 
                    href="/tournoi" 
                    className="group inline-flex items-center gap-1 xs:gap-2 sm:gap-3 px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-4 bg-[#f8c741] text-white rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg hover:bg-[#e5b53a] transition-all shadow-lg hover:shadow-xl"
                  >
                    <span>Commencer l'aventure</span>
                    <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}