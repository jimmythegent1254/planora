import heroEvent from "@/assets/hero-event.jpg";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { type ReactNode } from "react";

type AuthWrapperProps = {
  children: ReactNode;
};

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  return (
    <div className="flex min-h-screen items-center bg-gray-50">
      <div className="flex w-full justify-center px-6 py-10 lg:w-[55%]">
        <div className="flex w-full max-w-[420px] flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 text-white rounded-full p-2">
              <CalendarDays />
            </div>
            <span className="text-lg font-bold">Planora</span>
          </div>

          {children}
        </div>
      </div>

      {/* Right side hero image */}
      <div className="relative h-screen w-[45%] hidden lg:block">
        <Image
          fill
          className="object-cover"
          src={heroEvent} // You'll need to import this or use a public image
          alt="Event Hero"
        />

        {/* Optional testimonial */}
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 bg-stone-100 w-11/12 rounded-md p-5">
          <span className="font-bold text-slate-900">
            "Eventify made managing our 5,000-person conference effortless."
          </span>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-10 w-10 rounded-full bg-slate-300"></div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold">Sarah Chen</h1>
              <span className="text-xs text-slate-500">
                Head of Events, TechCorp
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
