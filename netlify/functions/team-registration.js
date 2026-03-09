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
        
        // 1️⃣ INSÉRER L'ÉQUIPE (sans les joueurs)
        const teamResult = await sql`
          INSERT INTO teams (
            team_name, team_tag, captain_name, captain_link,
            registration_code, payment_method, payment_ref, payment_date,
            tournament_id, terms_accepted, rules_accepted,
            created_at
          ) VALUES (
            ${fields.teamName}, 
            ${fields.teamTag || ''}, 
            ${fields.captainName}, 
            ${fields.captainLink || ''},
            ${registrationCode},
            ${fields.paymentMethod}, 
            ${fields.paymentRef}, 
            ${new Date(fields.paymentDate)},
            ${parseInt(fields.tournamentId)},
            ${fields.termsAccepted === 'true'}, 
            ${fields.rulesAccepted === 'true'},
            ${new Date()}
          )
          RETURNING id
        `;
        
        const teamId = teamResult[0].id;
        console.log('✅ Équipe insérée, ID:', teamId);
        
        // 2️⃣ INSÉRER LES JOUEURS DANS team_players
        const players = [
          { num: 1, id: fields.player1Id, name: fields.player1Name, sub: false },
          { num: 2, id: fields.player2Id, name: fields.player2Name, sub: false },
          { num: 3, id: fields.player3Id, name: fields.player3Name, sub: false },
          { num: 4, id: fields.player4Id, name: fields.player4Name, sub: false },
          { num: 5, id: fields.sub1Id, name: fields.sub1Name, sub: true },
          { num: 6, id: fields.sub2Id, name: fields.sub2Name, sub: true }
        ];
        
        for (const player of players) {
          if (player.id && player.name) {
            await sql`
              INSERT INTO team_players (
                team_id, player_number, player_id, player_name, is_substitute, created_at
              ) VALUES (
                ${teamId}, 
                ${player.num}, 
                ${player.id}, 
                ${player.name}, 
                ${player.sub}, 
                ${new Date()}
              )
            `;
            console.log(`✅ Joueur ${player.num} inséré`);
          }
        }
        
        // 3️⃣ GÉRER L'IMAGE DE PAIEMENT (si besoin)
        // Pour l'instant, on ignore l'image
        
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