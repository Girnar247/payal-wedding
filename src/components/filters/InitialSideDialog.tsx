import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SideAuthDialog } from "./SideAuthDialog";
import { useState } from "react";

interface InitialSideDialogProps {
  isOpen: boolean;
  onSideSelect: (side: "bride" | "groom") => void;
}

export const InitialSideDialog = ({ isOpen, onSideSelect }: InitialSideDialogProps) => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedSide, setSelectedSide] = useState<"bride" | "groom">("bride");

  const handleSideClick = (side: "bride" | "groom") => {
    setSelectedSide(side);
    setShowAuthDialog(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    onSideSelect(selectedSide);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="grid gap-6 py-4">
            <h2 className="text-2xl font-playfair text-center">Select Guest List</h2>
            <div className="grid grid-cols-1 gap-4">
              <Button
                size="lg"
                className="h-24 text-xl"
                onClick={() => handleSideClick("bride")}
              >
                Bride's Side
              </Button>
              <Button
                size="lg"
                className="h-24 text-xl"
                onClick={() => handleSideClick("groom")}
              >
                Groom's Side
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SideAuthDialog
        side={selectedSide}
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};