'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES, APP_CONFIG } from '@/utils/constants';

const navigationItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Services', href: ROUTES.SERVICES },
  { label: 'For Business', href: ROUTES.BUSINESS },
  { label: 'About Us', href: ROUTES.ABOUT },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.label} component={Link} href={item.href}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<DownloadIcon />}
            component={Link}
            href={ROUTES.DOWNLOAD}
          >
            Download App
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar>
          {/* Logo */}
          <Box component={Link} href={ROUTES.HOME} sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                textDecoration: 'none',
              }}
            >
              {APP_CONFIG.name}
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  color="inherit"
                  sx={{ mx: 1 }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                component={Link}
                href={ROUTES.DOWNLOAD}
              >
                Download App
              </Button>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

