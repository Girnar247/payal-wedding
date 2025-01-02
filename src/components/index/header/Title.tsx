import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

export const Title = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("Payal's Wedding - Guest List");

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div className="text-center md:text-left space-y-2 w-full md:w-auto">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Input
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            className="text-3xl md:text-5xl font-playfair text-wedding-text bg-white/50"
            autoFocus
          />
        ) : (
          <h1 
            className="text-3xl md:text-5xl font-playfair text-wedding-text cursor-pointer flex items-center gap-2"
            onClick={handleTitleClick}
          >
            {title}
            <Pencil className="h-5 w-5 inline-block hover:text-wedding-text/80" />
          </h1>
        )}
      </div>
      <p className="text-gray-600">Manage your special celebrations with elegance</p>
    </div>
  );
};