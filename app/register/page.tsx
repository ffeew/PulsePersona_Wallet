"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCircle from "../assets/QuestionCircle";
import Logo from "../assets/Logo";
import { contract, provider } from "../smartContract";
import { ethers, SigningKey } from "ethers";
import { randomBytes } from "crypto";
import { BytesLike } from "ethers";

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
	const [endpoint, setEndpoint] = useState("");
	const [key, setKey] = useState("");

	const generateDidDocument = async (
		email: string,
		publicKeyBase58: string
	) => {
		const did = "did:pulsepersona:" + randomBytes(16).toString("hex");
		const creationDate = new Date().toISOString();
		const didDocument: DidDocumentData = {
			"@context": ["https://www.w3.org/ns/did/v1"],
			id: did,
			controller: did,
			verificationMethod: [
				{
					id: did + "#keys-1",
					type: "Ed25519VerificationKey2020",
					controller: did,
					publicKeyBase58: publicKeyBase58,
				},
			],
			authentication: [did + "#keys-1"],
			service: [
				{
					id: did + "#email-1",
					type: "Email",
					serviceEndpoint: email,
				},
			],
			created: creationDate,
			updated: creationDate,
		};
		return didDocument;
	};

	const handleCredentialStorage = async (
		did: string,
		didDocument: DidDocumentData,
		privateKey: BytesLike
	) => {
		// store the data locally
	};

	const handleRegistration = async () => {
		const did = "did:pulsepersona:" + randomBytes(16).toString("hex");
		console.log(did);
		const wallet = new ethers.Wallet(key, provider);

		// ensure that the private key begins with 0x
		const privateKey = key.startsWith("0x") ? key : "0x" + key;
		const publicKey = SigningKey.computePublicKey(privateKey);
		console.log("public key ", publicKey);
		const publicKeyBase58 = ethers.encodeBase58(publicKey);
		console.log("public key base58", publicKeyBase58);

		// generate did document
		const didDocument = await generateDidDocument(endpoint, publicKeyBase58);

		// obtain hash of did document
		const didDocumentBytes = ethers.toUtf8Bytes(JSON.stringify(didDocument));
		const didDocumentHash = ethers.keccak256(didDocumentBytes);
		console.log("did document hash", didDocumentHash);

		// connect the wallet to the contract
		const contractWithSigner = contract.connect(wallet);

		// register the did document hash
		try {
			const tx = await contractWithSigner.registerIdentity(
				did,
				didDocumentHash
			);
			await tx.wait();
			console.log("transaction ", tx);
			handleCredentialStorage(did, didDocument, privateKey);

			// send user to home page
			router.push("/");
		} catch (e) {
			console.error(e);
		}
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
						<p className="">Private key</p>
						<input
							type="password"
							placeholder="Enter Private Key"
							className="w-full py-3 px-3 bg-[#2B2D31] rounded-lg"
							onChange={(e) => setKey(e.target.value)}
						/>
					</div>
					<div className="w-full flex flex-col space-y-2 justify-center items-start">
						<div className="flex flex-row justify-center items-center space-x-2">
							<p className="">Service Endpoint</p>
							<button>
								<QuestionCircle className="w-4 h-auto text-theme-white" />
							</button>
						</div>
						<input
							type="text"
							placeholder="Enter Endpoint"
							className="w-full py-3 px-3 bg-[#2B2D31] rounded-lg"
							onChange={(e) => setEndpoint(e.target.value)}
						/>
					</div>
					<button
						className="w-full flex justify-center items-center py-3 bg-theme-accent rounded-lg"
						onClick={handleRegistration}
					>
						<p className="text-white">Register</p>
					</button>
					<p className="text-white text-sm font-light">
						Already have an account?{" "}
						<span
							className="pressable underline font-bold"
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