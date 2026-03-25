import { useState, useEffect } from 'react';

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teams-with-players');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTeams(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      const res = await fetch(`/.netlify/functions/delete-team?id=${teamId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setTeams(prev => prev.filter(t => t.id !== teamId));
        return { success: true };
      }
      const data = await res.json();
      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return { teams, loading, fetchTeams, deleteTeam };
}