'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Trophy, Download, Search, 
  Trash2, CheckCircle, BarChart3,
  LogOut, Menu, Settings, Eye, Edit, Copy, 
  Save, X, 
  ChevronLeft, ChevronRight, Bell, Shield, Grid, Users2,
  Sword, CreditCard, User,
  Facebook, Gamepad2, FileDown, FileSpreadsheet
} from 'lucide-react';
import { Team } from '@/types/tournoi';
import * as XLSX from 'xlsx';

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

export default function AdminDashboard() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [selectedTeam, setSelectedTeam] = useState<TeamWithDetails | null>(null);
  const [showDetailCard, setShowDetailCard] = useState<boolean>(false);
  
  const [deleteConfirm, setDeleteConfirm] = useState<{id: number} | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
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
      const teamsRes = await fetch('/.netlify/functions/teams-with-players');
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

  const handleViewDetails = (team: TeamWithDetails): void => {
    setSelectedTeam(team);
    setShowDetailCard(true);
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

  const handleExportExcel = (): void => {
    // Préparer les données pour Excel
    const excelData = teamsFiltrees.map((t: TeamWithDetails) => ({
      'Code': t.registrationCode,
      'Équipe': t.teamName,
      'Tag': t.teamTag || '',
      'Capitaine': t.captainName,
      'Lien FB': t.captainLink,
      'J1 ID': t.player1Id || '',
      'J1 Pseudo': t.player1Name || '',
      'J2 ID': t.player2Id || '',
      'J2 Pseudo': t.player2Name || '',
      'J3 ID': t.player3Id || '',
      'J3 Pseudo': t.player3Name || '',
      'J4 ID': t.player4Id || '',
      'J4 Pseudo': t.player4Name || '',
      'R1 ID': t.sub1Id || '',
      'R1 Pseudo': t.sub1Name || '',
      'R2 ID': t.sub2Id || '',
      'R2 Pseudo': t.sub2Name || '',
      'Paiement': t.paymentMethod,
      'Référence': t.paymentRef,
      'Date Paiement': new Date(t.paymentDate).toLocaleDateString('fr-FR'),
      'Règles': t.termsAccepted ? 'Oui' : 'Non',
      'Décision': t.rulesAccepted ? 'Oui' : 'Non',
      'Date Inscription': new Date(t.createdAt).toLocaleDateString('fr-FR')
    }));

    // Créer le workbook et la worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Ajuster la largeur des colonnes
    const colWidths = [
      { wch: 12 }, // Code
      { wch: 20 }, // Équipe
      { wch: 10 }, // Tag
      { wch: 15 }, // Capitaine
      { wch: 30 }, // Lien FB
      { wch: 10 }, // J1 ID
      { wch: 15 }, // J1 Pseudo
      { wch: 10 }, // J2 ID
      { wch: 15 }, // J2 Pseudo
      { wch: 10 }, // J3 ID
      { wch: 15 }, // J3 Pseudo
      { wch: 10 }, // J4 ID
      { wch: 15 }, // J4 Pseudo
      { wch: 10 }, // R1 ID
      { wch: 15 }, // R1 Pseudo
      { wch: 10 }, // R2 ID
      { wch: 15 }, // R2 Pseudo
      { wch: 12 }, // Paiement
      { wch: 15 }, // Référence
      { wch: 15 }, // Date Paiement
      { wch: 8 },  // Règles
      { wch: 8 },  // Décision
      { wch: 15 }, // Date Inscription
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Inscriptions Tournament');
    
    // Télécharger le fichier
    const fileName = `tournament_inscriptions_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const confirmDelete = (id: number): void => {
    setDeleteConfirm({ id });
    setShowDeleteConfirm(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteConfirm) return;
    await handleDeleteTeam(deleteConfirm.id);
    setShowDeleteConfirm(false);
    setDeleteConfirm(null);
  };

  const teamsFiltrees: TeamWithDetails[] = teams.filter((t: TeamWithDetails) => {
    return t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.captainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.registrationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.player1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.player2Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.player3Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.player4Name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(teamsFiltrees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const teamsPaginees = teamsFiltrees.slice(startIndex, endIndex);

  const stats = {
    totalEquipes: teams.length,
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
            <div className="grid md:grid-cols-1 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-[#f8c741]/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#f8c741]" />
                  </div>
                  <span className="text-3xl font-bold text-gray-800">{stats.totalEquipes}</span>
                </div>
                <p className="text-gray-500 text-sm">Équipes inscrites au Tournament</p>
              </div>
            </div>
          )}

          {activeTab === 'inscriptions' && (
            <>
              {/* Barre de recherche et export */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une équipe, un capitaine, un joueur..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-[#f8c741] focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm text-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export Excel
                  </button>
                </div>
              </div>

              {/* Tableau des inscriptions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Équipes inscrites • <span className="text-[#f8c741]">{teamsFiltrees.length}</span>
                  </h2>
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
                                  onClick={() => handleViewDetails(team)}
                                  className="p-1 hover:text-[#f8c741] transition-colors"
                                  title="Voir détails"
                                >
                                  <Eye className="w-4 h-4 text-gray-400 hover:text-[#f8c741]" />
                                </button>
                                <button
                                  onClick={() => confirmDelete(team.id)}
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-600">
                        Affichage {startIndex + 1} à {Math.min(endIndex, teamsFiltrees.length)} sur {teamsFiltrees.length}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 rounded-lg bg-[#f8c741] text-white font-medium">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de détail pour Tournament */}
      {showDetailCard && selectedTeam && (
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
                Cette équipe et tous ses joueurs seront supprimés.
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