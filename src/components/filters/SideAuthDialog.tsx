import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SideAuthDialogProps {
  side: "bride" | "groom";
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface HostPasswords {
  bride_side_password: string | null;
  groom_side_password: string | null;
}

export const SideAuthDialog = ({ side, isOpen, onClose, onSuccess }: SideAuthDialogProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('hosts')
        .select('bride_side_password, groom_side_password')
        .eq('is_admin', true)
        .single();

      if (error) throw error;

      const passwords = data as HostPasswords;
      const correctPassword = side === 'bride' ? passwords.bride_side_password : passwords.groom_side_password;

      if (correctPassword && password === correctPassword) {
        toast({
          title: "Access Granted",
          description: `You now have access to the ${side}'s side guest list.`,
        });
        setPassword("");
        onSuccess();
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Enter Password for {side === 'bride' ? "Bride's" : "Groom's"} Side</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            autoFocus
          />
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};