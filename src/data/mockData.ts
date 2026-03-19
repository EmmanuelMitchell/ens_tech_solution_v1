
export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Website Development",
    description: "High-performance websites and web apps built with modern frameworks and clean UI.",
    icon: "globe"
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile apps optimized for speed, usability, and reliability.",
    icon: "smartphone"
  },
  {
    id: 3,
    title: "Complimentary Card Design",
    description: "Modern business card designs that match your brand and communicate credibility.",
    icon: "id-card"
  },
  {
    id: 4,
    title: "Business Flyers Creation",
    description: "Bold, clean flyer designs for marketing campaigns, product launches, and events.",
    icon: "file-text"
  },
  {
    id: 5,
    title: "Logo Creation",
    description: "Unique logo concepts crafted for clarity, recognition, and brand longevity.",
    icon: "badge-check"
  },
  {
    id: 6,
    title: "Branding Services",
    description: "A cohesive visual identity system: colors, typography, layouts, and brand guidelines.",
    icon: "palette"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Smith",
    company: "Tech Innovators Inc.",
    content: "E&S Tech Solution transformed our business with their innovative approach.",
    rating: 5,
    image: "eandsfinallogo.png"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "Digital Solutions Ltd.",
    content: "Outstanding service and technical expertise.",
    rating: 5,
    image: "eandsfinallogo.png"
  },
  {
    id: 3,
    name: "Jane Smith",
    company: "Creative Agency",
    content: "The team is professional, responsive, and delivers high-quality work.",
    rating: 5,
    image: "eandsfinallogo.png"
  },
  {
    id: 4,
    name: "Michael Johnson",
    company: "StartUp Inc",
    content: "Great experience working with them. They understood our vision perfectly.",
    rating: 4,
    image: "eandsfinallogo.png"
  }
];

export const messages: Message[] = [
  {
    id: 1,
    name: "Alice Cooper",
    email: "alice@example.com",
    subject: "Project Inquiry",
    message: "I would like to discuss a new project with you.",
    createdAt: "2023-10-25T10:00:00Z",
    read: false
  },
  {
    id: 2,
    name: "Bob Martin",
    email: "bob@example.com",
    subject: "Support Request",
    message: "I need help with my current website.",
    createdAt: "2023-10-24T14:30:00Z",
    read: true
  }
];
