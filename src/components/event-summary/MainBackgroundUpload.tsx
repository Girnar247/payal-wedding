import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface MainBackgroundUploadProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const MainBackgroundUpload = ({ onUpload }: MainBackgroundUploadProps) => {
  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Button
        variant="outline"
        className="bg-white/50 hover:bg-white/80"
      >
        <Upload className="h-4 w-4 mr-2" />
        Update Main Background
      </Button>
    </div>
  );
};