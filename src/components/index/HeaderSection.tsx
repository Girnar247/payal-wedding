import { EventDetails } from "@/types/guest";
import { Title } from "./header/Title";
import { ActionButtons } from "./header/ActionButtons";

interface HeaderSectionProps {
  eventDetails: Record<string, EventDetails>;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const HeaderSection = ({ eventDetails, isRefreshing, onRefresh }: HeaderSectionProps) => {
  const mainBackgroundUrl = "https://vztjldlvnklafclbinnv.supabase.co/storage/v1/object/public/event-backgrounds/main-background/96777c07-eea8-4596-901c-7137315f7b01.webp";

  return (
    <div 
      className="bg-cover bg-center bg-no-repeat py-8 relative"
      style={{
        backgroundImage: `url(${mainBackgroundUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-white/40" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Title />
          <ActionButtons isRefreshing={isRefreshing} onRefresh={onRefresh} />
        </div>
      </div>
    </div>
  );
};