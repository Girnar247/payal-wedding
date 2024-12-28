import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormTypes";

interface DueDateFieldProps {
  form: UseFormReturn<TaskFormValues>;
}

export const DueDateField = ({ form }: DueDateFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="due_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Due Date</FormLabel>
          <FormControl>
            <Input
              type="date"
              {...field}
              value={field.value ? field.value.split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value;
                if (date) {
                  field.onChange(new Date(date).toISOString());
                } else {
                  field.onChange(undefined);
                }
              }}
              className="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};