import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "./TaskFormTypes";
import { TitleField } from "./fields/TitleField";
import { DescriptionField } from "./fields/DescriptionField";
import { EventTypesField } from "./fields/EventTypesField";
import { PriorityField } from "./fields/PriorityField";
import { StatusField } from "./fields/StatusField";
import { DueDateField } from "./fields/DueDateField";
import { AssigneeField } from "./fields/AssigneeField";
import { FormActions } from "./fields/FormActions";

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
  hosts: any[];
  onCancel: () => void;
}

export const TaskFormFields = ({ form, hosts, onCancel }: TaskFormFieldsProps) => {
  return (
    <>
      <TitleField form={form} />
      <DescriptionField form={form} />
      <EventTypesField form={form} />
      <PriorityField form={form} />
      <StatusField form={form} />
      <DueDateField form={form} />
      <AssigneeField form={form} hosts={hosts} />
      <FormActions onCancel={onCancel} />
    </>
  );
};