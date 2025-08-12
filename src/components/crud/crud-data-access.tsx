import {
  CrudAccount,
  getCloseInstruction,
  getCrudProgramAccounts,
  getCrudProgramId,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { generateKeyPairSigner } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useWalletTransactionSignAndSend } from '../solana/use-wallet-transaction-sign-and-send'
import { useClusterVersion } from '@/components/cluster/use-cluster-version'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useCrudProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getCrudProgramId(cluster.id), [cluster])
}

export function useCrudProgram() {
  const { client, cluster } = useWalletUi()
  const programId = useCrudProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

export function useCrudInitializeMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      const crud = await generateKeyPairSigner()
      return await signAndSend(getInitializeInstruction({ payer: signer, crud }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['crud', 'accounts', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function useCrudDecrementMutation({ crud }: { crud: CrudAccount }) {
  const invalidateAccounts = useCrudAccountsInvalidate()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ crud: crud.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useCrudIncrementMutation({ crud }: { crud: CrudAccount }) {
  const invalidateAccounts = useCrudAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ crud: crud.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useCrudSetMutation({ crud }: { crud: CrudAccount }) {
  const invalidateAccounts = useCrudAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async (value: number) =>
      await signAndSend(
        getSetInstruction({
          crud: crud.address,
          value,
        }),
        signer,
      ),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useCrudCloseMutation({ crud }: { crud: CrudAccount }) {
  const invalidateAccounts = useCrudAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, crud: crud.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useCrudAccountsQuery() {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: useCrudAccountsQueryKey(),
    queryFn: async () => await getCrudProgramAccounts(client.rpc),
  })
}

function useCrudAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useCrudAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}

function useCrudAccountsQueryKey() {
  const { cluster } = useWalletUi()

  return ['crud', 'accounts', { cluster }]
}
