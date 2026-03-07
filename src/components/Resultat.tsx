'use client';

import { useState } from 'react';
import { Trophy, ChevronDown, Users, Clock, Calendar, Award, Target, Gamepad2, Star } from 'lucide-react';

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

  const jeux: string[] = [
    'Free Fire', 'Blood Strike', 'MLBB', 'PUBG', 
    'Genshin', 'Roblox', 'Valorant', 'Farlight'
  ];

  const resultats: Resultats = {
    
      
  };

    
  const tournoisFiltres = selectedJeu === 'all' 
    ? tournois 
    : tournois.filter(t => t.jeu === selectedJeu);

  const resultat = resultats[selectedTournoi];

  return (
    <div className="space-y-6">
      {/* Navbar des jeux */}
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

      {/* Header avec sélecteurs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#292929' }}>Résultats des tournois</h2>
          <p className="text-sm" style={{ color: '#826d4a' }}>Consultez les vainqueurs et les statistiques</p>
        </div>

        <div className="flex gap-3">
          {/* Sélecteur de tournoi */}
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

          {/* Sélecteur de vue */}
          <div className="flex rounded-xl border-2 border-[#f8c741] overflow-hidden">
            <button
              onClick={() => setViewMode('matchs')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'matchs' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Matchs
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'stats' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Statistiques
            </button>
            <button
              onClick={() => setViewMode('joueurs')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'joueurs' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Joueurs
            </button>
          </div>
        </div>
      </div>

      {/* Message si aucun résultat */}
      {!resultat && (
        <div className="text-center py-12 px-4">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg text-gray-500">Aucun résultat disponible pour ce tournoi</p>
          <p className="text-sm text-gray-400 mt-2">Sélectionnez un autre tournoi ou jeu</p>
        </div>
      )}

      {/* Affichage des résultats seulement si resultat existe */}
      {resultat && (
        <>
          {/* Cartes d'information du vainqueur */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
            <div className="bg-linear-to-br from-[#f8c741] to-[#f7b731] p-6 rounded-xl col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#292929]/70">Vainqueur du tournoi</p>
                  <p className="text-3xl font-bold text-[#292929] mt-1">{resultat.vainqueur}</p>
                  <p className="text-sm text-[#292929]/80 mt-2">Score final: {resultat.score}</p>
                </div>
                <div className="bg-white/20 p-4 rounded-full">
                  <Trophy className="w-8 h-8 text-[#292929]" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-600 to-purple-800 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Date de la finale</p>
                  <p className="text-xl font-bold text-white mt-1">{resultat.dateFinale || '8 Mars 2026'}</p>
                  <p className="text-xs text-white/60 mt-2">Saison 4</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'matchs' && (
            <>
              {/* MVPs */}
              <div className="px-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#292929' }}>
                  <Star className="w-5 h-5 text-[#f8c741]" />
                  MVPs du tournoi
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {resultat.mvps.map((mvp: string, index: number) => (
                    <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                      <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#f8c741] to-[#f7b731] flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">MVP {index === 0 ? 'Saison' : 'Finale'}</p>
                        <p className="font-bold text-lg text-gray-800">{mvp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historique des matchs */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-4">
                <div className="p-5 border-b border-gray-200 bg-gray-50/50">
                  <h3 className="font-semibold flex items-center gap-2" style={{ color: '#292929' }}>
                    <Clock className="w-4 h-4" />
                    Historique des matchs
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {resultat.matchs.map((match: Match, index: number) => (
                    <div key={index} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-[#f8c741]/10 text-[#f8c741] rounded-full font-medium">
                              {match.phase || match.match}
                            </span>
                            <span className="text-xs text-gray-400">{match.heure}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-800 min-w-30">{match.equipe1}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-[#f8c741]">{match.score.split('-')[0]}</span>
                              <span className="text-sm text-gray-400">-</span>
                              <span className="text-lg font-bold text-[#f8c741]">{match.score.split('-')[1]}</span>
                            </div>
                            <span className="font-semibold text-gray-800 min-w-30">{match.equipe2}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-500">{match.statut}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {viewMode === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#f8c741]/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#f8c741]" />
                  </div>
                  <h3 className="font-semibold">Top Killer</h3>
                </div>
                <p className="text-2xl font-bold text-gray-800">{resultat.topKiller || 'MarieGamer'}</p>
                <p className="text-sm text-gray-500 mt-2">Meilleur joueur en termes d&apos;éliminations</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Meilleure stratégie</h3>
                </div>
                <p className="text-xl font-bold text-gray-800">{resultat.bestStrat || 'Team A'}</p>
                <p className="text-sm text-gray-500 mt-2">Composition et tactique gagnante</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Statistiques globales</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{resultat.matchs.length}</p>
                    <p className="text-xs text-gray-500">Matchs joués</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{resultat.mvps.length}</p>
                    <p className="text-xs text-gray-500">MVPs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{resultat.score}</p>
                    <p className="text-xs text-gray-500">Score final</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">4</p>
                    <p className="text-xs text-gray-500">Équipes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'joueurs' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-4">
              <div className="p-5 border-b border-gray-200 bg-gray-50/50">
                <h3 className="font-semibold flex items-center gap-2" style={{ color: '#292929' }}>
                  <Users className="w-4 h-4" />
                  Performance des joueurs
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Joueur</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Équipe</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Kills</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Assists</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">DMG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {resultat.mvps.map((mvp, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{mvp}</td>
                        <td className="px-6 py-4 text-gray-600">{resultat.vainqueur}</td>
                        <td className="px-6 py-4 text-center text-[#f8c741] font-bold">15</td>
                        <td className="px-6 py-4 text-center text-gray-600">8</td>
                        <td className="px-6 py-4 text-center text-gray-600">2.5k</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Légende */}
          <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-lg mx-4 text-sm">
            <div className="flex items-center gap-2">
              <Trophy size={16} style={{ color: '#f8c741' }} />
              <span className="text-gray-600">Vainqueur</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} style={{ color: '#f8c741' }} />
              <span className="text-gray-600">MVP</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-600">Matchs terminés</span>
            </div>
            <div className="flex items-center gap-2">
              <Gamepad2 size={16} className="text-[#f8c741]" />
              <span className="text-gray-600">{selectedJeu === 'all' ? 'Tous les jeux' : selectedJeu}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}