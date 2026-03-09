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

  return new Promise((resolve) => {
    const fields = {};
    const files = [];
    
    const busboy = Busboy({ 
      headers: { 
        'content-type': event.headers['content-type'] || 'multipart/form-data' 
      } 
    });

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, info) => {
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
      console.log('🔵 Tous les champs reçus');
      
      try {
        const sql = neon(process.env.DATABASE_URL);
        
        const registrationCode = 'TT4-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // INSÉRER TOUT D'UN COUP
        const result = await sql`
          INSERT INTO teams (
            team_name, team_tag, captain_name, captain_link,
            registration_code, payment_method, payment_ref, payment_date,
            tournament_id, terms_accepted, rules_accepted,
            player1_id, player1_name, player2_id, player2_name,
            player3_id, player3_name, player4_id, player4_name,
            sub1_id, sub1_name, sub2_id, sub2_name,
            created_at
          ) VALUES (
            ${fields.teamName}, ${fields.teamTag || ''}, ${fields.captainName}, ${fields.captainLink || ''},
            ${registrationCode},
            ${fields.paymentMethod}, ${fields.paymentRef}, ${new Date(fields.paymentDate)},
            ${parseInt(fields.tournamentId)},
            ${fields.termsAccepted === 'true'}, ${fields.rulesAccepted === 'true'},
            ${fields.player1Id || null}, ${fields.player1Name || null},
            ${fields.player2Id || null}, ${fields.player2Name || null},
            ${fields.player3Id || null}, ${fields.player3Name || null},
            ${fields.player4Id || null}, ${fields.player4Name || null},
            ${fields.sub1Id || null}, ${fields.sub1Name || null},
            ${fields.sub2Id || null}, ${fields.sub2Name || null},
            ${new Date()}
          )
          RETURNING id
        `;
        
        console.log('✅ Équipe insérée, ID:', result[0].id);
        
        resolve({
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            registrationCode,
            message: 'Inscription réussie'
          })
        });
        
      } catch (error) {
        console.error('🔴 Erreur DB:', error);
        resolve({
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: error.message,
            stack: error.stack
          })
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