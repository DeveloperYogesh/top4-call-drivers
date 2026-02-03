// Application constants

export const APP_CONFIG = {
  name: 'TOP4 Call Drivers',
  description: 'Professional Drivers & Car Services',
  version: '1.0.0',
  author: 'TOP4 Call Drivers Team',
  url: 'https://www.top3.in',
  supportPhone: '+91 88807 12345',
  supportEmail: 'support@top3.in',
  apiUrl: 'http://top4mobileapp.vbsit.in/',
  // Contact Information
  primaryPhone: '04428287777',
  primaryPhoneFormatted: '044 2828 7777',
  secondaryPhone: '8190081900',
  secondaryPhoneFormatted: '81900 81900',
  email: 'info@top4calldrivers.com',
  // Location
  googleMapsLink: 'https://maps.app.goo.gl/Tgnb0NyCrvxCoBbD2',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.5938114946493!2d80.2411508!3d13.061507200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267d7c6aeac2d%3A0x17dcc58c5b924f96!2sTOP4%20Call%20Drivers%20%7C%20Acting%20Drivers%20%26%20Call%20Drivers%20in%20Chennai!5e0!3m2!1sen!2sin!4v1764832786632!5m2!1sen!2sin',
  officeAddress: {
    line1: 'TOP4 Call Driver Services Pvt Ltd',
    line2: 'No: 26, Jayalakshmipuram, 3rd Street',
    line3: 'Nungambakkam, Chennai - 600034',
    line4: 'Tamil Nadu, India',
  },
};

export const ROUTES = {
  HOME: '/',
  BOOK_DRIVER: '/book-driver',
  SERVICES: '/services',
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOG: '/blog',
  TERMS: '/terms-and-conditions',
  PRIVACY: '/privacy-policy',
  REFUND: '/refund',
  BUSINESS: '/business',
  TARIFF: '/call-drivers-tariff',
  COMPARE: '/compare',
  DOWNLOAD: 'https://play.google.com/store/apps/details?id=com.orgware.top4drivers&pcampaignid=web_share',
  // Dynamic city routes
  CITY_DRIVERS: (city: string) => `/best-acting-drivers-in-${city.toLowerCase()}`,
};

export const SERVICES = [
  {
    id: 'professional-drivers',
    name: 'Professional Drivers',
    description:
      'Hire verified, professional drivers for hassle-free commutes, running errands and safe after-party drops on an hourly basis',
    icon: 'DirectionsCar',
    available: true,
    cities: ['chennai', 'trichy', 'madurai', 'tiruppur', 'coimbatore'],
  },
  {
    id: 'car-wash',
    name: 'Car Wash',
    description:
      'Pressure wash, eco wash & daily wash by trained executives equipped with high-grade machines and premium materials',
    icon: 'LocalCarWash',
    available: false,
    cities: ['chennai', 'trichy', 'madurai', 'tiruppur', 'coimbatore'],
  },
  {
    id: 'fastag-recharge',
    name: 'Recharge FASTag',
    description:
      'Zip through the toll-gates on your outstation trips without any worries. Recharge your FASTag in just a few taps',
    icon: 'Toll',
    available: true,
    cities: ['all'],
  },
  {
    id: 'doorstep-wash',
    name: 'Doorstep Wash & Deep Cleaning',
    description:
      'TOP4 Call Drivers brings on-demand car cleaning to your doorstep with satisfaction guarantee. Now available in select cities — more coming soon.',
    icon: 'CleaningServices',
    available: false,
    cities: ['chennai', 'coimbatore', 'tiruppur'],
  },
  {
    id: 'car-maintenance',
    name: 'Car Maintenance & Care',
    description:
      'Discover and book the best car services and maintenance options near you. Seamless booking experience and secure online payments.',
    icon: 'Build',
    available: false,
    cities: ['chennai', 'trichy', 'madurai', 'tiruppur', 'coimbatore'],
  },
  {
    id: 'car-insurance',
    name: 'Car Insurance Renewals with Benefits',
    description:
      'Your insurance renewals will never be the same again. Reap immediate benefits on your motor insurance renewals with TOP4 Call Drivers rewards.',
    icon: 'Security',
    available: true,
    cities: ['all'],
  },
];

export const CITIES = [
  { id: 'tiruppur', name: 'Tiruppur', state: 'Tamil Nadu', slug: 'tiruppur' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', slug: 'chennai' },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', slug: 'coimbatore' },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu', slug: 'madurai' },
  { id: 'trichy', name: 'Trichy', state: 'Tamil Nadu', slug: 'trichy' },
];

