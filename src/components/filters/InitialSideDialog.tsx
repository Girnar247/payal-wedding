import { Dialog, DialogContent } from "@/components/ui/dialog";
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
        <DialogContent className="sm:max-w-[900px] p-0 bg-wedding-cream">
          <div className="grid gap-6 p-6">
            <h2 className="text-3xl font-playfair text-center">Select Guest List</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Bride's Side Card */}
              <div 
                className="relative overflow-hidden rounded-xl cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleSideClick("bride")}
              >
                <div className="aspect-[4/3] relative">
                  <img 
                    src="/lovable-uploads/b6706762-b467-49e0-9d00-ff7bc879608e.png"
                    alt="Bride's Side"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h3 className="text-3xl font-playfair text-white">Bride's Side</h3>
                  </div>
                </div>
              </div>

              {/* Groom's Side Card */}
              <div 
                className="relative overflow-hidden rounded-xl cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleSideClick("groom")}
              >
                <div className="aspect-[4/3] relative">
                  <img 
                    src="/lovable-uploads/7fa08b78-a345-4423-8e0c-ac7c0cfa089a.png"
                    alt="Groom's Side"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h3 className="text-3xl font-playfair text-white">Groom's Side</h3>
                  </div>
                </div>
              </div>
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