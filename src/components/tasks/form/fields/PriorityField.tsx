import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormTypes";
import { cn } from "@/lib/utils";

interface PriorityFieldProps {
  form: UseFormReturn<TaskFormValues>;
}

export const PriorityField = ({ form }: PriorityFieldProps) => {
  const priorities = [
    { value: "low", label: "Low", color: "bg-green-100 hover:bg-green-200" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 hover:bg-yellow-200" },
    { value: "high", label: "High", color: "bg-red-100 hover:bg-red-200" },
  ];

  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Priority</FormLabel>
          <div className="flex flex-wrap gap-2">
            {priorities.map((priority) => (
              <Button
                key={priority.value}
                type="button"
                variant="outline"
                onClick={() => field.onChange(priority.value)}
                className={cn(
                  "flex-1",
                  field.value === priority.value ? priority.color : "",
                  field.value === priority.value ? "border-2" : ""
                )}
              >
                {priority.label}
              </Button>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};