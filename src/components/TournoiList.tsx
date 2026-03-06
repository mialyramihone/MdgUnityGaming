'use client';

import { JSX, useState, useEffect } from 'react';
import { Trophy, Calendar, Users, DollarSign, Gamepad2, Search, Filter, LucideIcon, XCircle } from 'lucide-react';
import FormulaireInscription from './FormulaireInscription';

interface Tournoi {
  id: number;
  titre: string;
  jeu: string;
  description: string;
  format: string;
  cashPrize: string;
  places: number;
  date: string;
  status: 'ouvert' | 'bientot' | 'termine';
  icon: LucideIcon;
  couleur: string;
}

// Interface pour les joueuses retournées par l'API
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

export default function TournoiList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('tous');
  const [selectedTournoi, setSelectedTournoi] = useState<{id: number, titre: string} | null>(null);
  const [inscriptionsCount, setInscriptionsCount] = useState<{[key: number]: number}>({});

  const tournois: Tournoi[] = [
    {
      id: 1,
      titre: 'Tournoi Femina Esport',
      jeu: 'Free Fire',
      description: 'Les équipes sont formées par tirage au sort. Inscription gratuite',
      format: '4 vs 4',
      cashPrize: '20 H',
      places: 16,
      date: '08 Mars 2026',
      status: 'ouvert',
      icon: Gamepad2,
      couleur: '#f8c741'
    },
  ];

  // Charger le nombre d'inscriptions pour chaque tournoi
  useEffect(() => {
    const fetchInscriptionsCount = async () => {
      try {
        const res = await fetch('/api/joueuses');
        const data = await res.json();
        if (Array.isArray(data)) {
          const count: {[key: number]: number} = {};
          // Remplacer 'any' par l'interface Joueuse
          data.forEach((j: Joueuse) => {
            if (j.tournoi_id) {
              count[j.tournoi_id] = (count[j.tournoi_id] || 0) + 1;
            }
          });
          setInscriptionsCount(count);
        }
      } catch (error) {
        console.error('Erreur chargement inscriptions:', error);
      }
    };

    fetchInscriptionsCount();
  }, []);

  const filteredTournois = tournois.filter(tournoi => {
    const matchesSearch = tournoi.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournoi.jeu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'tous' || tournoi.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, placesRestantes: number): JSX.Element => {
    if (placesRestantes <= 0) {
      return <span className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">Complet</span>;
    }
    switch(status) {
      case 'ouvert':
        return <span className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">{placesRestantes} place{placesRestantes > 1 ? 's' : ''} restante{placesRestantes > 1 ? 's' : ''}</span>;
      case 'bientot':
        return <span className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">Bientôt</span>;
      case 'termine':
        return <span className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">Terminé</span>;
      default:
        return <span></span>;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#292929' }}>
            MDG Unity Gaming
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#826d4a' }}>
            Découvrez tous nos tournois et inscrivez-vous pour participer à l&apos;aventure !
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#826d4a' }} />
            <input
              type="text"
              placeholder="Rechercher un tournoi..."
              className="w-full pl-10 pr-4 py-2 rounded-lg"
              style={{ 
                border: '2px solid #f8c741',
                backgroundColor: '#ffffff',
                color: '#292929'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('tous')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium`}
              style={{
                backgroundColor: filter === 'tous' ? '#f8c741' : '#ffffff',
                color: filter === 'tous' ? '#292929' : '#826d4a',
                border: '2px solid #f8c741'
              }}
            >
              <Filter className="w-4 h-4" />
              Tous
            </button>
            <button
              onClick={() => setFilter('ouvert')}
              className={`px-4 py-2 rounded-lg font-medium`}
              style={{
                backgroundColor: filter === 'ouvert' ? '#f8c741' : '#ffffff',
                color: filter === 'ouvert' ? '#292929' : '#826d4a',
                border: '2px solid #f8c741'
              }}
            >
              Ouverts
            </button>
            <button
              onClick={() => setFilter('bientot')}
              className={`px-4 py-2 rounded-lg font-medium`}
              style={{
                backgroundColor: filter === 'bientot' ? '#f8c741' : '#ffffff',
                color: filter === 'bientot' ? '#292929' : '#826d4a',
                border: '2px solid #f8c741'
              }}
            >
              À venir
            </button>
          </div>
        </div>

        {/* Liste des tournois */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTournois.map((tournoi) => {
            const Icon = tournoi.icon;
            const placesPrises = inscriptionsCount[tournoi.id] || 0;
            const placesRestantes = tournoi.places - placesPrises;
            const estComplet = placesRestantes <= 0;

            return (
              <div 
                key={tournoi.id} 
                className={`rounded-xl overflow-hidden transition-all ${
                  estComplet ? 'opacity-75' : 'hover:shadow-2xl'
                }`}
                style={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #f8c741'
                }}
              >
                <div 
                  className="relative h-40 p-6"
                  style={{ backgroundColor: tournoi.couleur }}
                >
                  <Icon className="w-20 h-20 absolute right-4 top-4" style={{ color: '#ffffff', opacity: 0.2 }} />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: tournoi.couleur === '#292929' ? '#ffffff' : '#292929' }}>
                      {tournoi.titre}
                    </h3>
                    <p className="text-sm" style={{ color: tournoi.couleur === '#292929' ? '#ffffff' : '#292929', opacity: 0.9 }}>
                      {tournoi.jeu}
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-6">
                    {getStatusBadge(tournoi.status, placesRestantes)}
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="mb-4 line-clamp-2" style={{ color: '#292929' }}>
                    {tournoi.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3" style={{ color: '#f8c741' }} />
                      <span className="font-medium" style={{ color: '#826d4a' }}>Format:</span>
                      <span className="ml-2 font-semibold" style={{ color: '#292929' }}>{tournoi.format}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-3" style={{ color: '#f8c741' }} />
                      <span className="font-medium" style={{ color: '#826d4a' }}>Heure:</span>
                      <span className="ml-2 font-bold" style={{ color: '#292929' }}>{tournoi.cashPrize}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="w-5 h-5 mr-3" style={{ color: '#f8c741' }} />
                      <span className="font-medium" style={{ color: '#826d4a' }}>Places:</span>
                      <span className="ml-2 font-semibold" style={{ color: placesRestantes > 0 ? '#292929' : '#ef4444' }}>
                        {placesPrises}/{tournoi.places}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3" style={{ color: '#f8c741' }} />
                      <span className="font-medium" style={{ color: '#826d4a' }}>Date:</span>
                      <span className="ml-2 font-semibold" style={{ color: '#292929' }}>{tournoi.date}</span>
                    </div>
                  </div>

                  {/* Bouton S'inscrire (désactivé si complet) */}
                  {estComplet ? (
                    <div className="w-full text-center py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#ef4444', color: '#ffffff', opacity: 0.7 }}
                    >
                      <XCircle className="w-4 h-4" />
                      Complet
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedTournoi({ id: tournoi.id, titre: tournoi.titre })}
                      className="w-full text-center block font-bold py-3 px-4 rounded-lg transition-all hover:opacity-80"
                      style={{ backgroundColor: '#f8c741', color: '#292929' }}
                    >
                      S&apos;inscrire ({placesRestantes} place{placesRestantes > 1 ? 's' : ''} restante{placesRestantes > 1 ? 's' : ''})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTournois.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#826d4a' }}>
              Aucun tournoi ne correspond à votre recherche.
            </p>
          </div>
        )}
      </div>

      {/* Modal d'inscription */}
      {selectedTournoi && (
        <FormulaireInscription
          tournoiId={selectedTournoi.id}
          tournoiTitre={selectedTournoi.titre}
          onClose={() => setSelectedTournoi(null)}
        />
      )}
    </div>
  );
}