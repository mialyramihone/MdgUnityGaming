'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TournoiDetail from '@/components/TournoiDetail';
import { Tournoi } from '@/types/tournoi';

// Interface pour les données retournées par l'API joueuses
interface JoueuseData {
  id: number;
  compte_id: string;
  pseudo_ingame: string;
  pseudo_facebook: string;
  pseudo_discord: string;
  handcam: string;
  tournoi_id: number | null;
  date_inscription: string;
}

// Interface pour les données retournées par l'API count-teams
interface TeamsCountData {
  count: number;
  error?: string;
}

// Données des tournois
const tournois: Tournoi[] = [
  {
    id: 1,
    titre: 'Tournoi Femina Esport',
    jeu: 'Free Fire',
    description: 'Les équipes sont formées par tirage au sort. Inscription gratuite',
    format: '4 vs 4',
    heure: '20:00',
    mode: 'Clash Squad',
    places: 16,
    date: '2026-03-08',
    status: 'ouvert',
    couleur: '#f8c741',
    cashPrize: ['1ère place: 20 000 FCFA', '2ème place: 10 000 FCFA', '3ème place: 5 000 FCFA'],
    reglement: [
      'Être une joueuse',
      'Avoir un compte Free Fire valide',
      'Présence 15min avant le début',
      'Respecter les autres participantes',
      'Interdiction de tricher'
    ],
    organisation: 'MDG Unity Gaming',
    contact: 'MDG Unity Gaming',
    participants: []
  },
  {
    id: 2,
    titre: 'The Tournament saison 4',
    jeu: 'Free Fire',
    description: 'Tournoi Phase point rush et finale en présentielle',
    format: 'Squad',
    heure: '21:00',
    mode: 'Battle Royale',
    places: 999999,
    date: '2026-03-23',
    status: 'ouvert',
    couleur: '#826d4a',
    cashPrize: ['1ère place: 50 000 FCFA', '2ème place: 25 000 FCFA', '3ème place: 10 000 FCFA'],
    reglement: [
      'Équipe de 4 joueurs',
      'Finale en présentiel à BAEC Ankadivato, Antananarivo',
      'Mode Esport',
      'no Emulateur',
      'no Alliance',
      'Respect des horaires',
      'Fair-play exigé'
    ],
    organisation: 'The Tournament',
    contact: 'MDG Unity Gaming, Black Dragon, Miarana Gaming',
    participants: []
  }
];

export default function TournoiDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [inscriptionsCount, setInscriptionsCount] = useState<number>(0);
  
  const tournoi = tournois.find(t => t.id === id);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (id === 1) {
          const res = await fetch('/api/joueuses');
          const data: JoueuseData[] = await res.json();
          const count = Array.isArray(data) 
            ? data.filter((j: JoueuseData) => j.tournoi_id === 1).length 
            : 0;
          setInscriptionsCount(count);
        } else if (id === 2) {
          const res = await fetch('/api/count-teams?id=2');
          const data: TeamsCountData = await res.json();
          setInscriptionsCount(data.count || 0);
        }
      } catch (error) {
        console.error('Erreur chargement inscriptions:', error);
      }
    };
    
    fetchCount();
  }, [id]);

  if (!tournoi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Tournoi non trouvé</p>
      </div>
    );
  }

  return (
    <TournoiDetail 
      tournoi={tournoi}
      initialInscriptionsCount={inscriptionsCount}
      onBack={() => window.history.back()}
      onInscrire={() => {}}
    />
  );
}