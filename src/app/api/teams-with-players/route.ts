import { NextResponse } from 'next/server';
import { db } from '@/db/config';
import { teams, teamPlayers } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface TeamWithPlayers {
  id: number;
  teamName: string;
  teamTag: string | null;
  captainName: string;
  captainLink: string;
  registrationCode: string;
  paymentMethod: string;
  paymentRef: string;
  paymentDate: Date;
  paymentImage: string | null;
  tournamentId: number;
  termsAccepted: boolean | null;
  rulesAccepted: boolean | null;
  status: string | null;
  createdAt: Date | null;
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

export async function GET() {
  try {
    // Récupérer toutes les équipes
    const allTeams = await db.select().from(teams);
    
    // Pour chaque équipe, récupérer ses joueurs
    const teamsWithPlayers: TeamWithPlayers[] = await Promise.all(
      allTeams.map(async (team) => {
        const players = await db.select()
          .from(teamPlayers)
          .where(eq(teamPlayers.teamId, team.id));
        
        const teamDetails: TeamWithPlayers = {
          id: team.id,
          teamName: team.teamName,
          teamTag: team.teamTag,
          captainName: team.captainName,
          captainLink: team.captainLink,
          registrationCode: team.registrationCode,
          paymentMethod: team.paymentMethod,
          paymentRef: team.paymentRef,
          paymentDate: team.paymentDate,
          paymentImage: team.paymentImage,
          tournamentId: team.tournamentId,
          termsAccepted: team.termsAccepted,
          rulesAccepted: team.rulesAccepted,
          status: team.status,
          createdAt: team.createdAt,
          player1Id: '',
          player1Name: '',
          player2Id: '',
          player2Name: '',
          player3Id: '',
          player3Name: '',
          player4Id: '',
          player4Name: '',
          sub1Id: '',
          sub1Name: '',
          sub2Id: '',
          sub2Name: '',
        };

        players.forEach((player) => {
          if (player.playerNumber === 1) {
            teamDetails.player1Id = player.playerId;
            teamDetails.player1Name = player.playerName;
          } else if (player.playerNumber === 2) {
            teamDetails.player2Id = player.playerId;
            teamDetails.player2Name = player.playerName;
          } else if (player.playerNumber === 3) {
            teamDetails.player3Id = player.playerId;
            teamDetails.player3Name = player.playerName;
          } else if (player.playerNumber === 4) {
            teamDetails.player4Id = player.playerId;
            teamDetails.player4Name = player.playerName;
          } else if (player.playerNumber === 5) {
            teamDetails.sub1Id = player.playerId;
            teamDetails.sub1Name = player.playerName;
          } else if (player.playerNumber === 6) {
            teamDetails.sub2Id = player.playerId;
            teamDetails.sub2Name = player.playerName;
          }
        });

        return teamDetails;
      })
    );

    return NextResponse.json(teamsWithPlayers);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}