'use client';

import { useState, useEffect } from 'react';
import { Search, Gamepad2, Calendar, Clock, Users, ChevronRight,  Trophy } from 'lucide-react';
import TournoiDetail from './TournoiDetail';
import Classement from './Classement';
import Resultat from './Resultat';
import FormulaireInscription from './FormulaireInscription';
import { Tournoi } from '@/types/tournoi';

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

type TournoiStatus = 'ouvert' | 'bientot' | 'ferme' | 'complet';

export default function TournoiList() {
  const [activeTab, setActiveTab] = useState<'tournoi' | 'classement' | 'resultat'>('tournoi');
  const [selectedJeu, setSelectedJeu] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTournoi, setSelectedTournoi] = useState<Tournoi | null>(null);
  const [tournoiInscription, setTournoiInscription] = useState<{id: number, titre: string} | null>(null);
  const [inscriptionsCount, setInscriptionsCount] = useState<{[key: number]: number}>({});

  const jeux: string[] = [
    'Free Fire', 'Blood Strike', 'MLBB', 'PUBG', 
    'Genshin', 'Roblox', 'Valorant', 'Farlight'
  ];

  const tournois: Tournoi[] = [
    {
      id: 1,
      titre: 'Tournoi Femina Esport',
      jeu: 'Free Fire',
      description: 'Les équipes sont formées par tirage au sort. Inscription gratuite',
      format: '4 vs 4',
      heure: '20:00',
      mode: 'Clash Squad',
      places: 16,
      date: '2026-03-08',
      status: 'ouvert',
      couleur: '#f8c741',
      cashPrize: ['1ère place: 20 000 FCFA', '2ème place: 10 000 FCFA', '3ème place: 5 000 FCFA'],
      reglement: [
        'Être une joueuse',
        'Avoir un compte Free Fire valide',
        'Présence 15min avant le début',
        'Respecter les autres participantes',
        'Interdiction de tricher'
      ],
      organisation: 'MDG Unity Gaming',
      contact: 'MDG Unity Gaming',
      participants: []
    },
    {
      id: 2,
      titre: 'The Tournament saison 4',
      jeu: 'Free Fire',
      description: 'Tournoi Phase point rush et finale en présentielle',
      format: 'Squad',
      heure: '21:00',
      mode: 'Battle Royale',
      places: 999999,
      date: '2026-03-23',
      status: 'ouvert',
      couleur: '#826d4a',
      cashPrize: ['1ère place: 50 000 FCFA', '2ème place: 25 000 FCFA', '3ème place: 10 000 FCFA'],
      reglement: [
        'Équipe de 4 joueurs',
        'Finale en présentiel à BAEC Ankadivato, Antananarivo ',
        'Mode Esport',
        'no Emulateur',
        'no Alliance',
        'Respect des horaires',
        'Fair-play exigé'
      ],
      organisation: 'The Tournament',
      contact: 'MDG Unity Gaming , Black Dragon , Miarana Gaming',
      participants: []
    }
  ];

  useEffect(() => {
    const fetchInscriptionsCount = async () => {
      try {
        const joueusesRes = await fetch('/api/joueuses');
        const joueusesData = await joueusesRes.json();
        
        const teamsRes = await fetch('/.netlify/functions/count-teams?tournamentId=2');
        const teamsData = await teamsRes.json();

         console.log('📊 Réponse count-teams:', teamsData);
        
        const count: {[key: number]: number} = {};
        
        if (Array.isArray(joueusesData)) {
          joueusesData.forEach((j: Joueuse) => {
            if (j.tournoi_id === 1) {
              count[1] = (count[1] || 0) + 1;
            }
          });
        }
        
        if (teamsData.count !== undefined) {
          count[2] = teamsData.count;
        }
        
        setInscriptionsCount(count);
        
      } catch (error) {
        console.error('Erreur chargement inscriptions:', error);
      }
    };

    fetchInscriptionsCount();
  }, []);

  const getTournoiStatus = (tournoiId: number, placesPrises: number, placesTotal: number): TournoiStatus => {
    const now = new Date();
    
    if (tournoiId === 1) {
      const fermeture = new Date('2026-03-07T22:00:00');
      if (placesPrises >= placesTotal) return 'complet';
      if (now > fermeture) return 'ferme';
      return 'ouvert';
    } else if (tournoiId === 2) {
      const ouverture = new Date('2026-03-06T00:00:00');
      const fermeture = new Date('2026-03-21T00:00:00');
      
      if (now < ouverture) return 'bientot';
      if (now > fermeture) return 'ferme';
      return 'ouvert';
    }
    return 'ouvert';
  };

  const getButtonText = (tournoiId: number, status: TournoiStatus): string => {
    if (status === 'complet') return 'Complet';
    if (status === 'ferme') return 'Inscriptions fermées';
    if (status === 'bientot') return 'Bientôt disponible';
    return "S'inscrire";
  };

  const filteredTournois: Tournoi[] = tournois.filter(tournoi => {
    const matchesJeu = selectedJeu === 'all' || tournoi.jeu === selectedJeu;
    const matchesSearch = tournoi.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournoi.jeu.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJeu && matchesSearch;
  });

  if (selectedTournoi) {
    return (
      <TournoiDetail 
        tournoi={selectedTournoi}
        initialInscriptionsCount={inscriptionsCount[selectedTournoi.id] || 0} 
        onBack={() => setSelectedTournoi(null)}
        onInscrire={() => setTournoiInscription({ id: selectedTournoi.id, titre: selectedTournoi.titre })}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Sous-navbar */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('tournoi')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'tournoi' ? 'border-[#f8c741]' : 'border-transparent'
              }`}
              style={{ color: activeTab === 'tournoi' ? '#292929' : '#826d4a' }}
            >
              Tournoi
            </button>
            <button
              onClick={() => setActiveTab('classement')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'classement' ? 'border-[#f8c741]' : 'border-transparent'
              }`}
              style={{ color: activeTab === 'classement' ? '#292929' : '#826d4a' }}
            >
              Classement
            </button>
            <button
              onClick={() => setActiveTab('resultat')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'resultat' ? 'border-[#f8c741]' : 'border-transparent'
              }`}
              style={{ color: activeTab === 'resultat' ? '#292929' : '#826d4a' }}
            >
              Résultat
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'tournoi' && (
          <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#292929' }}>Tournois disponibles</h2>
                <p className="text-sm" style={{ color: '#826d4a' }}>Découvrez tous nos tournois et inscrivez-vous</p>
              </div>
              
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#826d4a' }} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-[#f8c741] transition-colors text-sm"
                  style={{ borderColor: '#f8c741' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Navbar des jeux (comme Classement et Résultat) */}
            <div className="border-b border-gray-200 pb-2">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedJeu('all')}
                  className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${
                    selectedJeu === 'all' 
                      ? 'text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ backgroundColor: selectedJeu === 'all' ? '#f8c741' : undefined }}
                >
                  Tous les jeux
                </button>
                {jeux.map((jeu) => (
                  <button
                    key={jeu}
                    onClick={() => setSelectedJeu(jeu)}
                    className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${
                      selectedJeu === jeu 
                        ? 'text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{ backgroundColor: selectedJeu === jeu ? '#f8c741' : undefined }}
                  >
                    {jeu}
                  </button>
                ))}
              </div>
            </div>

            {/* Statistiques rapides (comme Classement) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-linear-to-br from-[#f8c741] to-[#f7b731] p-5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#292929]/70">Total tournois</p>
                    <p className="text-2xl font-bold text-[#292929]">{filteredTournois.length}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Trophy className="w-6 h-6 text-[#292929]" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-gray-700 to-gray-900 p-5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Total inscriptions</p>
                    <p className="text-2xl font-bold text-white">
                      {Object.values(inscriptionsCount).reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-purple-600 to-purple-800 p-5 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Jeux disponibles</p>
                    <p className="text-2xl font-bold text-white">{jeux.length}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Message si aucun résultat */}
            {filteredTournois.length === 0 && (
              <div className="text-center py-12">
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg text-gray-500">Aucun tournoi ne correspond à votre recherche</p>
              </div>
            )}

            {/* Liste des tournois en grille (style carte) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournois.map((tournoi) => {
                const placesPrises = inscriptionsCount[tournoi.id] || 0;
                const status = getTournoiStatus(tournoi.id, placesPrises, tournoi.places);
                const buttonText = getButtonText(tournoi.id, status);
                
                const isIllimite = tournoi.id === 2;

                return (
                  <div 
                    key={tournoi.id} 
                    className="bg-white rounded-xl overflow-hidden transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 border border-gray-200"
                    onClick={() => {
                      if (tournoi.id === 1 || (tournoi.id === 2 && status === 'ouvert')) {
                        setSelectedTournoi(tournoi);
                      }
                    }}
                  >
                    {/* En-tête coloré */}
                    <div 
                      className="h-24 p-4 relative"
                      style={{ backgroundColor: tournoi.couleur }}
                    >
                      <Gamepad2 className="w-12 h-12 absolute right-3 top-3 text-white opacity-20" />
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{tournoi.titre}</h3>
                        <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full">
                          {tournoi.jeu}
                        </span>
                      </div>
                    </div>

                    {/* Corps de la carte */}
                    <div className="p-4">
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} style={{ color: '#f8c741' }} />
                          <span className="text-gray-600">
                            {new Date(tournoi.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} style={{ color: '#f8c741' }} />
                          <span className="text-gray-600">{tournoi.heure}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Users size={14} style={{ color: '#f8c741' }} />
                          <span className="text-sm text-gray-600">
                            {isIllimite ? `${placesPrises} inscrites` : `${placesPrises}/${tournoi.places} places`}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          status === 'ouvert' ? 'bg-green-100 text-green-600' :
                          status === 'bientot' ? 'bg-blue-100 text-blue-600' :
                          status === 'ferme' ? 'bg-gray-100 text-gray-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {status === 'ouvert' ? 'Ouvert' :
                           status === 'bientot' ? 'Bientôt' :
                           status === 'ferme' ? 'Fermé' : 'Complet'}
                        </span>
                      </div>

                      {/* Bouton Voir détails */}
                      {(tournoi.id === 1 || (tournoi.id === 2 && status === 'ouvert')) ? (
                        <button className="w-full mt-2 py-2 bg-[#f8c741] text-[#292929] rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-[#f9d164] transition">
                          Voir détails
                          <ChevronRight size={16} />
                        </button>
                      ) : (
                        <button 
                          className="w-full mt-2 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                          disabled
                        >
                          {buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'classement' && <Classement tournois={tournois} />}
        {activeTab === 'resultat' && <Resultat tournois={tournois} />}
      </div>

      {/* Modal d'inscription */}
      {tournoiInscription && (
        <FormulaireInscription
          tournoiId={tournoiInscription.id}
          tournoiTitre={tournoiInscription.titre}
          onClose={() => setTournoiInscription(null)}
        />
      )}
    </div>
  );
}