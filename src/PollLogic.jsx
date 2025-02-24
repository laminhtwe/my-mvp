// src/PollLogic.jsx
import { useState, useEffect } from 'react';

const VOTE_API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8787/api/vote/post'
  : 'https://voting-app.hackerinverse.workers.dev/api/vote/post';

export const PollLogic = ({ onVoteUpdate }) => {
  const [votes, setVotes] = useState({});
  const [error, setError] = useState(null);

  const fetchVoteCount = async (vote) => {
    try {
      const response = await fetch(`${VOTE_API_URL}?vote=${vote}`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error(`Failed to fetch vote count for ${vote}: ${response.status} ${response.statusText}`);
      console.log(`Fetched count for ${vote}: ${response.status} ${response.statusText}`); // Debug log
      const data = await response.json();
      console.log(`Fetched count for ${vote}: ${data.count}`); // Debug log
      setVotes((prev) => ({ ...prev, [vote]: data.count }));
      onVoteUpdate?.({ vote, count: data.count });
      return data.count;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching vote count:', err);
      return 0; // Default to 0 if Worker fails, keeping UI static
    }
  };

  const castVote = async (vote) => {
    try {
      const response = await fetch(VOTE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      });
      if (!response.ok) throw new Error(`Failed to cast vote for ${vote}: ${response.status} ${response.statusText}`);
      console.log(`Vote cast response for ${vote}: ${await response.text()}`); // Debug log
      const data = await response.json();
      await fetchVoteCount(vote); // Update the count after voting
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error casting vote:', err);
      return null;
    }
  };

  // Optional: Remove or delay initial fetch
  // useEffect(() => {
  //   const fetchInitialCounts = async () => {
  //     const initialVotes = {};
  //     for (const option of ['A', 'B', 'C', 'D']) {
  //       const count = await fetchVoteCount(option);
  //       initialVotes[option] = count;
  //     }
  //     setVotes(initialVotes);
  //   };
  //   fetchInitialCounts();
  // }, [fetchVoteCount]);

  return { votes, castVote, error };
};