# TOP4 Call Drivers - Full SEO-Focused SSR Website

This document provides a comprehensive overview of the TOP4 Call Drivers website, including its architecture, features, and instructions for setup, deployment, and maintenance.

## 🚀 Project Overview

The TOP4 Call Drivers website is a lightning-fast, SEO-focused, and secure platform built with Next.js for server-side rendering. It provides a seamless booking experience for customers and a comprehensive management system for administrators.

### Key Features

- **Lightning-Fast Performance**: Optimized with server-side rendering, caching, and Web Vitals monitoring.
- **Multi-Layer Security**: Hardened with rate limiting, CSRF protection, and security headers.
- **SEO Optimized**: Complete with structured data, dynamic sitemaps, and optimized meta tags.
- **Secure Authentication**: JWT-based authentication with OTP and password login.
- **Professional Design**: Fully responsive, mobile-first UI with a modern look and feel.
- **Comprehensive Booking System**: Easy-to-use booking form with real-time validation.
- **Full API Implementation**: Complete set of APIs for all website functionality.
- **Production Ready**: Optimized configuration and monitoring for deployment.

## 📊 Technical Architecture

### Frontend

- **Framework**: Next.js 15.5.0 with TypeScript
- **Styling**: Tailwind CSS with Material-UI components
- **State Management**: React hooks and context
- **Performance**: Server-side rendering, code splitting, lazy loading

### Backend

- **API**: Next.js API routes with middleware
- **Database**: SQLite with a comprehensive schema
- **Authentication**: JWT tokens with secure session management
- **Security**: Multi-layer protection with rate limiting and validation

## ⚙️ Setup and Installation

### Prerequisites

- Node.js >= 18.x
- npm or yarn

### Installation

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd top4-website
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up environment variables**:

    Create a `.env.local` file in the root of the project and add the following variables:

    ```
    # Secret key for JWT token signing
    JWT_SECRET=your-super-secret-key

    # Database configuration (for SQLite)
    DATABASE_URL="file:./dev.db"

    # API configuration
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    ```

4.  **Run database migrations**:

    ```bash
    npx prisma migrate dev
    ```

5.  **Start the development server**:

    ```bash
    npm run dev
    ```

    The website will be available at `http://localhost:3000`.

## 🚀 Deployment

The website is optimized for production deployment with a standalone output configuration.

1.  **Build the project**:

    ```bash
    npm run build
    ```

2.  **Start the production server**:

    ```bash
    npm start
    ```

    The production-ready server will start on the configured port.

### Deployment Platforms

- **Vercel**: Recommended for easy deployment of Next.js applications.
- **Docker**: A `Dockerfile` can be created for containerized deployment.
- **Node.js Server**: Deploy as a standard Node.js application.

## 🔐 Security

The website includes multiple layers of security to protect against common vulnerabilities:

- **Rate Limiting**: Middleware to prevent brute-force attacks.
- **CSRF Protection**: Synchronizer token pattern for all state-changing requests.
- **Security Headers**: XSS protection, content security policy, and more.
- **Input Sanitization**: Protection against XSS and SQL injection.
- **Secure Authentication**: JWT tokens with `httpOnly` cookies.

## 📈 SEO and Performance

The website is highly optimized for search engines and performance:

- **Server-Side Rendering**: Fast initial page loads and better SEO.
- **Structured Data**: JSON-LD for rich snippets in search results.
- **Dynamic Sitemap**: Automatically generated sitemap for all pages.
- **Image Optimization**: Next.js image optimization for faster loading.
- **Web Vitals Monitoring**: Built-in performance monitoring and analytics.

## 🔧 Maintenance

### Monitoring

- **Performance**: Use the `/api/analytics/performance` endpoint to monitor Web Vitals.
- **Security**: Review audit logs for suspicious activity.

### Updates

- **Dependencies**: Regularly update npm packages to the latest versions.
- **Security Patches**: Apply security patches as they become available.

## 📚 Documentation

- **API Documentation**: The Postman collection provides detailed API documentation.
- **Testing Report**: The `TESTING_REPORT.md` file contains a comprehensive testing summary.
- **Database Schema**: The `database-schema.md` file outlines the database structure.

## 📞 Support

For any questions or issues, please contact the development team.

