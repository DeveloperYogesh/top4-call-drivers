// Application constants

export const APP_CONFIG = {
  name: 'TOP4 Call Drivers',
  description: 'Professional Drivers & Car Services',
  version: '1.0.0',
  author: 'TOP4 Call Drivers Team',
  url: 'https://www.driveu.in',
  supportPhone: '+91 88807 12345',
  supportEmail: 'support@driveu.in',
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
  COMPARE: '/compare',
  DOWNLOAD: '/download',
  // Dynamic city routes
  CITY_DRIVERS: (city: string) => `/call-drivers-in-${city.toLowerCase()}`,
};

export const SERVICES = [
  {
    id: 'professional-drivers',
    name: 'Professional Drivers',
    description: 'Hire verified, professional drivers for hassle-free commutes, running errands and safe after-party drops on an hourly basis',
    icon: 'DirectionsCar',
    available: true,
    cities: ['bangalore', 'chennai', 'delhi-ncr', 'gurgaon', 'hyderabad', 'kolkata', 'mumbai', 'pune'],
  },
  {
    id: 'car-wash',
    name: 'Car Wash',
    description: 'Pressure wash, eco wash & daily wash by trained executives equipped with high-grade machines and premium materials',
    icon: 'LocalCarWash',
    available: true,
    cities: ['bangalore', 'chennai', 'delhi-ncr', 'gurgaon', 'hyderabad', 'kolkata', 'mumbai', 'pune'],
  },
  {
    id: 'fastag-recharge',
    name: 'Recharge FASTag',
    description: 'Zip through the toll-gates on your outstation trips without any worries. Recharge your FASTag in just a few taps',
    icon: 'Toll',
    available: true,
    cities: ['all'],
  },
  {
    id: 'doorstep-wash',
    name: 'Doorstep Wash & Deep Cleaning',
    description: 'TOP4 Call Drivers brings on-demand car cleaning to your doorstep with satisfaction guarantee. Now available in Bengaluru, Hyderabad and Gurgaon, coming soon to other cities.',
    icon: 'CleaningServices',
    available: true,
    cities: ['bangalore', 'hyderabad', 'gurgaon'],
  },
  {
    id: 'car-maintenance',
    name: 'Car Maintenance & Care',
    description: 'Discover and book the best car services and maintenance options near you. Seamless booking experience and secure online payments.',
    icon: 'Build',
    available: true,
    cities: ['bangalore', 'chennai', 'delhi-ncr', 'gurgaon', 'hyderabad', 'kolkata', 'mumbai', 'pune'],
  },
  {
    id: 'car-insurance',
    name: 'Car Insurance Renewals with Benefits',
    description: 'Your insurance renewals will never be the same again. Reap immediate benefits on your motor insurance renewals with TOP4 Call Drivers benefits with rewards worth up to ₹2,000.',
    icon: 'Security',
    available: true,
    cities: ['all'],
  },
];

export const CITIES = [
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', slug: 'bangalore' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', slug: 'chennai' },
  { id: 'delhi-ncr', name: 'Delhi NCR', state: 'Delhi', slug: 'delhi-ncr' },
  { id: 'gurgaon', name: 'Gurgaon', state: 'Haryana', slug: 'gurgaon' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', slug: 'hyderabad' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', slug: 'kolkata' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', slug: 'mumbai' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', slug: 'pune' },
];

export const SUPPORTED_CITIES = [
  {
    name: 'Bangalore',
    slug: 'bangalore',
    state: 'Karnataka',
    basePrice: 299,
    driversCount: 500,
    areasCount: 50,
    areas: [
      'Koramangala',
      'Indiranagar',
      'Whitefield',
      'Electronic City',
      'Marathahalli',
      'BTM Layout',
      'Jayanagar',
      'Rajajinagar',
      'Malleshwaram',
      'HSR Layout',
      'Banashankari',
      'JP Nagar',
    ],
    description: 'Book professional drivers in Bangalore for safe and comfortable rides across the Silicon Valley of India.',
    keywords: ['driver hire bangalore', 'professional drivers bangalore', 'car driver booking bangalore'],
  },
  {
    name: 'Chennai',
    slug: 'chennai',
    state: 'Tamil Nadu',
    basePrice: 279,
    driversCount: 400,
    areasCount: 45,
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
    description: 'Hire verified professional drivers in Chennai for reliable transportation across the cultural capital of South India.',
    keywords: ['driver hire chennai', 'professional drivers chennai', 'car driver booking chennai'],
  },
  {
    name: 'Delhi NCR',
    slug: 'delhi-ncr',
    state: 'Delhi',
    basePrice: 349,
    driversCount: 800,
    areasCount: 80,
    areas: [
      'Connaught Place',
      'Karol Bagh',
      'Lajpat Nagar',
      'South Extension',
      'Dwarka',
      'Rohini',
      'Janakpuri',
      'Vasant Kunj',
      'Saket',
      'Greater Kailash',
      'Nehru Place',
      'Chandni Chowk',
    ],
    description: 'Book professional drivers in Delhi NCR for safe rides across the national capital region.',
    keywords: ['driver hire delhi', 'professional drivers delhi ncr', 'car driver booking delhi'],
  },
  {
    name: 'Mumbai',
    slug: 'mumbai',
    state: 'Maharashtra',
    basePrice: 399,
    driversCount: 600,
    areasCount: 60,
    areas: [
      'Bandra',
      'Andheri',
      'Juhu',
      'Powai',
      'Lower Parel',
      'Worli',
      'Colaba',
      'Fort',
      'Malad',
      'Borivali',
      'Thane',
      'Navi Mumbai',
    ],
    description: 'Hire professional drivers in Mumbai for comfortable rides across the financial capital of India.',
    keywords: ['driver hire mumbai', 'professional drivers mumbai', 'car driver booking mumbai'],
  },
  {
    name: 'Hyderabad',
    slug: 'hyderabad',
    state: 'Telangana',
    basePrice: 289,
    driversCount: 350,
    areasCount: 40,
    areas: [
      'Hitech City',
      'Gachibowli',
      'Madhapur',
      'Kondapur',
      'Banjara Hills',
      'Jubilee Hills',
      'Secunderabad',
      'Begumpet',
      'Ameerpet',
      'Kukatpally',
      'Miyapur',
      'Uppal',
    ],
    description: 'Book verified drivers in Hyderabad for reliable transportation across the City of Pearls.',
    keywords: ['driver hire hyderabad', 'professional drivers hyderabad', 'car driver booking hyderabad'],
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
  facebook: 'https://www.facebook.com/TOP4 Call DriversIndia',
  instagram: 'https://www.instagram.com/driveuindia',
  twitter: 'https://twitter.com/driveuindia',
  linkedin: 'https://www.linkedin.com/company/driveu',
  youtube: 'https://www.youtube.com/channel/UCTOP4 Call Drivers',
};

export const APP_STORE_LINKS = {
  android: 'https://play.google.com/store/apps/details?id=com.driveu.android',
  ios: 'https://apps.apple.com/in/app/driveu-car-drivers-services/id1037756294',
};

export const DAMAGE_PROTECTION_COST = 15; // in INR
export const GST_RATE = 0.18; // 18%

export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const COUPON_REGEX = /^[A-Z0-9]{4,10}$/;

