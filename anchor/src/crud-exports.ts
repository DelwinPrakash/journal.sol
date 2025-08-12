// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, address, getBase58Decoder, SolanaClient } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Crud, CRUD_DISCRIMINATOR, CRUD_PROGRAM_ADDRESS, getCrudDecoder } from './client/js'
import CrudIDL from '../target/idl/crud.json'

export type CrudAccount = Account<Crud, string>

// Re-export the generated IDL and type
export { CrudIDL }

// This is a helper function to get the program ID for the Crud program depending on the cluster.
export function getCrudProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Crud program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return CRUD_PROGRAM_ADDRESS
  }
}

export * from './client/js'

export function getCrudProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getCrudDecoder(),
    filter: getBase58Decoder().decode(CRUD_DISCRIMINATOR),
    programAddress: CRUD_PROGRAM_ADDRESS,
  })
}
