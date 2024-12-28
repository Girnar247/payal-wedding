import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
}

export const FormActions = ({ onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">Save Task</Button>
    </div>
  );
};