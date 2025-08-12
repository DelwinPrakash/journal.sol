import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  fetchCrud,
  getCloseInstruction,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('crud', () => {
  let payer: KeyPairSigner
  let crud: KeyPairSigner

  beforeAll(async () => {
    crud = await generateKeyPairSigner()
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('Initialize Crud', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getInitializeInstruction({ payer: payer, crud: crud })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSER
    const currentCrud = await fetchCrud(rpc, crud.address)
    expect(currentCrud.data.count).toEqual(0)
  })

  it('Increment Crud', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({
      crud: crud.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchCrud(rpc, crud.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Increment Crud Again', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({ crud: crud.address })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchCrud(rpc, crud.address)
    expect(currentCount.data.count).toEqual(2)
  })

  it('Decrement Crud', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getDecrementInstruction({
      crud: crud.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchCrud(rpc, crud.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Set crud value', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getSetInstruction({ crud: crud.address, value: 42 })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchCrud(rpc, crud.address)
    expect(currentCount.data.count).toEqual(42)
  })

  it('Set close the crud account', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getCloseInstruction({
      payer: payer,
      crud: crud.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    try {
      await fetchCrud(rpc, crud.address)
    } catch (e) {
      if (!isSolanaError(e)) {
        throw new Error(`Unexpected error: ${e}`)
      }
      expect(e.message).toEqual(`Account not found at address: ${crud.address}`)
    }
  })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}
