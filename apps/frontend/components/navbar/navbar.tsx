"use client";

import { authClient } from "@/lib/auth-client";
import { Bell, Command, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "../logo";
import { Button } from "../ui/button";
import { NavbarDropdown } from "./navbar-dropdown";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const navItems = ["Browse Events", "Dashboard", "Analytics"];
  const navButtonClassName =
    "bg-transparent text-slate-500 hover:text-slate-600 font-semibold cursor-pointer";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white py-4 px-96 flex justify-between items-center border-b border-blue-200">
      {" "}
      <div className="w-3/12">
        <Logo />
      </div>
      <div className="flex items-center justify-center w-5/12 mr-16">
        {navItems.map((item) => (
          <Button key={item} className={navButtonClassName}>
            {item}
          </Button>
        ))}
      </div>
      <div className="w-4/12 flex gap-5 items-center justify-end">
        <Button className=" text-slate-600 border cursor-pointer bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border-slate-300 w-4/12">
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

        <Button
          onClick={() => router.push("/create-event")}
          className="bg-rose-600 hover:bg-rose-500 cursor-pointer"
        >
          <Plus />
          <span className="text-[13px] font-semibold">Create Event</span>
        </Button>

        {!session ? (
          <Button
            onClick={() => router.push("/login")}
            className="bg-transparent hover:bg-slate-100 text-slate-900 font-semibold cursor-pointer"
          >
            Sign In
          </Button>
        ) : (
          <NavbarDropdown session={session.session} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
