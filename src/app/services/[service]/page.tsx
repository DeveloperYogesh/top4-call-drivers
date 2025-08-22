import { Metadata } from "next";
import { notFound } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { SERVICES } from "@/utils/constants";
import { Button, Chip } from "@mui/material";
import {
  DirectionsCar,
  LocalCarWash,
  Toll,
  CleaningServices,
  Build,
  Security,
} from "@mui/icons-material";

type Props = {
  params: Promise<{ service: string }>;
};

const iconMap = {
  DirectionsCar: <DirectionsCar color="primary" />,
  LocalCarWash: <LocalCarWash color="primary" />,
  Toll: <Toll color="primary" />,
  CleaningServices: <CleaningServices color="primary" />,
  Build: <Build color="primary" />,
  Security: <Security color="primary" />,
};

// Sample pricing data (replace with actual data)
const pricingData = {
  "professional-drivers": [
    { name: "Hourly", price: 299, description: "Hire a driver for short trips or errands" },
    { name: "Daily", price: 1999, description: "Full-day driver for all your needs" },
    { name: "Outstation", price: 3999, description: "Driver for outstation trips" },
  ],
  "car-wash": [
    { name: "Eco Wash", price: 499, description: "Environmentally friendly wash" },
    { name: "Pressure Wash", price: 799, description: "Deep cleaning with high-pressure" },
    { name: "Premium Wash", price: 1299, description: "Full detailing service" },
  ],
  "fastag-recharge": [
    { name: "Basic Recharge", price: 500, description: "Recharge for short trips" },
    { name: "Standard Recharge", price: 1000, description: "Ideal for frequent travelers" },
    { name: "Premium Recharge", price: 2000, description: "High-value recharge for long trips" },
  ],
  "doorstep-wash": [
    { name: "Basic Clean", price: 599, description: "Quick wash at your doorstep" },
    { name: "Deep Clean", price: 999, description: "Interior and exterior cleaning" },
    { name: "Premium Clean", price: 1499, description: "Comprehensive detailing" },
  ],
  "car-maintenance": [
    { name: "Basic Service", price: 1999, description: "Oil change and basic checks" },
    { name: "Standard Service", price: 3999, description: "Full service with diagnostics" },
    { name: "Premium Service", price: 5999, description: "Complete maintenance package" },
  ],
  "car-insurance": [
    { name: "Third-Party", price: 2999, description: "Basic liability coverage" },
    { name: "Comprehensive", price: 5999, description: "Full coverage with benefits" },
    { name: "Premium Plus", price: 9999, description: "Enhanced coverage with rewards" },
  ],
};

// Sample testimonials (replace with actual data)
const testimonials = [
  { quote: "The professional drivers service is a lifesaver for my daily commute!", author: "Anita R., Chennai" },
  { quote: "TOP4’s FASTag recharge is so convenient for my road trips.", author: "Vikram S., Coimbatore" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  const serviceData = SERVICES.find((s) => s.id === service);

  if (!serviceData) {
    return {
      title: "Service Not Found",
      description: "The requested service is not available.",
    };
  }

  return {
    title: `${serviceData.name} | TOP4 Call Drivers`,
    description: serviceData.description,
    keywords: [`${serviceData.name.toLowerCase()} service`, `TOP4 ${serviceData.name.toLowerCase()}`, `car services ${serviceData.cities.join(", ")}`],
    openGraph: {
      title: `${serviceData.name}`,
      description: serviceData.description,
      type: "website",
      url: `https://yourdomain.com/services/${serviceData.id}`,
    },
    alternates: {
      canonical: `https://yourdomain.com/services/${serviceData.id}`,
    },
  };
}

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ service: service.id }));
}

