'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, ChevronDown, Gamepad2, Crown, Swords, Layers } from 'lucide-react';

interface Ranking {
  id: number;
  teamName: string;
  teamTag: string;
  totalPoints: number;
  totalKills: number;
  totalBooyahs: number;
  matchesPlayed: number;
}

export default function Classement() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'general' | 'kills' | 'booyah'>('general');
  const [filterMatch, setFilterMatch] = useState<number>(0);
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterMatch > 0) {
        params.append('match', filterMatch.toString());
      }
      if (filterGroup !== 'all') {
        params.append('group', filterGroup);
      }
      
      const url = `/api/rankings${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching rankings from:', url);
      
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

  useEffect(() => {
    fetchRankings();
  }, [filterMatch, filterGroup]);

  const getMedalIcon = (rank: number) => {
    switch(rank) {
      case 1: return <div className="w-8 h-8 rounded-full bg-[#f8c741] flex items-center justify-center"><Crown className="w-4 h-4 text-[#292929]" /></div>;
      case 2: return <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"><Medal className="w-4 h-4 text-gray-600" /></div>;
      case 3: return <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center"><Award className="w-4 h-4 text-white" /></div>;
      default: return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">{rank}</div>;
    }
  };

  const sortedRankings = [...rankings].sort((a, b) => {
    if (viewMode === 'kills') return b.totalKills - a.totalKills;
    if (viewMode === 'booyah') return b.totalBooyahs - a.totalBooyahs;
    return b.totalPoints - a.totalPoints;
  });

  const groupColors: Record<string, string> = {
    'A': 'bg-red-100 text-red-600',
    'B': 'bg-blue-100 text-blue-600',
    'C': 'bg-green-100 text-green-600',
    'D': 'bg-purple-100 text-purple-600'
  };

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
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800">
            The Tournament Saison 4
          </h2>
          <p className="text-xs xs:text-sm text-gray-500">
            Free Fire • Classement 
            {filterGroup !== 'all' && ` Groupe ${filterGroup}`}
            {filterMatch > 0 && ` - Match ${filterMatch}`}
            {filterGroup === 'all' && filterMatch === 0 && ' général'}
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
            {/* Filtre groupe */}
            <div className="flex rounded-lg border-2 border-[#f8c741] overflow-hidden">
              <button
                onClick={() => setFilterGroup('all')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterGroup === 'all' ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tous
              </button>
              {['A', 'B', 'C', 'D'].map(group => (
                <button
                  key={group}
                  onClick={() => setFilterGroup(group)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    filterGroup === group ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Groupe {group}
                </button>
              ))}
            </div>

            <div className="flex rounded-lg border-2 border-[#f8c741] overflow-hidden">
              {(['general', 'kills', 'booyah'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === mode ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode === 'general' ? 'Points' : mode === 'kills' ? 'Kills' : 'Booyah'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtre par match */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setFilterMatch(n)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                  filterMatch === n ? 'text-white bg-[#f8c741]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {n === 0 ? 'Tous les matchs' : `Match ${n}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau */}
      {sortedRankings.length === 0 ? (
        <div className="text-center py-12 px-4">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">
            {filterGroup !== 'all' && filterMatch === 0 && `Aucune donnée pour le groupe ${filterGroup}`}
            {filterGroup === 'all' && filterMatch > 0 && `Aucune donnée pour le match ${filterMatch}`}
            {filterGroup !== 'all' && filterMatch > 0 && `Aucune donnée pour le groupe ${filterGroup} - match ${filterMatch}`}
            {filterGroup === 'all' && filterMatch === 0 && 'Aucun classement disponible'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Ajoutez des points dans l'onglet "Résultats"</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-4">
          <div className="p-4 border-b bg-gray-50/50">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#f8c741]" />
              Classement {viewMode === 'general' ? 'par points' : viewMode === 'kills' ? 'par kills' : 'par booyahs'}
              {filterMatch > 0 && <span className="ml-2 text-xs px-2 py-0.5 bg-[#f8c741]/20 text-[#f8c741] rounded-full">Match {filterMatch}</span>}
              {filterGroup !== 'all' && <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">Groupe {filterGroup}</span>}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Rang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Équipe</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Matchs</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">
                    {viewMode === 'general' ? 'Points' : viewMode === 'kills' ? 'Kills' : 'Booyah'}
                  </th>
                  {viewMode === 'general' && (
                    <>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Kills</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Booyah</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedRankings.map((team, index) => (
                  <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getMedalIcon(index + 1)}
                        <span className="font-medium text-gray-900">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{team.teamName}</p>
                      <p className="text-xs text-gray-500">{team.teamTag}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{team.matchesPlayed}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xl font-bold text-[#f8c741]">
                        {viewMode === 'general' ? team.totalPoints : viewMode === 'kills' ? team.totalKills : team.totalBooyahs}
                      </span>
                    </td>
                    {viewMode === 'general' && (
                      <>
                        <td className="px-4 py-3 text-center text-blue-600 font-medium">{team.totalKills}</td>
                        <td className="px-4 py-3 text-center text-green-600 font-medium">{team.totalBooyahs}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg mx-4 text-xs">
        <div className="flex items-center gap-1"><Crown className="w-3 h-3 text-yellow-500" /> 1er</div>
        <div className="flex items-center gap-1"><Medal className="w-3 h-3 text-gray-400" /> 2ème</div>
        <div className="flex items-center gap-1"><Award className="w-3 h-3 text-amber-600" /> 3ème</div>
        <div className="flex items-center gap-1"><Swords className="w-3 h-3 text-blue-500" /> Kills</div>
        <div className="flex items-center gap-1"><Crown className="w-3 h-3 text-green-500" /> Booyah</div>
        <div className="flex items-center gap-1"><Layers className="w-3 h-3 text-purple-500" /> Groupes</div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}