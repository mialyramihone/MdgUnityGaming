'use client';

import { useState } from 'react';
import { Search, FileSpreadsheet, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';


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
  paymentImage: string | null;
  tournamentId: number;
  termsAccepted: boolean;
  rulesAccepted: boolean;
  status: string;
  createdAt: string;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  player3Id: string;
  player3Name: string;
  player4Id: string;
  player4Name: string;
  sub1Id: string;
  sub1Name: string;
  sub2Id: string;
  sub2Name: string;
}


interface InscriptionsTableProps {
  teams: Team[];
  onViewDetails: (team: Team) => void;
  onDelete: (id: number) => void;
}

export default function InscriptionsTable({ teams, onViewDetails, onDelete }: InscriptionsTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  const teamsFiltrees: Team[] = teams.filter((t) => {
    return t.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.captainName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.registrationCode?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages: number = Math.ceil(teamsFiltrees.length / itemsPerPage);
  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const teamsPaginees: Team[] = teamsFiltrees.slice(startIndex, startIndex + itemsPerPage);

  const handleExportExcel = (): void => {
    const excelData = teamsFiltrees.map((t) => ({
      'Code': t.registrationCode,
      'Équipe': t.teamName,
      'Tag': t.teamTag || '',
      'Capitaine': t.captainName,
      'Lien FB': t.captainLink,
      'J1 Pseudo': t.player1Name || '',
      'J2 Pseudo': t.player2Name || '',
      'J3 Pseudo': t.player3Name || '',
      'J4 Pseudo': t.player4Name || '',
      'Paiement': t.paymentMethod,
      'Référence': t.paymentRef,
      'Date Paiement': new Date(t.paymentDate).toLocaleDateString('fr-FR'),
      'Date Inscription': new Date(t.createdAt).toLocaleDateString('fr-FR')
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Inscriptions');
    XLSX.writeFile(wb, `inscriptions_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une équipe, capitaine ou code..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-[#f8c741] focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-600">Code</th>
                <th className="p-3 text-left text-xs font-medium text-gray-600">Équipe</th>
                <th className="p-3 text-left text-xs font-medium text-gray-600">Capitaine</th>
                <th className="p-3 text-center text-xs font-medium text-gray-600">Paiement</th>
                <th className="p-3 text-center text-xs font-medium text-gray-600">Actions</th>
               </tr>
            </thead>
            <tbody>
              {teamsPaginees.map((team) => (
                <tr key={team.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs text-gray-500">{team.registrationCode}</td>
                  <td className="p-3 font-medium text-gray-800">{team.teamName}</td>
                  <td className="p-3 text-sm text-gray-600">{team.captainName}</td>
                  <td className="p-3 text-center">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                      {team.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => onViewDetails(team)} className="p-1 hover:text-[#f8c741]" title="Voir détails">
                        <Eye className="w-4 h-4 text-gray-400 hover:text-[#f8c741]" />
                      </button>
                      <button onClick={() => onDelete(team.id)} className="p-1 hover:text-red-500" title="Supprimer">
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded bg-white border disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm">Page {currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded bg-white border disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}