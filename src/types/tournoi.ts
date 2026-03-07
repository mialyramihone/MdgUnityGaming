export interface Tournoi {
  id: number;
  titre: string;
  jeu: string;
  description: string;
  format: string;
  heure: string;
  mode: string;
  places: number;
  date: string;
  status: 'ouvert' | 'bientot' | 'termine';
  couleur: string;
  cashPrize: string[];
  reglement: string[];
  organisation: string;
  contact: string;
   participants: Joueuse[] | Team[];
}

export interface Joueuse {
  id: number;
  compte_id: string;
  pseudo_ingame: string;
  pseudo_facebook: string;
  pseudo_discord: string;
  handcam: string;
  tournoi_id: number | null;
  date_inscription: string;
}

export interface Team {
  id: number;
  teamName: string;
  teamTag: string | null;
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
}