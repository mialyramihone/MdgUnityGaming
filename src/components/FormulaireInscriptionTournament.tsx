'use client';

import { useState } from 'react';
import { X, Calendar, Trophy, Users, Phone, CheckCircle, AlertCircle, ArrowLeft, Camera, Smartphone, Copy, Check, User, Hash, Link as LinkIcon, Info, Shield, Award, Wallet, ChevronRight, Circle, LucideIcon } from 'lucide-react';
import Image from 'next/image';
import QRCode from 'qrcode';
import QRCodeWithDesign from './QRCodeWithDesign'; 

interface FormulaireInscriptionProps {
  tournoiId: number;
  tournoiTitre: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormDataType {
  teamName: string;
  teamTag: string;
  captainName: string;
  captainLink: string;
  player1Id: string; player1Name: string;
  player2Id: string; player2Name: string;
  player3Id: string; player3Name: string;
  player4Id: string; player4Name: string;
  sub1Id: string; sub1Name: string;
  sub2Id: string; sub2Name: string;
  paymentDate: string;
  paymentRef: string;
  paymentMethod: string;
  paymentImage: File | null;
  termsAccepted: boolean;
  rulesAccepted: boolean;
}

type PaymentMethod = 'mvola' | 'orange';

interface PageType {
  title: string;
  icon: LucideIcon;
  subtitle: string;
}

export default function FormulaireInscriptionTournament({ tournoiId, onClose }: FormulaireInscriptionProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<PaymentMethod | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [, setQrCodeUrl] = useState<string>('');
  const [registrationCode, setRegistrationCode] = useState<string>('');
  
  const [formData, setFormData] = useState<FormDataType>({
    teamName: '',
    teamTag: '',
    captainName: '',
    captainLink: '',
    player1Id: '', player1Name: '',
    player2Id: '', player2Name: '',
    player3Id: '', player3Name: '',
    player4Id: '', player4Name: '',
    sub1Id: '', sub1Name: '',
    sub2Id: '', sub2Name: '',
    paymentDate: '',
    paymentRef: '',
    paymentMethod: '',
    paymentImage: null,
    termsAccepted: false,
    rulesAccepted: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const generateQRCode = async (code: string): Promise<void> => {
    try {
      const url = await QRCode.toDataURL(code);
      setQrCodeUrl(url);
    } catch {
      console.error('Erreur génération QR code');
    }
  };

  const generateRegistrationCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TT4-${result}`;
  };

  const handleCopy = (text: string, id: string): void => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({...formData, paymentImage: file});
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateField = <K extends keyof FormDataType>(field: K, value: FormDataType[K]): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePlayerField = (num: number, field: 'id' | 'name', value: string): void => {
    const key = `player${num}${field === 'id' ? 'Id' : 'Name'}` as keyof FormDataType;
    updateField(key, value);
  };

  const updateSubField = (num: number, field: 'id' | 'name', value: string): void => {
    const key = `sub${num}${field === 'id' ? 'Id' : 'Name'}` as keyof FormDataType;
    updateField(key, value);
  };

  // const handleSubmit = async (): Promise<void> => {
  //   if (!formData.termsAccepted || !formData.rulesAccepted) {
  //     setErrorMessage('Veuillez accepter les conditions');
  //     setTimeout(() => setErrorMessage(null), 3000);
  //     return;
  //   }
    
  //   setIsSubmitting(true);
  //   try {
  //     const payload = new FormData();
  //     (Object.entries(formData) as [keyof FormDataType, unknown][]).forEach(([key, val]) => {
  //       if (key === 'paymentImage' && val instanceof File) {
  //         payload.append(key, val);
  //       } else if (key !== 'paymentImage') {
  //         payload.append(key, String(val));
  //       }
  //     });
  //     payload.append('tournamentId', String(tournoiId));
      
  //     await fetch('/api/team-registration', { method: 'POST', body: payload });
      
  //     const code = generateRegistrationCode();
  //     setRegistrationCode(code);
  //     await generateQRCode(code);
  //     setShowSuccess(true);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


const handleSubmit = async (): Promise<void> => {
  setIsSubmitting(true);
  setErrorMessage(null);
  
  try {
    const payload = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'paymentImage' && value instanceof File) {
        payload.append(key, value);
      } else if (key !== 'paymentImage') {
        payload.append(key, String(value));
      }
    });
    payload.append('tournamentId', String(tournoiId));
    
    
    const response = await fetch('/.netlify/functions/team-registration', {
      method: 'POST',
      body: payload
    });
    
    const text = await response.text();
    console.log('📤 Réponse brute:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('📤 Données parsées:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }
      
      const code = generateRegistrationCode();
      setRegistrationCode(code);
      await generateQRCode(code);
      setShowSuccess(true);
      
    } catch (e) {
      console.error('❌ Pas du JSON valide:', text.substring(0, 200));
      throw new Error('La réponse du serveur n\'est pas valide');
    }
    
  } catch (error: unknown) {
    let errorMessage = 'Erreur lors de l\'inscription';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    setErrorMessage(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};



  const pages: PageType[] = [
    { title: 'Équipe', icon: Trophy, subtitle: 'Informations' },
    { title: 'Composition', icon: Users, subtitle: '4 + 2 remplaçants' },
    { title: 'Paiement', icon: Wallet, subtitle: '20 000 AR' },
    { title: 'Confirmation', icon: CheckCircle, subtitle: 'Vérification' }
  ];

  const paymentMethods = {
    mvola: {
      name: 'Mvola',
      number: '0348564765',
      owner: 'Valisoa Robina',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
      icon: Smartphone
    },
    orange: {
      name: 'Orange Money',
      number: '0374157941',
      owner: 'Zohina Hanitriniaina',
      bgLight: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      icon: Phone
    }
  };

  const validatePage = (): boolean => {
    setErrorMessage(null);
    
    switch(currentPage) {
      case 0:
        if (!formData.teamName) { setErrorMessage('Nom de l\'équipe requis'); return false; }
        if (!formData.captainName) { setErrorMessage('Nom du capitaine requis'); return false; }
        if (!formData.captainLink) { setErrorMessage('Lien Facebook requis'); return false; }
        break;
      case 1:
        for(let i = 1; i <= 4; i++) {
          const idKey = `player${i}Id` as keyof FormDataType;
          const nameKey = `player${i}Name` as keyof FormDataType;
          if (!formData[idKey]) { setErrorMessage(`ID Joueur ${i} manquant`); return false; }
          if (!formData[nameKey]) { setErrorMessage(`Pseudo Joueur ${i} manquant`); return false; }
        }
        break;
      case 2:
        if (!paymentType) { setErrorMessage('Choisissez un mode de paiement'); return false; }
        if (!formData.paymentDate) { setErrorMessage('Date de paiement requise'); return false; }
        if (!formData.paymentRef) { setErrorMessage('Référence de paiement requise'); return false; }
        if (!formData.paymentImage) { setErrorMessage('Preuve de paiement requise'); return false; }
        break;
    }
    return true;
  };



  if (showSuccess) {

     const teamDataForQR = {
        teamName: formData.teamName,
        captainName: formData.captainName,
        players: [
        formData.player1Name,
        formData.player2Name,
        formData.player3Name,
        formData.player4Name,
        formData.sub1Name,
        formData.sub2Name
        ].filter(name => name), 
        paymentMethod: formData.paymentMethod,
        paymentRef: formData.paymentRef
    };

      
     return (
        <div className="fixed inset-0 bg-linear-to-br from-black/70 to-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="bg-linear-to-br from-green-500 to-emerald-500 p-6 text-white text-center rounded-t-3xl">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">Inscription confirmée !</h2>
            <p className="text-white/80 text-sm mt-1">The Tournament Saison 4</p>
            </div>

            <div className="p-6">
            {/* QR Code avec design */}
            <QRCodeWithDesign
                registrationCode={registrationCode}
                teamData={teamDataForQR}
                tournamentName="The Tournament Saison 4"
                tournamentDate="29 Mars 2026"
            />

            <div className="bg-amber-50 p-4 rounded-xl mb-5 border border-amber-200 mt-4">
                <p className="text-xs text-amber-700 flex items-start gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>Finale présentielle le 29 Mars 2026 à BAEC Ankadivato !</span>
                </p>
            </div>


            <button
                onClick={onClose}
                className="w-full mt-4 py-3 text-sm text-gray-500 hover:text-gray-700"
            >
                Fermer
            </button>
            </div>
        </div>
        </div>
    );
    }

  return (
    <div className="fixed inset-0 bg-linear-to-br from-black/70 to-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header with gradient */}
        <div className="bg-linear-to-r from-[#f8c741] to-[#f9d164] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-2xl">
                <Award className="w-5 h-5 text-black/70" />
              </div>
              <div>
                <h2 className="font-bold text-lg">The Tournament Saison 4</h2>
                <p className="text-xs text-black/70">Inscription équipe • 20 000 AR</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="mt-3 bg-white/20 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm">
            <Info size={16} className="shrink-0" />
            <span>Finale présentielle 29 Mars • N&apos;oubliez pas les frais de retrait</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            {pages.map((page, idx) => {
              const IconComponent = page.icon;
              const isActive = currentPage === idx;
              const isPast = currentPage > idx;
              
              return (
                <div key={idx} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-2xl flex items-center justify-center transition-all
                      ${isPast || isActive ? 'bg-[#f8c741]' : 'bg-gray-100'}
                    `}>
                      <IconComponent size={18} className={isPast || isActive ? 'text-black' : 'text-gray-400'} />
                    </div>
                    <span className={`text-xs mt-1.5 font-medium ${isPast || isActive ? 'text-black' : 'text-gray-400'}`}>
                      {page.title}
                    </span>
                  </div>
                  {idx < pages.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 ${idx < currentPage ? 'bg-[#f8c741]' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="mx-6 mt-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page 1 - Team Info */}
          {currentPage === 0 && (
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                  <Calendar size={12} /> Inscriptions du 9 au 20 Mars 2026
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 flex items-center gap-1">
                      <User size={12} /> Nom de l&apos;équipe *
                    </label>
                    <input
                      type="text"
                      value={formData.teamName}
                      onChange={e => updateField('teamName', e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-[#f8c741] focus:ring-1 focus:ring-[#f8c741] outline-none transition"
                      placeholder="ex: Les Lionnes"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium mb-1.5 flex items-center gap-1">
                      <Hash size={12} /> Tag (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.teamTag}
                      onChange={e => updateField('teamTag', e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-[#f8c741] focus:ring-1 focus:ring-[#f8c741] outline-none transition"
                      placeholder="ex: [LDLC]"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium mb-1.5 flex items-center gap-1">
                      <Shield size={12} /> Capitaine *
                    </label>
                    <input
                      type="text"
                      value={formData.captainName}
                      onChange={e => updateField('captainName', e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-[#f8c741] focus:ring-1 focus:ring-[#f8c741] outline-none transition"
                      placeholder="Nom complet"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium mb-1.5 flex items-center gap-1">
                      <LinkIcon size={12} /> Lien Facebook *
                    </label>
                    <input
                      type="url"
                      value={formData.captainLink}
                      onChange={e => updateField('captainLink', e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-[#f8c741] focus:ring-1 focus:ring-[#f8c741] outline-none transition"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page 2 - Players */}
          {currentPage === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Circle size={8} className="fill-[#f8c741] text-[#f8c741]" />
                  Titulaires (4 obligatoires)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(num => (
                    <div key={num} className="bg-white p-3 rounded-lg border">
                      <p className="text-xs font-medium mb-2 text-gray-600">Joueur {num}</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="ID"
                          value={formData[`player${num}Id` as keyof FormDataType] as string}
                          onChange={e => updatePlayerField(num, 'id', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-[#f8c741] outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Pseudo"
                          value={formData[`player${num}Name` as keyof FormDataType] as string}
                          onChange={e => updatePlayerField(num, 'name', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-[#f8c741] outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-500">
                  <Circle size={8} className="fill-gray-400 text-gray-400" />
                  Remplaçants (optionnel)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2].map(num => (
                    <div key={num} className="bg-white p-3 rounded-lg border border-dashed border-gray-300">
                      <p className="text-xs font-medium mb-2 text-gray-500">Remplaçant {num}</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="ID"
                          value={formData[`sub${num}Id` as keyof FormDataType] as string}
                          onChange={e => updateSubField(num, 'id', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-[#f8c741] outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Pseudo"
                          value={formData[`sub${num}Name` as keyof FormDataType] as string}
                          onChange={e => updateSubField(num, 'name', e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:border-[#f8c741] outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Page 3 - Payment */}
          {currentPage === 2 && (
            <div className="space-y-5 max-w-lg mx-auto">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(paymentMethods).map(([key, method]) => {
                  const IconComponent = method.icon;
                  const isSelected = paymentType === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setPaymentType(key as PaymentMethod);
                        updateField('paymentMethod', method.name);
                      }}
                      className={`
                        p-5 rounded-xl border-2 transition-all
                        ${isSelected 
                          ? method.bgLight + ' ' + method.border 
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }
                      `}
                    >
                      <IconComponent className={`w-7 h-7 mx-auto mb-2 ${isSelected ? method.text : 'text-gray-400'}`} />
                      <p className={`text-xs font-medium ${isSelected ? method.text : 'text-gray-500'}`}>
                        {method.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              {paymentType && (
                <div className={`${paymentMethods[paymentType].bgLight} p-5 rounded-xl border-2 ${paymentMethods[paymentType].border}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-medium ${paymentMethods[paymentType].text}`}>
                      Détails de paiement
                    </span>
                    <span className="text-xs bg-white px-3 py-1 rounded-full font-medium">
                      20 000 AR
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl mb-3">
                    <p className="text-xs text-gray-500 mb-2">Numéro de compte</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-base font-medium">{paymentMethods[paymentType].number}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{paymentMethods[paymentType].owner}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(paymentMethods[paymentType].number, 'number')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        {copiedItem === 'number' 
                          ? <Check size={16} className="text-green-600" /> 
                          : <Copy size={16} className="text-gray-400" />
                        }
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">Date</label>
                      <input
                        type="date"
                        value={formData.paymentDate}
                        onChange={e => updateField('paymentDate', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-[#f8c741] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">Référence</label>
                      <input
                        type="text"
                        placeholder="N° transaction"
                        value={formData.paymentRef}
                        onChange={e => updateField('paymentRef', e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-[#f8c741] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <label className="text-xs font-medium mb-3 block">Preuve de paiement</label>
                <div className="border-2 border-dashed rounded-xl p-4 text-center border-[#f8c741] bg-orange-50/20">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="proof-upload" />
                  <label htmlFor="proof-upload" className="cursor-pointer block">
                    {imagePreview ? (
                      <div className="relative h-24 mx-auto">
                        <Image 
                          src={imagePreview} 
                          alt="preview" 
                          width={100} 
                          height={80} 
                          className="rounded-lg object-contain mx-auto" 
                          unoptimized 
                        />
                      </div>
                    ) : (
                      <div className="py-4">
                        <Camera size={32} className="mx-auto mb-2 text-[#f8c741]" />
                        <p className="text-xs text-gray-500">Cliquez pour ajouter une capture d&apos;écran</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Page 4 - Confirmation */}
          {currentPage === 3 && (
            <div className="max-w-lg mx-auto">
              <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-800">Vérifiez vos informations</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/80 p-4 rounded-xl">
                    <p className="text-sm font-medium mb-2">Équipe</p>
                    <p className="text-xs text-gray-600">{formData.teamName} {formData.teamTag}</p>
                    <p className="text-xs text-gray-600 mt-1">Capitaine: {formData.captainName}</p>
                  </div>

                  <div className="bg-white/80 p-4 rounded-xl">
                    <p className="text-sm font-medium mb-2">Joueurs</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[1,2,3,4].map(i => {
                        const nameKey = `player${i}Name` as keyof FormDataType;
                        return (
                          <div key={i} className="text-xs">
                            <span className="font-medium">J{i}:</span> {String(formData[nameKey])}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white/80 p-4 rounded-xl">
                    <p className="text-sm font-medium mb-2">Paiement</p>
                    <p className="text-xs">{formData.paymentMethod} • {formData.paymentRef}</p>
                    <p className="text-xs text-gray-500 mt-1">Date: {formData.paymentDate}</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <label className="flex items-center gap-3 p-3 bg-white/80 rounded-xl">
                      <input 
                        type="checkbox" 
                        checked={formData.termsAccepted}
                        onChange={e => updateField('termsAccepted', e.target.checked)}
                        className="w-4 h-4 rounded accent-[#f8c741]"
                      />
                      <span className="text-xs">J&apos;accepte le règlement du tournoi</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white/80 rounded-xl">
                      <input 
                        type="checkbox" 
                        checked={formData.rulesAccepted}
                        onChange={e => updateField('rulesAccepted', e.target.checked)}
                        className="w-4 h-4 rounded accent-[#f8c741]"
                      />
                      <span className="text-xs">J&apos;accepte la décision des organisateurs</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50/80">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {currentPage > 0 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-6 py-2.5 text-sm border-2 border-[#f8c741] rounded-xl flex items-center gap-1 font-medium hover:bg-white transition"
              >
                <ArrowLeft size={16} />
                Retour
              </button>
            )}
            
            {currentPage < 3 ? (
              <button
                onClick={() => {
                  if (validatePage()) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                className="px-6 py-2.5 text-sm bg-[#f8c741] rounded-xl flex items-center gap-1 font-medium hover:bg-[#f9d164] transition ml-auto"
              >
                Continuer
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.termsAccepted || !formData.rulesAccepted}
                className="px-8 py-2.5 text-sm bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-50 ml-auto"
              >
                {isSubmitting ? '...' : 'Confirmer'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}