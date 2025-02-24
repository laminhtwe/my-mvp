import { useState } from 'react';

const VOTE_API_URL = 'https://mutuist.com/api/vote'; //  path for  Functions

export const PollLogic = ({ onVoteUpdate }) => {
  const [votes, setVotes] = useState({});
  const [error, setError] = useState(null);

  const fetchVoteCount = async (vote) => {
    try {
      console.log(`Fetching count for ${vote} from ${VOTE_API_URL}?vote=${vote}`);
      const response = await fetch(`${VOTE_API_URL}?vote=${vote}`, {
        method: 'GET', // Remove headers for GET unless needed
      });
      if (response.status === 405) {
        console.error(`405 Method Not Allowed for ${vote}: ${response.statusText}`);
        throw new Error('Method not allowed');
      }
      if (!response.ok) throw new Error(`Failed to fetch vote count for ${vote}: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log(`Fetched count for ${vote}: ${data.count}`);
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
      console.log(`Casting vote for ${vote} to ${VOTE_API_URL}`);
      const response = await fetch(VOTE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      });
      if (response.status === 405) {
        console.error(`405 Method Not Allowed for ${vote}: ${response.statusText}`);
        throw new Error('Method not allowed');
      }
      if (!response.ok) throw new Error(`Failed to cast vote for ${vote}: ${response.status} ${response.statusText}`);
      console.log(`Vote cast response for ${vote}: ${await response.text()}`);
      const data = await response.json();
      await fetchVoteCount(vote); // Fetch count after voting
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error casting vote:', err);
      return null;
    }
  };

  return { votes, castVote, error };
};