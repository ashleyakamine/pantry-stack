import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', 
    },
    secondary: {
      main: '#FFEBA2',
    },
    alert: {
      main: '#c20202', 
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#c20202', 
          },
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#000000', 
            }
          }
        }
      },
    }
  },
  
});
