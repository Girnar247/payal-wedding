import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MayraGuestList } from "@/components/mayra/MayraGuestList";
import { EventCard } from "@/components/event-summary/EventCard";
import { useEventState } from "@/hooks/useEventState";
import { Guest } from "@/types/guest";

const MayraEvent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { eventDetails } = useEventState();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "jahazpur") {
      setIsAuthenticated(true);
      localStorage.setItem("mayra_authenticated", "true");
    } else {
      toast({
        title: "Incorrect Password",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("mayra_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <Card className="w-full max-w-md p-6 space-y-4">
          <h1 className="text-2xl font-playfair text-center text-wedding-text">
            Mayra's Event
          </h1>
          <p className="text-center text-gray-600">
            Please enter the password to access this page
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const handleBackgroundUpload = async () => {
    return Promise.resolve(); // Return a resolved promise to match the expected type
  };

  return (
    <div className="min-h-screen bg-wedding-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-playfair text-wedding-text">
            Mayra's Event
          </h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Main Page
          </Button>
        </div>

        {eventDetails?.mayra && (
          <div className="max-w-md">
            <EventCard
              eventType="mayra"
              details={eventDetails.mayra}
              guests={[] as Guest[]}
              onBackgroundUpload={handleBackgroundUpload}
              uploading={null}
            />
          </div>
        )}

        <MayraGuestList />
      </div>
    </div>
  );
};

export default MayraEvent;