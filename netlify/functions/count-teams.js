const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  console.log('🔵 Fonction count-teams appelée');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const tournamentId = event.queryStringParameters?.tournamentId;
    
    if (!tournamentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'tournamentId manquant' }),
      };
    }

    const id = parseInt(tournamentId, 10);
    if (isNaN(id)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'tournamentId invalide' }),
      };
    }

    
    const sql = neon(process.env.DATABASE_URL);
    
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM teams 
      WHERE tournament_id = ${id}
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count: parseInt(result[0].count) }),
    };

  } catch (error) {
    console.error('🔴 Erreur:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};