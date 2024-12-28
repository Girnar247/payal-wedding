import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  event_types: z.array(z.string()).min(1, "At least one event type is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in-progress", "completed"]),
  due_date: z.string().optional(),
  assigned_to: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;