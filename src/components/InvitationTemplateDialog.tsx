import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";
import { PlusCircle } from "lucide-react";

export const InvitationTemplateDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [whatsappContent, setWhatsappContent] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('invitation_templates')
        .insert([
          {
            name,
            subject,
            email_content: emailContent,
            whatsapp_content: whatsappContent,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white/50 hover:bg-white/80">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Invitation Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Invitation Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Template Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Formal Invitation"
            />
          </div>
          <div>
            <Label>Email Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Wedding Invitation"
            />
          </div>
          <div>
            <Label>Email Content</Label>
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-[200px]"
              placeholder="Dear {guest_name},&#10;&#10;We are delighted to invite you..."
            />
          </div>
          <div>
            <Label>WhatsApp Message</Label>
            <Textarea
              value={whatsappContent}
              onChange={(e) => setWhatsappContent(e.target.value)}
              className="min-h-[200px]"
              placeholder="Dear {guest_name},&#10;&#10;You are cordially invited..."
            />
          </div>
          <Button onClick={handleSave} className="w-full">Save Template</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};