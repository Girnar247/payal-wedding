import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

export const DownloadApkButton = () => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch('/app-release.apk');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'payal-wedding.apk';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "The APK file is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the APK file.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) return null;

  return (
    <Button 
      variant="outline" 
      onClick={handleDownload}
      className="bg-white/50 hover:bg-white/80"
    >
      <Download className="h-4 w-4 mr-2" />
      Download APK
    </Button>
  );
};