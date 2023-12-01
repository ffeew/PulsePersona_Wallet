"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/login" && pathname !== "/logout" && <Navbar />}
      {children}
    </>
  );
}
