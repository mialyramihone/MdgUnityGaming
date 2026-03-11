'use client';

import { useState } from 'react';
import { Trophy, Medal, Award, ChevronDown, Gamepad2, Filter } from 'lucide-react';

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
  const [showFilters, setShowFilters] = useState(false);

  const jeux: string[] = [
    'Free Fire', 'Blood Strike', 'MLBB', 'PUBG', 
    'Genshin', 'Roblox', 'Valorant', 'Farlight'
  ];

  const classements: Classements = {};

  const getMedalIcon = (rang: number) => {
    switch(rang) {
      case 1: return <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-[#f8c741] flex items-center justify-center"><Trophy className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#292929]" /></div>;
      case 2: return <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center"><Medal className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-gray-600" /></div>;
      case 3: return <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-amber-600 flex items-center justify-center"><Award className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-white" /></div>;
      default: return <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs xs:text-sm">{rang}</div>;
    }
  };

  const classementActuel = (classements[selectedTournoi] || [])
    .filter(j => selectedJeu === 'all' || j.jeu === selectedJeu);

  const tournoisFiltres = selectedJeu === 'all' 
    ? tournois 
    : tournois.filter(t => t.jeu === selectedJeu);

  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 xs:gap-4 px-2 xs:px-3 sm:px-4">
        <div>
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800">
            Classement des tournois
          </h2>
          <p className="text-xs xs:text-sm text-gray-500">
            Suivez les performances des joueuses
          </p>
        </div>


        <div className="flex flex-col w-full lg:w-auto gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between w-full px-4 py-2 border-2 border-[#f8c741] rounded-xl text-sm"
          >
            <span>Filtres et options</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>


          <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col sm:flex-row lg:items-center gap-2 sm:gap-3`}>
            
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedTournoi}
                onChange={(e) => setSelectedTournoi(Number(e.target.value))}
                className="appearance-none w-full sm:w-auto px-3 xs:px-4 py-2 xs:py-2.5 pr-8 xs:pr-10 rounded-lg xs:rounded-xl border-2 focus:outline-none focus:border-[#f8c741] bg-white text-xs xs:text-sm"
                style={{ borderColor: '#f8c741' }}
              >
                {tournoisFiltres.length > 0 ? (
                  tournoisFiltres.map((tournoi) => (
                    <option key={tournoi.id} value={tournoi.id}>
                      {tournoi.titre.length > 20 ? tournoi.titre.substring(0, 20) + '...' : tournoi.titre}
                    </option>
                  ))
                ) : (
                  <option value="">Aucun tournoi</option>
                )}
              </select>
              <ChevronDown className="absolute right-2 xs:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 xs:w-4 xs:h-4 pointer-events-none text-gray-500" />
            </div>


            <div className="flex rounded-lg xs:rounded-xl border-2 border-[#f8c741] overflow-hidden w-full sm:w-auto">
              <button
                onClick={() => setViewMode('general')}
                className={`flex-1 sm:flex-none px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'general' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Général
              </button>
              <button
                onClick={() => setViewMode('kills')}
                className={`flex-1 sm:flex-none px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'kills' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Kills
              </button>
              <button
                onClick={() => setViewMode('winrate')}
                className={`flex-1 sm:flex-none px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'winrate' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Win Rate
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4">
          <div className="flex gap-1 xs:gap-2 overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setSelectedJeu('all')}
              className={`px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full font-medium transition-all whitespace-nowrap text-[10px] xs:text-xs sm:text-sm ${
                selectedJeu === 'all' 
                  ? 'text-white bg-[#f8c741]' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            {jeux.map((jeu) => (
              <button
                key={jeu}
                onClick={() => setSelectedJeu(jeu)}
                className={`px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full font-medium transition-all whitespace-nowrap text-[10px] xs:text-xs sm:text-sm ${
                  selectedJeu === jeu 
                    ? 'text-white bg-[#f8c741]' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {jeu}
              </button>
            ))}
          </div>
        </div>
      </div>


      {classementActuel.length === 0 && (
        <div className="text-center py-8 xs:py-10 sm:py-12 px-4">
          <Gamepad2 className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 mx-auto mb-3 xs:mb-4 text-gray-300" />
          <p className="text-sm xs:text-base text-gray-500">Aucun classement disponible</p>
        </div>
      )}


      {classementActuel.length > 0 && (
        <div className="bg-white rounded-lg xs:rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-2 xs:mx-3 sm:mx-4">
          <div className="p-3 xs:p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800">
              {viewMode === 'general' && 'Classement général'}
              {viewMode === 'kills' && 'Classement par kills'}
              {viewMode === 'winrate' && 'Classement par win rate'}
            </h3>
            {selectedJeu !== 'all' && (
              <span className="text-[10px] xs:text-xs px-2 xs:px-3 py-1 bg-[#f8c741] rounded-full text-[#292929]">
                {selectedJeu}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] xs:min-w-[700px] sm:min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-left text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rang
                  </th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-left text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joueuse
                  </th>
                  <th className="hidden xs:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-left text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Équipe
                  </th>
                  <th className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-left text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jeu
                  </th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {viewMode === 'general' ? 'Pts' : viewMode === 'kills' ? 'Kills' : 'WR'}
                  </th>
                  {viewMode === 'general' && (
                    <>
                      <th className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kills
                      </th>
                      <th className="hidden md:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Moy.
                      </th>
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
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 xs:gap-2">
                        {getMedalIcon(index + 1)}
                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-900">
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-900">
                          {joueur.pseudo}
                        </div>
                        <div className="text-[8px] xs:text-[10px] text-gray-500 xs:hidden">
                          {joueur.equipe}
                        </div>
                      </div>
                    </td>
                    <td className="hidden xs:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                      <span className="px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-gray-100 text-gray-600 rounded-full text-[8px] xs:text-[10px] sm:text-xs font-medium">
                        {joueur.equipe.length > 10 ? joueur.equipe.substring(0, 8) + '...' : joueur.equipe}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-[10px] xs:text-xs text-[#f8c741] font-medium">
                        {joueur.jeu}
                      </span>
                    </td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-center">
                      <span className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-[#f8c741]">
                        {viewMode === 'kills' ? joueur.kills : 
                         viewMode === 'winrate' ? joueur.winRate + '%' : 
                         joueur.points}
                      </span>
                    </td>
                    {viewMode === 'general' && (
                      <>
                        <td className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-center text-[10px] xs:text-xs text-gray-600">
                          {joueur.kills}
                        </td>
                        <td className="hidden md:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-center text-[10px] xs:text-xs text-gray-600">
                          {joueur.avgPlace}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}