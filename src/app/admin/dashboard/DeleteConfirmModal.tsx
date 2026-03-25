'use client';

import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-xl border-2 border-red-200 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Confirmer la suppression</h2>
        <p className="text-gray-600 mb-6">Cette équipe sera définitivement supprimée.</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
            Supprimer
          </button>
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-white text-gray-700 border hover:bg-gray-50">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}