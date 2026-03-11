'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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

 const [showAd, setShowAd] = useState(true); 



  const [tournoisEnVedette] = useState<Tournoi[]>([
    // {
    //   id: 1,
    //   titre: 'Tournoi Femina Esport',
    //   jeu: 'Free Fire',
    //   format: '4 vs 4',
    //   heure: '20:00',
    //   mode: 'Clash Squad',
    //   places: 16,
    //   date: '2026-03-08',
    //   status: 'ouvert'
    // },
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

   useEffect(() => {
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []); 

  const closeAd = () => {
    setShowAd(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-yellow-50">

      <div className="relative overflow-hidden bg-linear-to-br from-[#ffc629] to-[#ffb909]">
    

{showAd && (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div 
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={closeAd}
    ></div>
    
    <div className="relative w-96 animate-fade-in">
      <button
        onClick={closeAd}
        className="absolute -top-3 -right-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2 hover:bg-white/30 transition-colors z-10"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="relative">
        <div className="relative h-80 w-full">
          <Image
            src="/images/freefire-character.png" 
            alt="Free Fire Character"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute top-28 left-0 right-0 text-center">
          <p className="text-white text-sm font-medium mb-1 drop-shadow-lg">TOURNOI</p>
          <p className="text-white text-5xl font-black mb-2 drop-shadow-lg">FREE FIRE</p>
          <p className="text-[#f8c741] text-3xl font-bold drop-shadow-lg">23 MARS 2026</p>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center">
          <Link
            href="/tournoi/"
            onClick={closeAd}
            className="inline-block px-8 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold border border-white/30 hover:bg-white/20 transition-all"
          >
            S'inscrire maintenant
          </Link>
        </div>
      </div>
    </div>
  </div>
)}
    

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            
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

      </div>

<div className="relative overflow-hidden bg-gradient-to-r from-[#f8c741] to-[#ffd966] py-4">
   <div className="absolute left-0 top-0 bottom-0 w-50 bg-gradient-to-r from-[#f8c741] to-transparent z-10"></div>
  <div className="absolute right-0 top-0 bottom-0 w-50 bg-gradient-to-l from-[#ffd966] to-transparent z-10"></div>

  <div className="flex whitespace-nowrap animate-scroll w-max">
    {/* Trois séries pour éviter tout espace */}
    {[1, 2, 3].map((_, idx) => (
      <div key={idx} className="flex items-center">
        <span className="text-white font-bold text-lg mx-3">FREE FIRE</span>
        <span className="text-white text-2xl mx-1">•</span>
        <span className="text-white font-bold text-lg mx-3">BLOOD STRIKE</span>
        <span className="text-white text-2xl mx-1">•</span>
        <span className="text-white font-bold text-lg mx-3">MLBB</span>
        <span className="text-white text-2xl mx-1">•</span>
        <span className="text-white font-bold text-lg mx-3">PUBG</span>
        <span className="text-white text-2xl mx-1">•</span>
        <span className="text-white font-bold text-lg mx-3">GENSHIN</span>
        <span className="text-white text-2xl mx-1">•</span>
        <span className="text-white font-bold text-lg mx-3">ROBLOX</span>
        <span className="text-white text-2xl mx-1">•</span>
        <span className="text-white font-bold text-lg mx-3">VALORANT</span>
        <span className="text-white text-2xl mx-1">•</span>
        <span className="text-white font-bold text-lg mx-3">FARLIGHT</span>
        <span className="text-white text-2xl mx-1">•</span>
      </div>
    ))}
  </div>
</div>



    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Comment ça marche ?</h2>
        <p className="text-xl text-gray-500">Rejoindre un tournoi en 3 étapes simples</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f8c741]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-[#f8c741]">1</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Inscris-toi</h3>
          <p className="text-gray-500">Crée ton compte gratuitement</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f8c741]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-[#f8c741]">2</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Choisis ton tournoi</h3>
          <p className="text-gray-500">Parmi nos nombreux tournois</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f8c741]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-[#f8c741]">3</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Joue et gagne</h3>
          <p className="text-gray-500">Affronte les meilleurs et remporte des prix</p>
        </div>
      </div>
    </div>

    <div className="relative flex items-center justify-center my-12">
  <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#f8c741] to-transparent"></div>
  <div className="mx-4 w-10 h-10 bg-[#f8c741]/10 rounded-full flex items-center justify-center">
    <Gamepad2 className="w-5 h-5 text-[#f8c741]" />
  </div>
  <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#f8c741] to-transparent"></div>
</div>

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
      className="group relative h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
    >
      
      <div className="absolute inset-0">
        <Image
          src="/images/freefire-bg.jpg"
          alt={tournoi.jeu}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      </div>


      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-[#f8c741] text-black font-bold text-xs rounded-full">
            TOURNOI
          </span>
        </div>


        <div className="mb-3">
          <span className="text-sm text-[#f8c741] font-bold uppercase tracking-wider">{tournoi.jeu}</span>
        </div>


        <h3 className="text-2xl font-black mb-2">{tournoi.titre}</h3>


        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#f8c741]" />
          <span className="text-sm">
            {new Date(tournoi.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>


        <Link 
          href={`/tournoiDetail/${tournoi.id}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#f8c741] text-black font-bold rounded-full hover:bg-white transition-all w-fit"
        >
          <span>S'inscrire</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  ))}
</div>
    
    </div>

<div className="py-12 md:py-20 relative overflow-hidden bg-gradient-to-r from-[#f8c741]/10 to-[#ff8c42]/10">
  <div className="container mx-auto px-4 relative">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Image - toujours en premier */}
        <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] order-1">
          <Image
            src="/images/freefire-character1.png"
            alt="Gamer"
            fill
            className="object-contain md:object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Texte - toujours en deuxième */}
        <div className="order-2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 mb-3 md:mb-4">
            PRÊT À
            <br />
            <span className="text-[#f8c741]">DOMINER</span>
            <br />
            LE JEU ?
          </h2>
          
          <p className="text-gray-500 mb-4 md:mb-6 text-base sm:text-lg">
            Rejoins l'arène et prouve ta valeur face aux meilleurs joueurs
          </p>

          <div className="flex justify-center md:justify-start gap-4 sm:gap-6 mb-6 md:mb-8">
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#f8c741]">2</div>
              <div className="text-xs sm:text-sm text-gray-500">Tournois</div>
            </div>
            <div className="w-px h-8 sm:h-10 bg-gray-200"></div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#f8c741]">8</div>
              <div className="text-xs sm:text-sm text-gray-500">Jeux</div>
            </div>
          </div>

          <div className="flex justify-center md:justify-start">
            <Link 
              href="/tournoi" 
              className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#f8c741] text-white rounded-full font-bold text-base sm:text-lg hover:bg-[#e5b53a] transition-all shadow-lg hover:shadow-xl"
            >
              <span>Commencer l'aventure</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


</div>
        
      
  );
}