import { WalletButton } from '../solana/solana-provider'
import { CrudButtonInitialize, CrudList, CrudProgramExplorerLink, CrudProgramGuard } from './crud-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function CrudFeature() {
  const { account } = useWalletUi()

  return (
    <CrudProgramGuard>
      <AppHero
        title="Crud"
        subtitle={
          account
            ? "Initialize a new crud onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <CrudProgramExplorerLink />
        </p>
        {account ? (
          <CrudButtonInitialize />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <CrudList /> : null}
    </CrudProgramGuard>
  )
}
