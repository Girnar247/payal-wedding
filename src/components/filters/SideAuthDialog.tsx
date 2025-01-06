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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('hosts')
        .select<'hosts', HostPasswords>('bride_side_password, groom_side_password')
        .eq('is_admin', true)
        .single();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Error",
          description: "No admin configuration found.",
          variant: "destructive",
        });
        return;
      }

      const correctPassword = side === 'bride' ? data.bride_side_password : data.groom_side_password;

      if (password === correctPassword) {
        onSuccess();
        onClose();
        toast({
          title: "Access Granted",
          description: `You now have access to the ${side}'s side guest list.`,
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to verify password.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Password for {side === 'bride' ? "Bride's" : "Groom's"} Side</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};