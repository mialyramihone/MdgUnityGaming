'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Gamepad2, Facebook, MessageCircle, Video, Send, X } from 'lucide-react';

interface FormulaireInscriptionProps {
  tournoiId: number;
  tournoiTitre: string;
  onClose?: () => void;
}

export default function FormulaireInscription({ tournoiId, tournoiTitre, onClose }: FormulaireInscriptionProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    compte_id: '',
    pseudo_ingame: '',
    pseudo_facebook: '',
    pseudo_discord: '',
    handcam: false // Changé en booléen
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que handcam est coché
    if (!formData.handcam) {
      setError('Vous devez cocher Handcam pour participer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/joueuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compte_id: formData.compte_id,
          pseudo_ingame: formData.pseudo_ingame,
          pseudo_facebook: formData.pseudo_facebook,
          pseudo_discord: formData.pseudo_discord,
          handcam: formData.handcam ? 'Oui' : 'Non',
          tournoi_id: tournoiId,
          date_inscription: new Date().toISOString()
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          if (onClose) onClose();
          router.refresh();
        }, 2000);
      } else {
        setError('Erreur lors de l\'inscription. Réessaie plus tard.');
      }
    } catch {
      setError('Erreur de connexion. Vérifie ta connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="rounded-2xl p-8 max-w-md w-full text-center" style={{ backgroundColor: '#ffffff', border: '2px solid #f8c741' }}>
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#f8c741' }}>
            <svg className="w-10 h-10" style={{ color: '#292929' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#292929' }}>Inscription réussie !</h3>
          <p className="mb-6" style={{ color: '#826d4a' }}>Tu es maintenant inscrite au tournoi. À bientôt !</p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-semibold"
            style={{ backgroundColor: '#f8c741', color: '#292929' }}
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl max-w-md w-full" style={{ backgroundColor: '#ffffff', border: '2px solid #f8c741' }}>
        {/* Header avec X */}
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: '#f8c741' }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#292929' }}>Inscription</h2>
            <p className="text-sm mt-1" style={{ color: '#826d4a' }}>{tournoiTitre}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{ border: '2px solid #f8c741' }}
              aria-label="Fermer"
            >
              <X className="w-5 h-5" style={{ color: '#292929' }} />
            </button>
          )}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {/* ID Compte */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: '#292929' }}>
              <User className="w-4 h-4" style={{ color: '#f8c741' }} />
              ID Compte <span style={{ color: '#f8c741' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.compte_id}
              onChange={(e) => setFormData({...formData, compte_id: e.target.value})}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ 
                border: '2px solid #f8c741',
                backgroundColor: '#ffffff',
                color: '#292929'
              }}
              placeholder="Ex: 1234567890"
            />
          </div>

          {/* Pseudo In Game */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: '#292929' }}>
              <Gamepad2 className="w-4 h-4" style={{ color: '#f8c741' }} />
              Pseudo In Game <span style={{ color: '#f8c741' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.pseudo_ingame}
              onChange={(e) => setFormData({...formData, pseudo_ingame: e.target.value})}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ 
                border: '2px solid #f8c741',
                backgroundColor: '#ffffff',
                color: '#292929'
              }}
              placeholder="Ton pseudo dans le jeu"
            />
          </div>

          {/* Pseudo Facebook */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: '#292929' }}>
              <Facebook className="w-4 h-4" style={{ color: '#f8c741' }} />
              Lien Facebook <span style={{ color: '#f8c741' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.pseudo_facebook}
              onChange={(e) => setFormData({...formData, pseudo_facebook: e.target.value})}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ 
                border: '2px solid #f8c741',
                backgroundColor: '#ffffff',
                color: '#292929'
              }}
              placeholder="Lien sur Facebook"
            />
          </div>

          {/* Pseudo Discord */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1" style={{ color: '#292929' }}>
              <MessageCircle className="w-4 h-4" style={{ color: '#f8c741' }} />
              Pseudo Discord <span style={{ color: '#f8c741' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.pseudo_discord}
              onChange={(e) => setFormData({...formData, pseudo_discord: e.target.value})}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ 
                border: '2px solid #f8c741',
                backgroundColor: '#ffffff',
                color: '#292929'
              }}
              placeholder="Nom#0000"
            />
          </div>

          {/* Handcam (checkbox OBLIGATOIRE) */}
          <div>
            <label className="flex items-center gap-3 text-sm font-medium" style={{ color: '#292929' }}>
              <input
                type="checkbox"
                required
                checked={formData.handcam}
                onChange={(e) => setFormData({...formData, handcam: e.target.checked})}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#f8c741' }}
              />
              <Video className="w-4 h-4" style={{ color: '#f8c741' }} />
              Handcam <span style={{ color: '#f8c741' }}>*</span>
            </label>
            <p className="text-xs mt-1 ml-7" style={{ color: '#826d4a' }}>
              Obligatoire pour participer
            </p>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ 
                backgroundColor: '#f8c741', 
                color: '#292929',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#292929' }}></div>
                  Inscription...
                </>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  S&apos;inscrire
                </>
              )}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-semibold text-sm"
                style={{ 
                  backgroundColor: '#ffffff',
                  color: '#826d4a',
                  border: '2px solid #f8c741'
                }}
              >
                Annuler
              </button>
            )}
          </div>

          <p className="text-xs text-center mt-2" style={{ color: '#826d4a' }}>
            <span style={{ color: '#f8c741' }}>*</span> Champs obligatoires
          </p>
        </form>
      </div>
    </div>
  );
}