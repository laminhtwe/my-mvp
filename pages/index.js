import React from 'react';
import PollUI from '../src/PollUI';
import theme from '../src/theme';
import { ThemeProvider } from '@mui/material/styles';

const Index = () => {
  return (
    <ThemeProvider theme={theme}>
      <PollUI />
    </ThemeProvider>
  );
};

export default Index;