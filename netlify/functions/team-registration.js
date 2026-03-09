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

  try {
    const { fields, files } = await multipartParser.parse(event);
    
    // ✅ Vérification que fields existe
    if (!fields) {
      console.log('🔴 fields est undefined');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Aucune donnée reçue' })
      };
    }
    
    console.log('🔵 Fields reçus:', Object.keys(fields));
    console.log('🔵 Contenu:', fields);
    
    // Connexion à Neon
    const sql = neon(process.env.DATABASE_URL);
    
    // Test simple
    const result = await sql`SELECT COUNT(*) as count FROM teams`;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        count: result[0].count,
        receivedFields: Object.keys(fields)
      })
    };

  } catch (error) {
    console.error('🔴 Erreur:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack
      })
    };
  }
};