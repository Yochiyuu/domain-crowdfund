'use client'

import { useMemo } from 'react'
import { useActiveAccount, usePanna } from 'panna-sdk'
import { LISK_GARDEN_CONTRACT_ADDRESS } from '@/lib/contract'

/**
 * Hook to get the Panna client and active account
 * Returns client, account, and wallet connection status
 */
export function useContract() {
  const activeAccount = useActiveAccount()
  const { client } = usePanna()

  const contractInfo = useMemo(() => {
    return {
      client: client || null,
      account: activeAccount || null,
      isConnected: !!activeAccount && !!client,
      address: activeAccount?.address || null,
      contractAddress: LISK_GARDEN_CONTRACT_ADDRESS,
    }
  }, [activeAccount, client])

  return contractInfo
}
