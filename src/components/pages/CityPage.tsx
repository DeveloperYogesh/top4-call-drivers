"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LocationOn,
  Star,
  Schedule,
  Security,
  Phone,
  DirectionsCar,
  CheckCircle,
} from "@mui/icons-material";
import Link from "next/link";
import { CityData } from "@/types";
import { formatCurrency } from "@/utils/helpers";

interface CityPageProps {
  cityData: CityData;
}

const features = [
  {
    icon: <Security color="primary" />,
    title: "Verified Drivers",
    description: "All drivers are background verified and licensed",
  },
  {
    icon: <Schedule color="primary" />,
    title: "24/7 Availability",
    description: "Book drivers anytime, anywhere in the city",
  },
  {
    icon: <Star color="primary" />,
    title: "Rated Drivers",
    description: "Choose from highly rated professional drivers",
  },
  {
    icon: <DirectionsCar color="primary" />,
    title: "All Vehicle Types",
    description: "Support for manual, automatic, and all car sizes",
  },
];

const benefits = [
  "No surge pricing - transparent rates",
  "Professional and courteous drivers",
  "Real-time tracking and updates",
  "Flexible booking options",
  "Damage protection available",
  "Multiple payment options",
];

export default function CityPage({ cityData }: CityPageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <div className="text-center">
            <div>
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={`Available in ${cityData.name}`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    mb: 2,
                  }}
                />
              </Box>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                Hire Professional Drivers in {cityData.name}
              </h1>

              <h5 className="text-lg md:text-xl mb-6">
                Book verified, professional drivers for safe and comfortable
                rides across {cityData.name}. Available 24/7 with transparent
                pricing starting from {formatCurrency(cityData.basePrice)}.
              </h5>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <Button
                  component={Link}
                  href="/book-driver"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "white",
                    color: theme.palette.primary.main,
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                  startIcon={<Phone />}
                >
                  Book Driver Now
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  View Pricing
                </Button>
              </div>
            </div>

            <div className="w-fit mx-auto">
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: theme.palette.text.primary }}
                >
                  Quick Stats for {cityData.name}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {cityData.driversCount}+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verified Drivers
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {cityData.areasCount}+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Areas Covered
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      4.8★
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Rating
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      24/7
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Availability
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </div>
          </div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Why Choose TOP4 Call Drivers in {cityData.name}?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Experience the best driver hiring service with our professional and
            reliable drivers
          </Typography>
        </Box>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </div>
      </Container>

      {/* Areas Covered Section */}
      <Box sx={{ backgroundColor: theme.palette.grey[50], py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Areas We Cover in {cityData.name}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Our professional drivers are available across all major areas in{" "}
              {cityData.name}
            </Typography>
          </Box>

          <div className="flex md:flex-wrap justify-center gap-4 mb-6">
            {cityData.areas.map((area, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card
                  sx={{
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOn sx={{ fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {area}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </div>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 mb-6">
          <Card sx={{ p: 4}}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Pricing in {cityData.name}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Starting from
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              >
                {formatCurrency(cityData.basePrice)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                per trip (base fare)
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Popular vehicle types:</strong>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip label="Hatchback - ₹299" variant="outlined" />
                <Chip label="Sedan - ₹399" variant="outlined" />
                <Chip label="SUV - ₹499" variant="outlined" />
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary">
              * Final fare may vary based on distance, time, and vehicle type
            </Typography>
          </Card>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Benefits of Hiring Drivers in {cityData.name}
            </Typography>

            <Box sx={{ mb: 4 }}>
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <CheckCircle color="primary" />
                  <Typography variant="body1">{benefit}</Typography>
                </Box>
              ))}
            </Box>

            <Button
              component={Link}
              href="/book-driver"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Book Your Driver Now
            </Button>
          </Grid>
        </div>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Ready to Book a Driver in {cityData.name}?
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of satisfied customers who trust TOP4 Call Drivers
            for their transportation needs
          </Typography>

          <Button
            component={Link}
            href="/book-driver"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "white",
              color: theme.palette.primary.main,
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
            startIcon={<Phone />}
          >
            Book Driver Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
