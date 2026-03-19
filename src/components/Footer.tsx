import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logoSrc = `${import.meta.env.BASE_URL}eandsfinallogo.png`;

  return (
    <footer className="gradient-dark text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={logoSrc}
                alt="E&S Tech Solutions"
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15"
              />
              <span className="font-semibold text-lg">E&S Tech Solutions</span>
            </div>
            <p className="text-sm text-white/75 leading-relaxed">
              We build modern web and mobile experiences that help businesses move faster, look sharper, and scale with confidence.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
                Web • Mobile • Branding
              </span>
              <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs text-white ring-1 ring-accent/25">
                Available for projects
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-white/75 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-white/75 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm text-white/75 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-white/75 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <Mail size={16} className="text-accent" />
                <a href="mailto:enstechsolution@gmail.com" className="text-white/80 hover:text-white transition-colors">
                  enstechsolution@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone size={16} className="text-accent" />
                <a href="tel:+23276427304" className="text-white/80 hover:text-white transition-colors">
                  +232 76427304 / 75715080
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin size={16} className="text-accent mt-1" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Sierra%20Leone%20Freetown"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Sierra Leone, Freetown
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center hover:bg-accent/20 hover:ring-accent/30 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center hover:bg-accent/20 hover:ring-accent/30 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center hover:bg-accent/20 hover:ring-accent/30 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center hover:bg-accent/20 hover:ring-accent/30 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 text-center text-sm text-white/70">
          <p>&copy; {currentYear} E&S Tech Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
