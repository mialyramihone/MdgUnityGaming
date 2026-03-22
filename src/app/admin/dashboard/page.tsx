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

    console.log('Status:', res.status);
    
    const data = await res.json();
    console.log('Response:', data);

    if (res.ok) {
      setTeams(prev => prev.filter(t => t.id !== teamId));
      setShowDeleteConfirm(false);
      setDeleteConfirm(null);
      if (teamsPaginees.length === 1 && currentPage > 1) {
        setCurrentPage(p => p - 1);
      }
    } else {
      alert(`Erreur: ${data.error || JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error('Erreur fetch:', err);
    alert(`Erreur: ${err}`);
  }
};

  const handleExportExcel = (): void => {
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

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    const colWidths = [
      { wch: 12 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 30 },
      { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 10 },
      { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 15 },
      { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
      { wch: 8 },  { wch: 8 },  { wch: 15 },
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Inscriptions Tournament');
    
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
          <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3 xs:mb-4 border-[#f8c741]"></div>
          <p className="text-xs xs:text-sm text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header responsive */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4">
          <div className="flex items-center justify-between h-12 xs:h-14 sm:h-16">
            <div className="flex items-center gap-1 xs:gap-2 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 xs:p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                <Menu className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>
              <div className="flex items-center gap-1 xs:gap-2">
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-[#f8c741] rounded-lg flex items-center justify-center">
                  <Grid className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <h1 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                  Admin<span className="text-[#f8c741]">Panel</span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-1 xs:gap-2 sm:gap-3">
              <button className="p-1 xs:p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-4 h-4 xs:w-5 xs:h-5 text-gray-600" />
                <span className="absolute top-0 xs:top-1 right-0 xs:right-1 w-1.5 h-1.5 xs:w-2 xs:h-2 bg-[#f8c741] rounded-full"></span>
              </button>
              <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
              >
                <LogOut className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar responsive */}
        {sidebarOpen && (
          <div className="w-full lg:w-48 xl:w-56 2xl:w-64 bg-white border-b lg:border-r border-gray-200 p-2 xs:p-3 sm:p-4">
            <nav className="flex flex-row lg:flex-col gap-1 xs:gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar">
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
                    className={`flex items-center gap-1 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 lg:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-[10px] xs:text-xs sm:text-sm ${
                      activeTab === item.id 
                        ? 'bg-[#f8c741] text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="hidden lg:inline">{item.label}</span>
                    <span className="lg:hidden">{item.label.slice(0, 3)}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Contenu principal responsive */}
        <div className="flex-1 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
              <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2 xs:mb-3">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-[#f8c741]/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 text-[#f8c741]" />
                  </div>
                  <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalEquipes}</span>
                </div>
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500">Équipes inscrites</p>
              </div>
            </div>
          )}

          {activeTab === 'inscriptions' && (
            <>
              {/* Barre de recherche et export responsive */}
              <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 xs:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-7 xs:pl-9 sm:pl-10 pr-3 xs:pr-4 py-2 xs:py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:border-[#f8c741] focus:outline-none text-xs xs:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center justify-center gap-1 xs:gap-2 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm text-[10px] xs:text-xs sm:text-sm"
                >
                  <FileSpreadsheet className="w-3 h-3 xs:w-4 xs:h-4" />
                  <span className="hidden xs:inline">Export Excel</span>
                  <span className="xs:hidden">Export</span>
                </button>
              </div>

              {/* Tableau des inscriptions responsive */}
              <div className="space-y-3 xs:space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                    Équipes • <span className="text-[#f8c741]">{teamsFiltrees.length}</span>
                  </h2>
                </div>

                <div className="bg-white rounded-lg xs:rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] lg:min-w-full">
                      <thead>
                        <tr className="bg-purple-50 border-b border-gray-200">
                          <th className="text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Code</th>
                          <th className="text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Équipe</th>
                          <th className="hidden lg:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Tag</th>
                          <th className="text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Capitaine</th>
                          <th className="hidden xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">J1 ID</th>
                          <th className="hidden xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">J1 Pseudo</th>
                          <th className="hidden xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">J2 ID</th>
                          <th className="hidden xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">J2 Pseudo</th>
                          <th className="hidden xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">J3 ID</th>
                          <th className="hidden xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">J3 Pseudo</th>
                          <th className="hidden xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">J4 ID</th>
                          <th className="hidden xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">J4 Pseudo</th>
                          <th className="hidden 2xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">R1 ID</th>
                          <th className="hidden 2xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">R1 Pseudo</th>
                          <th className="hidden 2xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">R2 ID</th>
                          <th className="hidden 2xl:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">R2 Pseudo</th>
                          <th className="text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Paiement</th>
                          <th className="hidden lg:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Réf</th>
                          <th className="hidden md:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Date Pmt</th>
                          <th className="text-center py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Règles</th>
                          <th className="text-center py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Décision</th>
                          <th className="hidden sm:table-cell text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Date Insc</th>
                          <th className="text-left py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamsPaginees.map((team) => (
                          <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-2 xs:py-3 px-2 xs:px-3 font-mono text-[8px] xs:text-[10px] sm:text-xs text-gray-500">{team.registrationCode}</td>
                            <td className="py-2 xs:py-3 px-2 xs:px-3 font-medium text-gray-800 text-[10px] xs:text-xs sm:text-sm truncate max-w-[80px] xs:max-w-[100px]">
                              {team.teamName}
                            </td>
                            <td className="hidden lg:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600">{team.teamTag || '—'}</td>
                            <td className="py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] sm:text-xs text-gray-600">{team.captainName}</td>
                            <td className="hidden xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] font-mono text-gray-500">{team.player1Id || '—'}</td>
                            <td className="hidden xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] text-gray-600">{team.player1Name || '—'}</td>
                            <td className="hidden xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] font-mono text-gray-500">{team.player2Id || '—'}</td>
                            <td className="hidden xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] text-gray-600">{team.player2Name || '—'}</td>
                            <td className="hidden xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] font-mono text-gray-500">{team.player3Id || '—'}</td>
                            <td className="hidden xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] text-gray-600">{team.player3Name || '—'}</td>
                            <td className="hidden xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] font-mono text-gray-500">{team.player4Id || '—'}</td>
                            <td className="hidden xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] text-gray-600">{team.player4Name || '—'}</td>
                            <td className="hidden 2xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] font-mono text-gray-500">{team.sub1Id || '—'}</td>
                            <td className="hidden 2xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] text-gray-600">{team.sub1Name || '—'}</td>
                            <td className="hidden 2xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] font-mono text-gray-500">{team.sub2Id || '—'}</td>
                            <td className="hidden 2xl:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] text-gray-600">{team.sub2Name || '—'}</td>
                            <td className="py-2 xs:py-3 px-2 xs:px-3">
                              <span className="text-[8px] xs:text-[10px] px-1 xs:px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                                {team.paymentMethod}
                              </span>
                            </td>
                            <td className="hidden lg:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] font-mono text-gray-600">{team.paymentRef}</td>
                            <td className="hidden md:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] text-gray-600">
                              {new Date(team.paymentDate).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-2 xs:py-3 px-2 xs:px-3 text-center">
                              {team.termsAccepted ? (
                                <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-2 xs:py-3 px-2 xs:px-3 text-center">
                              {team.rulesAccepted ? (
                                <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="hidden sm:table-cell py-2 xs:py-3 px-2 xs:px-3 text-[8px] xs:text-[10px] text-gray-600">
                              {new Date(team.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-2 xs:py-3 px-2 xs:px-3">
                              <div className="flex gap-1 xs:gap-2">
                                <button
                                  onClick={() => handleViewDetails(team)}
                                  className="p-0.5 xs:p-1 hover:text-[#f8c741] transition-colors"
                                  title="Voir détails"
                                >
                                  <Eye className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-gray-400 hover:text-[#f8c741]" />
                                </button>
                                <button
                                  onClick={() => confirmDelete(team.id)}
                                  className="p-0.5 xs:p-1 hover:text-red-500 transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-gray-400 hover:text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>


                  {totalPages > 1 && (
                    <div className="flex flex-col xs:flex-row items-center justify-between gap-2 xs:gap-3 p-3 xs:p-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-600 order-2 xs:order-1">
                        {startIndex + 1}-{Math.min(endIndex, teamsFiltrees.length)}/{teamsFiltrees.length}
                      </p>
                      <div className="flex gap-1 xs:gap-2 order-1 xs:order-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-1 xs:p-1.5 sm:p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <span className="px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg bg-[#f8c741] text-white font-medium text-[8px] xs:text-[10px] sm:text-xs">
                          {currentPage}/{totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-1 xs:p-1.5 sm:p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
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


      {showDetailCard && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-2 xs:p-3 sm:p-4 backdrop-blur-sm">
          <div className="max-w-full xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl w-full bg-white rounded-xl xs:rounded-2xl shadow-xl border-2 border-[#f8c741] max-h-[90vh] overflow-y-auto">
            <div className="p-3 xs:p-4 sm:p-5 md:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-1 xs:gap-2">
                <Users2 className="w-4 h-4 xs:w-5 xs:h-5 text-[#f8c741]" />
                Détails équipe
              </h2>
              <button
                onClick={() => setShowDetailCard(false)}
                className="p-1 xs:p-1.5 sm:p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4 xs:w-5 xs:h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-3 xs:p-4 sm:p-5 md:p-6 space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
              
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                <div className="col-span-1 xs:col-span-2 p-3 xs:p-4 bg-purple-50 rounded-lg">
                  <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
                    <div>
                      <p className="text-[8px] xs:text-[10px] text-purple-600 mb-1">Équipe</p>
                      <p className="font-bold text-gray-800 text-xs xs:text-sm sm:text-base">{selectedTeam.teamName}</p>
                      {selectedTeam.teamTag && (
                        <p className="text-[8px] xs:text-[10px] text-gray-500">Tag: {selectedTeam.teamTag}</p>
                      )}
                    </div>
                    <div className="text-left xs:text-right">
                      <p className="text-[8px] xs:text-[10px] text-purple-600 mb-1">Code</p>
                      <p className="font-mono font-bold text-gray-800 text-xs xs:text-sm">{selectedTeam.registrationCode}</p>
                    </div>
                  </div>
                </div>
              </div>


              <div>
                <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-700 mb-2 xs:mb-3 flex items-center gap-1 xs:gap-2">
                  <User className="w-3 h-3 xs:w-4 xs:h-4 text-[#f8c741]" />
                  Capitaine
                </h3>
                <div className="bg-gray-50 p-3 xs:p-4 rounded-lg">
                  <p className="text-xs xs:text-sm font-medium text-gray-800">{selectedTeam.captainName}</p>
                  <div className="flex items-center justify-between mt-1 xs:mt-2">
                    <span className="text-[8px] xs:text-[10px] text-gray-600 break-all">{selectedTeam.captainLink}</span>
                    <button
                      onClick={() => copyToClipboard(selectedTeam.captainLink)}
                      className="p-0.5 xs:p-1 hover:text-[#f8c741] shrink-0"
                      title="Copier le lien"
                    >
                      <Copy className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>


              <div>
                <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-700 mb-2 xs:mb-3 flex items-center gap-1 xs:gap-2">
                  <Gamepad2 className="w-3 h-3 xs:w-4 xs:h-4 text-[#f8c741]" />
                  Joueurs
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3">
                  {[
                    { id: selectedTeam.player1Id, name: selectedTeam.player1Name, num: 1 },
                    { id: selectedTeam.player2Id, name: selectedTeam.player2Name, num: 2 },
                    { id: selectedTeam.player3Id, name: selectedTeam.player3Name, num: 3 },
                    { id: selectedTeam.player4Id, name: selectedTeam.player4Name, num: 4 },
                  ].map((joueur, idx) => joueur.name && (
                    <div key={idx} className="bg-gray-50 p-2 xs:p-3 rounded-lg">
                      <div className="flex items-center gap-1 xs:gap-2 mb-1">
                        <span className="text-[8px] xs:text-[10px] font-bold bg-[#f8c741] text-white w-4 h-4 xs:w-5 xs:h-5 rounded-full flex items-center justify-center">
                          {joueur.num}
                        </span>
                        <span className="text-[8px] xs:text-[10px] font-medium text-gray-800">{joueur.name}</span>
                      </div>
                      {joueur.id && (
                        <p className="text-[6px] xs:text-[8px] text-gray-500 ml-5 xs:ml-6">ID: {joueur.id}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>


              {(selectedTeam.sub1Name || selectedTeam.sub2Name) && (
                <div>
                  <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-700 mb-2 xs:mb-3 flex items-center gap-1 xs:gap-2">
                    <Users className="w-3 h-3 xs:w-4 xs:h-4 text-[#f8c741]" />
                    Remplaçants
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3">
                    {[
                      { id: selectedTeam.sub1Id, name: selectedTeam.sub1Name, num: 'R1' },
                      { id: selectedTeam.sub2Id, name: selectedTeam.sub2Name, num: 'R2' },
                    ].map((joueur, idx) => joueur.name && (
                      <div key={idx} className="bg-gray-50 p-2 xs:p-3 rounded-lg border border-dashed border-gray-300">
                        <div className="flex items-center gap-1 xs:gap-2 mb-1">
                          <span className="text-[8px] xs:text-[10px] font-bold bg-gray-400 text-white w-4 h-4 xs:w-5 xs:h-5 rounded-full flex items-center justify-center">
                            {joueur.num}
                          </span>
                          <span className="text-[8px] xs:text-[10px] font-medium text-gray-800">{joueur.name}</span>
                        </div>
                        {joueur.id && (
                          <p className="text-[6px] xs:text-[8px] text-gray-500 ml-5 xs:ml-6">ID: {joueur.id}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}


              <div>
                <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-700 mb-2 xs:mb-3 flex items-center gap-1 xs:gap-2">
                  <CreditCard className="w-3 h-3 xs:w-4 xs:h-4 text-[#f8c741]" />
                  Paiement
                </h3>
                <div className="bg-gray-50 p-3 xs:p-4 rounded-lg grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                  <div>
                    <p className="text-[6px] xs:text-[8px] text-gray-500">Méthode</p>
                    <p className="text-[8px] xs:text-[10px] font-medium text-gray-800">{selectedTeam.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-[6px] xs:text-[8px] text-gray-500">Référence</p>
                    <p className="text-[8px] xs:text-[10px] font-medium text-gray-800 font-mono">{selectedTeam.paymentRef}</p>
                  </div>
                  <div>
                    <p className="text-[6px] xs:text-[8px] text-gray-500">Date</p>
                    <p className="text-[8px] xs:text-[10px] font-medium text-gray-800">
                      {new Date(selectedTeam.paymentDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[6px] xs:text-[8px] text-gray-500">Preuve</p>
                    {selectedTeam.paymentImage ? (
                      <span className="text-[8px] xs:text-[10px] text-green-600">✓ Uploadé</span>
                    ) : (
                      <span className="text-[8px] xs:text-[10px] text-gray-400">—</span>
                    )}
                  </div>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                <div className="bg-gray-50 p-3 xs:p-4 rounded-lg">
                  <p className="text-[6px] xs:text-[8px] text-gray-500 mb-1">Règlement</p>
                  {selectedTeam.termsAccepted ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                      <span className="text-[8px] xs:text-[10px]">Oui</span>
                    </div>
                  ) : (
                    <span className="text-[8px] xs:text-[10px] text-gray-400">Non</span>
                  )}
                </div>
                <div className="bg-gray-50 p-3 xs:p-4 rounded-lg">
                  <p className="text-[6px] xs:text-[8px] text-gray-500 mb-1">Décision</p>
                  {selectedTeam.rulesAccepted ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                      <span className="text-[8px] xs:text-[10px]">Oui</span>
                    </div>
                  ) : (
                    <span className="text-[8px] xs:text-[10px] text-gray-400">Non</span>
                  )}
                </div>
              </div>


              <div className="bg-gray-50 p-3 xs:p-4 rounded-lg">
                <p className="text-[6px] xs:text-[8px] text-gray-500 mb-1">Date d'inscription</p>
                <p className="text-[8px] xs:text-[10px] font-medium text-gray-800">
                  {new Date(selectedTeam.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
            
            <div className="p-3 xs:p-4 sm:p-5 md:p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailCard(false)}
                className="px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 rounded-lg font-medium bg-[#f8c741] text-white hover:bg-[#e5b53a] text-xs xs:text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}


      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-3 xs:p-4 backdrop-blur-sm">
          <div className="max-w-[280px] xs:max-w-sm w-full bg-white rounded-xl xs:rounded-2xl shadow-xl border-2 border-red-200">
            <div className="p-4 xs:p-5 sm:p-6 text-center">
              <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
                <Trash2 className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 mb-1 xs:mb-2">Confirmer</h2>
              <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 mb-4 xs:mb-5 sm:mb-6">
                Cette équipe sera supprimée.
              </p>
              <div className="flex gap-2 xs:gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-1.5 xs:py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 text-[10px] xs:text-xs sm:text-sm"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-1.5 xs:py-2 rounded-lg font-medium bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 text-[10px] xs:text-xs sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
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
