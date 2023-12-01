"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }, [router]);
  return (
    <div className="container-screen flex-all-center bg-theme-dark-gray">
      <p>logout successful</p>
    </div>
  );
}
