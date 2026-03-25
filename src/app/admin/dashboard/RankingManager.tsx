'use client';

import { useState, useEffect, JSX } from 'react';
import { Trophy, Medal, Award, ChevronDown, Gamepad2 } from 'lucide-react';

interface TeamRanking {
  id: number;
  teamName: string;
  team_name?: string;
  teamTag?: string;
  team_tag?: string;
  totalPoints: number;
  total_points?: number;
  totalKills: number;
  total_kills?: number;
  totalBooyahs?: number;
  total_booyahs?: number;
  matchesPlayed: number;
  matches_played?: number;
}

export default function RankingManager() {
  const [rankings, setRankings] = useState<TeamRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'general' | 'kills' | 'booyah'>('general');
  const [filterMatch, setFilterMatch] = useState<number>(0); // 0 = tous
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchRankings(); }, []);

  const fetchRankings = async (): Promise<void> => {
    setLoading(true);
    try {
      const url = filterMatch > 0 ? `/api/rankings?match=${filterMatch}` : '/api/rankings';
      const res = await fetch(url);
      const data = await res.json();
      setRankings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur:', error);
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRankings(); }, [filterMatch]);

  const getMedalIcon = (rank: number): JSX.Element => {
    switch (rank) {
      case 1: return <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-[#f8c741] flex items-center justify-center"><Trophy className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-[#292929]" /></div>;
      case 2: return <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center"><Medal className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-gray-600" /></div>;
      case 3: return <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-amber-600 flex items-center justify-center"><Award className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-white" /></div>;
      default: return <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs xs:text-sm">{rank}</div>;
    }
  };

  const sorted = [...rankings].sort((a, b) => {
    if (viewMode === 'kills') return (b.totalKills || b.total_kills || 0) - (a.totalKills || a.total_kills || 0);
    if (viewMode === 'booyah') return (b.totalBooyahs || b.total_booyahs || 0) - (a.totalBooyahs || a.total_booyahs || 0);
    return (b.totalPoints || b.total_points || 0) - (a.totalPoints || a.total_points || 0);
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin border-[#f8c741]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 xs:gap-4 px-2 xs:px-3 sm:px-4">
        <div>
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800">Classement Général</h2>
          <p className="text-xs xs:text-sm text-gray-500">Classement par points du tournoi</p>
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
            {/* Toggle vue */}
            <div className="flex rounded-lg xs:rounded-xl border-2 border-[#f8c741] overflow-hidden w-full sm:w-auto">
              {(['general', 'kills', 'booyah'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 sm:flex-none px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-[10px] xs:text-xs sm:text-sm font-medium transition-colors ${
                    viewMode === mode ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode === 'general' ? 'Général' : mode === 'kills' ? 'Kills' : 'Booyah 🐔'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtre par match */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4">
          <div className="flex gap-1 xs:gap-2 overflow-x-auto hide-scrollbar pb-2">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setFilterMatch(n)}
                className={`px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full font-medium transition-all whitespace-nowrap text-[10px] xs:text-xs sm:text-sm ${
                  filterMatch === n ? 'text-white bg-[#f8c741]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {n === 0 ? 'Tous' : `Match ${n}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* État vide */}
      {sorted.length === 0 && (
        <div className="text-center py-8 xs:py-10 sm:py-12 px-4">
          <Gamepad2 className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 mx-auto mb-3 xs:mb-4 text-gray-300" />
          <p className="text-sm xs:text-base text-gray-500">Aucun classement disponible</p>
          <p className="text-xs text-gray-400 mt-1">Ajoutez des points dans l'onglet "Points"</p>
        </div>
      )}

      {/* Tableau */}
      {sorted.length > 0 && (
        <div className="bg-white rounded-lg xs:rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-2 xs:mx-3 sm:mx-4">
          <div className="p-3 xs:p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800">
              {viewMode === 'general' && 'Classement général'}
              {viewMode === 'kills' && 'Classement par kills'}
              {viewMode === 'booyah' && 'Classement par Booyah 🐔'}
              {filterMatch > 0 && <span className="ml-2 text-[10px] xs:text-xs px-2 py-0.5 bg-[#f8c741]/20 text-[#f8c741] rounded-full">Match {filterMatch}</span>}
            </h3>
            <span className="text-[10px] xs:text-xs px-2 xs:px-3 py-1 bg-[#f8c741] rounded-full text-[#292929]">
              {sorted.length} équipes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] xs:min-w-[500px] sm:min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-left text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Rang</th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-left text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th>
                  <th className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Matchs</th>
                  <th className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {viewMode === 'general' ? 'Points' : viewMode === 'kills' ? 'Kills' : 'Booyah 🐔'}
                  </th>
                  {viewMode === 'general' && (
                    <>
                      <th className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Kills</th>
                      <th className="hidden md:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[8px] xs:text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Booyah</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sorted.map((team, index) => (
                  <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 xs:gap-2">
                        {getMedalIcon(index + 1)}
                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-900">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                      <div>
                        <p className="text-[10px] xs:text-xs sm:text-sm font-bold text-gray-900">{team.teamName || team.team_name}</p>
                        <p className="text-[8px] xs:text-[10px] text-gray-500">{team.teamTag || team.team_tag}</p>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[10px] xs:text-xs text-gray-600">
                      {team.matchesPlayed || team.matches_played || 0}
                    </td>
                    <td className="px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center">
                      <span className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-[#f8c741]">
                        {viewMode === 'kills'
                          ? (team.totalKills || team.total_kills || 0)
                          : viewMode === 'booyah'
                          ? (team.totalBooyahs || team.total_booyahs || 0)
                          : (team.totalPoints || team.total_points || 0)}
                      </span>
                    </td>
                    {viewMode === 'general' && (
                      <>
                        <td className="hidden sm:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[10px] xs:text-xs text-blue-600 font-medium">
                          {team.totalKills || team.total_kills || 0}
                        </td>
                        <td className="hidden md:table-cell px-2 xs:px-3 sm:px-4 md:px-6 py-2 xs:py-3 sm:py-4 text-center text-[10px] xs:text-xs text-green-600 font-medium">
                          {team.totalBooyahs || team.total_booyahs || 0} 🐔
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
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}