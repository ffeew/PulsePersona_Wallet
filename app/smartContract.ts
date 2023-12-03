import { ethers } from "ethers";
import abi from "./identityRegistryAbi.json";

const contractAddress = "0xa34a080a97A01f340f853Af69Fe7487E73561aA0";
export const provider = ethers.getDefaultProvider(
	"https://sepolia.infura.io/v3/c4dec57aaf3140fe9df7ccfee9ed1b24"
);

export const contract = new ethers.Contract(contractAddress, abi, provider);
