import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Wrench, Clock } from 'lucide-react';

interface MaintenancePageProps {
  message?: string;
  estimatedEndAt?: string;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ 
  message = 'We are currently performing scheduled maintenance. We will be back shortly.',
  estimatedEndAt 
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 4,
            padding: { xs: 4, md: 6 },
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    opacity: 0.8,
                  },
                },
              }}
            >
              <Wrench size={60} style={{ color: '#10b981' }} />
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 2,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
            }}
          >
            We'll be back soon!
          </Typography>

          {/* Message */}
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.8,
            }}
          >
            {message}
          </Typography>

          {/* Estimated End Time */}
          {estimatedEndAt && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: '#fef3c7',
                color: '#92400e',
                padding: '12px 24px',
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Clock size={20} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Expected back: {new Date(estimatedEndAt).toLocaleString()}
              </Typography>
            </Box>
          )}

          {/* Decorative Line */}
          <Box
            sx={{
              width: 60,
              height: 4,
              backgroundColor: '#10b981',
              borderRadius: 2,
              margin: '0 auto',
              mt: 4,
            }}
          />

          {/* Footer Text */}
          <Typography
            variant="body2"
            sx={{
              color: '#94a3b8',
              mt: 3,
              fontSize: '0.875rem',
            }}
          >
            Thank you for your patience!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MaintenancePage;

