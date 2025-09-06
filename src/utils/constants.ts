import { PublicKey } from "@solana/web3.js";
import Idl from "@/utils/idl/idl.json";

export const PROGRAM_ID = new PublicKey(Idl.address);