"use client";

// import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PageContainer from "../components/PageContainer";
import Copy from "../assets/Copy";

export default function Settings() {
  return (
    <PageContainer title="Settings" description="Your account settings">
      <div className="w-full flex flex-col justify-center items-start p-5 space-y-5 bg-theme-medium-gray rounded-xl">
        <div className="flex flex-col justify-center items-start">
          <p className="text-theme-light-gray text-sm">DID</p>
          <div className="flex flex-row space-x-4">
            <p className="">{"did"}</p>
            <CopyToClipboard
              text={"did"}
              onCopy={() => alert("Copied to clipboard")}
            >
              <button>
                <Copy className="w-4 h-auto text-theme-white" />
              </button>
            </CopyToClipboard>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start">
          <p className="text-theme-light-gray text-sm">Email</p>
          <p className="">{"Email"}</p>
        </div>
        <div className="flex flex-col justify-center items-start">
          <p className="text-theme-light-gray text-sm">Private Key</p>
          <p className="">{"Private Key"}</p>
        </div>
        <div className="w-full flex flex-row justify-end items-center space-x-4">
          <button
            className="flex justify-center items-center py-3 px-6 rounded-xl text-sm bg-red-500"
            //   onClick={(e) => onClickDelete && onClickDelete(e)}
          >
            <p>Delete Account</p>
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
