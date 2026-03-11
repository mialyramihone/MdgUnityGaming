'use client';

import { useState, useEffect } from 'react';
import { Search, Gamepad2, Calendar, Clock, Users, ChevronRight, Trophy, X } from 'lucide-react';
import TournoiDetail from './TournoiDetail';
import Classement from './Classement';
import Resultat from './Resultat';
import FormulaireInscription from './FormulaireInscription';
import { Tournoi } from '@/types/tournoi';
import Image from 'next/image';

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

type TournoiStatus = 'ouvert' | 'bientot' | 'ferme' | 'complet' | 'termine';

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
      status: 'termine', 
      couleur: '#f8c741',
      cashPrize: ['1ère place: 20 000 FCFA', '2ème place: 10 000 FCFA', '3ème place: 5 000 FCFA'],
      reglement: [
        'Être une joueur',
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

  const countTournoi1Inscriptions = async () => {
    try {
      const response = await fetch('/.netlify/functions/count-teams?tournamentId=1');
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Erreur comptage tournoi 1:', error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchInscriptionsCount = async () => {
      try {
        const count1 = await countTournoi1Inscriptions();
        const teamsRes = await fetch('/.netlify/functions/count-teams?tournamentId=2');
        const teamsData = await teamsRes.json();
        
        const count: {[key: number]: number} = {};
        count[1] = count1;
        
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
    if (status === 'termine') return 'Terminé';
    return "S'inscrire";
  };

  const filteredTournois: Tournoi[] = tournois.filter(tournoi => {
    const matchesJeu = selectedJeu === 'all' || tournoi.jeu === selectedJeu;
    const matchesSearch = tournoi.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournoi.jeu.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJeu && matchesSearch;
  });

  
  const tournoisRecents = filteredTournois.filter(t => t.status !== 'termine');
  const tournoisTermines = filteredTournois.filter(t => t.status === 'termine');

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
    <div className="min-h-screen bg-white">
      
    
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
                <h2 className="text-2xl font-bold text-gray-800">Tournois disponibles</h2>
                <p className="text-sm text-gray-500">Découvrez tous nos tournois et inscrivez-vous</p>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border-2 border-[#f8c741] focus:outline-none transition-colors text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-2">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedJeu('all')}
                  className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${
                    selectedJeu === 'all' 
                      ? 'text-white bg-[#f8c741]' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous les jeux
                </button>
                {jeux.map((jeu) => (
                  <button
                    key={jeu}
                    onClick={() => setSelectedJeu(jeu)}
                    className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${
                      selectedJeu === jeu 
                        ? 'text-white bg-[#f8c741]' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {jeu}
                  </button>
                ))}
              </div>
            </div>

            {filteredTournois.length === 0 && (
              <div className="text-center py-12">
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg text-gray-500">Aucun tournoi ne correspond à votre recherche</p>
              </div>
            )}


            {tournoisRecents.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#f8c741] rounded-full animate-pulse"></span>
                  Tournois à venir
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tournoisRecents.map((tournoi) => {
                    const placesPrises = inscriptionsCount[tournoi.id] || 0;
                    const status = getTournoiStatus(tournoi.id, placesPrises, tournoi.places);
                    
                    const isIllimite = tournoi.id === 2;
                    const isClickable = tournoi.id === 2 && status === 'ouvert';

                    return (
                      <div 
                        key={tournoi.id} 
                        className={`bg-white rounded-xl overflow-hidden transition-all border-2 ${
                          isClickable 
                            ? 'border-[#f8c741] cursor-pointer hover:shadow-xl hover:-translate-y-1' 
                            : 'border-gray-200 opacity-80'
                        }`}
                        onClick={() => {
                          if (isClickable) {
                            setSelectedTournoi(tournoi);
                          }
                        }}
                      >
                         <div 
                            className="h-24 p-4 relative overflow-hidden"
                            style={{ backgroundColor: tournoi.id === 2 ? 'transparent' : tournoi.couleur }}
                          >
                            {tournoi.id === 2 && (
                              <>
                                <Image
                                  src="/images/freefire-bg.jpg" 
                                  alt="Free Fire Background"
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                              </>
                            )}
                            
                            <Gamepad2 className="w-12 h-12 absolute right-3 top-3 text-white opacity-20 z-10" />
                            <div className="relative z-10">
                              <h3 className="text-lg font-bold text-white mb-1">{tournoi.titre}</h3>
                              <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full">
                                {tournoi.jeu}
                              </span>
                            </div>
                          </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between text-sm mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-[#f8c741]" />
                              <span className="text-gray-600">
                                {new Date(tournoi.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-[#f8c741]" />
                              <span className="text-gray-600">{tournoi.heure}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-[#f8c741]" />
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

                          {tournoi.id === 1 ? (
                            <button 
                              className="w-full mt-2 py-2 bg-red-500 text-white rounded-lg text-sm font-medium cursor-not-allowed opacity-75"
                              disabled
                            >
                              Inscriptions fermées
                            </button>
                          ) : (tournoi.id === 2 && status === 'ouvert') ? (
                            <button className="w-full mt-2 py-2 bg-[#f8c741] text-[#292929] rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-[#f9d164] transition">
                              Voir détails
                              <ChevronRight size={16} />
                            </button>
                          ) : (
                            <button 
                              className="w-full mt-2 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                              disabled
                            >
                              {getButtonText(tournoi.id, status)}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tournois terminés - En arrière-plan */}
            {tournoisTermines.length > 0 && (
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Tournois terminés
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                  {tournoisTermines.map((tournoi) => {
                    const placesPrises = inscriptionsCount[tournoi.id] || 0;

                    return (
                      <div 
                        key={tournoi.id} 
                        className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 grayscale"
                      >
                        <div 
                          className="h-20 p-3 relative"
                          style={{ backgroundColor: tournoi.couleur + '80' }}
                        >
                          <Gamepad2 className="w-8 h-8 absolute right-3 top-3 text-white opacity-20" />
                          <h3 className="text-base font-bold text-white mb-1">{tournoi.titre}</h3>
                          <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full">
                            {tournoi.jeu}
                          </span>
                        </div>

                        <div className="p-3">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar size={12} className="text-gray-400" />
                              <span className="text-gray-500">
                                {new Date(tournoi.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                              Terminé
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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