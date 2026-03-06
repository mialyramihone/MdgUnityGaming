'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, LogIn } from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
      setError('');
      
    setTimeout(() => {
        if (formData.email === 'MdgUnityGaming@admin.com' && formData.password === 'MdgUnityGaming') {
          
        sessionStorage.setItem('adminAuth', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#ffffff' }}>
          <div className="max-w-md w-full">
              
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: '#f8c741' }}>
                <div className="relative w-10 h-10">
                    <Image
                        src="/logo.png"
                        alt="MDG Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                        style=
                                {{
                                    filter: 'brightness(0) saturate(100%) invert(12%) sepia(8%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)'
                                }}
                        onError={(e) => {
                        const target = e.target as HTMLImageElement; target.style.display = 'none'; }}
                                    
                    />
        
                </div>
                        
            </div>
            <h1 className="text-3xl font-bold" style={{ color: '#292929' }}>Admin MDG Unity</h1>
            <p className="text-sm mt-2" style={{ color: '#826d4a' }}>Connectez-vous pour gérer les tournois</p>
        </div>

              
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#ffffff', border: '2px solid #f8c741' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg text-sm text-center" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#292929' }}>
                <Mail className="w-4 h-4" style={{ color: '#f8c741' }} />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg"
                style={{ 
                  border: '2px solid #f8c741',
                  backgroundColor: '#ffffff',
                  color: '#292929'
                }}
                placeholder="admin@mdg.com"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#292929' }}>
                <Lock className="w-4 h-4" style={{ color: '#f8c741' }} />
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-lg"
                style={{ 
                  border: '2px solid #f8c741',
                  backgroundColor: '#ffffff',
                  color: '#292929'
                }}
                placeholder="••••••••"
              />
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-80"
              style={{ backgroundColor: '#f8c741', color: '#292929' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#292929' }}></div>
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>

          </form>
        </div>

        {/* Infos de test 
        <div className="mt-6 p-4 rounded-lg text-xs text-center" style={{ backgroundColor: '#f8c741', opacity: 0.8 }}>
          <p style={{ color: '#292929' }}>Identifiants de test :</p>
          <p style={{ color: '#292929' }}>MdgUnityGaming@admin.com / MdgUnityGaming</p>
        </div>*/}
      </div>
    </div>
  );
}