import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import { PollLogic } from './PollLogic';
import { pollData } from './PollData';
import { useTheme } from '@mui/material/styles';

const PollContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default || '#f5f5f5', // Fallback color
  padding: '2rem',
  borderRadius: '8px',
  maxWidth: '500px',
  margin: '0 auto',
  color: theme.palette.text.primary || '#333',
}));

const Option = styled(Box)(({ theme }) => ({
  padding: '1rem',
  marginBottom: '0.5rem',
  backgroundColor: theme.palette.background.paper || '#fff',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const VoteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom?.purpureus || '#9B5DE5', // Fallback purple
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#8a3a85',
  },
  marginTop: '1rem',
  width: '100%',
}));

const PollUI = () => {
  const theme = useTheme() || { palette: { background: { default: '#f5f5f5', paper: '#fff' }, text: { primary: '#333' }, custom: { purpureus: '#9B5DE5', lightGreen: '#00BB7E', gunmetal: '#2D3E50' } } };
  const { votes, castVote, error } = PollLogic({
    onVoteUpdate: (voteData) => {
      console.log('Vote updated in UI:', voteData);
      console.log('onVoteUpdate called');
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Votes state updated:', votes);
    }
  }, [votes]);

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0) || 1;

  const handleVote = async (vote) => {
    try {
      await castVote(vote);
    } catch (err) {
      console.error('Error voting:', err);
      setError?.(err.message); // If PollLogic passes setError via props or update state
    }
  };

  return (
    <PollContainer>
      <Typography variant="h5" gutterBottom align="center">
        {pollData.question}
      </Typography>
      {pollData.options.map((option) => {
        const count = votes[option.id] || 0;
        const percentage = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
        return (
          <Option key={option.id}>
            <Box>
              <Typography variant="body1">
                {option.label}
              </Typography>
              <Typography variant="caption" color={theme.palette.custom?.lightGreen || '#00BB7E'}>
                {count} votes, {percentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                width: '200px',
                backgroundColor: theme.palette.custom?.gunmetal || '#2D3E50',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.custom?.purpureus || '#9B5DE5',
                },
              }}
            />
            <VoteButton
              variant="contained"
              onClick={() => handleVote(option.id)}
            >
              Vote
            </VoteButton>
          </Option>
        );
      })}
      <Typography variant="body2" align="center" color="error" sx={{ mt: 2 }}>
        {error || 'Total Votes: ' + totalVotes}
      </Typography>
    </PollContainer>
  );
};

export default PollUI;