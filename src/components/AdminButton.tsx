import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useAdmin } from "@/contexts/AdminContext";
import { Lock, LogOut, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AdminButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [bridePassword, setBridePassword] = useState("");
  const [groomPassword, setGroomPassword] = useState("");
  const { isAdmin, login, logout } = useAdmin();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(password);
    setPassword("");
    setIsOpen(false);
  };

  const handleUpdatePasswords = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('hosts')
        .update({
          bride_side_password: bridePassword,
          groom_side_password: groomPassword
        })
        .eq('is_admin', true);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Side passwords have been updated.",
      });
      setIsSettingsOpen(false);
      setBridePassword("");
      setGroomPassword("");
    } catch (error) {
      console.error('Error updating passwords:', error);
      toast({
        title: "Error",
        description: "Failed to update passwords.",
        variant: "destructive",
      });
    }
  };

  if (isAdmin) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => setIsSettingsOpen(true)}
          className="bg-white/50 hover:bg-white/80"
        >
          <Settings className="h-4 w-4 mr-2" />
          Side Settings
        </Button>
        <Button 
          variant="outline" 
          onClick={logout}
          className="bg-white/50 hover:bg-white/80"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Admin Logout
        </Button>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Side Passwords</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdatePasswords} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Bride Side Password</label>
                <Input
                  type="password"
                  value={bridePassword}
                  onChange={(e) => setBridePassword(e.target.value)}
                  placeholder="Enter bride side password"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Groom Side Password</label>
                <Input
                  type="password"
                  value={groomPassword}
                  onChange={(e) => setGroomPassword(e.target.value)}
                  placeholder="Enter groom side password"
                />
              </div>
              <Button type="submit" className="w-full">Update Passwords</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="bg-white/50 hover:bg-white/80"
      >
        <Lock className="h-4 w-4 mr-2" />
        Admin
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};