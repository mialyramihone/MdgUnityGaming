'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, ChevronDown, Users, Clock, Award, Target, 
  Gamepad2, Plus, Filter, X, Save, Eye, Trash2, MapPin, 
  Crown, Flame, Compass, Mountain, Cloud, Sun,
  Map, Swords, Layers, Edit, Check
} from 'lucide-react';

interface Team {
  id: number;
  teamName: string;
  teamTag?: string;
}

interface MatchResult {
  id: number;
  teamId: number;
  teamName: string;
  matchNumber: number;
  matchGroup: string;
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

const GROUPS = ['A', 'B', 'C', 'D'];
const MATCH_NUMBERS = [1, 2, 3];

export default function PointsManager() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formulaire
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedMatchNumber, setSelectedMatchNumber] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [mapName, setMapName] = useState(MAPS[0].name);
  const [position, setPosition] = useState('');
  const [kills, setKills] = useState(0);
  
  // Édition
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Filtres
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterMatchNumber, setFilterMatchNumber] = useState(0);
  const [filterMap, setFilterMap] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [viewMode, setViewMode] = useState<'matchs' | 'stats' | 'ajouter'>('matchs');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal
  const [selectedResult, setSelectedResult] = useState<MatchResult | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pointsRes = await fetch('/api/points');
      const pointsData = await pointsRes.json();
      setTeams(pointsData.teams || []);
      setRankings(pointsData.rankings || []);
      setMatchResults(pointsData.matchResults || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = matchResults.filter(r => {
    const groupOk = filterGroup === 'all' || r.matchGroup === filterGroup;
    const matchOk = filterMatchNumber === 0 || r.matchNumber === filterMatchNumber;
    const mapOk = filterMap === 'all' || r.mapName === filterMap;
    const teamOk = filterTeam === 'all' || r.teamName === filterTeam;
    return groupOk && matchOk && mapOk && teamOk;
  }).sort((a, b) => {
    if (a.matchGroup !== b.matchGroup) return a.matchGroup.localeCompare(b.matchGroup);
    if (a.matchNumber !== b.matchNumber) return a.matchNumber - b.matchNumber;
    return a.position - b.position;
  });

  const handleSubmit = async () => {
    if (!selectedGroup || !selectedTeam || !position) {
      alert('Veuillez sélectionner un groupe, une équipe et une position');
      return;
    }

    const pos = Number(position);
    const totalPoints = (POSITION_POINTS[pos] || 0) + kills;

    try {
      const url = isEditing ? `/api/points/${editingId}` : '/api/points';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: Number(selectedTeam),
          matchNumber: selectedMatchNumber,
          matchGroup: selectedGroup,
          mapName,
          position: pos,
          kills,
          booyah: pos === 1,
          points: totalPoints
        }),
      });

      if (res.ok) {
        alert(isEditing ? 'Résultat modifié !' : `Points ajoutés ! Total: ${totalPoints} pts`);
        fetchData();
        resetForm();
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

  const handleEdit = (result: MatchResult) => {
    setIsEditing(true);
    setEditingId(result.id);
    setSelectedGroup(result.matchGroup);
    setSelectedMatchNumber(result.matchNumber);
    setSelectedTeam(String(result.teamId));
    setMapName(result.mapName);
    setPosition(String(result.position));
    setKills(result.kills);
    setViewMode('ajouter');
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setSelectedGroup('');
    setSelectedMatchNumber(1);
    setSelectedTeam('');
    setMapName(MAPS[0].name);
    setPosition('');
    setKills(0);
  };

  const handleDeleteResult = async (resultId: number) => {
    if (!confirm('Supprimer ce résultat ?')) return;
    try {
      const res = await fetch(`/api/points/${resultId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Résultat supprimé');
        fetchData();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const totalMatches = matchResults.length;
  const totalTeams = rankings.length;
  const totalKills = rankings.reduce((sum, r) => sum + (r.totalKills || 0), 0);
  const totalBooyahs = matchResults.filter(r => r.booyah).length;
  const topPoints = rankings[0];
  const topKiller = [...rankings].sort((a, b) => b.totalKills - a.totalKills)[0];
  const topBooyah = [...rankings].sort((a, b) => b.totalBooyahs - a.totalBooyahs)[0];

  const getMapIcon = (mapName: string) => {
    const map = MAPS.find(m => m.name === mapName);
    const Icon = map?.icon || Map;
    return <Icon className={`w-4 h-4 ${map?.color || 'text-gray-500'}`} />;
  };

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 px-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#f8c741]" />
            Gestion des Points
          </h2>
          <p className="text-sm text-gray-500">Ajoutez ou modifiez des résultats par groupe et par match</p>
        </div>

        <div className="flex flex-col w-full lg:w-auto gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-between w-full px-4 py-2 border-2 border-[#f8c741] rounded-xl"
          >
            <span>Options</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex gap-2`}>
            <div className="flex rounded-lg border-2 border-[#f8c741] overflow-hidden">
              {(['matchs', 'stats', 'ajouter'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    if (mode !== 'ajouter') resetForm();
                    setViewMode(mode);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === mode ? 'bg-[#f8c741] text-[#292929]' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode === 'ajouter' && (isEditing ? <Edit className="w-4 h-4 inline mr-1" /> : <Plus className="w-4 h-4 inline mr-1" />)}
                  {mode === 'matchs' ? 'Matchs' : mode === 'stats' ? 'Stats' : (isEditing ? 'Modifier' : 'Ajouter')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtres pour la vue Matchs */}
      {viewMode === 'matchs' && (
        <div className="bg-white rounded-xl border p-4 mx-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Groupe</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                <button onClick={() => setFilterGroup('all')} className={`px-3 py-1 rounded-lg text-xs ${filterGroup === 'all' ? 'bg-[#f8c741] text-white' : 'bg-gray-100'}`}>Tous</button>
                {GROUPS.map(g => (
                  <button key={g} onClick={() => setFilterGroup(g)} className={`px-3 py-1 rounded-lg text-xs ${filterGroup === g ? 'bg-[#f8c741] text-white' : 'bg-gray-100'}`}>G{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Match</label>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setFilterMatchNumber(0)} className={`px-3 py-1 rounded-lg text-xs ${filterMatchNumber === 0 ? 'bg-[#f8c741] text-white' : 'bg-gray-100'}`}>Tous</button>
                {MATCH_NUMBERS.map(n => (
                  <button key={n} onClick={() => setFilterMatchNumber(n)} className={`px-3 py-1 rounded-lg text-xs ${filterMatchNumber === n ? 'bg-[#f8c741] text-white' : 'bg-gray-100'}`}>M{n}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Map</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                <button onClick={() => setFilterMap('all')} className={`px-3 py-1 rounded-lg text-xs ${filterMap === 'all' ? 'bg-[#f8c741] text-white' : 'bg-gray-100'}`}>Toutes</button>
                {MAPS.map(m => (
                  <button key={m.name} onClick={() => setFilterMap(m.name)} className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 ${filterMap === m.name ? 'bg-[#f8c741] text-white' : 'bg-gray-100'}`}>
                    {m.name === 'Bermuda' && <MapPin className="w-3 h-3" />}
                    {m.name === 'Purgatory' && <Flame className="w-3 h-3" />}
                    {m.name === 'Kalahari' && <Compass className="w-3 h-3" />}
                    {m.name === 'NeXTerra' && <Mountain className="w-3 h-3" />}
                    {m.name === 'Solara' && <Sun className="w-3 h-3" />}
                    {m.name === 'Alpine' && <Cloud className="w-3 h-3" />}
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Équipe</label>
              <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} className="w-full mt-1 px-3 py-1 rounded-lg border text-sm">
                <option value="all">Toutes les équipes</option>
                {teams.map(t => <option key={t.id} value={t.teamName}>{t.teamName}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Vue Matchs */}
      {viewMode === 'matchs' && (
        <div className="bg-white rounded-xl shadow-lg border mx-4">
          <div className="p-4 border-b flex justify-between items-center flex-wrap gap-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#f8c741]" />
              Historique des matchs
              {filterMap !== 'all' && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">{filterMap}</span>}
            </h3>
            <span className="text-xs px-2 py-1 bg-[#f8c741] rounded-full">{filteredResults.length} résultats</span>
          </div>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 className="w-12 h-12 mx-auto text-gray-300" />
              <p className="text-gray-500 mt-2">Aucun résultat</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredResults.map((result, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${groupColors[result.matchGroup]}`}>Groupe {result.matchGroup}</span>
                        <span className="text-xs px-2 py-1 bg-[#f8c741]/10 rounded-full">Match {result.matchNumber}</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full flex items-center gap-1">
                          {getMapIcon(result.mapName)}
                          {result.mapName}
                        </span>
                        {result.booyah && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"><Crown className="w-3 h-3 inline" /> Booyah</span>}
                      </div>
                      <p className="font-semibold">{result.teamName}</p>
                      <div className="flex gap-3 mt-1 text-sm">
                        <span>Position: #{result.position}</span>
                        <span className="text-blue-600">{result.kills} kills</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#f8c741]">{result.points} pts</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { setSelectedResult(result); setShowDetailModal(true); }} className="p-1 hover:text-[#f8c741]"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEdit(result)} className="p-1 hover:text-blue-500"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteResult(result.id)} className="p-1 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vue Stats */}
      {viewMode === 'stats' && (
        <div className="space-y-4 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <div className="text-center"><Gamepad2 className="w-6 h-6 mx-auto text-purple-500" /><p className="text-2xl font-bold">{totalMatches}</p><p className="text-xs">Matchs</p></div>
            <div className="text-center"><Users className="w-6 h-6 mx-auto text-blue-500" /><p className="text-2xl font-bold">{totalTeams}</p><p className="text-xs">Équipes</p></div>
            <div className="text-center"><Crown className="w-6 h-6 mx-auto text-green-500" /><p className="text-2xl font-bold">{totalBooyahs}</p><p className="text-xs">Booyahs</p></div>
            <div className="text-center"><Target className="w-6 h-6 mx-auto text-red-500" /><p className="text-2xl font-bold">{totalKills}</p><p className="text-xs">Kills</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border"><div className="flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-500" /><h3 className="font-semibold">Leader Points</h3></div><p className="text-lg font-bold">{topPoints?.teamName || '—'}</p><p className="text-sm text-[#f8c741]">{topPoints?.totalPoints || 0} pts</p></div>
            <div className="bg-white rounded-xl p-4 shadow-lg border"><div className="flex items-center gap-2"><Target className="w-5 h-5 text-blue-600" /><h3 className="font-semibold">Top Killer</h3></div><p className="text-lg font-bold">{topKiller?.teamName || '—'}</p><p className="text-sm text-blue-600">{topKiller?.totalKills || 0} kills</p></div>
            <div className="bg-white rounded-xl p-4 shadow-lg border"><div className="flex items-center gap-2"><Award className="w-5 h-5 text-green-600" /><h3 className="font-semibold">Top Booyah</h3></div><p className="text-lg font-bold">{topBooyah?.teamName || '—'}</p><p className="text-sm text-green-600">{topBooyah?.totalBooyahs || 0} booyahs</p></div>
          </div>
        </div>
      )}

      {/* Vue Ajouter/Modifier */}
      {viewMode === 'ajouter' && (
        <div className="bg-white rounded-xl shadow-lg border mx-4">
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              {isEditing ? <Edit className="w-5 h-5 text-[#f8c741]" /> : <Plus className="w-5 h-5 text-[#f8c741]" />}
              {isEditing ? 'Modifier le résultat' : 'Enregistrer un résultat'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Groupe *</label>
                <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="w-full px-4 py-2 border-2 rounded-lg">
                  <option value="">Sélectionner...</option>
                  {GROUPS.map(g => <option key={g} value={g}>Groupe {g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Match *</label>
                <select value={selectedMatchNumber} onChange={(e) => setSelectedMatchNumber(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg">
                  {MATCH_NUMBERS.map(n => <option key={n} value={n}>Match {n}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">{selectedGroup && `Groupe ${selectedGroup} - Match ${selectedMatchNumber}`}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Équipe *</label>
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="w-full px-4 py-2 border-2 rounded-lg">
                  <option value="">Choisir une équipe...</option>
                  {teams.length === 0 ? (
                    <option disabled>Aucune équipe disponible</option>
                  ) : (
                    teams.map(t => <option key={t.id} value={t.id}>{t.teamName}</option>)
                  )}
                </select>
                {teams.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Aucune équipe trouvée. Vérifiez la base de données.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Map</label>
                <select value={mapName} onChange={(e) => setMapName(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  {MAPS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position *</label>
                <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full px-4 py-2 border-2 rounded-lg">
                  <option value="">Choisir...</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(p => <option key={p} value={p}>{p === 1 ? '🏆 1ère place (Booyah)' : `${p}ème place`}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kills</label>
                <input type="number" value={kills} onChange={(e) => setKills(Number(e.target.value))} min="0" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              {position && (
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between"><span>Points :</span><span className="text-2xl font-bold text-[#f8c741]">{(POSITION_POINTS[Number(position)] || 0) + kills} pts</span></div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="flex-1 py-3 bg-[#f8c741] rounded-lg font-bold hover:bg-[#e5b53a] flex items-center justify-center gap-2">
                {isEditing ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {isEditing ? 'Modifier' : 'Enregistrer'}
              </button>
              {isEditing && (
                <button onClick={() => { resetForm(); setViewMode('matchs'); }} className="px-6 py-3 bg-gray-200 rounded-lg font-bold hover:bg-gray-300">
                  Annuler
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showDetailModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between mb-4"><h3 className="font-bold">Détails</h3><button onClick={() => setShowDetailModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-2">
              <p><strong>Équipe:</strong> {selectedResult.teamName}</p>
              <p><strong>Groupe:</strong> {selectedResult.matchGroup}</p>
              <p><strong>Match:</strong> {selectedResult.matchNumber}</p>
              <p><strong>Map:</strong> {selectedResult.mapName}</p>
              <p><strong>Position:</strong> #{selectedResult.position}</p>
              <p><strong>Kills:</strong> {selectedResult.kills}</p>
              <p><strong>Booyah:</strong> {selectedResult.booyah ? 'Oui' : 'Non'}</p>
              <p><strong>Points:</strong> <span className="text-xl font-bold text-[#f8c741]">{selectedResult.points}</span></p>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowDetailModal(false); handleEdit(selectedResult); }} className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" /> Modifier
              </button>
              <button onClick={() => handleDeleteResult(selectedResult.id)} className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}