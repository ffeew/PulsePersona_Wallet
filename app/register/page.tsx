"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCircle from "../assets/QuestionCircle";
import Logo from "../assets/Logo";

export default function Login() {
  const router = useRouter();
  const [did, setDid] = useState("");
  const [key, setKey] = useState("");

  const handleAuthentication = () => {
    // do smething
  };

  return (
    <div className="w-full h-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center space-y-5">
        <div className="w-full flex flex-row justify-center items-center space-x-4">
          <Logo className="w-7 h-auto text-theme-white" />
          <p className="whitespace-nowrap font-medium text-3xl">
            Pulse Persona
          </p>
        </div>
        <div className="w-96 flex flex-col justify-center items-center space-y-5 p-7 bg-[#36373C] drop-shadow-xl rounded-3xl">
          <div className="w-full flex flex-col space-y-2 justify-center items-start">
            <div className="flex flex-row justify-center items-center space-x-2">
              <p className="font-medium">Service Endpoint</p>
              <button>
                <QuestionCircle className="w-4 h-auto text-theme-white" />
              </button>
            </div>
            <input
              type="text"
              className="w-full py-3 px-3 bg-[#2B2D31] rounded-lg"
              onChange={(e) => setDid(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col space-y-2 justify-center items-start">
            <p className="font-medium">Private key</p>
            <input
              type="password"
              className="w-full py-3 px-3 bg-[#2B2D31] rounded-lg"
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <button
            className="w-full flex justify-center items-center py-3 bg-theme-accent rounded-lg"
            onClick={handleAuthentication}
          >
            <p className="text-white font-medium">Register</p>
          </button>
          <p className="text-white text-sm font-light">
            Already have an account?{" "}
            <span
              className="pressable underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
