'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  DirectionsCar,
  Security,
  Verified,
  GetApp,
} from '@mui/icons-material';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

const features = [
  {
    icon: <Security />,
    text: 'Motor insurance is renewed',
  },
  {
    icon: <DirectionsCar />,
    text: 'Your car wash is booked',
  },
  {
    icon: <Verified />,
    text: 'Your FASTag is recharged',
  },
];

export default function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 1,
                mb: 2,
                display: 'block',
              }}
            >
              SIMPLIFY CAR OWNERSHIP
            </Typography>
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 3,
                color: theme.palette.text.primary,
              }}
            >
              Hire professional drivers, and all car services at your fingertips.
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                fontWeight: 400,
              }}
            >
              Get rewarded for owning a car!
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                href={ROUTES.BOOK_DRIVER}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Book Driver
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<GetApp />}
                component={Link}
                href={ROUTES.DOWNLOAD}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Download App
              </Button>
            </Box>

            {/* Feature Cards */}
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.success.main,
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {feature.text}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Content - Illustration */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: { xs: 300, md: 500 },
              }}
            >
              {/* Driver Illustration Placeholder */}
              <Box
                sx={{
                  width: { xs: 250, md: 400 },
                  height: { xs: 200, md: 350 },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: -10,
                    right: -10,
                    bottom: -10,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4,
                    opacity: 0.3,
                    zIndex: -1,
                  },
                }}
              >
                <DirectionsCar
                  sx={{
                    fontSize: { xs: 60, md: 100 },
                    color: 'white',
                  }}
                />
              </Box>

              {/* Floating Elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '10%',
                  right: '10%',
                  width: 60,
                  height: 60,
                  background: theme.palette.success.main,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                  },
                }}
              >
                <Verified sx={{ color: 'white' }} />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '5%',
                  width: 50,
                  height: 50,
                  background: theme.palette.warning.main,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'float 3s ease-in-out infinite 1s',
                }}
              >
                <Security sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

