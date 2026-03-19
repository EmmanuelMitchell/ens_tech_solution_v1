import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const logoSrc = `${import.meta.env.BASE_URL}eandsfinallogo.png`;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed top-0 z-50 w-full transition-colors duration-300",
        isScrolled ? "bg-primary/85 backdrop-blur-md border-b border-white/10" : "bg-transparent",
      ].join(" ")}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logoSrc}
              alt="E&S Tech Solutions"
              loading="eager"
              decoding="async"
              className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15"
            />
            <div className="leading-tight">
              <div className="font-semibold text-white">E&S Tech Solutions</div>
              <div className="text-xs text-white/70">Innovative & Trusted</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={[
                    "relative px-3 py-2 text-sm font-medium text-white/85 transition-colors",
                    "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-accent after:transition-transform after:duration-300",
                    active
                      ? "text-white after:scale-x-100 after:animate-underline-reveal"
                      : "hover:text-white after:scale-x-0 hover:after:scale-x-100 hover:after:animate-underline-reveal",
                  ].join(" ")}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link to="/contact" className="ml-2">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-accent hover:animate-glow transition-all">
                Start a Project
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-navigation" className="md:hidden pb-4 animate-fade-in">
            <div className="mt-3 rounded-2xl bg-primary/90 backdrop-blur-md ring-1 ring-white/10 p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={[
                    "block px-4 py-3 rounded-xl transition-colors",
                    isActive(link.path) ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-4 pt-2">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-accent hover:animate-glow transition-all">
                  Start a Project
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
