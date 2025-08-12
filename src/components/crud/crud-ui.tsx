import { ellipsify } from '@wallet-ui/react'
import {
  useCrudAccountsQuery,
  useCrudCloseMutation,
  useCrudDecrementMutation,
  useCrudIncrementMutation,
  useCrudInitializeMutation,
  useCrudProgram,
  useCrudProgramId,
  useCrudSetMutation,
} from './crud-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { CrudAccount } from '@project/anchor'
import { ReactNode } from 'react'

export function CrudProgramExplorerLink() {
  const programId = useCrudProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function CrudList() {
  const crudAccountsQuery = useCrudAccountsQuery()

  if (crudAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!crudAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {crudAccountsQuery.data?.map((crud) => (
        <CrudCard key={crud.address} crud={crud} />
      ))}
    </div>
  )
}

export function CrudProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useCrudProgram()

  if (programAccountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!programAccountQuery.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return children
}

function CrudCard({ crud }: { crud: CrudAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crud: {crud.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={crud.address} label={ellipsify(crud.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <CrudButtonIncrement crud={crud} />
          <CrudButtonSet crud={crud} />
          <CrudButtonDecrement crud={crud} />
          <CrudButtonClose crud={crud} />
        </div>
      </CardContent>
    </Card>
  )
}

export function CrudButtonInitialize() {
  const mutationInitialize = useCrudInitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Crud {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function CrudButtonIncrement({ crud }: { crud: CrudAccount }) {
  const incrementMutation = useCrudIncrementMutation({ crud })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function CrudButtonSet({ crud }: { crud: CrudAccount }) {
  const setMutation = useCrudSetMutation({ crud })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', crud.data.count.toString() ?? '0')
        if (!value || parseInt(value) === crud.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

export function CrudButtonDecrement({ crud }: { crud: CrudAccount }) {
  const decrementMutation = useCrudDecrementMutation({ crud })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function CrudButtonClose({ crud }: { crud: CrudAccount }) {
  const closeMutation = useCrudCloseMutation({ crud })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
