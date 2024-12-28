import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useAdmin } from "@/contexts/AdminContext";
import { Lock, LogOut } from "lucide-react";

export const AdminButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { isAdmin, login, logout } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(password);
    setPassword("");
    setIsOpen(false);
  };

  if (isAdmin) {
    return (
      <Button 
        variant="outline" 
        onClick={logout}
        className="bg-white/50 hover:bg-white/80"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Admin Logout
      </Button>
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