"use client";

import lodash from "lodash";
import { ethers } from "ethers";
import { randomBytes } from "crypto";
import { useEffect, useRef, useState } from "react";
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
  onClickDownload?: (
    e: React.MouseEvent<HTMLElement>,
    vc: VerificationCredentialDocument
  ) => void;
  onClickDelete?: (
    e: React.MouseEvent<HTMLElement>,
    vc: VerificationCredentialDocument
  ) => void;
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
  const tabs = [
    { value: "others", display: "Imported VCs" },
    { value: "personal", display: "Personal VC" },
  ];

  const importRef = useRef<any | null>(null);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<tab>(tabs[0]);
  const [selectedVc, setSelectedVc] =
    useState<VerificationCredentialDocument | null>(null);
  const [personalVc, setPersonalVc] = useState<any>(null);
  const [importedVcs, setImportedVcs] = useState<any>([]);

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
    console.log(vcDocument);

    // obtain hash of vcDocument
    const vcDocumentBytes = ethers.toUtf8Bytes(JSON.stringify(vcDocument));
    const vcDocumentHash = ethers.keccak256(vcDocumentBytes);
    console.log(vcDocumentHash);

    const contractWithSigner = await getContractWithSignerInLocalStorage();

    try {
      // write VC to local storage
      setPersonalVc(vcDocument);
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

  const handleImport = (file: any) => {
    const extension = file?.name.split(".").pop();
    if (extension !== "jsonld") {
      alert(
        "Invalid File Type. We only accept JSON-LD files. Please Try Again."
      );
    } else {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (e: any) => {
        const rawContent = e.target.result;
        const importedVcsCopy = [...importedVcs];
        importedVcsCopy.push(JSON.parse(rawContent));
        setImportedVcs(importedVcsCopy);
        localStorage.setItem("importedVcs", JSON.stringify(importedVcsCopy));
      };
    }
  };

  useEffect(() => {
    const rawData = localStorage.getItem("importedVcs");
    if (rawData) {
      const existingImportedVcs = JSON.parse(rawData);
      setImportedVcs(existingImportedVcs);
    }
    const rawPersonalData = localStorage.getItem("personalVc");
    if (rawPersonalData) {
      const existingPersonalVc = JSON.parse(rawPersonalData);
      setPersonalVc(existingPersonalVc);
    }
  }, []);

  return (
    <PageContainer
      tabs={tabs}
      showImportButton
      title="Verfiable Credentials"
      description="Manage your VCs"
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
              <VcDetails
                showDeleteButton
                showDownloadButton
                vc={selectedVc}
                onClickDelete={(e, vc) => {
                  const importedVcsCopy = [...importedVcs];
                  lodash.remove(importedVcsCopy, (e: any) => vc === e);
                  setImportedVcs(importedVcsCopy);
                  localStorage.setItem(
                    "importedVcs",
                    JSON.stringify(importedVcsCopy)
                  );
                  setSelectedVc(null);
                }}
                onClickDownload={(e, vc) => {
                  const url = window.URL.createObjectURL(
                    new Blob([JSON.stringify(vc)], {
                      type: "application/ld+json",
                    })
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", `${vc.name}.jsonld`);
                  document.body.appendChild(link);
                  link.click();
                }}
              />
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
                <p className="">{`${importedVcs.length} ${
                  importedVcs.length === 1 ? "Result" : "Results"
                }`}</p>
                {importedVcs.map((vc: any, index: any) => (
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
        <VcDetails
          showDeleteButton
          showDownloadButton
          vc={personalVc}
          onClickDelete={(e, vc) => {
            setPersonalVc(null);
            localStorage.removeItem("personalVc");
          }}
          onClickDownload={(e, vc) => {
            const url = window.URL.createObjectURL(
              new Blob([JSON.stringify(vc)], {
                type: "application/ld+json",
              })
            );
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${vc.name}.jsonld`);
            document.body.appendChild(link);
            link.click();
          }}
        />
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
  const [isCopy, setIsCopy] = useState(false);

  return (
    <div
      className="cursor-pointer w-full flex flex-col justify-center items-start px-8 py-7 space-y-6 bg-theme-dark-gray border-2 border-theme-dark-gray hover:border-theme-light-gray/30 hover:bg-opacity-80 rounded-xl"
      onClick={(e) => !isCopy && onClick && onClick(e, vc)}
    >
      <div
        className="flex flex-col justify-center items-start"
        onMouseEnter={() => setIsCopy(true)}
        onMouseLeave={() => setIsCopy(false)}
      >
        <div className="flex flex-row justify-center items-center space-x-2">
          <p className="text-theme-light-gray text-sm">DID</p>
          <CopyToClipboard
            text={vc.issuer}
            onCopy={() => alert("Copied to clipboard")}
          >
            <button className="p-2 bg-theme-medium-gray rounded-lg">
              <Copy className="w-4 h-auto text-theme-white" />
            </button>
          </CopyToClipboard>
        </div>
        <p className="">{vc.issuer}</p>
      </div>
      <div className="flex flex-col justify-center items-start">
        <p className="text-theme-light-gray text-sm">Issued Date</p>
        <p className="">{vc.issuanceDate}</p>
      </div>
    </div>
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
          <div className="flex flex-row justify-center items-center space-x-2">
            <p className="text-theme-light-gray text-sm">DID</p>
            <CopyToClipboard
              text={vc.issuer}
              onCopy={() => alert("Copied to clipboard")}
            >
              <button className="p-2 bg-theme-dark-gray rounded-lg">
                <Copy className="w-4 h-auto text-theme-white" />
              </button>
            </CopyToClipboard>
          </div>
          <p className="">{vc.issuer}</p>
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
            onClick={(e) => onClickDownload && onClickDownload(e, vc)}
          >
            <p>Download</p>
          </button>
        )}
        {showDeleteButton && (
          <button
            className="py-3 px-8 rounded-xl text-sm bg-red-500"
            onClick={(e) => onClickDelete && onClickDelete(e, vc)}
          >
            <p>Delete</p>
          </button>
        )}
      </div>
    </div>
  );
}
