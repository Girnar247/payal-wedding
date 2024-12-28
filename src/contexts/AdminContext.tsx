import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: async () => {},
  logout: () => {},
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const login = async (password: string) => {
    try {
      const { data, error } = await supabase
        .from('hosts')
        .select('*')
        .eq('is_admin', true)
        .eq('admin_password', password)
        .single();

      if (error) throw error;

      if (data) {
        setIsAdmin(true);
        toast({
          title: "Admin Access Granted",
          description: "You now have admin privileges.",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin credentials.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: "Admin session ended.",
    });
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};