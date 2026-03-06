'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Gamepad2 } from 'lucide-react';

export default function Accueil() {
  const [stats, setStats] = useState({
    totalJoueuses: 0,
    tournoisActifs: 1,
    prochainTournoi: 'Tournoi Femina Esport - 08 Mars 2026'
  });

  const tournoisEnVedette = [
    {
      id: 1,
      titre: 'Tournoi Femina Esport',
      jeu: 'Free Fire',
      description: 'Les équipes sont formées par tirage au sort. Inscription gratuite ',
      format: '4 vs 4',
      cashPrize: '20 H',
      places: '16',
      date: '08 Mars 2026',
      status: 'ouvert',
      icon: Gamepad2,
      couleur: '#f8c741'
    },
  ];

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        const res = await fetch('/api/joueuses');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setStats(prev => ({
            ...prev,
            totalJoueuses: data.length 
          }));
        }
      } catch (error) {
        console.error('Erreur chargement stats:', error);
        
      }
    };

    fetchStats();
  }, []); 

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#f8c741' }}>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span style={{ color: '#292929' }}>
                Bienvenue sur
              </span>
              <br />
              <span style={{ color: '#292929' }}>
                MDG Unity Gaming
              </span>
            </h1>
            <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: '#292929' }}>
              La première plateforme de tournois exclusivement. 
              Rejoignez une communauté de joueurs passionnés et compétitifs !
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/tournoi" 
                className="font-bold py-4 px-8 rounded-lg transition-all inline-block"
                style={{ backgroundColor: '#292929', color: '#ffffff' }}
              >
                Voir les tournois
              </Link>
              <Link 
                href="/admin" 
                className="font-bold py-4 px-8 rounded-lg transition-all inline-block"
                style={{ backgroundColor: '#826d4a', color: '#ffffff' }}
              >
                Espace Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#ffffff' }}>
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="currentColor" 
            />
          </svg>
        </div>
      </div>

      {/* Statistiques avec données réelles */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-lg" style={{ backgroundColor: '#f8c741' }}>
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#292929' }} />
            <div className="text-4xl font-bold mb-2" style={{ color: '#292929' }}>
              {stats.totalJoueuses}
            </div>
            <div style={{ color: '#292929' }}>Joueurs inscrits</div>
          </div>
          <div className="text-center p-8 rounded-lg" style={{ backgroundColor: '#826d4a' }}>
            <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: '#ffffff' }} />
            <div className="text-4xl font-bold mb-2" style={{ color: '#ffffff' }}>
              {stats.tournoisActifs}
            </div>
            <div style={{ color: '#ffffff' }}>Tournois actifs</div>
          </div>
          <div className="text-center p-8 rounded-lg" style={{ backgroundColor: '#292929' }}>
            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#ffffff' }} />
            <div className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>
              {stats.prochainTournoi}
            </div>
            <div style={{ color: '#ffffff' }}>Prochain tournoi</div>
          </div>
        </div>
      </div>

      {/* Reste du code inchangé... */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#292929' }}>
          Tournois à venir
        </h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: '#826d4a' }}>
          Découvrez nos prochains tournois et inscrivez-vous dès maintenant !
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournoisEnVedette.map((tournoi) => {
            const Icon = tournoi.icon;
            return (
              <div key={tournoi.id} className="rounded-lg overflow-hidden group" style={{ backgroundColor: '#ffffff', border: '1px solid #f8c741' }}>
                <div className="relative h-32 flex items-center justify-center" style={{ backgroundColor: tournoi.couleur }}>
                  <Icon className="w-16 h-16" style={{ color: '#ffffff', opacity: 0.5 }} />
                  <div className="absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: '#ffffff', color: '#292929' }}>
                    {tournoi.jeu}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#292929' }}>{tournoi.titre}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="flex items-center">
                      <span className="w-24 font-medium" style={{ color: '#826d4a' }}>Format:</span>
                      <span className="font-semibold" style={{ color: '#292929' }}>{tournoi.format}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-24 font-medium" style={{ color: '#826d4a' }}>Cash Prize:</span>
                      <span className="font-semibold" style={{ color: tournoi.couleur }}>{tournoi.cashPrize}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-24 font-medium" style={{ color: '#826d4a' }}>Places:</span>
                      <span className="font-semibold" style={{ color: '#292929' }}>{tournoi.places}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-24 font-medium" style={{ color: '#826d4a' }}>Date:</span>
                      <span className="font-semibold" style={{ color: '#292929' }}>{tournoi.date}</span>
                    </p>
                  </div>
                  <Link 
                    href={`/tournoi/`}
                    className="w-full text-center block font-bold py-3 px-4 rounded-lg transition-all"
                    style={{ backgroundColor: '#f8c741', color: '#292929' }}
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20" style={{ backgroundColor: '#826d4a' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: '#ffffff' }}>Prête à relever le défi ?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto" style={{ color: '#ffffff' }}>
            Rejoignez {stats.totalJoueuses} joueuses déjà inscrites et participez à des tournois passionnants
          </p>
          <Link 
            href="/tournoi" 
            className="font-bold py-4 px-12 rounded-full text-lg hover:shadow-2xl transform hover:scale-105 transition-all inline-block"
            style={{ backgroundColor: '#f8c741', color: '#292929' }}
          >
            S&apos;inscrire maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}