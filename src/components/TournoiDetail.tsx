'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Clock, Gamepad2, Target, Info, FileText, Smartphone, Calendar, AlertCircle } from 'lucide-react';
import { Tournoi } from '@/types/tournoi';
import FormulaireInscriptionFemina from './FormulaireInscriptionFemina';
import FormulaireInscriptionTournament from './FormulaireInscriptionTournament';

interface TournoiDetailProps {
  tournoi: Tournoi;
  initialInscriptionsCount: number; 
  onBack: () => void;
  onInscrire: () => void;
}

type SectionId = 'infos' | 'reglement';

interface Section {
  id: SectionId;
  label: string;
  icon: React.ElementType;
}

export default function TournoiDetail({ 
  tournoi, 
  initialInscriptionsCount, 
  onBack, 
  onInscrire 
}: TournoiDetailProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('infos');
  const [showInscriptionModal, setShowInscriptionModal] = useState(false);
  const [inscriptionsCount, setInscriptionsCount] = useState(initialInscriptionsCount);
  const [loading, setLoading] = useState(false);

    
   useEffect(() => {
      const fetchInscriptionsCount = async () => {
        if (tournoi.id === 2) {
          setLoading(true);
          try {
            
            const res = await fetch(`/api/count-teams?tournamentId=${tournoi.id}`);
            const data = await res.json();
            console.log("📊 Données reçues:", data); 
            
            if (data.count !== undefined) {
              setInscriptionsCount(data.count);
            }
          } catch (error) {
            console.error('Erreur chargement inscriptions:', error);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchInscriptionsCount();
    }, [tournoi.id]);
        
    const handleInscriptionSuccess = () => {
      setShowInscriptionModal(false);
      onInscrire();
      
      if (tournoi.id === 2) {
        
        fetch(`/api/count-teams?tournamentId=${tournoi.id}`)
          .then(res => res.json())
          .then(data => {
            console.log("📊 Rechargement:", data);
            if (data.count !== undefined) {
              setInscriptionsCount(data.count);
            }
          });
      }
    };

  const placesRestantes = tournoi.places - inscriptionsCount;

  const inscriptionStatus = useMemo(() => {
    const now = new Date();
    
    if (tournoi.id === 1) {
      const fermeture = new Date('2026-03-07T22:00:00');
      if (placesRestantes <= 0) return 'complet';
      if (now > fermeture) return 'fermee';
      return 'ouverte';
    } else if (tournoi.id === 2) {
      const ouverture = new Date('2026-03-06T00:00:00');
      const fermeture = new Date('2026-03-20T23:59:59');
      
      if (now < ouverture) return 'fermee';
      if (now > fermeture) return 'fermee';
      return 'ouverte';
    }
    return 'ouverte';
  }, [tournoi.id, placesRestantes]);

  const getInscriptionMessage = () => {
    if (tournoi.id === 1) {
      return {
        periode: "Inscriptions jusqu'au 7 Mars 2026 à 22h00",
        limite: "Fermeture des inscriptions : 7 Mars 22h"
      };
    } else {
      return {
        periode: "Inscriptions du 9 Mars au 20 Mars 2026",
        limite: "Dernier jour : 20 Mars à minuit"
      };
    }
  };

  const getButtonState = () => {
    if (inscriptionStatus === 'complet') {
      return {
        text: 'Complet',
        disabled: true,
        className: 'bg-red-500 text-white cursor-not-allowed'
      };
    } else if (inscriptionStatus === 'fermee') {
      return {
        text: 'Inscriptions fermées',
        disabled: true,
        className: 'bg-gray-400 text-white cursor-not-allowed'
      };
    } else {
      return {
        text: "S'inscrire maintenant",
        disabled: false,
        className: 'hover:scale-105 hover:shadow-lg'
      };
    }
  };

  const message = getInscriptionMessage();
  const buttonState = getButtonState();

  const sections: Section[] = [
    { id: 'infos', label: 'Infos', icon: Info },
    { id: 'reglement', label: 'Règlement', icon: FileText },
    ];
    
    

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        {/* Hero section */}
        <div className="relative h-80 overflow-hidden" style={{ backgroundColor: tournoi.couleur }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Gamepad2 className="w-40 h-40 text-white opacity-20" />
          </div>
          
          {/* Bouton retour */}
          <button
            onClick={onBack}
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Retour
          </button>

          {/* Titre et date */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm uppercase tracking-wider opacity-80">{tournoi.jeu}</span>
                  <h1 className="text-3xl font-bold mt-2">{tournoi.titre}</h1>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">
                    {new Date(tournoi.date).getDate()}
                  </div>
                  <div className="text-xl">
                    {new Date(tournoi.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation sections */}
        <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`py-4 px-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                      activeSection === section.id ? 'border-[#f8c741]' : 'border-transparent'
                    }`}
                    style={{ color: activeSection === section.id ? '#292929' : '#826d4a' }}
                  >
                    <Icon size={18} />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Section principale */}
            <div className="md:col-span-2">
              {activeSection === 'infos' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4" style={{ color: '#292929' }}>Description</h2>
                    <p className="text-gray-600 leading-relaxed">{tournoi.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} style={{ color: '#f8c741' }} />
                        <span className="font-medium" style={{ color: '#292929' }}>Horaire</span>
                      </div>
                      <p className="text-gray-600">{tournoi.heure}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Gamepad2 size={18} style={{ color: '#f8c741' }} />
                        <span className="font-medium" style={{ color: '#292929' }}>Format</span>
                      </div>
                      <p className="text-gray-600">{tournoi.format}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Target size={18} style={{ color: '#f8c741' }} />
                        <span className="font-medium" style={{ color: '#292929' }}>Mode</span>
                      </div>
                      <p className="text-gray-600">{tournoi.mode}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone size={18} style={{ color: '#f8c741' }} />
                        <span className="font-medium" style={{ color: '#292929' }}>Plateforme</span>
                      </div>
                      <p className="text-gray-600">Mobile</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4" style={{ color: '#292929' }}>Organisation</h2>
                    <p className="text-gray-600 mb-2">{tournoi.organisation}</p>
                    <p className="text-gray-600">Contact: {tournoi.contact}</p>
                  </div>
                </div>
              )}

              {activeSection === 'reglement' && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#292929' }}>Règlement du tournoi</h2>
                  <ul className="space-y-4">
                    {tournoi.reglement.map((regle: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#f8c74120] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold" style={{ color: '#f8c741' }}>{index + 1}</span>
                        </span>
                        <span className="text-gray-600">{regle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            
                      {/* Sidebar avec inscription */}
                <div className="md:col-span-1">
                <div className="bg-gray-50 p-6 rounded-xl sticky top-24">
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#292929' }}>
                    {tournoi.id === 2 ? 'Squads inscrits' : 'Inscriptions'}
                    </h3>
                    
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Période d&apos;inscription</span>
                    </div>
                    <p className="text-xs text-blue-700">{message.periode}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                        {tournoi.id === 2 ? 'Squads inscrits' : 'Places totales'}
                        </span>
                        <span className="font-bold text-gray-800">
                        {loading ? (
                            <span className="animate-pulse">...</span>
                        ) : (
                            tournoi.id === 2 ? inscriptionsCount : tournoi.places
                        )}
                        </span>
                    </div>
                    
                    {tournoi.id === 1 && (
                        <>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Inscrites</span>
                            <span className="font-bold text-gray-800">{inscriptionsCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Places restantes</span>
                            <span className={`font-bold ${placesRestantes > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {placesRestantes}
                            </span>
                        </div>

                        <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                                width: tournoi.places > 0 ? `${(inscriptionsCount / tournoi.places) * 100}%` : '0%',
                                backgroundColor: '#f8c741'
                            }}
                            ></div>
                        </div>
                        </>
                    )}
                    </div>

                    {inscriptionStatus === 'fermee' && (
                    <div className="mb-4 p-3 bg-orange-50 rounded-lg flex items-start gap-2">
                        <AlertCircle size={16} className="text-orange-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-orange-700">
                        {tournoi.id === 1 
                            ? "Les inscriptions sont fermées (limite: 7 Mars 22h)"
                            : "Les inscriptions sont fermées (du 9 au 20 Mars)"}
                        </p>
                    </div>
                    )}

                    <button
                    onClick={() => setShowInscriptionModal(true)}
                    disabled={buttonState.disabled}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${buttonState.className}`}
                    style={{ 
                        backgroundColor: buttonState.disabled ? undefined : '#f8c741', 
                        color: buttonState.disabled ? undefined : '#292929' 
                    }}
                    >
                    {buttonState.text}
                    </button>

                    <p className="text-xs text-center mt-4 text-gray-500">
                    {message.limite}
                    </p>

                    {tournoi.id === 2 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 text-center">
                        Finale en présentiel le 29 Mars 2026 à BAEC Ankadivato, Antananarivo
                        </p>
                    </div>
                    )}
                </div>
                </div>
                                    
          </div>
        </div>
      </div>

      {showInscriptionModal && tournoi.id === 1 && (
        <FormulaireInscriptionFemina
            tournoiId={tournoi.id}
            tournoiTitre={tournoi.titre}
            onClose={() => setShowInscriptionModal(false)}
            onSuccess={handleInscriptionSuccess}  // ← CHANGER ICI
        />
        )}

        {showInscriptionModal && tournoi.id === 2 && (
        <FormulaireInscriptionTournament
            tournoiId={tournoi.id}
            tournoiTitre={tournoi.titre}
            onClose={() => setShowInscriptionModal(false)}
            onSuccess={handleInscriptionSuccess}  // ← CHANGER ICI
        />
        )}
    </>
  );
}