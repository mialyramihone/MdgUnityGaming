'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Calendar, Clock, Gamepad2, Users, ArrowRight, Sun } from 'lucide-react';

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
      id: 1,
      titre: 'Tournoi Femina Esport',
      jeu: 'Free Fire',
      format: '4 vs 4',
      heure: '20:00',
      mode: 'Clash Squad',
      places: 16,
      date: '2026-03-08',
      status: 'ouvert'
    },
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
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Caramel */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#ffc629] to-[#ffb909]">
        {/* Éléments nature */}
        

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/30">
              <Sun className="w-4 h-4 text-white" />
              <span className="text-sm text-white">MDG Unity Gaming</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Là où les
              <br />
              <span className="text-[#363225]">talents</span>
              <br />
              <span>s&apos;épanouissent</span>
            </h1>

            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              La première plateforme de tournois gaming. Rejoignez une communauté passionnée et compétitive !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tournoi" 
                className="group px-8 py-4 bg-[#f8c741] text-amber-900 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Explorer les tournois
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/classement" 
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all"
              >
                Voir le classement
              </Link>
            </div>
          </div>
        </div>

        {/* Vague caramel */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="#fef3c7" 
            />
          </svg>
        </div>
      </div>

      {/* Stats Caramel */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 text-center border border-amber-200">
            <div className="w-16 h-16 bg-[#f8c741]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-[#f8c741]" />
            </div>
            <div className="text-3xl font-bold text-[#363225]-800 mb-2">2</div>
            <div className="text-[#363225]">Tournois actifs</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 text-center border border-amber-200 transform md:translate-y-4">
            <div className="w-16 h-16 bg-[#f8c741]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-[#f8c741]" />
            </div>
            <div className="text-3xl font-bold text-[#363225]-800 mb-2">Free Fire</div>
            <div className="text-[#363225]-600">Jeu principal</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 text-center border border-amber-200">
            <div className="w-16 h-16 bg-[#f8c741]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-[#f8c741]" />
            </div>
            <div className="text-2xl font-bold text-[#363225]-800 mb-2">08 Mars 2026</div>
            <div className="text-[#363225]-600">Prochain tournoi</div>
          </div>
        </div>
      </div>

      {/* Tournois Cards Caramel */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#363225]-800 mb-4">
            Tournois à venir
          </h2>
          <p className="text-xl text-[#363225]-600 max-w-2xl mx-auto">
            Découvrez nos prochains tournois et laissez vos talents s&apos;épanouir
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {tournoisEnVedette.map((tournoi, index) => (
              <div 
                key={tournoi.id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#f8c741]/20"
              >
                {/* Bandeau */}
                <div className={`h-2 bg-linear-to-r ${index === 0 ? 'from-[#f8c741] to-[#e5b53a]' : 'from-[#f8c741] to-[#d4a02a]'}`}></div>
                
                <div className="p-8">
                  {/* Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 bg-[#f8c741]/10 text-[#f8c741] rounded-full text-sm font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#f8c741] rounded-full animate-pulse"></span>
                      Inscriptions ouvertes
                    </span>
                  </div>

                  {/* En-tête */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${index === 0 ? 'bg-[#f8c741]/10' : 'bg-[#f8c741]/10'}`}>
                      <Gamepad2 className="w-6 h-6 text-[#f8c741]" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Jeu</span>
                      <p className="font-semibold text-gray-800">{tournoi.jeu}</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {tournoi.titre}
                  </h3>

                  {/* Grille d'infos */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#f8c741]/5 rounded-xl p-4">
                      <Calendar className="w-5 h-5 text-[#f8c741] mb-2" />
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-semibold text-gray-800">
                        {new Date(tournoi.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      </div>
                    </div>
                    
                    <div className="bg-[#f8c741]/5 rounded-xl p-4">
                      <Clock className="w-5 h-5 text-[#f8c741] mb-2" />
                      <div className="text-sm text-gray-500">Heure</div>
                      <div className="font-semibold text-gray-800">{tournoi.heure}</div>
                    </div>
                    
                    <div className="bg-[#f8c741]/5 rounded-xl p-4">
                      <Gamepad2 className="w-5 h-5 text-[#f8c741] mb-2" />
                      <div className="text-sm text-gray-500">Format</div>
                      <div className="font-semibold text-gray-800">{tournoi.format}</div>
                    </div>
                    
                    <div className="bg-[#f8c741]/5 rounded-xl p-4">
                      <Users className="w-5 h-5 text-[#f8c741] mb-2" />
                      <div className="text-sm text-gray-500">Places</div>
                      <div className="font-semibold text-gray-800">{tournoi.places}</div>
                    </div>
                  </div>

                  <Link 
                    href={`/tournoiDetail/${tournoi.id}`}
                    className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all group/btn bg-[#f8c741] text-gray-900 hover:bg-[#e5b53a]`}
                  >
                    <span>Voir les détails</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

   {/* CTA avec stats */}
<div className="bg-gray-50 py-20">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Prête à relever le défi ?
          </h2>
          <p className="text-gray-500 mb-6">
            Rejoins la communauté et montre tes talents
          </p>
          <Link 
            href="/tournoi" 
            className="inline-block px-8 py-4 bg-[#f8c741] text-gray-900 rounded-xl font-bold hover:bg-[#e5b53a] transition-all shadow-lg"
          >
            Commencer maintenant
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-[#f8c741]">2</div>
            <div className="text-sm text-gray-500">Tournois</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-[#f8c741]">24/7</div>
            <div className="text-sm text-gray-500">Disponibles</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-[#f8c741]">8</div>
            <div className="text-sm text-gray-500">Jeux</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-[#f8c741]">24/7</div>
            <div className="text-sm text-gray-500">Support</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        
      </div>
    </div>
  );
}