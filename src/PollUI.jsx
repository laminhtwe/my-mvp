import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import { PollLogic } from './PollLogic';
import { pollData } from './PollData';
import { useTheme } from '@mui/material/styles';

const PollContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default || '#f5f5f5',
  padding: '2rem',
  borderRadius: '8px',
  maxWidth: '500px',
  margin: '0 auto',
  color: theme.palette.text.primary || '#333',
}));

const Option = styled(Box)(({ theme }) => ({
  padding: '1rem',
  marginBottom: '0.5rem',
  backgroundColor: theme.palette.background.light || '#f0f0f0',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'transform 0.2s ease-in-out',
  cursor: 'pointer',
  color: '#000',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    transform: 'scale(1.05)',
  },
  '&.selected': {
    backgroundColor: theme.palette.primary.light,
    transform: 'scale(1.05)',
  },
}));

const VoteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom?.purpureus || '#9B5DE5',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#8a3a85',
  },
  marginTop: '1rem',
  width: '100%',
}));

const PollUI = () => {
  const theme = useTheme() || { palette: { background: { default: '#f5f5f5', paper: '#fff' }, text: { primary: '#333' }, custom: { purpureus: '#9B5DE5', lightGreen: '#00BB7E', gunmetal: '#2D3E50' } } };
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const checkCookie = () => {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('voted='))
        ?.split('=')[1];
      setHasVoted(!!cookieValue);
    };
    if (process.env.NODE_ENV !== 'development') {
      checkCookie();
    }
  }, []);

  const { votes, castVote, error } = PollLogic({
    onVoteUpdate: (voteData) => {
      console.log('Vote updated in UI:', voteData);
    },
  });

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + Number(count), 0) || 0;
  const handleVote = async () => {
    if (!selectedOption) return;
    if (selectedOption) {
      try {
        await castVote(selectedOption);
        document.cookie = `voted=true; max-age=${24 * 60 * 60}; path=/`;
        setHasVoted(true);
      } catch (err) {
        console.error('Error voting:', err);
        setError?.(err.message);
      }
    }
  };

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
  };

  const [hoverOption, setHoverOption] = useState(null);

  const handleOptionHover = (optionId) => {
    setHoverOption(optionId);
  };

  const handleOptionLeave = () => {
    setHoverOption(null);
  };

  return (
    <PollContainer>
      {hasVoted ? (
        <>
          <Typography variant="h5" gutterBottom align="center">
            Thank you for voting!
          </Typography>
          {pollData.options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((votes[option.id] / totalVotes) * 100) : 0;
            return (
              <Box key={option.id} sx={{ marginBottom: '0.5rem' }}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" sx={{ width: '70%', fontWeight: 'bold' }}>
                    {option.label}
                  </Typography>
                  <Box sx={{ width: '30%', textAlign: 'right' }}>
                    <Typography variant="body2">
                      {`${votes[option.id] || 0} votes`}
                    </Typography>
                    <Typography variant="body2">
                      ({percentage}%)
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{ height: '8px', borderRadius: '4px' }}
                />
              </Box>
            );
          })}
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
            Total Votes: {totalVotes}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom align="center">
            {pollData.question}
          </Typography>
          {pollData.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isHovered = hoverOption === option.id;

            return (
              <Option
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                onMouseEnter={() => handleOptionHover(option.id)}
                onMouseLeave={handleOptionLeave}
                sx={{
                  backgroundColor: isSelected ? theme.palette.primary.light : theme.palette.background.light,
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  padding: '1rem',
                  color: '#000',
                  transform: isHovered ? 'scale(1.05)' : 'none',
                }}
                className={isSelected ? 'selected' : ''}
              >
                <Typography variant="body1" color="inherit">
                  {option.label}
                </Typography>
              </Option>
            );
          })}
          <VoteButton
            variant="contained"
            onClick={handleVote}
            disabled={!selectedOption || hasVoted}
            sx={{
              marginTop: '1rem',
              backgroundColor: theme.palette.custom?.purpureus || '#9B5DE5',
              color: '#ffffff',
              '&:disabled': {
                backgroundColor: '#999',
                color: '#fff',
              },
            }}
          >
            {hasVoted ? 'Voted!' : 'Vote'}
          </VoteButton>
        </>
      )}
      <Typography variant="body2" align="center" color="error" sx={{ mt: 2 }}>
        {error || `Total Votes: ${totalVotes}`}
      </Typography>
    </PollContainer>
  );
};

export default PollUI;