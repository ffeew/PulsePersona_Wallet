import { ethers } from "ethers";
import abi from "./identityRegistryAbi.json";
import pulsePersonaConfig from "../pulsepersona.config.json";

const contractAddress = pulsePersonaConfig.smartContractAddress;
export const provider = ethers.getDefaultProvider(
	pulsePersonaConfig.providerAddress
);

export const contract = new ethers.Contract(contractAddress, abi, provider);

// Requires the private key to be stored in localStorage
export const getContractWithSignerInLocalStorage = async () => {
	// check if privateKey is stored in localStorage
	if (!localStorage.getItem("privateKey")) {
		throw new Error("Private key not found in localStorage");
	}

	const privateKey = localStorage.getItem("privateKey");
	const wallet = new ethers.Wallet(privateKey!, provider);
	const contractWithSigner = contract.connect(wallet);
	return contractWithSigner;
};
