import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export const handler: Handler = async (event, context) => {
  try {
    const matchFilter = event.queryStringParameters?.match;
    
    let allRankings;
    
    if (matchFilter && parseInt(matchFilter) > 0) {
      const matchNumber = parseInt(matchFilter);
      
      
      allRankings = await sql`
        SELECT 
          t.id,
          t.team_name as "teamName",
          t.team_tag as "teamTag",
          COALESCE(SUM(mr.points), 0) as "totalPoints",
          COALESCE(SUM(mr.kills), 0) as "totalKills",
          COALESCE(SUM(CASE WHEN mr.booyah = true THEN 1 ELSE 0 END), 0) as "totalBooyahs",
          COUNT(DISTINCT mr.map_id) as "matchesPlayed"
        FROM teams t
        LEFT JOIN map_results mr ON t.id = mr.team_id
        LEFT JOIN maps mp ON mr.map_id = mp.id
        LEFT JOIN matches m ON mp.match_id = m.id
        WHERE m.match_number = ${matchNumber}
        GROUP BY t.id, t.team_name, t.team_tag
        ORDER BY "totalPoints" DESC, "totalBooyahs" DESC, "totalKills" DESC
      `;
    } else {
      
      allRankings = await sql`
        SELECT 
          t.id,
          t.team_name as "teamName",
          t.team_tag as "teamTag",
          COALESCE(SUM(mr.points), 0) as "totalPoints",
          COALESCE(SUM(mr.kills), 0) as "totalKills",
          COALESCE(SUM(CASE WHEN mr.booyah = true THEN 1 ELSE 0 END), 0) as "totalBooyahs",
          COUNT(DISTINCT CONCAT(m.match_number, '-', mp.map_number)) as "matchesPlayed"
        FROM teams t
        LEFT JOIN map_results mr ON t.id = mr.team_id
        LEFT JOIN maps mp ON mr.map_id = mp.id
        LEFT JOIN matches m ON mp.match_id = m.id
        GROUP BY t.id, t.team_name, t.team_tag
        ORDER BY "totalPoints" DESC, "totalBooyahs" DESC, "totalKills" DESC
      `;
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(allRankings),
    };
  } catch (error) {
    console.error('Erreur API rankings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};