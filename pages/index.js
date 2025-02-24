import React from 'react';
import theme from '../src/theme';
import { ThemeProvider } from '@mui/material/styles';
import dynamic from 'next/dynamic';

const PollUI = dynamic(() => import('../src/PollUI'), { ssr: false });

const Index = () => {
  return (
    <ThemeProvider theme={theme}>
      <PollUI />
    </ThemeProvider>
  );
};

export default Index;