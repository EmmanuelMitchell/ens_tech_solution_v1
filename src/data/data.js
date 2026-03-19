export { services, testimonials, messages } from "./mockData";

import travel from "../images/portfolio/travel-agency.svg";
import mobileBanking from "../images/portfolio/mobile-banking.svg";
import ecommercePlatform from "../images/portfolio/ecommerce-platform.svg";
import financeDashboard from "../images/portfolio/finance-dashboard.svg";
import corporateWebsite from "../images/portfolio/corporate-website.svg";
import educationPlatform from "../images/portfolio/education-platform.svg";

export const portfolioData = [
  {
    id: 1,
    title: "Travel Agency Website",
    description: "A modern travel booking website.",
    category: "Web",
    image: travel,
    link: "https://truthfull-agency.vercel.app/",
  },
  {
    id: 2,
    title: "Mobile Banking App",
    description: "Secure mobile banking application.",
    category: "Mobile",
    image: mobileBanking,
    link: "https://example.com/banking-app",
  },
  {
    id: 3,
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration.",
    category: "Web",
    image: ecommercePlatform,
    link: "#",
  },
  {
    id: 4,
    title: "Finance Dashboard",
    description: "Real-time financial data visualization dashboard.",
    category: "Web",
    image: financeDashboard,
    link: "#",
  },
  {
    id: 5,
    title: "Brand Identity Kit",
    description: "Logo, typography, and visual system aligned to a premium, modern tech brand.",
    category: "Branding",
    image: corporateWebsite,
    link: "#",
  },
  {
    id: 6,
    title: "Education Platform",
    description: "Online learning management system for schools.",
    category: "Web",
    image: educationPlatform,
    link: "#",
  },
];

export const portfolio = portfolioData;
