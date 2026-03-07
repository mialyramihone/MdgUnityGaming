'use client';

import Classement from '@/components/Classement';


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

export default function ClassementPage() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto">
        <Classement tournois={tournois} />
      </div>
    </div>
  );
}