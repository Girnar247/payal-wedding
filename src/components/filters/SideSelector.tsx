import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SideAuthDialog } from "./SideAuthDialog";
import { Side } from "@/types/guest";
import { useToast } from "@/hooks/use-toast";

interface SideSelectorProps {
  selectedSide: Side;
  onSideChange: (side: Side) => void;
}

export const SideSelector = ({ selectedSide, onSideChange }: SideSelectorProps) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [sideToAuth, setSideToAuth] = useState<Side>("bride");
  const [authorizedSides, setAuthorizedSides] = useState<Side[]>([selectedSide]);
  const { toast } = useToast();

  const handleSideClick = (side: Side) => {
    // Log the current side and the side being switched to
    console.log('Current side:', selectedSide);
    console.log('Switching to side:', side);
    
    if (authorizedSides.includes(side)) {
      onSideChange(side);
      toast({
        title: "Side Changed",
        description: `Switched to ${side === 'bride' ? "Bride's" : "Groom's"} Side (${side})`,
      });
    } else {
      setSideToAuth(side);
      setShowAuthDialog(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthorizedSides([...authorizedSides, sideToAuth]);
    onSideChange(sideToAuth);
    setShowAuthDialog(false);
    toast({
      title: "Access Granted",
      description: `You now have access to the ${sideToAuth === 'bride' ? "Bride's" : "Groom's"} Side (${sideToAuth})`,
    });
  };

  return (
    <div className="flex justify-center gap-4 mb-6">
      <Button
        variant={selectedSide === "bride" ? "default" : "outline"}
        onClick={() => handleSideClick("bride")}
        className="w-32"
      >
        Bride's Side
      </Button>
      <Button
        variant={selectedSide === "groom" ? "default" : "outline"}
        onClick={() => handleSideClick("groom")}
        className="w-32"
      >
        Groom's Side
      </Button>

      <SideAuthDialog
        side={sideToAuth}
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};