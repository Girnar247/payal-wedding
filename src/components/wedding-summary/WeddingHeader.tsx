import { Calendar } from "lucide-react";

export const WeddingHeader = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl md:text-6xl font-playfair text-wedding-text animate-fadeIn">
        Payal Weds Pranai
      </h1>
      <div className="flex items-center justify-center space-x-2 text-wedding-text/80">
        <Calendar className="h-5 w-5" />
        <p className="text-xl font-inter">01.03.2025 - 02.03.2025</p>
      </div>
    </div>
  );
};