'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Clock, Gamepad2, Target, Info, FileText, Smartphone, Calendar, AlertCircle } from 'lucide-react';
import { Tournoi } from '@/types/tournoi';
import FormulaireInscriptionFemina from './FormulaireInscriptionFemina';
import FormulaireInscriptionTournament from './FormulaireInscriptionTournament';
import Image from 'next/image';

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
        limite: "Fermeture : 7 Mars 22h"
      };
    } else {
      return {
        periode: "Inscriptions du 9 au 20 Mars 2026",
        limite: "Dernier jour : 20 Mars"
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
        text: 'Fermé',
        disabled: true,
        className: 'bg-gray-400 text-white cursor-not-allowed'
      };
    } else {
      return {
        text: "S'inscrire",
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
      <div className="min-h-screen bg-white">
        
        <div className="relative h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
          
          {tournoi.id === 2 ? (
            <div className="absolute inset-0">
              <Image
                src="/images/freefire-bg.jpg" 
                alt="Free Fire Background"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: tournoi.couleur }}>
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
          )}
          
          <button
            onClick={onBack}
            className="absolute top-3 left-3 xs:top-4 xs:left-4 sm:top-6 sm:left-6 flex items-center gap-1 xs:gap-2 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all z-10 text-xs xs:text-sm"
          >
            <ChevronRight className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rotate-180" />
            <span className="hidden xs:inline">Retour</span>
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 sm:p-6 md:p-8 text-white">
            <div className="container mx-auto">
              <div className="flex flex-wrap justify-between items-end gap-2">
                <div>
                  <span className="text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider opacity-80">
                    {tournoi.jeu}
                  </span>
                  <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-0.5 xs:mt-1 sm:mt-2">
                    {tournoi.titre}
                  </h1>
                </div>
                <div className="text-right">
                  <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold">
                    {new Date(tournoi.date).getDate()}
                  </div>
                  <div className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-xl">
                    {new Date(tournoi.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="container mx-auto px-2 xs:px-3 sm:px-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 xs:gap-4 sm:gap-6 md:gap-8 overflow-x-auto hide-scrollbar">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`py-2 xs:py-3 sm:py-4 px-1 xs:px-2 font-medium border-b-2 transition-colors flex items-center gap-1 xs:gap-2 text-xs xs:text-sm sm:text-base whitespace-nowrap ${
                        activeSection === section.id ? 'border-[#f8c741]' : 'border-transparent'
                      }`}
                      style={{ color: activeSection === section.id ? '#292929' : '#826d4a' }}
                    >
                      <Icon size={14} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px]" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-5 sm:py-6 md:py-8">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
            
            <div className="lg:col-span-2 order-2 lg:order-1">
              {activeSection === 'infos' && (
                <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="bg-gray-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg xs:rounded-xl">
                    <h2 className="text-base xs:text-lg sm:text-xl font-bold mb-2 xs:mb-3 sm:mb-4 text-gray-800">
                      Description
                    </h2>
                    <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
                      {tournoi.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                    <div className="bg-gray-50 p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl">
                      <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2">
                        <Clock size={12} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] text-[#f8c741]" />
                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-800">Horaire</span>
                      </div>
                      <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">{tournoi.heure}</p>
                    </div>
                    <div className="bg-gray-50 p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl">
                      <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2">
                        <Gamepad2 size={12} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] text-[#f8c741]" />
                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-800">Format</span>
                      </div>
                      <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">{tournoi.format}</p>
                    </div>
                    <div className="bg-gray-50 p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl">
                      <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2">
                        <Target size={12} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] text-[#f8c741]" />
                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-800">Mode</span>
                      </div>
                      <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">{tournoi.mode}</p>
                    </div>
                    <div className="bg-gray-50 p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl">
                      <div className="flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2">
                        <Smartphone size={12} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] text-[#f8c741]" />
                        <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-800">Plateforme</span>
                      </div>
                      <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">Mobile</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg xs:rounded-xl">
                    <h2 className="text-base xs:text-lg sm:text-xl font-bold mb-2 xs:mb-3 sm:mb-4 text-gray-800">
                      Organisation
                    </h2>
                    <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-1">{tournoi.organisation}</p>
                    <p className="text-xs xs:text-sm sm:text-base text-gray-600">Contact: {tournoi.contact}</p>
                  </div>
                </div>
              )}

              {activeSection === 'reglement' && (
                <div className="bg-gray-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg xs:rounded-xl">
                  <h2 className="text-base xs:text-lg sm:text-xl font-bold mb-3 xs:mb-4 sm:mb-5 md:mb-6 text-gray-800">
                    Règlement
                  </h2>
                  <ul className="space-y-2 xs:space-y-3 sm:space-y-4">
                    {tournoi.reglement.map((regle: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 xs:gap-3">
                        <span className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full bg-[#f8c74120] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[8px] xs:text-[10px] sm:text-xs font-bold text-[#f8c741]">
                            {index + 1}
                          </span>
                        </span>
                        <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600">{regle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-gray-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg xs:rounded-xl sticky top-16 xs:top-20 sm:top-24">
                <h3 className="text-sm xs:text-base sm:text-lg font-bold mb-2 xs:mb-3 sm:mb-4 text-gray-800">
                  Inscriptions
                </h3>
                
                <div className="mb-4 p-2 xs:p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-1 xs:gap-2 mb-1">
                    <Calendar size={10} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-blue-600" />
                    <span className="text-[8px] xs:text-[10px] sm:text-xs font-medium text-blue-800">
                      Période
                    </span>
                  </div>
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-blue-700">{message.periode}</p>
                </div>

                {inscriptionStatus === 'fermee' && (
                  <div className="mb-4 p-2 xs:p-2.5 sm:p-3 bg-orange-50 rounded-lg flex items-start gap-1 xs:gap-2">
                    <AlertCircle size={10} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-orange-600 mt-0.5 shrink-0" />
                    <p className="text-[8px] xs:text-[10px] sm:text-xs text-orange-700">
                      {tournoi.id === 1 ? "Fermé (limite: 7 Mars 22h)" : "Fermé (du 9 au 20 Mars)"}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowInscriptionModal(true)}
                  disabled={buttonState.disabled}
                  className={`w-full py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-lg xs:rounded-xl font-bold text-xs xs:text-sm sm:text-base transition-all ${buttonState.className}`}
                  style={{ 
                    backgroundColor: buttonState.disabled ? undefined : '#f8c741', 
                    color: buttonState.disabled ? undefined : '#292929' 
                  }}
                >
                  {buttonState.text}
                </button>

                {tournoi.id === 2 && (
                  <div className="mt-4 p-2 xs:p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                    <p className="text-[8px] xs:text-[10px] sm:text-xs text-blue-600 text-center">
                      Finale: 29 Mars - BAEC Ankadivato
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
          onSuccess={handleInscriptionSuccess}
        />
      )}

      {showInscriptionModal && tournoi.id === 2 && (
        <FormulaireInscriptionTournament
          tournoiId={tournoi.id}
          tournoiTitre={tournoi.titre}
          onClose={() => setShowInscriptionModal(false)}
          onSuccess={handleInscriptionSuccess}
        />
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
    </>
  );
}
