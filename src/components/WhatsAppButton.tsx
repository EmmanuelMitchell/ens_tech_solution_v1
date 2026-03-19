import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "23276427304"; // Replace with actual phone number
  const message = "Hello E&S Tech Solution, I'm interested in your services.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-success rounded-full flex items-center justify-center shadow-xl hover:shadow-accent hover:scale-110 transition-all duration-300 animate-fade-in"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} className="text-success-foreground" />
    </a>
  );
};

export default WhatsAppButton;
