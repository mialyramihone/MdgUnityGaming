'use client';

import Resultat from '@/components/Resultat';


const tournois = [
  {
    id: 1,
    titre: 'Tournoi Femina Esport',
    date: '2026-03-08',
    jeu: 'Free Fire'
  },
  {
    id: 2,
    titre: 'The Tournament saison 4',
    date: '2026-03-23',
    jeu: 'Free Fire'
  }
];

export default function ResultatPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto">
        <Resultat tournois={tournois} />
      </div>
    </div>
  );
}