export default async function ServicePage({ params }: Props) {
  const { service } = await params;
  const serviceData = SERVICES.find((s) => s.id === service);

  if (!serviceData) notFound();

  const trackBookClick = () => {
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: serviceData.name,
            provider: {
              "@type": "Organization",
              name: "TOP4 Call Drivers",
              sameAs: "https://yourdomain.com",
            },
            areaServed: serviceData.cities.includes("all") ? "India" : serviceData.cities.map((city) => ({
              "@type": "City",
              name: city.charAt(0).toUpperCase() + city.slice(1),
            })),
            description: serviceData.description,
          })}
        </script>
      </Head>
      <div>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#354B9C] to-blue-800 text-white py-8 md:py-12 relative overflow-hidden">
          <div className="custom-container">
            <div className="text-center">
              <div className="mb-3">
                <div className="bg-white/20 text-white py-2 px-4 rounded-full w-fit mx-auto">
                  <p className="text-xs uppercase text-white">
                    {serviceData.available ? "Available Now" : "Coming Soon"}
                  </p>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {serviceData.name}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                {serviceData.description}
              </p>
              {/* <Button
                // component={Link}
                // href={serviceData.available ? "/book-service" : "/contact"}
                variant="contained"
                size="large"
                className="bg-white text-[#354B9C] px-6 py-3 text-lg font-semibold hover:bg-white/90"
                // aria-label={serviceData.available ? `Book ${serviceData.name} service` : `Contact us about ${serviceData.name}`}
                onClick={trackBookClick}
              >
                {serviceData.available ? "Book Now" : "Contact Us"}
              </Button> */}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="custom-container">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              Why Choose Our {serviceData.name} Service?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the benefits of choosing TOP4 for your {serviceData.name.toLowerCase()} needs.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
            <div className="p-6 text-center bg-white rounded-lg my-border hover:shadow-md">
              <div className="mb-2">{iconMap[serviceData.icon]}</div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Quality Assurance</h3>
              <p className="text-sm text-gray-600">
                {serviceData.available ? "Top-notch service delivered by professionals" : "Coming soon with guaranteed quality"}
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg my-border hover:shadow-md">
              <div className="mb-2">{iconMap[serviceData.icon]}</div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Convenience</h3>
              <p className="text-sm text-gray-600">
                Easy booking and {serviceData.cities.includes("all") ? "nationwide" : "city-specific"} availability
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg my-border hover:shadow-md">
              <div className="mb-2">{iconMap[serviceData.icon]}</div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Trusted Service</h3>
              <p className="text-sm text-gray-600">Backed by TOP4’s commitment to customer satisfaction</p>
            </div>
          </div>
        </div>

        {/* Pricing & Packages Section */}
        <div className="bg-gray-100">
          <div className="custom-container">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                Pricing & Packages
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the perfect plan for your {serviceData.name.toLowerCase()} needs.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {pricingData[serviceData.id].map((plan, index) => (
                <div key={index} className="p-6 bg-white rounded-lg my-border shadow-md text-center">
                  <h3 className="mb-2 text-gray-900">{plan.name}</h3>
                  <h2 className="text-[#354B9C] mb-2">₹{plan.price}</h2>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  {/* <Button
                    // component={Link}
                    // href={serviceData.available ? "/book-service" : "/contact"}
                    variant="outlined"
                    className="text-[#354B9C] border-[#354B9C] hover:bg-[#354B9C]/10"
                    aria-label={`Select ${plan.name} plan for ${serviceData.name}`}
                  >
                    {serviceData.available ? "Choose Plan" : "Contact Us"}
                  </Button> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Cities Section */}
        <div className="bg-[#354B9C]">
          <div className="custom-container">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                Available in These Cities
              </h2>
              <p className="text-lg text-white max-w-2xl mx-auto">
                {serviceData.cities.includes("all")
                  ? "Available nationwide"
                  : `Our ${serviceData.name.toLowerCase()} service is available in these cities`}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {serviceData.cities.includes("all") ? (
                <Chip label="Nationwide" className="text-white bg-white/20" />
              ) : (
                serviceData.cities.map((city, index) => (
                  <Chip
                    key={index}
                    label={city.charAt(0).toUpperCase() + city.slice(1)}
                    className="!text-white bg-black/20 border-white !border"
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="custom-container">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from customers who love our {serviceData.name.toLowerCase()} service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-lg my-border shadow-md text-center">
                <p className="text-sm text-gray-600 mb-2">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#354B9C] text-white py-8 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Ready to Experience Our {serviceData.name} Service?
            </h2>
            <p className="text-lg mb-4 opacity-90">
              {serviceData.available
                ? `Book our ${serviceData.name.toLowerCase()} service today!`
                : `Contact us to learn when ${serviceData.name.toLowerCase()} will be available in your city.`}
            </p>
            {/* <Button
              // component={Link}
              // href={serviceData.available ? "/book-service" : "/contact"}
              variant="contained"
              size="large"
              className="bg-white text-[#354B9C] px-8 py-4 text-lg font-semibold hover:bg-white/90"
              // aria-label={serviceData.available ? `Book ${serviceData.name} service` : `Contact us about ${serviceData.name}`}
              onClick={trackBookClick}
            >
              {serviceData.available ? "Book Now" : "Contact Us"}
            </Button> */}
          </div>
        </div>
      </div>
    </>
  );
}