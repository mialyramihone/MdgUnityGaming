
const { db } = require('../../db/config');
const { teams } = require('../../db/schema');
const { eq } = require('drizzle-orm');
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const multiparty = require('multiparty');

exports.handler = async (event) => {
  console.log('🔵 Netlify Function: team-registration appelée');
  
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
    };
  }

  try {
    
    const formData = await parseFormData(event);
    console.log('🔵 Données reçues:', formData.fields);
    
    
    const requiredFields = [
      'teamName', 'captainName', 'captainLink', 'tournamentId',
      'player1Id', 'player1Name', 'player2Id', 'player2Name',
      'player3Id', 'player3Name', 'player4Id', 'player4Name',
      'paymentDate', 'paymentRef', 'paymentMethod'
    ];
    
    for (const field of requiredFields) {
      if (!formData.fields[field]) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Champ manquant: ${field}` }),
        };
      }
    }

    
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL non configurée');
    }
    
    const sql = postgres(connectionString);
    const db = drizzle(sql);
    
    
    const tournamentId = parseInt(formData.fields.tournamentId, 10);
    if (isNaN(tournamentId)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'tournamentId invalide' }),
      };
    }

    
    const teamData = {
      team_name: formData.fields.teamName,
      team_tag: formData.fields.teamTag || '',
      captain_name: formData.fields.captainName,
      captain_link: formData.fields.captainLink,
      tournament_id: tournamentId,
      registration_code: generateRegistrationCode(),
      payment_method: formData.fields.paymentMethod,
      payment_ref: formData.fields.paymentRef,
      payment_date: formData.fields.paymentDate,
      status: 'en_attente',
      terms_accepted: formData.fields.termsAccepted === 'true',
      rules_accepted: formData.fields.rulesAccepted === 'true',
      created_at: new Date(),
    };

    console.log('🔵 Données à insérer:', teamData);

    
    const result = await db.insert(teams).values(teamData).returning();
    console.log('🟢 Insertion réussie:', result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Équipe inscrite avec succès',
        registrationCode: teamData.registration_code 
      }),
    };

  } catch (error) {
    console.error('🔴 ERREUR:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    };
  }
};


function parseFormData(event) {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    
    form.parse(event, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      
      
      const parsedFields = {};
      Object.keys(fields).forEach(key => {
        parsedFields[key] = fields[key][0];
      });
      
      resolve({ fields: parsedFields, files });
    });
  });
}


function generateRegistrationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TT4-${result}`;
}