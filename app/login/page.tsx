"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCircle from "../assets/QuestionCircle";
import Logo from "../assets/Logo";

export default function Login() {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
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
          <p className="whitespace-nowrap text-3xl">Pulse Persona</p>
        </div>
        <div className="w-96 flex flex-col justify-center items-center space-y-5 p-7 bg-[#36373C] drop-shadow-xl rounded-3xl">
          <div className="w-full flex flex-col space-y-2 justify-center items-start">
            <p className="">DID</p>
            <input
              type="text"
              placeholder="Enter DID"
              className="w-full py-3 px-3 bg-[#2B2D31] rounded-lg"
              onChange={(e) => setDid(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col space-y-2 justify-center items-start">
            <div className="relative">
              <div className="flex flex-row justify-center items-center space-x-2">
                <p className="">Private key</p>
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <QuestionCircle className="w-4 h-auto text-theme-white" />
                </button>
              </div>
              {showTooltip && (
                <div className="w-full absolute top-0 pl-3 translate-x-full">
                  <div className="w-48 p-3 bg-theme-medium-gray rounded-2xl drop-shadow-lg">
                    <p className="text-xs">
                      Your private key must be an ethereum wallet
                    </p>
                  </div>
                </div>
              )}
            </div>
            <input
              type="password"
              placeholder="Enter Private Key"
              className="w-full py-3 px-3 bg-[#2B2D31] rounded-lg"
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <button
            className="w-full flex justify-center items-center py-3 bg-theme-accent rounded-lg"
            onClick={handleAuthentication}
          >
            <p className="text-white">Login</p>
          </button>
          <p className="text-white text-sm font-light">
            Do not have an account?{" "}
            <span
              className="pressable underline font-bold"
              onClick={() => router.push("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
