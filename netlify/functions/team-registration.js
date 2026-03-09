const { neon } = require('@neondatabase/serverless');
const multipartParser = require('lambda-multipart-parser');

exports.handler = async (event) => {
  console.log('🔵 Fonction team-registration appelée');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
    };
  }

  try {
    
    const { fields, files } = await multipartParser.parse(event);
    
    console.log('🔵 Fields reçus:', fields);
    console.log('🔵 Files reçus:', files);

    
    if (!fields.teamName || !fields.captainName || !fields.tournamentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Champs requis manquants' }),
      };
    }

    
    const sql = neon(process.env.DATABASE_URL);
    
    
    const registrationCode = 'TT4-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    
    const result = await sql`
      INSERT INTO teams (
        team_name, team_tag, captain_name, captain_link,
        tournament_id, registration_code, payment_method,
        payment_ref, payment_date, terms_accepted,
        rules_accepted, created_at
      ) VALUES (
        ${fields.teamName},
        ${fields.teamTag || ''},
        ${fields.captainName},
        ${fields.captainLink || ''},
        ${parseInt(fields.tournamentId)},
        ${registrationCode},
        ${fields.paymentMethod || 'mvola'},
        ${fields.paymentRef || ''},
        ${fields.paymentDate || new Date().toISOString().split('T')[0]},
        ${fields.termsAccepted === 'true'},
        ${fields.rulesAccepted === 'true'},
        ${new Date()}
      )
      RETURNING id
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        registrationCode,
        message: 'Inscription réussie'
      }),
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