"use client";

import { ethers } from "ethers";
import { useState } from "react";
import { BytesLike } from "ethers";
import { provider } from "../smartContract";
import { useRouter } from "next/navigation";
import abi from "../identityRegistryAbi.json";
import QuestionCircle from "../assets/QuestionCircle";
import pulsePersonaConfig from "../../pulsepersona.config.json";
import Logo from "../assets/Logo";

type Service = {
  id: string;
  type: string;
  serviceEndpoint: string;
};

type VerificationMethod = {
  id: string;
  type: string;
  controller: string;
  publicKeyBase58: string;
};

type DidDocumentData = {
  "@context": string[];
  id: string;
  controller: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  service: Service[];
  created: string;
  updated: string;
};

export default function Login() {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [did, setDid] = useState("");

  const handleCredentialStorage = async (
    did: string,
    didDocument: DidDocumentData,
    privateKey: BytesLike
  ) => {
    localStorage.clear();
    localStorage.setItem("did", did);
    localStorage.setItem("didDocument", JSON.stringify(didDocument));
    localStorage.setItem("privateKey", ethers.hexlify(privateKey));
  };

  const getDidDocument = async (ipfsCid: any) => {
    try {
      const res = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsCid}`, {
        method: "POST",
      });
      const json = await res.json();
      console.log(json);
      return json;
    } catch (e) {
      console.error(e);
      alert("Trouble getting didDocument");
    }
  };

  const handleAuthentication = async () => {
    // get owner of did from smart contract
    const contractAddress = pulsePersonaConfig.smartContractAddress;
    const provider = ethers.getDefaultProvider(
      pulsePersonaConfig.providerAddress
    );
    const contract = new ethers.Contract(contractAddress, abi, provider);
    try {
      const ownerAddress = await contract.getDidOwner(did);
      const wallet = new ethers.Wallet(privateKey, provider);

      // check if did belongs to private key (create wallet and match the wallet address with the address returned)
      if (ownerAddress === wallet.address) {
        console.log("Verification success");
      } else {
        console.log("Verification failed");
      }
    } catch (e) {
      console.error(e);
      return false;
    }

    // get ipfs address of didDocument from smart contract
    const ipfsCid = await contract.getDidIpfsCid(did);

    // download file from pinata
    const didDocument = await getDidDocument(ipfsCid);

    // save to localstorage
    handleCredentialStorage(did, didDocument, privateKey);
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
              onChange={(e) => setPrivateKey(e.target.value)}
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
