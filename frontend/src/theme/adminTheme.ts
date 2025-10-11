import { createTheme } from '@mui/material/styles';

export const createAdminTheme = (isDarkMode: boolean) => {
  return createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      info: {
        main: '#06b6d4',
        light: '#22d3ee',
        dark: '#0891b2',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      background: {
        default: isDarkMode ? '#0f172a' : '#f8fafc',
        paper: isDarkMode ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#f1f5f9' : '#1e293b',
        secondary: isDarkMode ? '#94a3b8' : '#64748b',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0,0,0,0.05)',
      '0px 4px 6px rgba(0,0,0,0.07)',
      '0px 6px 12px rgba(0,0,0,0.1)',
      '0px 8px 16px rgba(0,0,0,0.12)',
      '0px 12px 24px rgba(0,0,0,0.15)',
      '0px 16px 32px rgba(0,0,0,0.18)',
      '0px 20px 40px rgba(0,0,0,0.2)',
      '0px 24px 48px rgba(0,0,0,0.22)',
      '0 0 0 1px rgba(0,0,0,.05),0 1px 2px 0 rgba(0,0,0,.05)',
      '0 0 0 1px rgba(0,0,0,.05),0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)',
      '0 0 0 1px rgba(0,0,0,.05),0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)',
      '0 25px 50px -12px rgba(0,0,0,.25)',
      '0 35px 60px -15px rgba(0,0,0,.3)',
      '0 45px 70px -20px rgba(0,0,0,.35)',
      '0 50px 100px -20px rgba(0,0,0,.4)',
      '0 60px 120px -25px rgba(0,0,0,.45)',
      '0 70px 140px -30px rgba(0,0,0,.5)',
      '0 80px 160px -35px rgba(0,0,0,.55)',
      '0 90px 180px -40px rgba(0,0,0,.6)',
      '0 100px 200px -45px rgba(0,0,0,.65)',
      '0 110px 220px -50px rgba(0,0,0,.7)',
      '0 120px 240px -55px rgba(0,0,0,.75)',
      '0 130px 260px -60px rgba(0,0,0,.8)',
      '0 140px 280px -65px rgba(0,0,0,.85)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: '0.95rem',
            fontWeight: 600,
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(16, 185, 129, 0.3)',
              transform: 'translateY(-2px)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0px 8px 20px rgba(16, 185, 129, 0.4)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px !important',
            boxShadow: isDarkMode 
              ? '0px 8px 32px rgba(0, 0, 0, 0.5) !important' 
              : '0px 8px 32px rgba(0, 0, 0, 0.12) !important',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important',
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              transform: 'translateY(-8px) scale(1.02) !important',
              boxShadow: isDarkMode
                ? '0px 20px 60px rgba(0, 0, 0, 0.7) !important'
                : '0px 20px 60px rgba(0, 0, 0, 0.2) !important',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: isDarkMode
              ? '0px 2px 8px rgba(0, 0, 0, 0.3)'
              : '0px 2px 8px rgba(0, 0, 0, 0.06)',
          },
          elevation2: {
            boxShadow: isDarkMode
              ? '0px 4px 16px rgba(0, 0, 0, 0.4)'
              : '0px 4px 16px rgba(0, 0, 0, 0.08)',
          },
          elevation3: {
            boxShadow: isDarkMode
              ? '0px 6px 24px rgba(0, 0, 0, 0.5)'
              : '0px 6px 24px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              transition: 'all 0.3s ease',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: 2,
                },
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDarkMode
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.06)',
          },
          head: {
            fontWeight: 700,
            backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            boxShadow: isDarkMode
              ? '0px 24px 80px rgba(0, 0, 0, 0.8)'
              : '0px 24px 80px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
            borderRight: isDarkMode
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
  });
};

