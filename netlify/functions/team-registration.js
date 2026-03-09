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
    console.log('🔵 Fields reçus:', fields);
    
    
    const sql = neon(process.env.DATABASE_URL);
    
    
    const result = await sql`SELECT COUNT(*) as count FROM teams`;
    console.log('🔵 Résultat DB:', result);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Test réussi',
        count: result[0].count,
        fields: Object.keys(fields)
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