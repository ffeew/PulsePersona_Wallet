import { ethers } from "ethers";
import abi from "./identityRegistryAbi.json";
import { BytesLike } from "ethers";

const contractAddress = "0xa34a080a97A01f340f853Af69Fe7487E73561aA0";
export const provider = ethers.getDefaultProvider(
	"https://sepolia.infura.io/v3/c4dec57aaf3140fe9df7ccfee9ed1b24"
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
