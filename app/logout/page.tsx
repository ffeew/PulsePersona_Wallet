"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SmileyFace from "../assets/SmileyFace";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      localStorage.clear();
      router.push("/login");
    }, 2000);
  }, [router]);
  return (
    <div className="container-screen flex-col-all-center space-y-4 bg-theme-dark-gray">
      <SmileyFace className="w-12 h-auto text-theme-white" />
      <p className="text-xl">Logout Successful</p>
    </div>
  );
}
