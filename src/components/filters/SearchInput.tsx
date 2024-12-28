import { Input } from "@/components/ui/input";
import { memo } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = memo(function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <Input
      placeholder="Search guests..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-64"
    />
  );
});