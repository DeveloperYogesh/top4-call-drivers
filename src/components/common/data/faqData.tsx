interface FAQData {
  [path: string]: { question: string; answer: string }[];
}

export const faqData: FAQData = {
  "/call-drivers-tariff": [
    {
      question: "What is the in-city Call driver rate with TOP4?",
      answer:
        "The cost depends on the type of car you choose, with normal cars being more affordable and luxury cars priced higher for additional comfort.",
    },
    {
      question:
        "Are there any discounts available for frequent travelers booking call driver services?",
      answer:
        "Yes! Our monthly call driver tariff plans offer great value for regular travelers, providing flexible pricing.",
    },
    {
      question: "How can I book a valet service with TOP4?",
      answer:
        "You can book a valet service through our app or website. Pricing is based on the event and location.",
    },
    {
      question:
        "Are there any hidden driver charges per day with TOP4 services?",
      answer: "No. We provide transparent pricing with no hidden fees.",
    },
    {
      question: "Can I modify my Call driver booking once it’s made?",
      answer:
        "Yes, you can modify your booking easily through the app or by contacting customer support.",
    },
  ],
  "/best-acting-drivers-in-chennai": [
    {
      question: "What is the minimum booking duration for a driver?",
      answer:
        "The minimum booking duration is 3 hours, with rates starting at ₹350 for standard cars and ₹400 for luxury cars.",
    },
    {
      question: "Are there additional charges for night-time bookings?",
      answer:
        "Yes, an extra ₹100 is applicable for bookings between 10:15 PM and 5:30 AM.",
    },
    {
      question: "Can I hire drivers for all areas in Chennai?",
      answer:
        "Yes, services are available across Chennai, including Anna Nagar, Porur, Velachery, and all other areas.",
    },
    {
      question: "What are the charges for canceling a booking?",
      answer:
        "A cancellation fee of ₹100 is charged if the booking is canceled less than 30 minutes before the scheduled time.",
    },
    {
      question: "What is the daily charge for hiring a driver in Chennai?",
      answer:
        "Driver charges per day vary based on the type of service and vehicle, with detailed rates provided in our tariff table.",
    },
  ],
};
