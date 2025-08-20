'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  YouTube,
  Android,
  Apple,
} from '@mui/icons-material';
import { APP_CONFIG, ROUTES, SOCIAL_LINKS, APP_STORE_LINKS, CITIES } from '@/utils/constants';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              {APP_CONFIG.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'grey.300' }}>
              {APP_CONFIG.description}
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.300' }}>
              Simplify Car Ownership
            </Typography>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="grey.300" underline="hover">
                Professional Drivers
              </Link>
              <Link href="#" color="grey.300" underline="hover">
                Car Wash
              </Link>
              <Link href="#" color="grey.300" underline="hover">
                FASTag Recharge
              </Link>
              <Link href="#" color="grey.300" underline="hover">
                Car Maintenance
              </Link>
              <Link href="#" color="grey.300" underline="hover">
                Car Insurance
              </Link>
            </Box>
          </Grid>

          {/* Cities */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Cities
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {CITIES.slice(0, 5).map((city) => (
                <Link
                  key={city.id}
                  href={ROUTES.CITY_DRIVERS(city.slug)}
                  color="grey.300"
                  underline="hover"
                >
                  {city.name}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href={ROUTES.ABOUT} color="grey.300" underline="hover">
                About Us
              </Link>
              <Link href={ROUTES.BUSINESS} color="grey.300" underline="hover">
                For Business
              </Link>
              <Link href={ROUTES.CONTACT} color="grey.300" underline="hover">
                Contact Us
              </Link>
              <Link href={ROUTES.BLOG} color="grey.300" underline="hover">
                Blog
              </Link>
              <Link href={ROUTES.COMPARE} color="grey.300" underline="hover">
                Compare
              </Link>
            </Box>
          </Grid>

          {/* Download App */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Download App
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <Link
                href={APP_STORE_LINKS.android}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'grey.300',
                  textDecoration: 'none',
                  '&:hover': { color: 'white' },
                }}
              >
                <Android />
                <Typography variant="body2">Google Play</Typography>
              </Link>
              <Link
                href={APP_STORE_LINKS.ios}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'grey.300',
                  textDecoration: 'none',
                  '&:hover': { color: 'white' },
                }}
              >
                <Apple />
                <Typography variant="body2">App Store</Typography>
              </Link>
            </Box>

            {/* Social Links */}
            <Typography variant="body2" sx={{ mb: 1, color: 'grey.300' }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'grey.300', '&:hover': { color: 'white' } }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'grey.300', '&:hover': { color: 'white' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'grey.300', '&:hover': { color: 'white' } }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'grey.300', '&:hover': { color: 'white' } }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'grey.300', '&:hover': { color: 'white' } }}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />

        {/* Bottom section */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="grey.400">
              © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Link href={ROUTES.TERMS} color="grey.400" underline="hover">
                Terms & Conditions
              </Link>
              <Link href={ROUTES.PRIVACY} color="grey.400" underline="hover">
                Privacy Policy
              </Link>
              <Link href={ROUTES.REFUND} color="grey.400" underline="hover">
                Refund Policy
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

