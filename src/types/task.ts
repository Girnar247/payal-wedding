export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  event_types?: string[];
  event_type?: string;
  due_date: string | null;
  assigned_to: string | null;
}