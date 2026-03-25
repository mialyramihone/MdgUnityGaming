'use client';

import { useState, useEffect } from 'react';
import { Trophy, ChevronDown, Clock, Award, Target, Gamepad2, Crown, Swords } from 'lucide-react';

interface MatchResult {
  id: number;
  teamName: string;
  matchNumber: number;
  mapName: string;
  position: number;
  kills: number;
  booyah: boolean;
  points: number;
  createdAt: string;
}

interface Ranking {
  id: number;
  teamName: string;
  teamTag: string;
  totalPoints: number;
  totalKills: number;
  totalBooyahs: number;
  matchesPlayed: number;
}

export default function Resultat() {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'matchs' | 'stats'>('matchs');
  const [filterMatch, setFilterMatch] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resultsRes, rankingsRes] = await Promise.all([
        fetch('/api/match-results'),
        fetch('/api/rankings')
      ]);
      const resultsData = await resultsRes.json();
      const rankingsData = await rankingsRes.json();
      setMatchResults(Array.isArray(resultsData) ? resultsData : []);
      setRankings(Array.isArray(rankingsData) ? rankingsData : []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = matchResults.filter(r => {
    if (filterMatch === 0) return true;
    return r.matchNumber === filterMatch;
  }).sort((a, b) => {
    if (a.matchNumber !== b.matchNumber) return a.matchNumber - b.matchNumber;
    return a.position - b.position;
  });

  const topTeam = rankings[0];
  const topKiller = [...rankings].sort((a, b) => b.totalKills - a.totalKills)[0];
  const totalMatches = matchResults.length;
  const totalKills = rankings.reduce((sum, r) => sum + r.totalKills, 0);
  const totalBooyahs = rankings.reduce((sum, r) => sum + r.totalBooyahs, 0);

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
            Free Fire • Résultats et statistiques
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
            <div className="flex rounded-lg border-2 border-[#f8c741] overflow-hidden w-full sm:w-auto">
              {(['matchs', 'stats'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                    viewMode === mode ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode === 'matchs' ? 'Matchs' : 'Stats'}
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
                {n === 0 ? 'Tous' : `Match ${n}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vue MATCHS */}
      {viewMode === 'matchs' && (
        <>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Aucun résultat disponible</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-4">
              <div className="p-4 border-b bg-gray-50/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#f8c741]" />
                  Historique des matchs
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredResults.map((result, idx) => (
                  <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 bg-[#f8c741]/10 text-[#f8c741] rounded-full font-medium">
                            Match {result.matchNumber} - {result.mapName}
                          </span>
                          {result.booyah && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                              <Crown className="w-3 h-3" /> Booyah
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-gray-900">{result.teamName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500">Position: #{result.position}</span>
                          <span className="text-sm text-blue-600 flex items-center gap-1">
                            <Swords className="w-3 h-3" /> {result.kills} kills
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#f8c741]">{result.points} pts</p>
                        <p className="text-xs text-gray-400">{new Date(result.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {viewMode === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
          {topTeam && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leader actuel</p>
                  <p className="text-xl font-bold text-gray-900">{topTeam.teamName}</p>
                  <p className="text-2xl font-bold text-[#f8c741] mt-1">{topTeam.totalPoints} points</p>
                </div>
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
            </div>
          )}

          {topKiller && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Killer</p>
                  <p className="text-xl font-bold text-gray-900">{topKiller.teamName}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{topKiller.totalKills} kills</p>
                </div>
                <Target className="w-12 h-12 text-blue-500" />
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 border shadow-sm md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="w-5 h-5 text-[#f8c741]" />
              <h3 className="font-semibold text-gray-800">Statistiques globales - Free Fire</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalMatches}</p>
                <p className="text-xs text-gray-500">Matchs joués</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{rankings.length}</p>
                <p className="text-xs text-gray-500">Équipes</p>
              </div>
             
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg mx-4 text-xs">
        <div className="flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-500" /> Vainqueur</div>
        <div className="flex items-center gap-1"><Crown className="w-3 h-3 text-green-500" /> Booyah</div>
        <div className="flex items-center gap-1"><Swords className="w-3 h-3 text-blue-500" /> Kills</div>
        <div className="flex items-center gap-1"><Target className="w-3 h-3 text-[#f8c741]" /> Points</div>
        <div className="flex items-center gap-1"><Gamepad2 className="w-3 h-3 text-gray-500" /> Free Fire</div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}