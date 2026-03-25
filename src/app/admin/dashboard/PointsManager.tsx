'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, ChevronDown, Users, Clock, Award, Target, 
  Gamepad2, Plus, Filter, X, Save, TrendingUp, 
  Medal, Calendar, Star, Eye, Trash2, MapPin, 
  Skull, Crown, Flame, Compass, Mountain, Cloud, 
  Sun, Wind, Leaf, Droplets, Heart, Zap,
  Map, Swords, Shield
} from 'lucide-react';

interface Team {
  id: number;
  teamName: string;
  team_name?: string;
  teamTag?: string;
  team_tag?: string;
}

interface Ranking {
  id: number;
  teamId: number;
  teamName: string;
  teamTag: string;
  totalPoints: number;
  totalKills: number;
  totalBooyahs: number;
  matchesPlayed: number;
}

interface MatchResult {
  id: number;
  teamId: number;
  teamName: string;
  matchNumber: number;
  mapName: string;
  position: number;
  kills: number;
  booyah: boolean;
  points: number;
  createdAt: string;
}


const MAPS = [
  { name: 'Bermuda', icon: MapPin, color: 'text-emerald-500' },
  { name: 'Purgatory', icon: Flame, color: 'text-orange-500' },
  { name: 'Kalahari', icon: Compass, color: 'text-amber-600' },
  { name: 'NeXTerra', icon: Mountain, color: 'text-indigo-500' },
  { name: 'Solara', icon: Sun, color: 'text-yellow-500' },
  { name: 'Alpine', icon: Cloud, color: 'text-sky-500' }
];

const POSITION_POINTS: Record<number, number> = {
  1: 12, 2: 9, 3: 8, 4: 7, 5: 6,
  6: 5, 7: 4, 8: 3, 9: 2, 10: 1,
  11: 0, 12: 0
};

