'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Trophy, Download, Search, 
  Trash2, CheckCircle, BarChart3,
  LogOut, Menu, Settings, Eye, Edit, Copy, 
  Save, X, 
  ChevronLeft, ChevronRight, Bell, Shield, Grid, Users2,
  Sparkles, Sword, CreditCard, User,
  Facebook, Gamepad2, Calendar, Clock
} from 'lucide-react';
import { Joueuse, Team } from '@/types/tournoi';

interface TeamWithDetails extends Team {
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  player3Id: string;
  player3Name: string;
  player4Id: string;
  player4Name: string;
  sub1Id: string;
  sub1Name: string;
  sub2Id: string;
  sub2Name: string;
}

type TournoiType = 'femina' | 'tournament';

export default function AdminDashboard() {
  const router = useRouter();
  const [joueuses, setJoueuses] = useState<Joueuse[]>([]);
  const [teams, setTeams] = useState<TeamWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTournoi, setSelectedTournoi] = useState<TournoiType>('femina');
  
  const [selectedJoueuse, setSelectedJoueuse] = useState<Joueuse | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamWithDetails | null>(null);
  const [showDetailCard, setShowDetailCard] = useState<boolean>(false);
  const [detailType, setDetailType] = useState<'individuel' | 'equipe'>('individuel');
  
  const [editingJoueuse, setEditingJoueuse] = useState<Joueuse | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    pseudo_ingame: '',
    pseudo_facebook: '',
    pseudo_discord: '',
    handcam: ''
  });
  
  const [deleteConfirm, setDeleteConfirm] = useState<{type: 'individuel' | 'equipe', id: number} | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  
  const [currentPageFemina, setCurrentPageFemina] = useState<number>(1);
  const [currentPageTournament, setCurrentPageTournament] = useState<number>(1);
  const itemsPerPage: number = 10;

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async (): Promise<void> => {
    setLoading(true);
    try {
      const joueusesRes = await fetch('/api/joueuses');
      const joueusesData: Joueuse[] = await joueusesRes.json();
      if (Array.isArray(joueusesData)) {
        setJoueuses(joueusesData);
      }

      const teamsRes = await fetch('/api/teams-with-players');
      const teamsData: TeamWithDetails[] = await teamsRes.json();
      if (Array.isArray(teamsData)) {
        setTeams(teamsData);
      }
    } catch {
      console.error('Erreur chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (): void => {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    alert('Copié !');
  };

  const handleViewDetails = (type: 'individuel' | 'equipe', data: Joueuse | TeamWithDetails): void => {
    setDetailType(type);
    if (type === 'individuel') {
      setSelectedJoueuse(data as Joueuse);
    } else {
      setSelectedTeam(data as TeamWithDetails);
    }
    setShowDetailCard(true);
  };

  const handleEdit = (joueuse: Joueuse): void => {
    setEditingJoueuse(joueuse);
    setEditFormData({
      pseudo_ingame: joueuse.pseudo_ingame,
      pseudo_facebook: joueuse.pseudo_facebook,
      pseudo_discord: joueuse.pseudo_discord,
      handcam: joueuse.handcam
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingJoueuse) return;

    try {
      const updatedData = {
        compte_id: editingJoueuse.compte_id,
        pseudo_ingame: editFormData.pseudo_ingame,
        pseudo_facebook: editFormData.pseudo_facebook,
        pseudo_discord: editFormData.pseudo_discord,
        handcam: editFormData.handcam,
        tournoi_id: editingJoueuse.tournoi_id
      };

      const res = await fetch(`/api/joueuses/${editingJoueuse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditingJoueuse(null);
        await fetchAllData();
        alert('Modification réussie !');
      } else {
        const errorData = await res.json();
        alert(`Erreur: ${errorData.error || 'Erreur inconnue'}`);
      }
    } catch {
      console.error('Erreur lors de la modification');
      alert('Erreur de connexion');
    }
  };

  const handleDeleteTeam = async (teamId: number): Promise<void> => {
    try {
      const res = await fetch(`/api/teams/${teamId}`, { 
        method: 'DELETE' 
      });

      if (res.ok) {
        await fetchAllData();
        alert('Équipe supprimée avec succès !');
      } else {
        const errorData = await res.json();
        alert(`Erreur: ${errorData.error || 'Erreur inconnue'}`);
      }
    } catch {
      console.error('Erreur lors de la suppression');
      alert('Erreur de connexion');
    }
  };

  const handleExportCSV = (type: 'femina' | 'tournament'): void => {
    let headers: string[] = [];
    let csvData: string[][] = [];

    if (type === 'femina') {
      headers = ['ID Compte', 'Pseudo', 'Facebook', 'Discord', 'Handcam', 'Date'];
      csvData = joueusesFiltrees.map((j: Joueuse) => [
        j.compte_id,
        j.pseudo_ingame,
        j.pseudo_facebook,
        j.pseudo_discord,
        j.handcam,
        new Date(j.date_inscription).toLocaleDateString('fr-FR')
      ]);
    } else {
      headers = [
        'Code', 'Équipe', 'Tag', 'Capitaine', 'Lien FB',
        'Joueur 1 ID', 'Joueur 1 Pseudo',
        'Joueur 2 ID', 'Joueur 2 Pseudo',
        'Joueur 3 ID', 'Joueur 3 Pseudo',
        'Joueur 4 ID', 'Joueur 4 Pseudo',
        'Remplaçant 1 ID', 'Remplaçant 1 Pseudo',
        'Remplaçant 2 ID', 'Remplaçant 2 Pseudo',
        'Paiement', 'Référence', 'Date Paiement',
        'Règles acceptées', 'Décision acceptée', 'Date Inscription'
      ];
      
      csvData = teamsFiltrees.map((t: TeamWithDetails) => [
        t.registrationCode,
        t.teamName,
        t.teamTag || '',
        t.captainName,
        t.captainLink,
        t.player1Id || '',
        t.player1Name || '',
        t.player2Id || '',
        t.player2Name || '',
        t.player3Id || '',
        t.player3Name || '',
        t.player4Id || '',
        t.player4Name || '',
        t.sub1Id || '',
        t.sub1Name || '',
        t.sub2Id || '',
        t.sub2Name || '',
        t.paymentMethod,
        t.paymentRef,
        new Date(t.paymentDate).toLocaleDateString('fr-FR'),
        t.termsAccepted ? 'Oui' : 'Non',
        t.rulesAccepted ? 'Oui' : 'Non',
        new Date(t.createdAt).toLocaleDateString('fr-FR')
      ]);
    }

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const confirmDelete = (type: 'individuel' | 'equipe', id: number): void => {
    setDeleteConfirm({ type, id });
    setShowDeleteConfirm(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'individuel') {
      try {
        const res = await fetch(`/api/joueuses/${deleteConfirm.id}`, { 
          method: 'DELETE' 
        });

        if (res.ok) {
          setShowDeleteConfirm(false);
          setDeleteConfirm(null);
          await fetchAllData();
          alert('Suppression réussie !');
        } else {
          const errorData = await res.json();
          alert(`Erreur: ${errorData.error || 'Erreur inconnue'}`);
        }
      } catch {
        console.error('Erreur lors de la suppression');
        alert('Erreur de connexion');
      }
    } else {
      await handleDeleteTeam(deleteConfirm.id);
      setShowDeleteConfirm(false);
      setDeleteConfirm(null);
    }
  };

  const joueusesFiltrees: Joueuse[] = joueuses.filter((j: Joueuse) => {
    const matchesSearch = 
      j.compte_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.pseudo_ingame.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.pseudo_facebook.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.pseudo_discord.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTournoi = j.tournoi_id === 1;

    return matchesSearch && matchesTournoi;
  });

  const teamsFiltrees: TeamWithDetails[] = teams.filter((t: TeamWithDetails) => {
    const matchesSearch = 
      t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.captainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.registrationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.player1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.player2Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.player3Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.player4Name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTournoi = t.tournamentId === 2;

    return matchesSearch && matchesTournoi;
  });

  const totalPagesFemina: number = Math.ceil(joueusesFiltrees.length / itemsPerPage);
  const startIndexFemina: number = (currentPageFemina - 1) * itemsPerPage;
  const endIndexFemina: number = startIndexFemina + itemsPerPage;
  const joueusesPaginees = joueusesFiltrees.slice(startIndexFemina, endIndexFemina);

  const totalPagesTournament: number = Math.ceil(teamsFiltrees.length / itemsPerPage);
  const startIndexTournament: number = (currentPageTournament - 1) * itemsPerPage;
  const endIndexTournament: number = startIndexTournament + itemsPerPage;
  const teamsPaginees = teamsFiltrees.slice(startIndexTournament, endIndexTournament);

  const stats = {
    totalIndividuelles: joueuses.length,
    totalEquipes: teams.length,
    avecHandcam: joueuses.filter((j: Joueuse) => j.handcam === 'Oui').length,
    tournoi1: joueuses.filter((j: Joueuse) => j.tournoi_id === 1).length,
    tournoi2: teams.filter((t: TeamWithDetails) => t.tournamentId === 2).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 border-[#f8c741]"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#f8c741] rounded-lg flex items-center justify-center">
                  <Grid className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-800">Admin<span className="text-[#f8c741]">Panel</span></h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#f8c741] rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-gray-600" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
            <nav className="space-y-1">
              {[
                { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                { id: 'inscriptions', icon: Users, label: 'Inscriptions' },
                { id: 'tournois', icon: Trophy, label: 'Tournois' },
                { id: 'parametres', icon: Settings, label: 'Paramètres' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === item.id 
                        ? 'bg-[#f8c741] text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-[#f8c741]/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#f8c741]" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{stats.totalIndividuelles + stats.totalEquipes}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Inscriptions totales</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{stats.tournoi1}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Femina Esport (8 Mars)</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sword className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{stats.tournoi2}</span>
                  </div>
                  <p className="text-gray-500 text-sm">The Tournament S4 (23 Mars)</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{stats.avecHandcam}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Avec Handcam</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'inscriptions' && (
            <>
              {/* Barre de recherche commune */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les deux tournois..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-[#f8c741] focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Mini-navbar pour les tournois */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setSelectedTournoi('femina')}
                  className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                    selectedTournoi === 'femina' 
                      ? 'border-[#f8c741] text-[#f8c741]' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Tournoi Femina Esport 
                </button>
                <button
                  onClick={() => setSelectedTournoi('tournament')}
                  className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                    selectedTournoi === 'tournament' 
                      ? 'border-[#f8c741] text-[#f8c741]' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Sword className="w-4 h-4" />
                  The Tournament S4 
                </button>
              </div>

              {/* Tableau Tournoi Femina */}
              {selectedTournoi === 'femina' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Inscriptions individuelles • <span className="text-[#f8c741]">{joueusesFiltrees.length}</span>
                    </h2>
                    <button
                      onClick={() => handleExportCSV('femina')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-[#f8c741] text-white hover:bg-[#e5b53a] transition-colors shadow-sm text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>

                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-blue-50 border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">ID Compte</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Pseudo</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Facebook</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Discord</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Handcam</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {joueusesPaginees.map((joueuse) => (
                            <tr 
                              key={joueuse.id}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-3 px-4 font-mono text-sm text-gray-700">{joueuse.compte_id}</td>
                              <td className="py-3 px-4 font-medium text-gray-800">{joueuse.pseudo_ingame}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">{joueuse.pseudo_facebook}</span>
                                  <button
                                    onClick={() => copyToClipboard(joueuse.pseudo_facebook)}
                                    className="p-1 hover:text-[#f8c741]"
                                  >
                                    <Copy className="w-3 h-3 text-gray-400" />
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{joueuse.pseudo_discord}</td>
                              <td className="py-3 px-4">
                                {joueuse.handcam === 'Oui' ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {new Date(joueuse.date_inscription).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewDetails('individuel', joueuse)}
                                    className="p-1 hover:text-[#f8c741] transition-colors"
                                    title="Voir détails"
                                  >
                                    <Eye className="w-4 h-4 text-gray-400 hover:text-[#f8c741]" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(joueuse)}
                                    className="p-1 hover:text-[#f8c741] transition-colors"
                                    title="Modifier"
                                  >
                                    <Edit className="w-4 h-4 text-gray-400 hover:text-[#f8c741]" />
                                  </button>
                                  <button
                                    onClick={() => confirmDelete('individuel', joueuse.id)}
                                    className="p-1 hover:text-red-500 transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Femina */}
                    {totalPagesFemina > 1 && (
                      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-600">
                          Affichage {startIndexFemina + 1} à {Math.min(endIndexFemina, joueusesFiltrees.length)} sur {joueusesFiltrees.length}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentPageFemina(p => Math.max(1, p - 1))}
                            disabled={currentPageFemina === 1}
                            className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 rounded-lg bg-[#f8c741] text-white font-medium">
                            {currentPageFemina} / {totalPagesFemina}
                          </span>
                          <button
                            onClick={() => setCurrentPageFemina(p => Math.min(totalPagesFemina, p + 1))}
                            disabled={currentPageFemina === totalPagesFemina}
                            className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tableau The Tournament avec toutes les informations */}
              {selectedTournoi === 'tournament' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Équipes inscrites • <span className="text-[#f8c741]">{teamsFiltrees.length}</span>
                    </h2>
                    <button
                      onClick={() => handleExportCSV('tournament')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-[#f8c741] text-white hover:bg-[#e5b53a] transition-colors shadow-sm text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>

                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-purple-50 border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Code</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Équipe</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Tag</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Capitaine</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">J1 ID</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">J1 Pseudo</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">J2 ID</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">J2 Pseudo</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">J3 ID</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">J3 Pseudo</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">J4 ID</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">J4 Pseudo</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">R1 ID</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">R1 Pseudo</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">R2 ID</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">R2 Pseudo</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Paiement</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Réf</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Date Pmt</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Règles</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Décision</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Date Insc</th>
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamsPaginees.map((team) => (
                            <tr 
                              key={team.id}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-3 px-4 font-mono text-xs text-gray-500">{team.registrationCode}</td>
                              <td className="py-3 px-4 font-medium text-gray-800">{team.teamName}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{team.teamTag || '—'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{team.captainName}</td>
                              <td className="py-3 px-4 text-xs font-mono text-gray-500">{team.player1Id || '—'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{team.player1Name || '—'}</td>
                              <td className="py-3 px-4 text-xs font-mono text-gray-500">{team.player2Id || '—'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{team.player2Name || '—'}</td>
                              <td className="py-3 px-4 text-xs font-mono text-gray-500">{team.player3Id || '—'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{team.player3Name || '—'}</td>
                              <td className="py-3 px-4 text-xs font-mono text-gray-500">{team.player4Id || '—'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{team.player4Name || '—'}</td>
                              <td className="py-3 px-4 text-xs font-mono text-gray-500">{team.sub1Id || '—'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{team.sub1Name || '—'}</td>
                              <td className="py-3 px-4 text-xs font-mono text-gray-500">{team.sub2Id || '—'}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{team.sub2Name || '—'}</td>
                              <td className="py-3 px-4">
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                                  {team.paymentMethod}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm font-mono text-gray-600">{team.paymentRef}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {new Date(team.paymentDate).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {team.termsAccepted ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {team.rulesAccepted ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {new Date(team.createdAt).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewDetails('equipe', team)}
                                    className="p-1 hover:text-[#f8c741] transition-colors"
                                    title="Voir détails"
                                  >
                                    <Eye className="w-4 h-4 text-gray-400 hover:text-[#f8c741]" />
                                  </button>
                                  <button
                                    onClick={() => confirmDelete('equipe', team.id)}
                                    className="p-1 hover:text-red-500 transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Tournament */}
                    {totalPagesTournament > 1 && (
                      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-600">
                          Affichage {startIndexTournament + 1} à {Math.min(endIndexTournament, teamsFiltrees.length)} sur {teamsFiltrees.length}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentPageTournament(p => Math.max(1, p - 1))}
                            disabled={currentPageTournament === 1}
                            className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 rounded-lg bg-[#f8c741] text-white font-medium">
                            {currentPageTournament} / {totalPagesTournament}
                          </span>
                          <button
                            onClick={() => setCurrentPageTournament(p => Math.min(totalPagesTournament, p + 1))}
                            disabled={currentPageTournament === totalPagesTournament}
                            className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals de détail pour Femina */}
      {showDetailCard && detailType === 'individuel' && selectedJoueuse && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border-2 border-[#f8c741]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-[#f8c741]" />
                Détails inscription
              </h2>
              <button
                onClick={() => setShowDetailCard(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">ID Compte</p>
                  <p className="font-mono font-medium text-gray-800">{selectedJoueuse.compte_id}</p>
                </div>
                <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Pseudo In Game</p>
                  <p className="font-medium text-gray-800">{selectedJoueuse.pseudo_ingame}</p>
                </div>
                <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Facebook</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">{selectedJoueuse.pseudo_facebook}</p>
                    <button
                      onClick={() => copyToClipboard(selectedJoueuse.pseudo_facebook)}
                      className="p-1 hover:text-[#f8c741]"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Discord</p>
                  <p className="font-medium text-gray-800">{selectedJoueuse.pseudo_discord}</p>
                </div>
                <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Handcam</p>
                  <p className="font-medium text-gray-800">{selectedJoueuse.handcam}</p>
                </div>
                <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Date d&apos;inscription</p>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedJoueuse.date_inscription).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailCard(false)}
                className="px-6 py-2 rounded-lg font-medium bg-[#f8c741] text-white hover:bg-[#e5b53a]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals de détail pour Tournament */}
      {showDetailCard && detailType === 'equipe' && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border-2 border-[#f8c741] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users2 className="w-5 h-5 text-[#f8c741]" />
                Détails équipe
              </h2>
              <button
                onClick={() => setShowDetailCard(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* En-tête avec code et équipe */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 p-4 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-purple-600 mb-1">Équipe</p>
                      <p className="font-bold text-gray-800 text-lg">{selectedTeam.teamName}</p>
                      {selectedTeam.teamTag && (
                        <p className="text-sm text-gray-500">Tag: {selectedTeam.teamTag}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-purple-600 mb-1">Code d'inscription</p>
                      <p className="font-mono font-bold text-gray-800">{selectedTeam.registrationCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capitaine */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#f8c741]" />
                  Capitaine
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-800">{selectedTeam.captainName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600 break-all">{selectedTeam.captainLink}</span>
                    <button
                      onClick={() => copyToClipboard(selectedTeam.captainLink)}
                      className="p-1 hover:text-[#f8c741] shrink-0"
                      title="Copier le lien"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Joueurs titulaires */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-[#f8c741]" />
                  Joueurs titulaires
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: selectedTeam.player1Id, name: selectedTeam.player1Name, num: 1 },
                    { id: selectedTeam.player2Id, name: selectedTeam.player2Name, num: 2 },
                    { id: selectedTeam.player3Id, name: selectedTeam.player3Name, num: 3 },
                    { id: selectedTeam.player4Id, name: selectedTeam.player4Name, num: 4 },
                  ].map((joueur, idx) => joueur.name && (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold bg-[#f8c741] text-white w-5 h-5 rounded-full flex items-center justify-center">
                          {joueur.num}
                        </span>
                        <span className="font-medium text-gray-800">{joueur.name}</span>
                      </div>
                      {joueur.id && (
                        <p className="text-xs text-gray-500 ml-7">ID: {joueur.id}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Remplaçants */}
              {(selectedTeam.sub1Name || selectedTeam.sub2Name) && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#f8c741]" />
                    Remplaçants
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: selectedTeam.sub1Id, name: selectedTeam.sub1Name, num: 'R1' },
                      { id: selectedTeam.sub2Id, name: selectedTeam.sub2Name, num: 'R2' },
                    ].map((joueur, idx) => joueur.name && (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-gray-400 text-white w-5 h-5 rounded-full flex items-center justify-center">
                            {joueur.num}
                          </span>
                          <span className="font-medium text-gray-800">{joueur.name}</span>
                        </div>
                        {joueur.id && (
                          <p className="text-xs text-gray-500 ml-7">ID: {joueur.id}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Paiement */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#f8c741]" />
                  Paiement
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Méthode</p>
                    <p className="font-medium text-gray-800">{selectedTeam.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Référence</p>
                    <p className="font-medium text-gray-800 font-mono">{selectedTeam.paymentRef}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedTeam.paymentDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Preuve</p>
                    {selectedTeam.paymentImage ? (
                      <span className="text-xs text-green-600">✓ Uploadé</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Acceptations */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Règlement accepté</p>
                  {selectedTeam.termsAccepted ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Oui</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Non</span>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Décision acceptée</p>
                  {selectedTeam.rulesAccepted ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Oui</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Non</span>
                  )}
                </div>
              </div>

              {/* Date d'inscription */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Date d'inscription</p>
                <p className="font-medium text-gray-800">
                  {new Date(selectedTeam.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailCard(false)}
                className="px-6 py-2 rounded-lg font-medium bg-[#f8c741] text-white hover:bg-[#e5b53a]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && editingJoueuse && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border-2 border-[#f8c741]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Modifier l&apos;inscription</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pseudo In Game</label>
                <input
                  type="text"
                  value={editFormData.pseudo_ingame}
                  onChange={(e) => setEditFormData({...editFormData, pseudo_ingame: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:border-[#f8c741] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                <input
                  type="text"
                  value={editFormData.pseudo_facebook}
                  onChange={(e) => setEditFormData({...editFormData, pseudo_facebook: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:border-[#f8c741] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discord</label>
                <input
                  type="text"
                  value={editFormData.pseudo_discord}
                  onChange={(e) => setEditFormData({...editFormData, pseudo_discord: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:border-[#f8c741] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Handcam</label>
                <select
                  value={editFormData.handcam}
                  onChange={(e) => setEditFormData({...editFormData, handcam: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:border-[#f8c741] focus:outline-none"
                >
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg font-medium bg-[#f8c741] text-white hover:bg-[#e5b53a] transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 rounded-lg font-medium bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl border-2 border-red-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Confirmer la suppression</h2>
              <p className="text-gray-600 mb-6">
                {deleteConfirm?.type === 'individuel' 
                  ? 'Cette inscription individuelle sera supprimée.'
                  : 'Cette équipe et tous ses joueurs seront supprimés.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-lg font-medium bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}