export const SUPPORTED_CITIES = [
  {
    name: 'Tiruppur',
    slug: 'tiruppur',
    state: 'Tamil Nadu',
    phoneNumber: '74189 22002',
    basePrice: 299,
    driversCount: 500,
    areasCount: 25,
    areas: [
      'Kumaran Road',
      'Avinashi Road',
      'Kangeyam Road',
      'Mangalam',
      'Palladam',
      'Dharapuram',
      'Old Bus Stand',
      'New Bus Stand',
      'Valipalayam',
      'Anupparpalayam',
      'Pudhupalli',
      'Perumanallur',
      'Kunnathur Road',
      'PN Road',
      'Murugan Nagar',
      'Karuvampalayam',
      'Odakkadu',
      'Chettipalayam',
      'Veerapandi',
      'Neruperichal',
      'Uthukuli',
    ],
    description:
      "Hire Top 4 Acting Driver in Tirupur. Top 4 Call Taxi offers reliable and professional acting drivers in Tirupur, Tamil Nadu for hourly, daily, and outstation travel. Whether you're in Kumaran Road, Avinashi Road, Kangeyam Road, Mangalam, Palladam, Dharapuram, or any part of Tiruppur city, our trained drivers ensure safe, smooth, and comfortable travel anytime. With clear pricing, verified professionals, and fast booking support, we are one of the most trusted options for call drivers in Tirupur.",
    keywords: [
      'Acting driver in Tirupur',
      'Call drivers in Tirupur',
      'Acting driver charges in Tirupur',
      'Personal car driver in Tirupur',
      'Outstation Driver Service from Tirupur',
      'Call drivers in Tirupur Kumaran Road',
      'Call drivers in Tirupur Avinashi Road',
      'Call drivers in Tirupur Kangeyam Road',
      'Call drivers in Tirupur Palladam',
      'Call drivers in Tirupur Dharapuram',
      'Call drivers in Tirupur Mangalam',
    ],
    metaTitle: 'Best Acting Driver in Tirupur | Top 4 Call Drivers',
    metaDescription: 'Acting driver in Tirupur for city & outstation trips. Transparent acting driver charges in Tirupur with verified drivers. Call 7418922002.',
  },
  {
    name: 'Chennai',
    slug: 'chennai',
    state: 'Tamil Nadu',
    // phoneNumber: '', // Default to primary
    basePrice: 279,
    driversCount: 6000,
    areasCount: 60,
    areas: [
      'T. Nagar',
      'Adyar',
      'Anna Nagar',
      'Velachery',
      'OMR',
      'Nungambakkam',
      'Mylapore',
      'Besant Nagar',
      'Porur',
      'Tambaram',
      'Chrompet',
      'Guindy',
    ],
    description:
      'Hire verified professional drivers in Chennai for reliable transportation across the cultural capital of South India.',
    keywords: ['driver hire chennai', 'professional drivers chennai', 'car driver booking chennai'],
  },
  {
    name: 'Coimbatore',
    slug: 'coimbatore',
    state: 'Tamil Nadu',
    phoneNumber: '74189 22002',
    basePrice: 289,
    driversCount: 1000,
    areasCount: 40,
    areas: [
      'Gandhipuram',
      'RS Puram',
      'Peelamedu',
      'Avinashi Road',
      'Saravanampatti',
      'Podanur',
      'Singanallur',
      'Kovaipudur',
      'CODISSIA',
      'Ondipudur',
    ],
    description:
      'Book verified drivers in Coimbatore for reliable transportation across the Garden City of South India.',
    keywords: ['driver hire coimbatore', 'professional drivers coimbatore', 'car driver booking coimbatore'],
  },
  {
    name: 'Madurai',
    slug: 'madurai',
    state: 'Tamil Nadu',
    // phoneNumber: '', // Default to primary
    basePrice: 259,
    driversCount: 1000,
    areasCount: 30,
    areas: [
      'Goripalayam',
      'Tallakulam',
      'East Gate',
      'West Masi',
      'KK Nagar',
      'Anna Nagar (Madurai)',
      'Thirupparankundram',
      'Simmakkal',
      'Shenoy Nagar',
      'Alagar Kovil Road',
    ],
    description:
      'Book professional drivers in Madurai for comfortable and punctual rides across the temple city.',
    keywords: ['driver hire madurai', 'professional drivers madurai', 'car driver booking madurai'],
  },
  {
    name: 'Trichy',
    slug: 'trichy',
    state: 'Tamil Nadu',
    phoneNumber: '75400 14002',
    basePrice: 249,
    driversCount: 1000,
    areasCount: 35,
    areas: [
      'Srirangam',
      'Thillai Nagar',
      'Golden Rock',
      'Woraiyur',
      'BHEL Township',
      'Tennur',
      'Cantonment',
      'Tiruchirappalli Railway Station',
      'Chinna Melur',
      'K.K. Nagar (Trichy)',
    ],
    description:
      'Hire TOP4 Call Drivers in Trichy for reliable transportation across Tiruchirappalli and surrounding localities.',
    keywords: ['driver hire trichy', 'professional drivers trichy', 'car driver booking trichy'],
  },
];

export const CAR_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
];

export const VEHICLE_SIZES = [
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
];

export const TRIP_TYPES = [
  { value: 'one-way', label: 'One Way' },
  { value: 'round-trip', label: 'Round Trip' },
  { value: 'outstation', label: 'Outstation' },
];

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/top4drivers/',
  instagram: 'https://www.instagram.com/top4drivers/',
  twitter: 'https://x.com/calltop4',
  linkedin: 'https://www.linkedin.com/company/top4-call-driver-services-pvt-ltd/',
  youtube: 'https://www.youtube.com/@top4driverstv312',
};

export const APP_STORE_LINKS = {
  android: 'https://play.google.com/store/apps/details?id=com.top3.android',
  ios: 'https://apps.apple.com/in/app/top4-car-drivers-services/id1037756294',
};

export const DAMAGE_PROTECTION_COST = 15; // in INR
export const GST_RATE = 0.18; // 18%

export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const COUPON_REGEX = /^[A-Z0-9]{4,10}$/;
