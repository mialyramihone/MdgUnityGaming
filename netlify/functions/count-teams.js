
const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');
const { teams } = require('../../db/schema');
const { eq } = require('drizzle-orm');

exports.handler = async (event) => {
  console.log('🔵 Netlify Function: count-teams appelée');
  
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

    
    const connectionString = process.env.DATABASE_URL;
    const sql = postgres(connectionString);
    const db = drizzle(sql);

    
    const result = await db.select()
      .from(teams)
      .where(eq(teams.tournamentId, id));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count: result.length }),
    };

  } catch (error) {
    console.error('🔴 ERREUR:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};