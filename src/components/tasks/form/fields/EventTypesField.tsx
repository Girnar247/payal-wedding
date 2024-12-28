import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormTypes";
import { EventType } from "@/types/guest";
import { cn } from "@/lib/utils";

interface EventTypesFieldProps {
  form: UseFormReturn<TaskFormValues>;
}

export const EventTypesField = ({ form }: EventTypesFieldProps) => {
  const eventTypes: EventType[] = [
    "haldi",
    "mehndi",
    "mayra",
    "sangeet",
    "wedding",
  ];

  return (
    <FormField
      control={form.control}
      name="event_types"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Events</FormLabel>
          <Select
            onValueChange={(value) => {
              const currentValues = field.value || [];
              if (currentValues.includes(value)) {
                field.onChange(currentValues.filter((v) => v !== value));
              } else {
                field.onChange([...currentValues, value]);
              }
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select events">
                  {field.value?.length
                    ? `${field.value.length} events selected`
                    : "Select events"}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {eventTypes.map((event) => (
                <SelectItem
                  key={event}
                  value={event}
                  className={cn(
                    "cursor-pointer",
                    field.value?.includes(event) && "bg-accent"
                  )}
                >
                  {event.charAt(0).toUpperCase() + event.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};