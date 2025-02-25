import { useState } from 'react';

const VOTE_API_URL = 'https://voting.mutuist.com/api/vote/post'; // Updated path for casting votes

export const PollLogic = ({ onVoteUpdate }) => {
  const [votes, setVotes] = useState({});
  const [error, setError] = useState(null);

  const fetchVoteCount = async (vote) => {
    try {
      console.log(`Fetching count for ${vote} from ${VOTE_API_URL}`);
      const response = await fetch(VOTE_API_URL, { // Modified URL
        method: 'GET', // Remove headers for GET unless needed
      });
      if (response.status === 405) {
        console.error(`405 Method Not Allowed for ${vote}: ${response.statusText}`);
        throw new Error('Method not allowed');
      }
      if (!response.ok) throw new Error(`Failed to fetch vote count for ${vote}: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log(`Fetched count for ${vote}: ${data[vote]}`); // Modified data access
      setVotes((prev) => ({ ...prev, [vote]: data[vote] })); // Modified data access
      onVoteUpdate?.({ vote, count: data[vote] }); // Modified data access
      return data[vote]; // Modified data access
    } catch (err) {
      console.error('Error fetching vote count:', err);
      setError(err.message);
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
      const data = await response.json();
      await fetchVoteCount(vote); // Fetch count after voting
      return data;
    } catch (err) {
      console.error('Error casting vote:', err);
      setError(err.message);
      return null;
    }
  };

  return { votes, castVote, error };
};