// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Set dark mode as the default
    primary: {
      main: '#a846a0', // Purpureus for primary actions (e.g., buttons)
    },
    secondary: {
      main: '#0caadc', // Process Cyan for secondary elements
    },
    background: {
      default: '#272d2d', // Gunmetal as the background
      paper: '#272d2d', // Consistent dark background for paper components
    },
    text: {
      primary: '#ffffff', // White text for readability on dark background
      secondary: '#7dde92', // Light Green for secondary text
    },
    custom: {
      peach: '#efbc9b', // Peach for accents or highlights
      purpureus: '#a846a0', // Purpureus for buttons or highlights
      lightGreen: '#7dde92', // Light Green for progress or status
      processCyan: '#0caadc', // Process Cyan for links or secondary actions
      gunmetal: '#272d2d', // Gunmetal for background consistency
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      color: '#ffffff', // White for headings
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#a846a0', // Purpureus for the "Vote" button
          '&:hover': {
            backgroundColor: '#8a3a85', // Darker shade of Purpureus for hover
          },
        },
      },
    },
  },
});

export default theme;