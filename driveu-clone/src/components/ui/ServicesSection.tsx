'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
} from '@mui/material';
import {
  DirectionsCar,
  LocalCarWash,
  Toll,
  CleaningServices,
  Build,
  Security,
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';
import { SERVICES, ROUTES } from '@/utils/constants';

const iconMap = {
  DirectionsCar,
  LocalCarWash,
  Toll,
  CleaningServices,
  Build,
  Security,
};

export default function ServicesSection() {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Comprehensive car services and professional drivers at your fingertips
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {SERVICES.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || DirectionsCar;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      '& .service-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                      '& .service-button': {
                        transform: 'translateX(4px)',
                      },
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Service Icon */}
                  <Box
                    sx={{
                      p: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.main}10 100%)`,
                    }}
                  >
                    <Box
                      className="service-icon"
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 40,
                          color: 'white',
                        }}
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {service.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    {service.available ? (
                      <Button
                        className="service-button"
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        component={Link}
                        href={ROUTES.SERVICES}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {service.id === 'professional-drivers' ? 'Book Now' : 'Learn More'}
                      </Button>
                    ) : (
                      <Button
                        variant="text"
                        disabled
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Coming Soon
                      </Button>
                    )}
                  </CardActions>

                  {/* Availability Badge */}
                  {service.available && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: theme.palette.success.main,
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      Available
                    </Box>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: theme.palette.text.primary,
            }}
          >
            Simplify Car Ownership
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Download the TOP4 Call Drivers app on iOS / Android phones for a seamless car ownership experience. 
            Track all your bookings and get rewarded for every transaction.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href={ROUTES.DOWNLOAD}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Download App
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href={ROUTES.SERVICES}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              View All Services
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

