"use client";

import { useRouter, usePathname } from "next/navigation";
import AnimatedBackground from "./AnimatedBackground";
import Documents from "../assets/Documents";
import Setting from "../assets/Setting";
import Logout from "../assets/Logout";
import Logo from "../assets/Logo";

interface TabProps {
  router: any;
  pathname: string;
  tab: {
    name: string;
    path: string;
    icon: React.ReactNode;
  };
}

interface TabClusterProps {
  router: any;
  pathname: string;
  array: Array<{
    name: string;
    path: string;
    icon: React.ReactNode;
  }>;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  if (typeof window !== "undefined") {
    const existingDid = localStorage.getItem("key");
    if (!existingDid) {
      router.push("/login");
    }
  }

  const pageTabs = [
    {
      name: "VCs",
      path: "/",
      icon: <Documents className="w-4 h-auto" />,
    },
  ];

  const controlTabs = [
    {
      name: "Settings",
      path: "/settings",
      icon: <Setting className="w-4 h-auto" />,
    },
  ];

  const authTabs = [
    {
      name: "Logout",
      path: "/logout",
      icon: <Logout className="w-4 h-auto" />,
    },
  ];

  return (
    <div className="w-64 h-screen fixed bg-[#2B2D31] flex flex-col justify-between items-center py-14">
      <div className="w-full flex flex-col space-y-20 justify-center items-start">
        {/* logo */}
        <div className="w-full flex flex-row justify-start items-center px-10 space-x-2">
          <Logo className="text-theme-white" />
          <p>Pulse Persona</p>
        </div>

        {/* pages tab */}
        <TabCluster pathname={pathname!} router={router} array={pageTabs} />
      </div>

      <div className="w-full flex flex-col justify-center items-center">
        {/* controls tab */}
        <TabCluster pathname={pathname!} router={router} array={controlTabs} />

        {/* divider */}
        <div className="w-full py-2 px-10">
          <div className="w-full h-[2px] bg-theme-gray rounded-full" />
        </div>

        {/* auth tab */}
        <TabCluster pathname={pathname!} router={router} array={authTabs} />
      </div>
    </div>
  );
}

function Tab(props: TabProps) {
  const { router, pathname, tab } = props;

  return (
    <AnimatedBackground backgroundClassname="bg-theme-gray rounded-xl">
      <button
        className="pressable group w-full flex flex-row justify-start items-center py-5 px-4 space-x-4"
        onClick={() => router.push(tab.path)}
      >
        <div
          className={`${
            pathname === tab.path ? "text-theme-white" : "text-theme-light-gray"
          }`}
        >
          {tab.icon}
        </div>
        <p
          className={`${
            pathname === tab.path ? "text-theme-white" : "text-theme-light-gray"
          }`}
        >
          {tab.name}
        </p>
      </button>
    </AnimatedBackground>
  );
}

function TabCluster(props: TabClusterProps) {
  const { router, pathname, array } = props;

  return (
    <div className="w-full flex flex-col justify-center items-center px-7">
      {array.map((page, index) => (
        <Tab key={index} pathname={pathname} router={router} tab={page} />
      ))}
    </div>
  );
}
