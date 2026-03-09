const { neon } = require('@neondatabase/serverless');
const Busboy = require('busboy');

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
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  return new Promise((resolve) => {
    const fields = {};
    const files = [];
    
    const busboy = Busboy({ 
      headers: { 
        'content-type': event.headers['content-type'] || 'multipart/form-data' 
      } 
    });

    busboy.on('field', (fieldname, val) => {
      console.log(`🔵 Champ reçu: ${fieldname}=${val}`);
      fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, info) => {
      console.log(`🔵 Fichier reçu: ${fieldname}`);
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        files.push({
          fieldname,
          filename: info.filename,
          encoding: info.encoding,
          mimetype: info.mimeType,
          buffer: Buffer.concat(chunks)
        });
      });
    });

    busboy.on('finish', async () => {
      console.log('🔵 Tous les champs:', fields);
      
      try {
        const sql = neon(process.env.DATABASE_URL);
        
        // Test simple
        const result = await sql`SELECT COUNT(*) as count FROM teams`;
        
        resolve({
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            count: result[0].count,
            receivedFields: Object.keys(fields)
          })
        });
        
      } catch (error) {
        console.error('🔴 Erreur DB:', error);
        resolve({
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: error.message })
        });
      }
    });

    busboy.on('error', (error) => {
      console.error('🔴 Erreur Busboy:', error);
      resolve({
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      });
    });

    const buffer = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
    busboy.end(buffer);
  });
};