import { useState } from "react";
import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";
import { Card } from "./ui/card";
import { toast } from "./ui/use-toast";
import { GuestBasicInfo } from "./guest-form/GuestBasicInfo";
import { GuestCategories } from "./guest-form/GuestCategories";
import { GuestEvents } from "./guest-form/GuestEvents";
import { GuestPlusCount } from "./guest-form/GuestPlusCount";
import { GuestHostSelect } from "./guest-form/GuestHostSelect";
import { AddGuestFormProps, GuestFormData } from "@/types/form";

export const AddGuestForm = ({ onSubmit, hosts, side }: AddGuestFormProps) => {
  const [formData, setFormData] = useState<GuestFormData>({
    name: "",
    email: "",
    phone: "",
    plusCount: 0,
    hostId: "",
    events: [],
    attributes: [],
    side
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.plusCount > 20) {
      toast({
        title: "Error",
        description: "Contact admin to add more than the limit - 20 guests",
        variant: "destructive",
      });
      return;
    }
    
    const submissionData = {
      ...formData,
      side
    };
    
    console.log('Submitting guest with side:', side);
    onSubmit(submissionData);

    toast({
      title: "Success",
      description: `The Guest has been successfully added to the ${side} side`,
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      plusCount: 0,
      hostId: "",
      events: [],
      attributes: [],
      side
    });
  };

  return (
    <Card className="glass-card p-6 max-w-md mx-auto fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
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