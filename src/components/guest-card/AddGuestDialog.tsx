import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddGuestForm } from "@/components/AddGuestForm";
import { UserPlus } from "lucide-react";
import { Host } from "@/types/guest";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface AddGuestDialogProps {
  hosts: Host[];
  onSubmit: (data: any) => void;
}

export const AddGuestDialog = ({ hosts, onSubmit }: AddGuestDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: any) => {
    if (!data.hostId) {
      toast({
        title: "Error",
        description: "Please assign a host to the guest.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto bg-white/50 hover:bg-white/80">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
        </DialogHeader>
        <AddGuestForm onSubmit={handleSubmit} hosts={hosts} />
      </DialogContent>
    </Dialog>
  );
};