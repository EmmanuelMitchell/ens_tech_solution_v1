
import { services as initialServices, portfolio as initialPortfolio, testimonials as initialTestimonials, messages as initialMessages } from "../data/data.js";

// Local state to simulate database
let services = [...initialServices];
let portfolio = [...initialPortfolio];
let testimonials = [...initialTestimonials];
let messages = [...initialMessages];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const toRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

export const API_BASE_URL = ""; // No backend URL needed

export const getAuthHeaders = () => {
  return {}; // No auth headers needed for local
};

export const api = {
  get: async (endpoint: string) => {
    await delay(300); // Simulate network latency

    if (endpoint === "/api/services/") return services;
    if (endpoint === "/api/portfolio/") return portfolio;
    if (endpoint === "/api/testimonials/") return testimonials;
    if (endpoint === "/api/messages/") return messages;
    
    // Handle single item gets if needed, e.g., /api/services/1
    const serviceMatch = endpoint.match(/\/api\/services\/(\d+)/);
    if (serviceMatch) {
      const id = parseInt(serviceMatch[1]);
      return services.find(s => s.id === id);
    }

    const portfolioMatch = endpoint.match(/\/api\/portfolio\/(\d+)/);
    if (portfolioMatch) {
      const id = parseInt(portfolioMatch[1]);
      return portfolio.find(p => p.id === id);
    }

    const testimonialMatch = endpoint.match(/\/api\/testimonials\/(\d+)/);
    if (testimonialMatch) {
      const id = parseInt(testimonialMatch[1]);
      return testimonials.find(t => t.id === id);
    }

    throw new Error(`Endpoint not found: ${endpoint}`);
  },

  post: async (endpoint: string, data: unknown) => {
    await delay(300);

    if (endpoint === "/api/services/") {
      const payload = toRecord(data);
      const newService = { ...payload, id: Date.now() };
      services = [...services, newService];
      return newService;
    }
    if (endpoint === "/api/portfolio/") {
      const payload = toRecord(data);
      const newItem = { ...payload, id: Date.now() };
      portfolio = [...portfolio, newItem];
      return newItem;
    }
    if (endpoint === "/api/testimonials/") {
      const payload = toRecord(data);
      const newItem = { ...payload, id: Date.now() };
      testimonials = [...testimonials, newItem];
      return newItem;
    }
    if (endpoint === "/api/contact") {
        const payload = toRecord(data);
        // Simulate sending a message
        const newMessage = { ...payload, id: Date.now(), createdAt: new Date().toISOString(), read: false };
        messages = [...messages, newMessage];
        return { success: true, message: "Message sent" };
    }

    throw new Error(`Endpoint not found: ${endpoint}`);
  },

  put: async (endpoint: string, data: unknown) => {
    await delay(300);
    const payload = toRecord(data);

    const serviceMatch = endpoint.match(/\/api\/services\/(\d+)/);
    if (serviceMatch) {
      const id = parseInt(serviceMatch[1]);
      services = services.map(s => s.id === id ? { ...s, ...payload } : s);
      return { ...payload, id };
    }

    const portfolioMatch = endpoint.match(/\/api\/portfolio\/(\d+)/);
    if (portfolioMatch) {
      const id = parseInt(portfolioMatch[1]);
      portfolio = portfolio.map(p => p.id === id ? { ...p, ...payload } : p);
      return { ...payload, id };
    }

    const testimonialMatch = endpoint.match(/\/api\/testimonials\/(\d+)/);
    if (testimonialMatch) {
      const id = parseInt(testimonialMatch[1]);
      testimonials = testimonials.map(t => t.id === id ? { ...t, ...payload } : t);
      return { ...payload, id };
    }

    throw new Error(`Endpoint not found: ${endpoint}`);
  },

  delete: async (endpoint: string) => {
    await delay(300);

    const serviceMatch = endpoint.match(/\/api\/services\/(\d+)/);
    if (serviceMatch) {
      const id = parseInt(serviceMatch[1]);
      services = services.filter(s => s.id !== id);
      return { success: true };
    }

    const portfolioMatch = endpoint.match(/\/api\/portfolio\/(\d+)/);
    if (portfolioMatch) {
      const id = parseInt(portfolioMatch[1]);
      portfolio = portfolio.filter(p => p.id !== id);
      return { success: true };
    }

    const testimonialMatch = endpoint.match(/\/api\/testimonials\/(\d+)/);
    if (testimonialMatch) {
      const id = parseInt(testimonialMatch[1]);
      testimonials = testimonials.filter(t => t.id !== id);
      return { success: true };
    }

    const messageMatch = endpoint.match(/\/api\/messages\/(\d+)/);
    if (messageMatch) {
        const id = parseInt(messageMatch[1]);
        messages = messages.filter(m => m.id !== id);
        return { success: true };
    }

    throw new Error(`Endpoint not found: ${endpoint}`);
  },

  login: async (credentials: { username: string; password: string }) => {
    await delay(500);
    // Simple mock login
    if (credentials.username === "admin" && credentials.password === "admin") {
      localStorage.setItem("token", "mock-token-123");
      return { access_token: "mock-token-123", token_type: "bearer" };
    }
    throw new Error("Invalid credentials");
  }
};
