"use client";

import { ethers } from "ethers";
import { randomBytes } from "crypto";
import { useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getContractWithSignerInLocalStorage } from "./smartContract";
import MagnifyingGlass from "./assets/MagnifyingGlass";
import PageContainer from "./components/PageContainer";
import ErrorSadFace from "./assets/ErrorSadFace";
import ChevronRight from "./assets/ChevronRight";
import Copy from "./assets/Copy";

interface tab {
  value: string;
  display: string;
}

interface VcButtonProps {
  vc: VerificationCredentialDocument;
  onClick: (
    e: React.MouseEvent<HTMLElement>,
    vc: VerificationCredentialDocument
  ) => void;
}

interface VcDetailsProps {
  vc: VerificationCredentialDocument;
  showDownloadButton?: boolean;
  showDeleteButton?: boolean;
  onClickDownload?: (e: React.MouseEvent<HTMLElement>) => void;
  onClickDelete?: (e: React.MouseEvent<HTMLElement>) => void;
}

type VerificationCredentialDocument = {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  name: string;
  credentialSubject: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function VerificationCredentials() {
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [selectedVc, setSelectedVc] =
    useState<VerificationCredentialDocument | null>(null);
  const [selectedTab, setSelectedTab] = useState<tab>({
    value: "others",
    display: "Other VCs",
  });

  const generatePersonalVc = async () => {
    const did = localStorage.getItem("did");
    // ensure that the user has a did
    if (!did) {
      alert("Please register a DID first");
      return;
    }

    const didDocument = JSON.parse(localStorage.getItem("didDocument") || "");
    // ensure that the user has a did document
    if (!didDocument) {
      alert("Please register a DID Document first");
      return;
    }

    const vcDocument: VerificationCredentialDocument = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1",
      ],
      id: ethers.hexlify(randomBytes(32)),
      type: ["VerifiableCredential", "PersonalVC"],
      issuer: did,
      issuanceDate: new Date().toISOString(),
      name: "Personal VC",
      credentialSubject: {
        id: did,
        firstName: "John",
        lastName: "Doe",
        email: didDocument.service[0].serviceEndpoint,
      },
    };
    setPersonalVc(vcDocument);
    console.log(vcDocument);

    // obtain hash of vcDocument
    const vcDocumentBytes = ethers.toUtf8Bytes(JSON.stringify(vcDocument));
    const vcDocumentHash = ethers.keccak256(vcDocumentBytes);
    console.log(vcDocumentHash);

    const contractWithSigner = await getContractWithSignerInLocalStorage();

    try {
      // write VC to local storage
      localStorage.setItem("personalVc", JSON.stringify(vcDocument));
      const tx = await contractWithSigner.issueClaim(
        did,
        vcDocument.id,
        vcDocumentHash
      );
      console.log("tx ", tx);
      await tx.wait();
      alert("VC successfully generated!");
    } catch (e) {
      console.error(e);
      alert("VC generation failed");
    }
  };

  const [vcs, setVcs] = useState<any>([]);
  const [personalVc, setPersonalVc] = useState<any>(null);
  const importRef = useRef<any | null>(null);
  const handleImport = (file: any) => {
    setVcs([
      {
        title: "Singapore University of Technology and Design",
        dateTime: "11:53AM, 23 November 2023",
      },
    ]);
  };

  return (
    <PageContainer
      title="Verfiable Credentials"
      description="Manage your VCs"
      tabs={[
        { value: "others", display: "Other VCs" },
        { value: "personal", display: "Personal VC" },
      ]}
      onClickImport={() => importRef.current.click()}
      onChangeTab={(tab: tab) => setSelectedTab(tab)}
    >
      <input
        ref={importRef}
        type="file"
        accept="json"
        onChange={(e: any) => handleImport(e.target.files[0])}
        className="absolute invisible pointer-events-none"
      />
      {selectedTab.value === "others" ? (
        <div className="w-full flex flex-col justify-center items-start space-y-5">
          {selectedVc ? (
            <>
              <div className="flex-row-all-center space-x-2">
                <button
                  className="flex-row-all-center space-x-2"
                  onClick={() => setSelectedVc(null)}
                >
                  <ChevronRight className="w-3 h-auto text-theme-white rotate-180" />
                  <p className="text-theme-white">Back</p>
                </button>
              </div>
              <VcDetails showDeleteButton showDownloadButton vc={selectedVc} />
            </>
          ) : (
            <>
              <div
                className={`w-full flex-row-all-center px-4 bg-theme-medium-gray border-2 rounded-xl ${
                  inputFocus
                    ? "border-theme-light-gray/40"
                    : "border-theme-medium-gray"
                }`}
              >
                <MagnifyingGlass className="w-4 h-auto text-theme-white" />
                <input
                  placeholder="Start typing to search VCs"
                  className="w-full py-3 px-5"
                  onFocus={() => setInputFocus(true)}
                  onBlur={() => setInputFocus(false)}
                />
              </div>
              <div className="w-full flex flex-col justify-center items-start p-5 space-y-5 bg-theme-light-gray/20 rounded-xl">
                <p className="">{`${vcs.length} Results`}</p>
                {vcs.map((vc: any, index: any) => (
                  <VcButton
                    key={index}
                    vc={vc}
                    onClick={(e, vc) => setSelectedVc(vc)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : personalVc ? (
        <VcDetails showDeleteButton showDownloadButton vc={personalVc} />
      ) : (
        <div className="w-full flex flex-col justify-center items-center p-5 space-y-5 bg-theme-medium-gray rounded-xl">
          <ErrorSadFace className="w-44 h-auto text-theme-white" />
          <p>You have not generated a personal VC yet.</p>
          <button
            className="py-3 px-8 rounded-xl bg-theme-light-gray/20"
            onClick={() => generatePersonalVc()}
          >
            <p>Generate</p>
          </button>
        </div>
      )}
    </PageContainer>
  );
}

function VcButton({ vc, onClick }: VcButtonProps) {
  return (
    <button
      className="w-full flex flex-col justify-center items-start px-8 py-7 space-y-6 bg-theme-dark-gray border-2 border-theme-dark-gray hover:border-theme-light-gray/30 hover:bg-opacity-80 rounded-xl"
      onClick={(e) => onClick && onClick(e, vc)}
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-theme-light-gray text-sm">Issuer</p>
        <p className="">{vc.issuer}</p>
      </div>
      <div className="flex flex-col justify-center items-start">
        <p className="text-theme-light-gray text-sm">Issued Date</p>
        <p className="">{vc.issuanceDate}</p>
      </div>
    </button>
  );
}

function VcDetails({
  vc,
  showDownloadButton = false,
  showDeleteButton = false,
  onClickDownload,
  onClickDelete,
}: VcDetailsProps) {
  return (
    <div className="w-full flex flex-col justify-center items-start p-5 space-y-5 bg-theme-medium-gray rounded-xl">
      {vc.issuer && (
        <div className="flex flex-col justify-center items-start">
          <p className="text-theme-light-gray text-sm">DID</p>
          <div className="flex flex-row space-x-4">
            <p className="">{vc.issuer}</p>
            <CopyToClipboard
              text={vc.issuer}
              onCopy={() => alert("Copied to clipboard")}
            >
              <button>
                <Copy className="w-4 h-auto text-theme-white" />
              </button>
            </CopyToClipboard>
          </div>
        </div>
      )}
      {vc.issuanceDate && (
        <div className="flex flex-col justify-center items-start">
          <p className="text-theme-light-gray text-sm">Issued Date</p>
          <p className="">{vc.issuanceDate}</p>
        </div>
      )}
      {vc.name && (
        <div className="flex flex-col justify-center items-start">
          <p className="text-theme-light-gray text-sm">VC Name</p>
          <p className="">{vc.name}</p>
        </div>
      )}
      {vc.credentialSubject && vc.credentialSubject.firstName && (
        <div className="flex flex-col justify-center items-start">
          <p className="text-theme-light-gray text-sm">First Name</p>
          <p className="">{vc.credentialSubject.firstName}</p>
        </div>
      )}
      {vc.credentialSubject && vc.credentialSubject.lastName && (
        <div className="flex flex-col justify-center items-start">
          <p className="text-theme-light-gray text-sm">Last Name</p>
          <p className="">{vc.credentialSubject.lastName}</p>
        </div>
      )}
      {vc.credentialSubject && vc.credentialSubject.email && (
        <div className="flex flex-col justify-center items-start">
          <p className="text-theme-light-gray text-sm">Email</p>
          <p className="">{vc.credentialSubject.email}</p>
        </div>
      )}
      <div className="w-full flex flex-row justify-end items-center space-x-4">
        {showDownloadButton && (
          <button
            className="py-3 px-6 rounded-xl text-sm bg-theme-light-gray/20"
            onClick={(e) => onClickDownload && onClickDownload(e)}
          >
            <p>Download</p>
          </button>
        )}
        {showDeleteButton && (
          <button
            className="py-3 px-8 rounded-xl text-sm bg-red-500"
            onClick={(e) => onClickDelete && onClickDelete(e)}
          >
            <p>Delete</p>
          </button>
        )}
      </div>
    </div>
  );
}
