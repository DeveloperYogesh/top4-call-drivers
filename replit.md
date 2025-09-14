# DriveU Clone - Replit Project Documentation

## Overview
This is a Next.js application for a driver service platform called DriveU Clone. The application provides services for booking drivers, car maintenance, and related automotive services.

## Project Architecture
- **Framework**: Next.js 15.5.0 with App Router
- **Styling**: Tailwind CSS 4.x + Material-UI (MUI)
- **Language**: TypeScript
- **UI Library**: Material-UI with custom theme
- **Form Handling**: React Hook Form with Zod validation

## Current State
✅ **Production Ready** - The application is fully configured for the Replit environment and ready for deployment.

## Recent Changes (September 14, 2025)
- ✅ Installed all dependencies from package.json
- ✅ Configured Next.js for Replit iframe embedding with proper CSP headers
- ✅ Set up development workflow on port 5000 with 0.0.0.0 binding
- ✅ Configured standalone output for production deployments
- ✅ Updated production start script to respect PORT environment variable
- ✅ Removed Turbopack to avoid compatibility issues in Replit environment

## Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── common/         # Shared components (Theme, Accessibility)
│   ├── forms/          # Form components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── pages/          # Page-specific components
│   └── ui/             # UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (SEO, theme, validations)
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and constants
```

## Configuration Files
- `next.config.ts` - Next.js configuration with Replit iframe support
- `tailwind.config.js` - Tailwind CSS configuration with custom theme
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

## Deployment Configuration
- **Type**: Autoscale (stateless)
- **Build**: `npm run build`
- **Start**: `npm run start` (binds to 0.0.0.0:PORT)
- **Output**: Standalone for optimized deployments

## Development
- **Dev Server**: Runs on port 5000 with 0.0.0.0 binding
- **Hot Reload**: Enabled via Next.js Fast Refresh
- **TypeScript**: Strict mode enabled with path aliases (@/*)

## User Preferences
(To be updated as user preferences are expressed)

## Notes
- The application uses Material-UI with Tailwind CSS (preflight disabled to avoid conflicts)
- Configured for Replit's iframe embedding with appropriate CSP headers
- All cross-origin warnings in development are expected and non-blocking