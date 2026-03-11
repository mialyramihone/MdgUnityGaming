'use client';

import { useState } from 'react';
import { Trophy, ChevronDown, Users, Clock, Calendar, Award, Target, Gamepad2, Star, Filter } from 'lucide-react';

interface Tournoi {
  id: number;
  titre: string;
  date: string;
  jeu: string;
}

interface ResultatProps {
  tournois: Tournoi[];
}

interface Match {
  match: string;
  equipe1: string;
  equipe2: string;
  score: string;
  statut: string;
  heure?: string;
  phase?: string;
}

interface ResultatTournoi {
  vainqueur: string;
  mvps: string[];
  score: string;
  matchs: Match[];
  topKiller?: string;
  bestStrat?: string;
  dateFinale?: string;
}

interface Resultats {
  [key: number]: ResultatTournoi;
}

export default function Resultat({ tournois }: ResultatProps) {
  const [selectedTournoi, setSelectedTournoi] = useState<number>(tournois[0]?.id || 0);
  const [selectedJeu, setSelectedJeu] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'matchs' | 'stats' | 'joueurs'>('matchs');
  const [showFilters, setShowFilters] = useState(false);

  const jeux: string[] = [
    'Free Fire', 'Blood Strike', 'MLBB', 'PUBG', 
    'Genshin', 'Roblox', 'Valorant', 'Farlight'
  ];

  const resultats: Resultats = {};

  const tournoisFiltres = selectedJeu === 'all' 
    ? tournois 
    : tournois.filter(t => t.jeu === selectedJeu);

  const resultat = resultats[selectedTournoi];

  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6">
      
      


      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 xs:gap-4 px-2 xs:px-3 sm:px-4">
        <div>
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800">
            Résultats des tournois
          </h2>
          <p className="text-xs xs:text-sm text-gray-500">
            Consultez les vainqueurs et les statistiques
          </p>
        </div>


        <div className="flex flex-col w-full lg:w-auto gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between w-full px-4 py-2 border-2 border-[#f8c741] rounded-xl text-xs xs:text-sm"
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
                      {tournoi.titre.length > 20 ? tournoi.titre.substring(0, 18) + '...' : tournoi.titre}
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
                onClick={() => setViewMode('matchs')}
                className={`flex-1 sm:flex-none px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'matchs' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Matchs
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`flex-1 sm:flex-none px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'stats' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Stats
              </button>
              <button
                onClick={() => setViewMode('joueurs')}
                className={`flex-1 sm:flex-none px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'joueurs' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Joueurs
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

      {!resultat && (
        <div className="text-center py-8 xs:py-10 sm:py-12 px-4">
          <Gamepad2 className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 mx-auto mb-3 xs:mb-4 text-gray-300" />
          <p className="text-sm xs:text-base text-gray-500">Aucun résultat disponible</p>
        </div>
      )}


      {resultat && (
        <>
        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 px-2 xs:px-3 sm:px-4">
            <div className="bg-gradient-to-br from-[#f8c741] to-[#f7b731] p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-[#292929]/70">Vainqueur</p>
                  <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-[#292929] mt-0.5 xs:mt-1">
                    {resultat.vainqueur}
                  </p>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-[#292929]/80 mt-1 xs:mt-2">
                    Score: {resultat.score}
                  </p>
                </div>
                <div className="bg-white/20 p-2 xs:p-3 sm:p-4 rounded-full">
                  <Trophy className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#292929]" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-white/70">Finale</p>
                  <p className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-white mt-0.5 xs:mt-1">
                    {resultat.dateFinale || '8 Mars 2026'}
                  </p>
                </div>
                <div className="bg-white/10 p-2 xs:p-2.5 sm:p-3 rounded-lg">
                  <Calendar className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'matchs' && (
            <>
            
              <div className="px-2 xs:px-3 sm:px-4">
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2 text-gray-800">
                  <Star className="w-4 h-4 xs:w-5 xs:h-5 text-[#f8c741]" />
                  MVPs du tournoi
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                  {resultat.mvps.map((mvp: string, index: number) => (
                    <div key={index} className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center gap-2 xs:gap-3 sm:gap-4 hover:shadow-md transition">
                      <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#f8c741] to-[#f7b731] flex items-center justify-center">
                        <Award className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">
                          MVP {index === 0 ? 'Saison' : 'Finale'}
                        </p>
                        <p className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-gray-800">{mvp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="bg-white rounded-lg xs:rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-2 xs:mx-3 sm:mx-4">
                <div className="p-3 xs:p-4 sm:p-5 border-b border-gray-200 bg-gray-50/50">
                  <h3 className="text-xs xs:text-sm sm:text-base font-semibold flex items-center gap-1 xs:gap-2 text-gray-800">
                    <Clock className="w-3 h-3 xs:w-4 xs:h-4" />
                    Historique des matchs
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {resultat.matchs.map((match: Match, index: number) => (
                    <div key={index} className="p-3 xs:p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2">
                            <span className="text-[8px] xs:text-[10px] sm:text-xs px-1.5 xs:px-2 py-0.5 bg-[#f8c741]/10 text-[#f8c741] rounded-full font-medium">
                              {match.phase || match.match}
                            </span>
                            <span className="text-[8px] xs:text-[10px] text-gray-400">{match.heure}</span>
                          </div>
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 sm:gap-4">
                            <span className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[150px]">
                              {match.equipe1}
                            </span>
                            <div className="flex items-center gap-1 xs:gap-2">
                              <span className="text-sm xs:text-base sm:text-lg font-bold text-[#f8c741]">
                                {match.score.split('-')[0]}
                              </span>
                              <span className="text-xs xs:text-sm text-gray-400">-</span>
                              <span className="text-sm xs:text-base sm:text-lg font-bold text-[#f8c741]">
                                {match.score.split('-')[1]}
                              </span>
                            </div>
                            <span className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[150px]">
                              {match.equipe2}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 xs:gap-2 mt-1 xs:mt-0">
                          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-500 rounded-full"></div>
                          <span className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">{match.statut}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {viewMode === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 px-2 xs:px-3 sm:px-4">
              <div className="bg-white rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-2 xs:gap-3 mb-2 xs:mb-3 sm:mb-4">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-[#f8c741]/20 flex items-center justify-center">
                    <Target className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 text-[#f8c741]" />
                  </div>
                  <h3 className="text-xs xs:text-sm sm:text-base font-semibold">Top Killer</h3>
                </div>
                <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                  {resultat.topKiller || 'MarieGamer'}
                </p>
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-1 xs:mt-2">
                  Meilleur en éliminations
                </p>
              </div>

              <div className="bg-white rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-2 xs:gap-3 mb-2 xs:mb-3 sm:mb-4">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Award className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xs xs:text-sm sm:text-base font-semibold">Meilleure stratégie</h3>
                </div>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-gray-800">
                  {resultat.bestStrat || 'Team A'}
                </p>
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mt-1 xs:mt-2">
                  Composition gagnante
                </p>
              </div>

              <div className="bg-white rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 shadow-lg border border-gray-200 md:col-span-2">
                <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xs xs:text-sm sm:text-base font-semibold">Statistiques globales</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 xs:gap-4">
                  <div>
                    <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                      {resultat.matchs.length}
                    </p>
                    <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Matchs</p>
                  </div>
                  <div>
                    <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                      {resultat.mvps.length}
                    </p>
                    <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">MVPs</p>
                  </div>
                  <div>
                    <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                      {resultat.score}
                    </p>
                    <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Score final</p>
                  </div>
                  <div>
                    <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800">4</p>
                    <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Équipes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'joueurs' && (
            <div className="bg-white rounded-lg xs:rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-2 xs:mx-3 sm:mx-4">
              <div className="p-3 xs:p-4 sm:p-5 border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-xs xs:text-sm sm:text-base font-semibold flex items-center gap-1 xs:gap-2 text-gray-800">
                  <Users className="w-3 h-3 xs:w-4 xs:h-4" />
                  Performance des joueurs
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] xs:min-w-[550px] sm:min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-left text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                        Joueur
                      </th>
                      <th className="hidden xs:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-left text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                        Équipe
                      </th>
                      <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                        Kills
                      </th>
                      <th className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                        Assists
                      </th>
                      <th className="hidden md:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                        DMG
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {resultat.mvps.map((mvp, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 font-medium text-gray-900 text-[10px] xs:text-xs sm:text-sm">
                          {mvp}
                        </td>
                        <td className="hidden xs:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-gray-600 text-[8px] xs:text-[10px] sm:text-xs">
                          {resultat.vainqueur}
                        </td>
                        <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[#f8c741] font-bold text-xs xs:text-sm">
                          15
                        </td>
                        <td className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-gray-600 text-[8px] xs:text-[10px] sm:text-xs">
                          8
                        </td>
                        <td className="hidden md:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-gray-600 text-[8px] xs:text-[10px] sm:text-xs">
                          2.5k
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          <div className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 p-3 xs:p-4 bg-gray-50 rounded-lg mx-2 xs:mx-3 sm:mx-4 text-[8px] xs:text-[10px] sm:text-xs">
            <div className="flex items-center gap-1 xs:gap-2">
              <Trophy size={12} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-[#f8c741]" />
              <span className="text-gray-600">Vainqueur</span>
            </div>
            <div className="flex items-center gap-1 xs:gap-2">
              <Award size={12} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-[#f8c741]" />
              <span className="text-gray-600">MVP</span>
            </div>
            <div className="flex items-center gap-1 xs:gap-2">
              <Clock size={12} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-gray-400" />
              <span className="text-gray-600">Terminés</span>
            </div>
            <div className="flex items-center gap-1 xs:gap-2">
              <Gamepad2 size={12} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-[#f8c741]" />
              <span className="text-gray-600">{selectedJeu === 'all' ? 'Tous' : selectedJeu}</span>
            </div>
          </div>
        </>
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