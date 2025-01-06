import { useState, useEffect } from "react";
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
    side
  });

  // Function to programmatically add a test guest
  const addTestGuest = () => {
    console.log('Starting to add test guest on the groom side');
    
    // Find Pranai Mehta's host ID
    const pranaiHost = hosts.find(host => host.name === 'Pranai Mehta');
    if (!pranaiHost) {
      console.error('Could not find host: Pranai Mehta');
      return;
    }

    const testData: GuestFormData = {
      name: "test program",
      email: "test@example.com",
      phone: "+1234567890",
      plusCount: 2,
      hostId: pranaiHost.id,
      events: ["wedding", "sangeet"],
      attributes: ["friends"],
      side: "groom"  // Explicitly set to groom
    };

    console.log('Test guest data prepared:', testData);
    handleSubmit(null, testData);
  };

  const handleSubmit = (e: React.FormEvent | null, testData?: GuestFormData) => {
    if (e) e.preventDefault();
    
    const dataToSubmit = testData || formData;
    console.log('Handling submit with data:', dataToSubmit);

    if (!dataToSubmit.name.trim()) {
      toast({
        title: "Error",
        description: "Guest name is required",
        variant: "destructive",
      });
      return;
    }

    if (dataToSubmit.attributes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one guest category",
        variant: "destructive",
      });
      return;
    }

    if (dataToSubmit.events.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one event",
        variant: "destructive",
      });
      return;
    }

    if (!dataToSubmit.hostId) {
      toast({
        title: "Error",
        description: "Please select a host",
        variant: "destructive",
      });
      return;
    }
    
    if (dataToSubmit.plusCount > 20) {
      toast({
        title: "Error",
        description: "Contact admin to add more than the limit - 20 guests",
        variant: "destructive",
      });
      return;
    }
    
    // Only use the side from props if it's not provided in the test data
    const submissionData = {
      ...dataToSubmit,
      side: dataToSubmit.side || side
    };
    
    console.log('AddGuestForm - Current side:', side);
    console.log('AddGuestForm - Submitting guest data:', submissionData);
    
    onSubmit(submissionData);

    if (!testData) {
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
    }

    toast({
      title: "Success",
      description: `Guest has been successfully added to the ${submissionData.side === 'bride' ? "Bride's" : "Groom's"} side`,
    });
  };

  // Call addTestGuest immediately after component mount
  useEffect(() => {
    if (side === "groom") {
      console.log('Component mounted, adding test guest...');
      addTestGuest();
    }
  }, []);

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