import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { memo } from "react";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onToggle: () => void;
}

export const ViewToggle = memo(function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
    >
      {viewMode === "grid" ? (
        <List className="h-4 w-4 mr-2" />
      ) : (
        <LayoutGrid className="h-4 w-4 mr-2" />
      )}
      {viewMode === "grid" ? "List View" : "Grid View"}
    </Button>
  );
});