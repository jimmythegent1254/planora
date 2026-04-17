import { CalendarDays } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="bg-rose-600 text-white rounded-full p-2">
        <CalendarDays />
      </div>
      <span className="text-lg font-bold">Planora</span>
    </div>
  );
};

export default Logo;
