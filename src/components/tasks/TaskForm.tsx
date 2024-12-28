import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskFormFields } from "./form/TaskFormFields";
import { taskFormSchema, TaskFormValues } from "./form/TaskFormTypes";

interface TaskFormProps {
  initialData?: any;
  onSubmit: (data: TaskFormValues) => void;
  onCancel: () => void;
}

export const TaskForm = ({ initialData, onSubmit, onCancel }: TaskFormProps) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      event_types: initialData?.event_types || [],
      priority: initialData?.priority || "medium",
      status: initialData?.status || "pending",
      due_date: initialData?.due_date || undefined,
      assigned_to: initialData?.assigned_to || undefined,
    },
  });

  const { data: hosts = [] } = useQuery({
    queryKey: ["hosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hosts")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TaskFormFields form={form} hosts={hosts} onCancel={onCancel} />
      </form>
    </Form>
  );
};
