import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SideAuthDialog } from "./SideAuthDialog";
import { useAdmin } from "@/contexts/AdminContext";

interface SideSelectorProps {
  selectedSide: "bride" | "groom";
  onSideChange: (side: "bride" | "groom") => void;
}

export const SideSelector = ({ selectedSide, onSideChange }: SideSelectorProps) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [attemptedSide, setAttemptedSide] = useState<"bride" | "groom">("bride");
  const { isAdmin } = useAdmin();
  const [authorizedSides, setAuthorizedSides] = useState<Set<"bride" | "groom">>(new Set());

  useEffect(() => {
    if (!isAdmin && authorizedSides.size === 0) {
      setAttemptedSide("bride");
      setShowAuthDialog(true);
    }
  }, [isAdmin]);

  const handleSideClick = (side: "bride" | "groom") => {
    if (isAdmin || authorizedSides.has(side)) {
      onSideChange(side);
    } else {
      setAttemptedSide(side);
      setShowAuthDialog(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthorizedSides(prev => new Set([...prev, attemptedSide]));
    onSideChange(attemptedSide);
    setShowAuthDialog(false);
  };

  const handleDialogClose = () => {
    if (!isAdmin && authorizedSides.size === 0) {
      return;
    }
    setShowAuthDialog(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <Button
          variant={selectedSide === "bride" ? "default" : "outline"}
          onClick={() => handleSideClick("bride")}
          className="w-32"
        >
          Bride Side
        </Button>
        <Button
          variant={selectedSide === "groom" ? "default" : "outline"}
          onClick={() => handleSideClick("groom")}
          className="w-32"
        >
          Groom Side
        </Button>
      </div>

      <SideAuthDialog
        side={attemptedSide}
        isOpen={showAuthDialog}
        onClose={handleDialogClose}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};