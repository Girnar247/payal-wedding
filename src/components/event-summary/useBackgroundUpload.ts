import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useBackgroundUpload = () => {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>, eventType: string) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const sanitizedEventType = eventType.replace(/\s+/g, '_');
      const filePath = `${sanitizedEventType}/${crypto.randomUUID()}.${fileExt}`;

      setUploading(eventType);

      const { error: uploadError } = await supabase.storage
        .from('event-backgrounds')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from('event-backgrounds')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('events')
        .update({ background_url: publicUrl.publicUrl })
        .eq('event_name', eventType);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Background Updated",
        description: "The event background has been successfully updated.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload background image: " + error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleMainBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `main/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event-backgrounds')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from('event-backgrounds')
        .getPublicUrl(filePath);

      toast({
        title: "Main Background Updated",
        description: "The main background has been successfully updated.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload main background image: " + error.message,
        variant: "destructive",
      });
    }
  };

  return {
    uploading,
    handleBackgroundUpload,
    handleMainBackgroundUpload
  };
};