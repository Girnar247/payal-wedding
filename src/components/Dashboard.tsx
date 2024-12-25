import { Card } from "./ui/card";
import { User, UserCheck, UserX, Users } from "lucide-react";

interface DashboardProps {
  totalGuests: number;
  totalWithPlusOnes: number;
  confirmed: number;
  declined: number;
  pending: number;
}

export const Dashboard = ({ totalGuests, totalWithPlusOnes, confirmed, declined, pending }: DashboardProps) => {
  const stats = [
    {
      label: "Invited Guests",
      value: totalGuests,
      icon: User,
      color: "bg-wedding-rose/20",
      textColor: "text-wedding-text",
    },
    {
      label: "Total Guests",
      value: totalWithPlusOnes,
      icon: Users,
      color: "bg-wedding-rose/20",
      textColor: "text-wedding-text",
    },
    {
      label: "Confirmed",
      value: confirmed,
      icon: UserCheck,
      color: "bg-green-100",
      textColor: "text-green-700",
    },
    {
      label: "Declined",
      value: declined,
      icon: UserX,
      color: "bg-red-100",
      textColor: "text-red-700",
    },
    {
      label: "Pending",
      value: pending,
      icon: User,
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 fade-in">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="glass-card p-6 transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-playfair mt-2 ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};