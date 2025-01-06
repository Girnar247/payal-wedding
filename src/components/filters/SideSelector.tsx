import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SideSelectorProps {
  selectedSide: "bride" | "groom";
  onSideChange: (side: "bride" | "groom") => void;
}

export const SideSelector = ({ selectedSide, onSideChange }: SideSelectorProps) => {
  return (
    <Tabs value={selectedSide} onValueChange={(value) => onSideChange(value as "bride" | "groom")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="bride">Bride Side</TabsTrigger>
        <TabsTrigger value="groom">Groom Side</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};