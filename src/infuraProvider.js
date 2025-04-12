// src/infuraProvider.js

import { JsonRpcProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

// ✅ Infura Sepolia endpoint
const INFURA_SEPOLIA_URL = "https://sepolia.infura.io/v3/52e1953beaba481faa11be324e46cf41";

// ✅ Create read-only provider
export const provider = new JsonRpcProvider(INFURA_SEPOLIA_URL);

// ✅ Contract instance
export const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);