'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Trophy, Calendar, Download, Search, 
  Trash2, CheckCircle, XCircle, BarChart3,
  LogOut, Menu, Settings, Eye, Edit, Copy, 
  Save, X, Info, Facebook, MessageCircle, Gamepad2,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface Joueuse {
  id: number;
  compte_id: string;
  pseudo_ingame: string;
  pseudo_facebook: string;
  pseudo_discord: string;
  handcam: string;
  tournoi_id: number | null;
  date_inscription: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [joueuses, setJoueuses] = useState<Joueuse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHandcam, setFilterHandcam] = useState('tous');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // États pour la carte détail
  const [selectedJoueuse, setSelectedJoueuse] = useState<Joueuse | null>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  
  // États pour la modification
  const [editingJoueuse, setEditingJoueuse] = useState<Joueuse | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    pseudo_ingame: '',
    pseudo_facebook: '',
    pseudo_discord: '',
    handcam: ''
  });
  
  // État pour la confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // États pour pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    fetchJoueuses();
  }, []);

  const fetchJoueuses = async () => {
    try {
      const res = await fetch('/api/joueuses');
      const data = await res.json();
      if (Array.isArray(data)) {
        setJoueuses(data);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  // Fonction pour copier le lien Facebook
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Lien Facebook copié !');
  };

  // Ouvrir la carte détail
  const handleViewDetails = (joueuse: Joueuse) => {
    setSelectedJoueuse(joueuse);
    setShowDetailCard(true);
  };

  // Ouvrir le modal de modification
  const handleEdit = (joueuse: Joueuse) => {
    setEditingJoueuse(joueuse);
    setEditFormData({
      pseudo_ingame: joueuse.pseudo_ingame,
      pseudo_facebook: joueuse.pseudo_facebook,
      pseudo_discord: joueuse.pseudo_discord,
      handcam: joueuse.handcam
    });
    setShowEditModal(true);
  };

    
const handleSaveEdit = async () => {
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
      await fetchJoueuses(); 
      alert('Modification réussie !');
    } else {
      const errorData = await res.json();
      alert(`Erreur lors de la modification: ${errorData.error || 'Erreur inconnue'}`);
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur de connexion');
  }
};
    
    
  const handleExportCSV = () => {
    const headers = ['ID Compte', 'Pseudo In Game', 'Facebook', 'Discord', 'Handcam', 'Date'];
    const csvData = joueusesFiltrees.map(j => [
      j.compte_id,
      j.pseudo_ingame,
      j.pseudo_facebook,
      j.pseudo_discord,
      j.handcam,
      new Date(j.date_inscription).toLocaleDateString('fr-FR')
    ]);

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
    
  // Demander confirmation suppression
  const confirmDelete = (id: number) => {
    setDeleteConfirm(id);
    setShowDeleteConfirm(true);
  };

const handleDelete = async () => {
  if (!deleteConfirm) return;

  try {
    const res = await fetch(`/api/joueuses/${deleteConfirm}`, { 
      method: 'DELETE' 
    });

    if (res.ok) {
      setShowDeleteConfirm(false);
      setDeleteConfirm(null);
      await fetchJoueuses(); 
      alert('Suppression réussie !');
    } else {
      const errorData = await res.json();
      alert(`Erreur lors de la suppression: ${errorData.error || 'Erreur inconnue'}`);
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur de connexion');
  }
};

    
  const joueusesFiltrees = joueuses.filter(j => {
    const matchesSearch = 
      j.compte_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.pseudo_ingame.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.pseudo_facebook.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.pseudo_discord.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHandcam = filterHandcam === 'tous' || 
      (filterHandcam === 'oui' && j.handcam === 'Oui') ||
      (filterHandcam === 'non' && j.handcam === 'Non');

    return matchesSearch && matchesHandcam;
  });

  // Pagination
  const totalPages = Math.ceil(joueusesFiltrees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const joueusesPaginees = joueusesFiltrees.slice(startIndex, endIndex);

  const stats = {
    total: joueuses.length,
    avecHandcam: joueuses.filter(j => j.handcam === 'Oui').length,
    sansHandcam: joueuses.filter(j => j.handcam === 'Non').length,
    aujourdhui: joueuses.filter(j => {
      const today = new Date().toDateString();
      return new Date(j.date_inscription).toDateString() === today;
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#f8c741' }}></div>
          <p style={{ color: '#292929' }}>Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div className="sticky top-0 z-50" style={{ backgroundColor: '#292929', borderBottom: '3px solid #f8c741' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:opacity-80"
                style={{ color: '#ffffff' }}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold" style={{ color: '#f8c741' }}>Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm hover:opacity-80"
              style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 min-h-screen p-4" style={{ backgroundColor: '#ffffff', borderRight: '1px solid #f8c741' }}>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'dashboard' ? '' : 'hover:opacity-80'
                }`}
                style={{ 
                  backgroundColor: activeTab === 'dashboard' ? '#f8c741' : 'transparent',
                  color: activeTab === 'dashboard' ? '#292929' : '#292929'
                }}
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('inscriptions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'inscriptions' ? '' : 'hover:opacity-80'
                }`}
                style={{ 
                  backgroundColor: activeTab === 'inscriptions' ? '#f8c741' : 'transparent',
                  color: activeTab === 'inscriptions' ? '#292929' : '#292929'
                }}
              >
                <Users className="w-5 h-5" />
                Inscriptions
              </button>
              <button
                onClick={() => setActiveTab('tournois')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'tournois' ? '' : 'hover:opacity-80'
                }`}
                style={{ 
                  backgroundColor: activeTab === 'tournois' ? '#f8c741' : 'transparent',
                  color: activeTab === 'tournois' ? '#292929' : '#292929'
                }}
              >
                <Trophy className="w-5 h-5" />
                Tournois
              </button>
              <button
                onClick={() => setActiveTab('parametres')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'parametres' ? '' : 'hover:opacity-80'
                }`}
                style={{ 
                  backgroundColor: activeTab === 'parametres' ? '#f8c741' : 'transparent',
                  color: activeTab === 'parametres' ? '#292929' : '#292929'
                }}
              >
                <Settings className="w-5 h-5" />
                Paramètres
              </button>
            </nav>
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #f8c741' }}>
                  <div className="flex items-center justify-between mb-3">
                    <Users className="w-8 h-8" style={{ color: '#f8c741' }} />
                    <span className="text-3xl font-bold" style={{ color: '#292929' }}>{stats.total}</span>
                  </div>
                  <p style={{ color: '#826d4a' }}>Total inscriptions</p>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #f8c741' }}>
                  <div className="flex items-center justify-between mb-3">
                    <CheckCircle className="w-8 h-8" style={{ color: '#22c55e' }} />
                    <span className="text-3xl font-bold" style={{ color: '#292929' }}>{stats.avecHandcam}</span>
                  </div>
                  <p style={{ color: '#826d4a' }}>Avec Handcam</p>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #f8c741' }}>
                  <div className="flex items-center justify-between mb-3">
                    <XCircle className="w-8 h-8" style={{ color: '#ef4444' }} />
                    <span className="text-3xl font-bold" style={{ color: '#292929' }}>{stats.sansHandcam}</span>
                  </div>
                  <p style={{ color: '#826d4a' }}>Sans Handcam</p>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #f8c741' }}>
                  <div className="flex items-center justify-between mb-3">
                    <Calendar className="w-8 h-8" style={{ color: '#f8c741' }} />
                    <span className="text-3xl font-bold" style={{ color: '#292929' }}>{stats.aujourdhui}</span>
                  </div>
                  <p style={{ color: '#826d4a' }}>Aujourd&apos;hui</p>
                </div>
              </div>

              {/* Graphique simple */}
              <div className="p-6 rounded-xl mb-8" style={{ backgroundColor: '#ffffff', border: '1px solid #f8c741' }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: '#292929' }}>Répartition Handcam</h2>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div 
                    style={{ 
                      width: `${(stats.avecHandcam / stats.total * 100) || 0}%`, 
                      backgroundColor: '#22c55e',
                      height: '100%'
                    }}
                  />
                  <div 
                    style={{ 
                      width: `${(stats.sansHandcam / stats.total * 100) || 0}%`, 
                      backgroundColor: '#ef4444',
                      height: '100%'
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span style={{ color: '#22c55e' }}>Avec Handcam: {stats.avecHandcam}</span>
                  <span style={{ color: '#ef4444' }}>Sans Handcam: {stats.sansHandcam}</span>
                </div>
              </div>

              {/* Dernières inscriptions */}
              <div className="p-6 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #f8c741' }}>
                <h2 className="text-lg font-bold mb-4" style={{ color: '#292929' }}>Dernières inscriptions</h2>
                <div className="space-y-3">
                  {joueuses.slice(-5).reverse().map((j) => (
                    <div key={j.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#f8c741', opacity: 0.9 }}>
                      <div>
                        <p className="font-semibold" style={{ color: '#292929' }}>{j.pseudo_ingame}</p>
                        <p className="text-xs" style={{ color: '#292929', opacity: 0.7 }}>ID: {j.compte_id} - {new Date(j.date_inscription).toLocaleString('fr-FR')}</p>
                      </div>
                      {j.handcam === 'Oui' ? (
                        <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                      ) : (
                        <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'inscriptions' && (
            <>
              {/* Filtres */}
              <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid #f8c741' }}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#826d4a' }} />
                    <input
                      type="text"
                      placeholder="Rechercher par ID compte, pseudo, Facebook, Discord..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg"
                      style={{ 
                        border: '1px solid #f8c741',
                        backgroundColor: '#ffffff',
                        color: '#292929'
                      }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 rounded-lg"
                    style={{ 
                      border: '1px solid #f8c741',
                      backgroundColor: '#ffffff',
                      color: '#292929'
                    }}
                    value={filterHandcam}
                    onChange={(e) => setFilterHandcam(e.target.value)}
                  >
                    <option value="tous">Tous (Handcam)</option>
                    <option value="oui">Avec Handcam</option>
                    <option value="non">Sans Handcam</option>
                  </select>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold hover:opacity-80"
                    style={{ backgroundColor: '#f8c741', color: '#292929' }}
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Tableau avec ID Compte, Pseudo, FB, Discord, Handcam */}
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #f8c741' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: '#f8c741' }}>
                        <th className="text-left py-3 px-4" style={{ color: '#292929' }}>ID Compte</th>  
                        <th className="text-left py-3 px-4" style={{ color: '#292929' }}>Pseudo</th>
                        <th className="text-left py-3 px-4" style={{ color: '#292929' }}>Facebook</th>
                        <th className="text-left py-3 px-4" style={{ color: '#292929' }}>Discord</th>
                        <th className="text-left py-3 px-4" style={{ color: '#292929' }}>Handcam</th>
                        <th className="text-left py-3 px-4" style={{ color: '#292929' }}>Date</th>
                        <th className="text-left py-3 px-4" style={{ color: '#292929' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {joueusesPaginees.map((joueuse) => (
                        <tr 
                          key={joueuse.id}
                          className="border-t hover:opacity-80"
                          style={{ borderColor: '#f8c741' }}
                        >
                          <td className="py-3 px-4 font-mono" style={{ color: '#292929' }}>{joueuse.compte_id}</td>
                          <td className="py-3 px-4" style={{ color: '#292929' }}>{joueuse.pseudo_ingame}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span style={{ color: '#292929' }}>{joueuse.pseudo_facebook}</span>
                              <button
                                onClick={() => copyToClipboard(joueuse.pseudo_facebook)}
                                className="p-1 hover:opacity-60"
                                title="Copier le lien Facebook"
                              >
                                <Copy className="w-4 h-4" style={{ color: '#3b82f6' }} />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4" style={{ color: '#292929' }}>{joueuse.pseudo_discord}</td>
                          <td className="py-3 px-4">
                            {joueuse.handcam === 'Oui' ? (
                              <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                            ) : (
                              <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                            )}
                          </td>
                          <td className="py-3 px-4" style={{ color: '#292929' }}>
                            {new Date(joueuse.date_inscription).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewDetails(joueuse)}
                                className="p-1 hover:opacity-60"
                                title="Voir détails"
                              >
                                <Eye className="w-4 h-4" style={{ color: '#3b82f6' }} />
                              </button>
                              <button
                                onClick={() => handleEdit(joueuse)}
                                className="p-1 hover:opacity-60"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" style={{ color: '#f8c741' }} />
                              </button>
                              <button
                                onClick={() => confirmDelete(joueuse.id)}
                                className="p-1 hover:opacity-60"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
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
                  <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: '#f8c741' }}>
                    <p style={{ color: '#826d4a' }}>
                      Affichage {startIndex + 1} à {Math.min(endIndex, joueusesFiltrees.length)} sur {joueusesFiltrees.length} inscriptions
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg disabled:opacity-50"
                        style={{ backgroundColor: '#f8c741', color: '#292929' }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#f8c741', color: '#292929' }}>
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg disabled:opacity-50"
                        style={{ backgroundColor: '#f8c741', color: '#292929' }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Carte détail */}
      {showDetailCard && selectedJoueuse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '2px solid #f8c741' }}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: '#f8c741' }}>
              <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#292929' }}>
                <Info className="w-5 h-5" style={{ color: '#f8c741' }} />
                Détails de l&apos;inscription
              </h2>
              <button
                onClick={() => setShowDetailCard(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" style={{ color: '#292929' }} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8c741', opacity: 0.9 }}>
                <Gamepad2 className="w-5 h-5" style={{ color: '#292929' }} />
                <div>
                  <p className="text-xs" style={{ color: '#292929', opacity: 0.7 }}>ID Compte</p>
                  <p className="font-bold" style={{ color: '#292929' }}>{selectedJoueuse.compte_id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8c741', opacity: 0.9 }}>
                <Gamepad2 className="w-5 h-5" style={{ color: '#292929' }} />
                <div>
                  <p className="text-xs" style={{ color: '#292929', opacity: 0.7 }}>Pseudo In Game</p>
                  <p className="font-bold" style={{ color: '#292929' }}>{selectedJoueuse.pseudo_ingame}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8c741', opacity: 0.9 }}>
                <Facebook className="w-5 h-5" style={{ color: '#292929' }} />
                <div className="flex-1">
                  <p className="text-xs" style={{ color: '#292929', opacity: 0.7 }}>Facebook</p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold" style={{ color: '#292929' }}>{selectedJoueuse.pseudo_facebook}</p>
                    <button
                      onClick={() => copyToClipboard(selectedJoueuse.pseudo_facebook)}
                      className="p-1 hover:opacity-60"
                    >
                      <Copy className="w-4 h-4" style={{ color: '#3b82f6' }} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8c741', opacity: 0.9 }}>
                <MessageCircle className="w-5 h-5" style={{ color: '#292929' }} />
                <div>
                  <p className="text-xs" style={{ color: '#292929', opacity: 0.7 }}>Discord</p>
                  <p className="font-bold" style={{ color: '#292929' }}>{selectedJoueuse.pseudo_discord}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8c741', opacity: 0.9 }}>
                {selectedJoueuse.handcam === 'Oui' ? (
                  <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                ) : (
                  <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                )}
                <div>
                  <p className="text-xs" style={{ color: '#292929', opacity: 0.7 }}>Handcam</p>
                  <p className="font-bold" style={{ color: '#292929' }}>{selectedJoueuse.handcam}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8c741', opacity: 0.9 }}>
                <Calendar className="w-5 h-5" style={{ color: '#292929' }} />
                <div>
                  <p className="text-xs" style={{ color: '#292929', opacity: 0.7 }}>Date d&apos;inscription</p>
                  <p className="font-bold" style={{ color: '#292929' }}>
                    {new Date(selectedJoueuse.date_inscription).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end" style={{ borderColor: '#f8c741' }}>
              <button
                onClick={() => setShowDetailCard(false)}
                className="px-6 py-2 rounded-lg font-semibold"
                style={{ backgroundColor: '#f8c741', color: '#292929' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && editingJoueuse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '2px solid #f8c741' }}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: '#f8c741' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#292929' }}>Modifier l&apos;inscription</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" style={{ color: '#292929' }} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#292929' }}>Pseudo In Game</label>
                <input
                  type="text"
                  value={editFormData.pseudo_ingame}
                  onChange={(e) => setEditFormData({...editFormData, pseudo_ingame: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ border: '2px solid #f8c741', backgroundColor: '#ffffff', color: '#292929' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#292929' }}>Facebook</label>
                <input
                  type="text"
                  value={editFormData.pseudo_facebook}
                  onChange={(e) => setEditFormData({...editFormData, pseudo_facebook: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ border: '2px solid #f8c741', backgroundColor: '#ffffff', color: '#292929' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#292929' }}>Discord</label>
                <input
                  type="text"
                  value={editFormData.pseudo_discord}
                  onChange={(e) => setEditFormData({...editFormData, pseudo_discord: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ border: '2px solid #f8c741', backgroundColor: '#ffffff', color: '#292929' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#292929' }}>Handcam</label>
                <select
                  value={editFormData.handcam}
                  onChange={(e) => setEditFormData({...editFormData, handcam: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{ border: '2px solid #f8c741', backgroundColor: '#ffffff', color: '#292929' }}
                >
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#f8c741', color: '#292929' }}
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 rounded-lg font-semibold"
                  style={{ backgroundColor: '#ffffff', color: '#826d4a', border: '2px solid #f8c741' }}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-sm w-full rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '2px solid #f8c741' }}>
            <div className="p-6 text-center">
              <Trash2 className="w-12 h-12 mx-auto mb-4" style={{ color: '#ef4444' }} />
              <h2 className="text-xl font-bold mb-2" style={{ color: '#292929' }}>Confirmer la suppression</h2>
              <p className="mb-6" style={{ color: '#826d4a' }}>Cette action est irréversible. Voulez-vous vraiment supprimer cette inscription ?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-lg font-semibold"
                  style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-lg font-semibold"
                  style={{ backgroundColor: '#ffffff', color: '#826d4a', border: '2px solid #f8c741' }}
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