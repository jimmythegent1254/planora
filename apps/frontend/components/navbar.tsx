"use client";

import { authClient } from "@/lib/auth-client";
import { Bell, Command, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "./logo";
import { Button } from "./ui/button";

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="bg-white py-4 px-96 flex justify-between items-center border border-b-blue-200">
      <div className="w-3/12">
        <Logo />
      </div>
      <div className="flex items-center justify-center w-5/12">
        <Button className="bg-transparent text-slate-500 hover:text-slate-600 font-semibold">
          Browse Events
        </Button>
        <Button className="bg-transparent text-slate-500 hover:text-slate-600 font-semibold">
          Dashboard
        </Button>
        <Button className="bg-transparent text-slate-500 hover:text-slate-600 font-semibold">
          Analytics
        </Button>
      </div>

      <div className="w-4/12 flex gap-5 items-center justify-end">
        <Button className=" text-slate-600 border bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border-slate-300 w-4/12">
          <Search />
          <span className="font-light text-[13px]">Search...</span>
          <div className="flex border border-slate-400 text-slate-500 bg-white rounded-sm text-xs items-center px-1 py-0.5">
            <Command className="w-3! h-3!" />
            <span className="text-[10px]">K</span>
          </div>
        </Button>

        <Button className="bg-transparent text-rose-600 hover:bg-slate-100 cursor-pointer p-2 py-4">
          <Bell className="w-5! h-5!" />
        </Button>

        <Button className="bg-rose-600 hover:bg-rose-500 cursor-pointer">
          <Plus />
          <span className="text-[13px] font-semibold">Create Event</span>
        </Button>

        <Button
          disabled={isPending}
          onClick={!session ? () => router.push("/auth") : handleSignOut}
          className="bg-transparent w-4/12 text-slate-900 font-semibold hover:bg-slate-100"
        >
          {isPending ? (
            <span className="opacity-50">Loading...</span>
          ) : session ? (
            "Sign Out"
          ) : (
            "Sign In"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
