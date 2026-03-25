'use client';

import { X, User, Gamepad2, CreditCard, Copy } from 'lucide-react';

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
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
  sub1Name?: string;
  sub2Name?: string;
}

interface TeamDetailsModalProps {
  team: Team;
  onClose: () => void;
}

export default function TeamDetailsModal({ team, onClose }: TeamDetailsModalProps) {
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    alert('Copié !');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl border-2 border-[#f8c741] max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Détails équipe</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-purple-600">Équipe</p>
                <p className="font-bold">{team.teamName}</p>
                {team.teamTag && <p className="text-xs text-gray-500">Tag: {team.teamTag}</p>}
              </div>
              <div>
                <p className="text-xs text-purple-600">Code</p>
                <p className="font-mono font-bold">{team.registrationCode}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#f8c741]" /> Capitaine
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{team.captainName}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-600 break-all">{team.captainLink}</span>
                <button onClick={() => copyToClipboard(team.captainLink)} className="hover:text-[#f8c741]">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#f8c741]" /> Joueurs
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map(num => {
                const playerName = team[`player${num}Name` as keyof Team];
                if (!playerName) return null;
                return (
                  <div key={num} className="bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#f8c741] text-white rounded-full flex items-center justify-center text-xs">
                        {num}
                      </span>
                      <span className="text-sm">{playerName as string}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#f8c741]" /> Paiement
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Méthode</p>
                <p className="text-sm font-medium">{team.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Référence</p>
                <p className="text-sm font-mono">{team.paymentRef}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-[#f8c741] text-white hover:bg-[#e5b53a]">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}