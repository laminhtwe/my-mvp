// src/PollUI.jsx
import React from 'react';
import styled from '@emotion/styled';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import { PollLogic } from './PollLogic';
import { pollData } from './PollData';
import { useTheme } from '@mui/material/styles';

const PollContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: '2rem',
  borderRadius: '8px',
  maxWidth: '500px',
  margin: '0 auto',
  color: theme.palette.text.primary,
}));

const Option = styled(Box)(({ theme }) => ({
  padding: '1rem',
  marginBottom: '0.5rem',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const VoteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.purpureus,
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#8a3a85',
  },
  marginTop: '1rem',
  width: '100%',
}));

const PollUI = () => {
  const theme = useTheme();
  const { votes, castVote, error } = PollLogic({
    onVoteUpdate: (voteData) => {
      console.log('Vote updated in UI:', voteData);
    },
  });

  useEffect(() => {
    console.log('Votes state updated:', votes); // Debug log to track changes
  }, [votes]);

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0) || 1; // Avoid division by zero

  const handleVote = async (vote) => {
    await castVote(vote);
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
              <Typography variant="caption" color={theme.palette.custom.lightGreen}>
                {count} votes, {percentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                width: '200px',
                backgroundColor: theme.palette.custom.gunmetal,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.custom.purpureus,
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