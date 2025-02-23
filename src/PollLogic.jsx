// src/PollLogic.jsx
import { useState, useEffect } from 'react';

const VOTE_API_URL = '/api/vote/post'; // Proxied to voting-app via Pages routes

export const PollLogic = ({ onVoteUpdate }) => {
  const [votes, setVotes] = useState({});
  const [error, setError] = useState(null);

  const fetchVoteCount = async (vote) => {
    try {
      const response = await fetch(`${VOTE_API_URL}?vote=${vote}`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to fetch vote count');
      const data = await response.json();
      setVotes((prev) => ({ ...prev, [vote]: data.count }));
      onVoteUpdate?.({ vote, count: data.count });
      return data.count;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching vote count:', err);
      return 0;
    }
  };

  const castVote = async (vote) => {
    try {
      const response = await fetch(VOTE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      });
      if (!response.ok) throw new Error('Failed to cast vote');
      const data = await response.json();
      await fetchVoteCount(vote); // Update the count after voting
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error casting vote:', err);
      return null;
    }
  };

  useEffect(() => {
    // Fetch initial counts for all options
    const fetchInitialCounts = async () => {
      const initialVotes = {};
      for (const option of ['A', 'B', 'C', 'D']) {
        const count = await fetchVoteCount(option);
        initialVotes[option] = count;
      }
      setVotes(initialVotes);
    };
    fetchInitialCounts();
  }, [fetchVoteCount]);

  return { votes, castVote, error };
};