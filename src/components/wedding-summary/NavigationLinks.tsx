import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NavigationLinks = () => {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <Link to="/guests">
        <Button variant="outline" className="bg-white/80 hover:bg-white">
          Manage Guest List
        </Button>
      </Link>
    </div>
  );
};