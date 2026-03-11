'use client';

import { useState } from 'react';
import { Trophy, Medal, Award, ChevronDown, Gamepad2 } from 'lucide-react';


interface Tournoi {
  id: number;
  titre: string;
  date: string;
  jeu: string;
}

interface ClassementProps {
  tournois: Tournoi[];
}

interface JoueurClassement {
  rang: number;
  pseudo: string;
  equipe: string;
  points: number;
  kills: number;
  winRate?: number;
  avgPlace?: number;
  jeu: string;
}

interface Classements {
  [key: number]: JoueurClassement[];
}

export default function Classement({ tournois }: ClassementProps) {
  const [selectedTournoi, setSelectedTournoi] = useState<number>(tournois[0]?.id || 0);
  const [selectedJeu, setSelectedJeu] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'general' | 'kills' | 'winrate'>('general');

  const jeux: string[] = [
    'Free Fire', 'Blood Strike', 'MLBB', 'PUBG', 
    'Genshin', 'Roblox', 'Valorant', 'Farlight'
  ];

  const classements: Classements = {
   
  };

  const getMedalIcon = (rang: number) => {
    switch(rang) {
      case 1: return <div className="w-8 h-8 rounded-full bg-[#f8c741] flex items-center justify-center"><Trophy className="w-4 h-4 text-[#292929]" /></div>;
      case 2: return <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"><Medal className="w-4 h-4 text-gray-600" /></div>;
      case 3: return <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center"><Award className="w-4 h-4 text-white" /></div>;
      default: return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">{rang}</div>;
    }
  };

    
  const classementActuel = (classements[selectedTournoi] || [])
    .filter(j => selectedJeu === 'all' || j.jeu === selectedJeu);

    
  const tournoisFiltres = selectedJeu === 'all' 
    ? tournois 
    : tournois.filter(t => t.jeu === selectedJeu);

  return (
    <div className="space-y-6">
     
      

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#292929' }}>Classement des tournois</h2>
          <p className="text-sm" style={{ color: '#826d4a' }}>Suivez les performances des joueuses</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              value={selectedTournoi}
              onChange={(e) => setSelectedTournoi(Number(e.target.value))}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border-2 focus:outline-none focus:border-[#f8c741] bg-white"
              style={{ borderColor: '#f8c741' }}
            >
              {tournoisFiltres.length > 0 ? (
                tournoisFiltres.map((tournoi) => (
                  <option key={tournoi.id} value={tournoi.id}>
                    {tournoi.titre}
                  </option>
                ))
              ) : (
                <option value="">Aucun tournoi</option>
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#826d4a' }} />
          </div>


          <div className="flex rounded-xl border-2 border-[#f8c741] overflow-hidden">
            <button
              onClick={() => setViewMode('general')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'general' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Général
            </button>
            <button
              onClick={() => setViewMode('kills')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'kills' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Top Kills
            </button>
            <button
              onClick={() => setViewMode('winrate')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'winrate' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Win Rate
            </button>
          </div>
        </div>
          </div>
          
          <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedJeu('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                selectedJeu === 'all' 
                  ? 'text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{ backgroundColor: selectedJeu === 'all' ? '#f8c741' : undefined }}
            >
              Tous les jeux
            </button>
            {jeux.map((jeu) => (
              <button
                key={jeu}
                onClick={() => setSelectedJeu(jeu)}
                className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  selectedJeu === jeu 
                    ? 'text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ backgroundColor: selectedJeu === jeu ? '#f8c741' : undefined }}
              >
                {jeu}
              </button>
            ))}
          </div>
        </div>
      </div>


      {classementActuel.length === 0 && (
        <div className="text-center py-12 px-4">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg text-gray-500">Aucun classement disponible</p>
        </div>
      )}


      {classementActuel.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-4">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-semibold" style={{ color: '#292929' }}>
              {viewMode === 'general' && 'Classement général'}
              {viewMode === 'kills' && 'Classement par kills'}
              {viewMode === 'winrate' && 'Classement par win rate'}
            </h3>
            {selectedJeu !== 'all' && (
              <span className="text-sm px-3 py-1 bg-[#f8c741] rounded-full text-[#292929]">
                {selectedJeu}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rang</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joueuse</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jeu</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {viewMode === 'general' ? 'Points' : viewMode === 'kills' ? 'Kills' : 'Win Rate'}
                  </th>
                  {viewMode === 'general' && (
                    <>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kills</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Moy. Place</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...classementActuel]
                  .sort((a, b) => {
                    if (viewMode === 'kills') return b.kills - a.kills;
                    if (viewMode === 'winrate') return (b.winRate || 0) - (a.winRate || 0);
                    return a.rang - b.rang;
                  })
                  .map((joueur, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getMedalIcon(index + 1)}
                        <span className="font-medium text-gray-900">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{joueur.pseudo}</div>
                          <div className="text-xs text-gray-500">{joueur.equipe}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {joueur.equipe}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-[#f8c741] font-medium">{joueur.jeu}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold" style={{ color: '#f8c741' }}>
                        {viewMode === 'kills' ? joueur.kills : viewMode === 'winrate' ? joueur.winRate + '%' : joueur.points}
                      </span>
                    </td>
                    {viewMode === 'general' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{joueur.kills}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{joueur.avgPlace}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}