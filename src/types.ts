export interface Joueuse {
  id: number;
  compte_id: string;
  pseudo_ingame: string;
  pseudo_facebook: string;
  pseudo_discord: string;
  handcam: string;
  date_inscription: string;
}

export type NouvelleJoueuse = Omit<Joueuse, 'id' | 'date_inscription'>;