export default function PointsManager() {
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [matchNumber, setMatchNumber] = useState<number>(1);
  const [mapName, setMapName] = useState<string>(MAPS[0].name);
  const [position, setPosition] = useState<string>('');
  const [kills, setKills] = useState<number>(0);
  
  
  const [filterMatch, setFilterMatch] = useState<number>(0);
  const [filterMap, setFilterMap] = useState<string>('all');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'matchs' | 'stats' | 'ajouter'>('matchs');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  
  const [selectedResult, setSelectedResult] = useState<MatchResult | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    try {
      const teamsRes = await fetch('/api/teams-with-players');
      const teamsData = await teamsRes.json();
      if (Array.isArray(teamsData)) {
        setTeams(teamsData);
      }

      const rankingsRes = await fetch('/api/rankings');
      const rankingsData = await rankingsRes.json();
      setRankings(rankingsData);

      const matchResultsRes = await fetch('/api/match-results');
      const matchResultsData = await matchResultsRes.json();
      setMatchResults(matchResultsData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedTeam || !position) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const booyah = position === '1';
    const positionPoints = POSITION_POINTS[Number(position)] || 0;
    const killPoints = kills * 1;
    const totalPoints = positionPoints + killPoints + (booyah ? 2 : 0);

    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: Number(selectedTeam),
          matchNumber,
          mapName,
          position: Number(position),
          kills,
          booyah,
          points: totalPoints
        }),
      });

      if (res.ok) {
        alert(`Points ajoutés ! Total: ${totalPoints} pts`);
        fetchData();
        setSelectedTeam('');
        setPosition('');
        setKills(0);
        setViewMode('matchs');
      } else {
        const error = await res.json();
        alert('Erreur: ' + (error.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    }
  };

  const handleDeleteResult = async (resultId: number): Promise<void> => {
    if (!confirm('Supprimer ce résultat ?')) return;
    
    try {
      const res = await fetch(`/api/match-results?id=${resultId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Résultat supprimé');
        fetchData();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  
const filteredResults = matchResults.filter(r => {
  const matchOk = filterMatch === 0 || r.matchNumber === filterMatch;
  const mapOk = filterMap === 'all' || r.mapName === filterMap;
  const teamOk = filterTeam === 'all' || r.teamName === filterTeam;
  return matchOk && mapOk && teamOk;
}).sort((a, b) => {
  if (a.matchNumber !== b.matchNumber) return a.matchNumber - b.matchNumber;
  const mapOrderA = MAPS.findIndex(m => m.name === a.mapName);
  const mapOrderB = MAPS.findIndex(m => m.name === b.mapName);
  if (mapOrderA !== mapOrderB) return mapOrderA - mapOrderB;
  return a.position - b.position;
});


useEffect(() => {
  console.log('MatchResults:', matchResults);
  console.log('FilteredResults:', filteredResults);
}, [matchResults, filterMatch, filterMap, filterTeam]);


  const totalMatches = matchResults.length;
  const totalTeams = rankings.length;
  const totalKills = rankings.reduce((sum, r) => sum + (r.totalKills || 0), 0);
  const totalBooyahs = matchResults.filter(r => r.booyah).length;
  
  const topPoints = [...rankings].sort((a, b) => b.totalPoints - a.totalPoints)[0];
  const topKiller = [...rankings].sort((a, b) => b.totalKills - a.totalKills)[0];
  const topBooyah = [...rankings].sort((a, b) => b.totalBooyahs - a.totalBooyahs)[0];

  const getMedalIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="w-4 h-4 text-yellow-500" />;
      case 2: return <Medal className="w-4 h-4 text-gray-400" />;
      case 3: return <Medal className="w-4 h-4 text-amber-600" />;
      default: return <span className="text-xs font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getMapIcon = (mapName: string) => {
    const map = MAPS.find(m => m.name === mapName);
    const IconComponent = map?.icon || Map;
    return <IconComponent className={`w-4 h-4 ${map?.color || 'text-gray-500'}`} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin border-[#f8c741]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 px-2 sm:px-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#f8c741]" />
            Gestion des Points
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Ajoutez des résultats et consultez les statistiques
          </p>
        </div>

        <div className="flex flex-col w-full lg:w-auto gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between w-full px-4 py-2 border-2 border-[#f8c741] rounded-xl text-sm"
          >
            <span>Options</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col sm:flex-row lg:items-center gap-2 sm:gap-3`}>
            <div className="flex rounded-lg border-2 border-[#f8c741] overflow-hidden w-full sm:w-auto">
              {(['matchs', 'stats', 'ajouter'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 justify-center ${
                    viewMode === mode 
                      ? 'bg-[#f8c741] text-[#292929]' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode === 'ajouter' && <Plus className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {mode === 'matchs' ? 'Matchs' : mode === 'stats' ? 'Stats' : 'Ajouter'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtres pour la vue Matchs */}
      {viewMode === 'matchs' && (
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mx-2 sm:mx-0">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filtre par match */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Match</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setFilterMatch(0)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    filterMatch === 0 ? 'bg-[#f8c741] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => setFilterMatch(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                      filterMatch === n ? 'bg-[#f8c741] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Match {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtre par map */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Map</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setFilterMap('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    filterMap === 'all' ? 'bg-[#f8c741] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Toutes
                </button>
                {MAPS.map(map => {
                  const IconComponent = map.icon;
                  return (
                    <button
                      key={map.name}
                      onClick={() => setFilterMap(map.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
                        filterMap === map.name ? 'bg-[#f8c741] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="w-3 h-3" />
                      {map.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtre par équipe */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Équipe</label>
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-[#f8c741] focus:outline-none"
              >
                <option value="all">Toutes les équipes</option>
                {teams.map(team => (
                  <option key={team.id} value={team.teamName || team.team_name}>
                    {team.teamName || team.team_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Vue MATCHS - Tableau des résultats */}
        {viewMode === 'matchs' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-2 sm:mx-0">
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2 text-gray-800">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#f8c741]" />
                Historique des matchs
              </h3>
              <span className="text-xs px-2 py-1 bg-[#f8c741] rounded-full text-[#292929]">
                {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''}
              </span>
            </div>

            {filteredResults.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Gamepad2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Aucun résultat pour ces filtres</p>
                <button
                  onClick={() => setViewMode('ajouter')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#f8c741] text-[#292929] rounded-full text-xs font-semibold hover:bg-[#e5b53a]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter un résultat
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Équipe</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Match</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Map</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Place</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Kills</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Booyah</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Points</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredResults.map((result, index) => {
                      const mapIcon = getMapIcon(result.mapName);
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-4 py-3">
                            <p className="text-sm font-semibold text-gray-900">{result.teamName}</p>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center">
                            <span className="text-xs px-2 py-1 bg-[#f8c741]/10 text-[#f8c741] rounded-full font-medium">
                              M{result.matchNumber}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {mapIcon}
                              <span className="text-xs text-gray-600">{result.mapName}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center">
                            <div className={`flex items-center justify-center gap-1 ${
                              result.position === 1 ? 'text-[#f8c741]' : 'text-gray-700'
                            }`}>
                              {result.position === 1 && <Crown className="w-3 h-3" />}
                              <span className="text-sm font-bold">#{result.position}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Swords className="w-3 h-3 text-blue-500" />
                              <span className="text-sm text-blue-600 font-medium">{result.kills}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center">
                            {result.booyah ? (
                              <div className="flex items-center justify-center gap-1">
                                <Crown className="w-3 h-3 text-green-600" />
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                  Booyah
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center">
                            <span className="text-base font-bold text-[#f8c741]">{result.points}</span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedResult(result);
                                  setShowDetailModal(true);
                                }}
                                className="p-1 hover:text-[#f8c741] transition-colors"
                                title="Voir détails"
                              >
                                <Eye className="w-4 h-4 text-gray-400 hover:text-[#f8c741]" />
                              </button>
                              <button
                                onClick={() => handleDeleteResult(result.id)}
                                className="p-1 hover:text-red-500 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      {/* Vue STATS */}
      {viewMode === 'stats' && (
        <div className="space-y-4 px-2 sm:px-0">
          {/* Stats globales */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <Gamepad2 className="w-6 h-6 mx-auto text-purple-500 mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{totalMatches}</p>
                <p className="text-xs text-gray-500">Matchs joués</p>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{totalTeams}</p>
                <p className="text-xs text-gray-500">Équipes</p>
              </div>
              
              <div className="text-center">
                <Crown className="w-6 h-6 mx-auto text-green-500 mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{totalBooyahs}</p>
                <p className="text-xs text-gray-500">Booyahs</p>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-700">Leader Points</h3>
              </div>
              <p className="text-lg font-bold text-gray-900">{topPoints?.teamName || '—'}</p>
              <p className="text-sm text-[#f8c741] font-semibold">{topPoints?.totalPoints || 0} points</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-700">Top Killer</h3>
              </div>
              <p className="text-lg font-bold text-gray-900">{topKiller?.teamName || '—'}</p>
              <p className="text-sm text-blue-600 font-semibold">{topKiller?.totalKills || 0} kills</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-700">Top Booyah</h3>
              </div>
              <p className="text-lg font-bold text-gray-900">{topBooyah?.teamName || '—'}</p>
              <p className="text-sm text-green-600 font-semibold">{topBooyah?.totalBooyahs || 0} booyahs</p>
            </div>
          </div>

         
        </div>
      )}

      {/* Vue AJOUTER */}
      {viewMode === 'ajouter' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mx-2 sm:mx-0">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#f8c741]" />
              Enregistrer un résultat
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Équipe */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipe *</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#f8c741] focus:outline-none"
                >
                  <option value="">Choisir une équipe...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.teamName || team.team_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Match */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Match</label>
                <select
                  value={matchNumber}
                  onChange={(e) => setMatchNumber(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#f8c741] focus:outline-none"
                >
                  {[1, 2, 3].map(n => <option key={n} value={n}>Match {n}</option>)}
                </select>
              </div>

              {/* Map */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Map</label>
                <select
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#f8c741] focus:outline-none"
                >
                  {MAPS.map(map => {
                    const IconComponent = map.icon;
                    return (
                      <option key={map.name} value={map.name}>
                        {map.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                  {position === '1' && <span className="ml-2 text-green-600 flex items-center gap-1"><Crown className="w-3 h-3" /> Booyah !</span>}
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none ${
                    position === '1' ? 'border-green-400 bg-green-50' : 'border-gray-200 focus:border-[#f8c741]'
                  }`}
                >
                  <option value="">Choisir...</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(p => (
                    <option key={p} value={p}>
                      {p === 1 ? '🏆 1ère place (Booyah)' : `${p}ème place`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kills</label>
                <input
                  type="number"
                  value={kills}
                  onChange={(e) => setKills(Number(e.target.value))}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#f8c741] focus:outline-none"
                />
              </div>

              {/* Aperçu des points */}
                {position && (
                  <div className="sm:col-span-2 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Aperçu des points :</span>
                      <span className="text-2xl font-bold text-[#f8c741]">
                        {(() => {
                          const posPoints = POSITION_POINTS[Number(position)] || 0;
                          const killPoints = kills * 1;
                          // PAS de bonus booyah
                          return posPoints + killPoints;
                        })()} pts
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                      {position && (
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>Position {position}: {POSITION_POINTS[Number(position)] || 0} pts</span>
                        </div>
                      )}
                      {kills > 0 && (
                        <div className="flex items-center gap-1">
                          <Swords className="w-3 h-3" />
                          <span>+ {kills} pts (kills)</span>
                        </div>
                      )}
                      {position === '1' && (
                        <div className="flex items-center gap-1 text-green-600 ml-2">
                          <Crown className="w-3 h-3" />
                          <span className="text-xs">Booyah comptabilisé pour départage (aucun point)</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#f8c741] text-[#292929] rounded-lg font-bold hover:bg-[#e5b53a] transition-colors"
            >
              <Save className="w-4 h-4" />
              Enregistrer les points
            </button>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showDetailModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#f8c741]" />
                Détails du résultat
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Équipe :</span>
                <span className="text-gray-900">{selectedResult.teamName}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Gamepad2 className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Match :</span>
                <span>Match {selectedResult.matchNumber}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                {getMapIcon(selectedResult.mapName)}
                <span className="font-medium">Map :</span>
                <span>{selectedResult.mapName}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Position :</span>
                <span className={`font-bold ${selectedResult.position === 1 ? 'text-[#f8c741]' : ''}`}>
                  #{selectedResult.position}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Swords className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Kills :</span>
                <span className="text-blue-600 font-semibold">{selectedResult.kills}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Crown className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Booyah :</span>
                {selectedResult.booyah ? (
                  <span className="text-green-600 font-semibold">Oui</span>
                ) : (
                  <span className="text-gray-400">Non</span>
                )}
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#f8c741]/10 rounded-lg">
                <Trophy className="w-4 h-4 text-[#f8c741]" />
                <span className="font-medium">Points :</span>
                <span className="text-xl font-bold text-[#f8c741]">{selectedResult.points}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Date :</span>
                <span className="text-xs">{new Date(selectedResult.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDeleteResult(selectedResult.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}