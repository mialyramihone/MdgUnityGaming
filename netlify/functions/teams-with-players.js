const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  console.log('🔵 Fonction teams-with-players appelée');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Récupérer toutes les équipes
    const teams = await sql`
      SELECT * FROM teams WHERE tournament_id = 2 ORDER BY created_at DESC
    `;
    
    // Pour chaque équipe, récupérer ses joueurs
    const teamsWithPlayers = await Promise.all(
      teams.map(async (team) => {
        const players = await sql`
          SELECT * FROM team_players WHERE team_id = ${team.id} ORDER BY player_number
        `;
        
        // Organiser les joueurs par position
        const teamData = {
          id: team.id,
          teamName: team.team_name,
          teamTag: team.team_tag,
          captainName: team.captain_name,
          captainLink: team.captain_link,
          registrationCode: team.registration_code,
          paymentMethod: team.payment_method,
          paymentRef: team.payment_ref,
          paymentDate: team.payment_date,
          paymentImage: team.payment_image,
          tournamentId: team.tournament_id,
          termsAccepted: team.terms_accepted,
          rulesAccepted: team.rules_accepted,
          status: team.status,
          createdAt: team.created_at,
          player1Id: '', player1Name: '',
          player2Id: '', player2Name: '',
          player3Id: '', player3Name: '',
          player4Id: '', player4Name: '',
          sub1Id: '', sub1Name: '',
          sub2Id: '', sub2Name: ''
        };
        
        players.forEach(player => {
          if (player.player_number === 1) {
            teamData.player1Id = player.player_id;
            teamData.player1Name = player.player_name;
          } else if (player.player_number === 2) {
            teamData.player2Id = player.player_id;
            teamData.player2Name = player.player_name;
          } else if (player.player_number === 3) {
            teamData.player3Id = player.player_id;
            teamData.player3Name = player.player_name;
          } else if (player.player_number === 4) {
            teamData.player4Id = player.player_id;
            teamData.player4Name = player.player_name;
          } else if (player.player_number === 5) {
            teamData.sub1Id = player.player_id;
            teamData.sub1Name = player.player_name;
          } else if (player.player_number === 6) {
            teamData.sub2Id = player.player_id;
            teamData.sub2Name = player.player_name;
          }
        });
        
        return teamData;
      })
    );
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(teamsWithPlayers)
    };

  } catch (error) {
    console.error('🔴 Erreur:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};