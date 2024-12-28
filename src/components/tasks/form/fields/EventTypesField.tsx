import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormTypes";
import { EventType } from "@/types/guest";

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      form.setValue("event_types", eventTypes);
    } else {
      form.setValue("event_types", []);
    }
  };

  const isAllSelected = form.watch("event_types")?.length === eventTypes.length;

  return (
    <FormField
      control={form.control}
      name="event_types"
      render={() => (
        <FormItem>
          <FormLabel>Events</FormLabel>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                All Events
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {eventTypes.map((type) => (
                <FormField
                  key={type}
                  control={form.control}
                  name="event_types"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value?.includes(type)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, type]);
                          } else {
                            field.onChange(
                              currentValues.filter((value) => value !== type)
                            );
                          }
                        }}
                      />
                      <label className="text-sm font-medium leading-none capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {type}
                      </label>
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};