import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";

interface TaskDetailsProps {
  description: string | null;
  events: string[];
  dueDate: string | null;
  assignedHostName: string | null;
}

export const TaskDetails = ({
  description,
  events,
  dueDate,
  assignedHostName,
}: TaskDetailsProps) => {
  return (
    <div className="space-y-2">
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {events.map((event) => (
          <Badge key={event} variant="outline" className="bg-wedding-sage/30">
            {event}
          </Badge>
        ))}
        {dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <CalendarIcon className="h-3 w-3" />
            {format(new Date(dueDate), "MMM d, yyyy")}
          </div>
        )}
        {assignedHostName && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <UserIcon className="h-3 w-3" />
            {assignedHostName}
          </div>
        )}
      </div>
    </div>
  );
};