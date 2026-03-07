
import type { NextApiRequest, NextApiResponse } from 'next';

interface Tournoi {
  id: number;
  titre: string;
  jeu: string;
  description: string;
  format: string;
  cashPrize: string;
  places: number;
  participants: number;
  date: string;
  status: string;
  dateCreation: string;
}

const tournois: Tournoi[] = [
  {
    id: 1,
    titre: 'Tournoi Femina Esport',
    jeu: 'Free Fire',
    description: 'Les équipes sont formées par tirage au sort. Inscription gratuite',
    format: '4 vs 4',
    cashPrize: '20 H',
    places: 16,
    participants: 8,
    date: '08 Mars 2026',
    status: 'ouvert',
    dateCreation: '2024-01-15'
  },
  {
    id: 2,
    titre: 'THE TOURNAMENT saison 4',
    jeu: 'Free Fire',
    description: 'Tournoi Esport, Battle Royale',
    format: 'Battle Royale',
    cashPrize: ' ',
    places: 0,
    participants: 0,
    date: '15 Mars 2026',
    status: 'ouvert',
    dateCreation: '2024-01-20'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tournoi[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      res.status(200).json(tournois);
    } catch {
      res.status(500).json({ error: 'Erreur lors de la récupération des tournois' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}