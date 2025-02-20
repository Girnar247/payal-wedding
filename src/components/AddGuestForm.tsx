import { useState } from "react";
import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { GuestBasicInfo } from "./guest-form/GuestBasicInfo";
import { GuestCategories } from "./guest-form/GuestCategories";
import { GuestEvents } from "./guest-form/GuestEvents";
import { GuestPlusCount } from "./guest-form/GuestPlusCount";
import { GuestHostSelect } from "./guest-form/GuestHostSelect";
import { AddGuestFormProps, GuestFormData } from "@/types/form";

export const AddGuestForm = ({ onSubmit, hosts, side }: AddGuestFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<GuestFormData>({
    name: "",
    email: "",
    phone: "",
    plusCount: 0,
    hostId: "",
    events: [],
    attributes: [],
    side // Initialize with the provided side prop
  });

  const handleSubmit = (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    
    console.log('AddGuestForm - Current side prop:', side);
    console.log('AddGuestForm - Current form data:', formData);

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Guest name is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.attributes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one guest category",
        variant: "destructive",
      });
      return;
    }

    if (formData.events.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one event",
        variant: "destructive",
      });
      return;
    }

    if (!formData.hostId) {
      toast({
        title: "Error",
        description: "Please select a host",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.plusCount > 20) {
      toast({
        title: "Error",
        description: "Contact admin to add more than the limit - 20 guests",
        variant: "destructive",
      });
      return;
    }
    
    // Create submission data with explicit side value from props
    const submissionData: GuestFormData = {
      ...formData,
      side // Always use the current side prop value
    };
    
    console.log('AddGuestForm - Final submission data:', submissionData);
    
    onSubmit(submissionData);

    // Reset form after submission, maintaining the current side
    setFormData({
      name: "",
      email: "",
      phone: "",
      plusCount: 0,
      hostId: "",
      events: [],
      attributes: [],
      side // Keep the current side when resetting
    });

    toast({
      title: "Success",
      description: `Guest has been successfully added to the ${side === 'bride' ? "Bride's" : "Groom's"} side`,
    });
  };

  return (
    <Card className="glass-card p-6 max-w-md mx-auto fade-in">
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <GuestBasicInfo
          name={formData.name}
          email={formData.email}
          phone={formData.phone}
          onNameChange={(value) => setFormData({ ...formData, name: value })}
          onEmailChange={(value) => setFormData({ ...formData, email: value })}
          onPhoneChange={(value) => setFormData({ ...formData, phone: value })}
        />

        <GuestCategories
          selectedAttributes={formData.attributes}
          onAttributeChange={(attributes) => setFormData({ ...formData, attributes })}
        />

        <GuestPlusCount
          plusCount={formData.plusCount}
          onPlusCountChange={(count) => setFormData({ ...formData, plusCount: count })}
        />

        <GuestHostSelect
          hostId={formData.hostId}
          hosts={hosts}
          onHostChange={(hostId) => setFormData({ ...formData, hostId })}
        />

        <GuestEvents
          selectedEvents={formData.events}
          onEventsChange={(events) => setFormData({ ...formData, events })}
        />

        <Button type="submit" className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </form>
    </Card>
  );
};