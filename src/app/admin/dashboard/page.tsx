'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Trophy, BarChart3, LogOut, Menu, Settings, 
  Grid, Target, TrendingUp
} from 'lucide-react';
import PointsManager from './PointsManager';
import InscriptionsTable from './InscriptionsTable';
import TeamDetailsModal from './TeamDetailsModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import RankingManager from './RankingManager';

interface Team {
  id: number;
  teamName: string;
  teamTag: string;
  captainName: string;
  captainLink: string;
  registrationCode: string;
  paymentMethod: string;
  paymentRef: string;
  paymentDate: string;
  paymentImage: string | null;
  tournamentId: number;
  termsAccepted: boolean;
  rulesAccepted: boolean;
  status: string;
  createdAt: string;
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
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetailCard, setShowDetailCard] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) router.push('/admin/login');
  }, [router]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch('/api/teams-with-players');
      const data = await res.json();
      if (Array.isArray(data)) setTeams(data as Team[]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: number): Promise<void> => {
    try {
      const res = await fetch(`/.netlify/functions/delete-team?id=${teamId}`, { method: 'DELETE' });
      if (res.ok) {
        setTeams(prev => prev.filter(t => t.id !== teamId));
        setDeleteConfirm(null);
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    }
  };

  const handleLogout = (): void => {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin border-[#f8c741]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#f8c741] rounded-lg flex items-center justify-center">
                  <Grid className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">Admin<span className="text-[#f8c741]">Panel</span></h1>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-white border-r min-h-screen p-4">
            <nav className="flex flex-col gap-1">
              {[
                { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                { id: 'inscriptions', icon: Users, label: 'Inscriptions' },
                { id: 'points', icon: Target, label: 'Résultats' },
                { id: 'ranking', icon: Trophy, label: 'Classement' },
                { id: 'parametres', icon: Settings, label: 'Paramètres' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id 
                        ? 'bg-[#f8c741] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f8c741]/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#f8c741]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-800">{teams.length}</p>
                    <p className="text-sm text-gray-500">Équipes inscrites</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-5 border">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#f8c741]" />
                  Actions rapides
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab('points')}
                    className="px-4 py-2 bg-[#f8c741]/10 text-[#f8c741] rounded-lg text-sm font-medium hover:bg-[#f8c741] hover:text-white transition"
                  >
                    Ajouter points
                  </button>
                  <button
                    onClick={() => setActiveTab('inscriptions')}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition"
                  >
                    Voir inscriptions
                  </button>
                  <button
                    onClick={() => setActiveTab('ranking')}
                    className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-600 hover:text-white transition"
                  >
                    Voir classement
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inscriptions' && (
            <InscriptionsTable 
              teams={teams}
              onViewDetails={(team: Team) => {
                setSelectedTeam(team);
                setShowDetailCard(true);
              }}
              onDelete={(id: number) => setDeleteConfirm(id)}
            />
          )}

          {activeTab === 'points' && <PointsManager />}
          
          {activeTab === 'ranking' && <RankingManager />}
          
          {activeTab === 'parametres' && (
            <div className="bg-white rounded-xl p-8 border text-center">
              <Settings className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Paramètres à venir</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailCard && selectedTeam && (
        <TeamDetailsModal team={selectedTeam} onClose={() => setShowDetailCard(false)} />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal 
          onConfirm={() => handleDeleteTeam(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}