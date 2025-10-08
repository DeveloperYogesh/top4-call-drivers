// Application constants

export const APP_CONFIG = {
  name: 'TOP4 Call Drivers',
  description: 'Professional Drivers & Car Services',
  version: '1.0.0',
  author: 'TOP4 Call Drivers Team',
  url: 'https://www.top3.in',
  supportPhone: '+91 88807 12345',
  supportEmail: 'support@top3.in',
  apiUrl:"http://top4mobileapp.vbsit.in/"
};

export const ROUTES = {
  HOME: '/',
  BOOK_DRIVER: '/book-driver',
  SERVICES: '/services',
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOG: '/blog',
  TERMS: '/terms',
  PRIVACY: '/privacy',
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
    cities: ['chennai', 'trichy', 'madurai', 'tirupur', 'coimbatore'],
  },
  {
    id: 'car-wash',
    name: 'Car Wash',
    description:
      'Pressure wash, eco wash & daily wash by trained executives equipped with high-grade machines and premium materials',
    icon: 'LocalCarWash',
    available: false,
    cities: ['chennai', 'trichy', 'madurai', 'tirupur', 'coimbatore'],
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
    cities: ['chennai', 'coimbatore', 'tirupur'],
  },
  {
    id: 'car-maintenance',
    name: 'Car Maintenance & Care',
    description:
      'Discover and book the best car services and maintenance options near you. Seamless booking experience and secure online payments.',
    icon: 'Build',
    available: false,
    cities: ['chennai', 'trichy', 'madurai', 'tirupur', 'coimbatore'],
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
  { id: 'tirupur', name: 'Tirupur', state: 'Tamil Nadu', slug: 'tirupur' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', slug: 'chennai' },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', slug: 'coimbatore' },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu', slug: 'madurai' },
  { id: 'trichy', name: 'Trichy', state: 'Tamil Nadu', slug: 'trichy' },
];

export const SUPPORTED_CITIES = [
  {
    name: 'Tirupur',
    slug: 'tirupur',
    state: 'Tamil Nadu',
    basePrice: 299,
    driversCount: 500,
    areasCount: 25,
    areas: [
      'Tirupur Central',
      'New Tirupur Industrial Park (NIT)',
      'Avinashi (nearby)',
      'Pudur',
      'Karuvampalayam',
      'Palladam',
      'Kumarasamy Nagar',
      'Kumaran Nagar',
      'Karumathampatti',
      'Tirupur Railway Station',
    ],
    description:
      'Book professional drivers in Tirupur for safe and comfortable rides across the textile & industrial hub.',
    keywords: ['driver hire tirupur', 'professional drivers tirupur', 'car driver booking tirupur'],
  },
  {
    name: 'Chennai',
    slug: 'chennai',
    state: 'Tamil Nadu',
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
  facebook: 'https://www.facebook.com/top4calldrivers',
  instagram: 'https://www.instagram.com/top4calldrivers',
  twitter: 'https://twitter.com/top4calldrivers',
  linkedin: 'https://www.linkedin.com/company/top4calldrivers',
  youtube: 'https://www.youtube.com/top4calldrivers',
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
