import { Card } from "./ui/card";
import { User, UserCheck, UserX, Users, Home } from "lucide-react";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
  totalGuests: number;
  totalWithPlusOnes: number;
  confirmed: number;
  declined: number;
  pending: number;
  accommodationRequired: number;
  onFilterByStatus?: (status: string | null) => void;
}

export const Dashboard = ({ 
  totalGuests, 
  totalWithPlusOnes, 
  confirmed, 
  declined, 
  pending,
  accommodationRequired,
  onFilterByStatus 
}: DashboardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const stats = [
    {
      label: "Invited Guests",
      value: totalGuests,
      icon: User,
      color: "bg-wedding-rose/20",
      textColor: "text-wedding-text",
      status: null
    },
    {
      label: "Total Guests",
      value: totalWithPlusOnes,
      icon: Users,
      color: "bg-wedding-rose/20",
      textColor: "text-wedding-text",
      status: null
    },
    {
      label: "Confirmed",
      value: confirmed,
      icon: UserCheck,
      color: "bg-green-100",
      textColor: "text-green-700",
      status: "confirmed"
    },
    {
      label: "Declined",
      value: declined,
      icon: UserX,
      color: "bg-red-100",
      textColor: "text-red-700",
      status: "declined"
    },
    {
      label: "Pending",
      value: pending,
      icon: User,
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
      status: "pending"
    },
    {
      label: "Need Accommodation",
      value: accommodationRequired,
      icon: Home,
      color: "bg-blue-100",
      textColor: "text-blue-700",
      status: "accommodation"
    },
  ];

  const handleFilterClick = (status: string | null) => {
    setActiveFilter(status === activeFilter ? null : status);
    onFilterByStatus?.(status === activeFilter ? null : status);
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 bg-white/50 hover:bg-white/80 rounded-lg shadow-sm transition-all duration-300"
      >
        <h2 className="text-2xl font-playfair">Dashboard Analytics</h2>
        {isCollapsed ? (
          <ChevronDown className="h-6 w-6 transition-transform duration-200" />
        ) : (
          <ChevronUp className="h-6 w-6 transition-transform duration-200" />
        )}
      </Button>
      
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 fade-in">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className={`glass-card p-6 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                onFilterByStatus ? 'hover:scale-105' : ''
              } ${activeFilter === stat.status ? 'ring-2 ring-wedding-rose shadow-lg' : ''}`}
              onClick={() => handleFilterClick(stat.status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-playfair mt-2 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className={`h-6 w-4 ${stat.textColor}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};