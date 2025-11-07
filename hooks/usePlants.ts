'use client'

import { useState, useEffect, useCallback } from 'react'
import { useContract } from './useContract'
import {
  getUserPlants,
  getPlant,
  plantSeed as plantSeedContract,
  waterPlant as waterPlantContract,
  getNFT as harvestPlantContract,
  updatePlantStage as updatePlantStageContract,
  isStageOutOfSync,
} from '@/lib/contract'
import { Plant } from '@/types/contracts'
import { useToast } from '@/hooks/use-toast'

/**
 * Hook to manage user's plants (simplified workshop version)
 * Fetches plants from contract and provides plant operations using Panna SDK
 */
export function usePlants() {
  const { client, account, isConnected, address } = useContract()
  const { toast } = useToast()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fungsi untuk memberi jeda singkat agar RPC sinkron
  const waitForRPC = (ms: number = 2000) => {
    console.log(`Waiting ${ms}ms for RPC sync before fetching plants...`);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fetch user's plants (with optional silent mode for auto-refresh)
  const fetchPlants = useCallback(async (silent = false) => {
    if (!client || !address) {
      setPlants([])
      return
    }

    // Only show loading state when not silent (user-initiated actions)
    if (!silent) {
      setLoading(true)
    }
    setError(null)

    try {
      // Get user's plant IDs
      const plantIds = await getUserPlants(client, address)

      // Fetch each plant's data
      const plantPromises = plantIds.map(async (id) => {
        try {
          const plant = await getPlant(client, id)
          return plant.exists ? plant : null
        } catch (err) {
          console.error(`Error fetching plant ${id}:`, err)
          return null
        }
      })

      const fetchedPlants = await Promise.all(plantPromises)
      const validPlants = fetchedPlants.filter((p): p is Plant => p !== null)

      setPlants(validPlants)
    } catch (err) {
      console.error('Error fetching plants:', err)
      setError(err as Error)
      // Only show error toast when not silent
      if (!silent) {
        toast({
          title: 'Error',
          description: 'Failed to fetch your plants. Please try again.',
          variant: 'destructive',
        })
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [client, address, toast])

  // Plant a new seed (simplified - no plant type)
  const plantSeed = useCallback(async (quantity: number) => {
    if (!client || !account) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      // Send transaction and wait for receipt
      const result = await plantSeedContract(client, account, quantity)   //tambahkan quantity untuk jumlah seed yang ditanam

      toast({
        title: 'Seed planted!',
        description: 'Your plant has been created successfully. Cost: 0.001 ETH',
      })

      // --- PERBAIKAN ---
      // Beri jeda 2 detik agar RPC node sempat sinkron
      await waitForRPC();
      // --- AKHIR PERBAIKAN ---

      // Transaction is confirmed, refresh plants immediately
      await fetchPlants()
    } catch (err: any) {
      console.error('Error planting seed:', err)
      toast({
        title: 'Error',
        description: err.message || 'Failed to plant seed. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [client, account, toast, fetchPlants])

  // Water a plant (simplified - no watering level)
  const waterPlant = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      try {
        // Check if stage needs updating
        const plant = await getPlant(client, plantId)
        const needsStageUpdate = isStageOutOfSync(plant)

        if (needsStageUpdate) {
          toast({
            title: 'Syncing stage...',
            description: 'Updating plant stage first, then watering.',
          })
          await updatePlantStageContract(client, account, plantId)
        }

        // Send transaction and wait for receipt
        await waterPlantContract(client, account, plantId)

        toast({
          title: 'Plant watered!',
          description: needsStageUpdate
            ? 'Stage synced and plant watered successfully!'
            : 'Your plant has been watered successfully. FREE - gas only!',
        })

        // --- PERBAIKAN ---
        // Beri jeda 2 detik agar RPC node sempat sinkron
        await waitForRPC();
        // --- AKHIR PERBAIKAN ---

        // Transaction is confirmed, refresh plants immediately
        await fetchPlants()
      } catch (err: any) {
        console.error('Error watering plant:', err)
        toast({
          title: 'Error',
          description: err.message || 'Failed to water plant. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants]
  )

  // Harvest a plant
  const harvestPlant = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      try {
        // Check if stage needs updating before harvest
        const plant = await getPlant(client, plantId)
        const needsStageUpdate = isStageOutOfSync(plant)

        if (needsStageUpdate) {
          toast({
            title: 'Syncing stage...',
            description: 'Updating plant to blooming stage before harvest.',
          })
          await updatePlantStageContract(client, account, plantId)
        }

        // Send transaction and wait for receipt
        await harvestPlantContract(client, account, plantId, plant)

        toast({
          title: 'Plant harvested!',
          description: needsStageUpdate
            ? 'Stage synced and harvested successfully! You received 0.003 ETH 🎉'
            : 'You received 0.003 ETH reward! 🎉',
        })

        // --- PERBAIKAN ---
        // Beri jeda 2 detik agar RPC node sempat sinkron
        await waitForRPC();
        // --- AKHIR PERBAIKAN ---

        // Transaction is confirmed, refresh plants immediately
        await fetchPlants()
      } catch (err: any) {
        console.error('Error harvesting plant:', err)
        toast({
          title: 'Error',
          description: err.message || 'Failed to harvest plant. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants]
  )

  // Update plant stage manually
  const updatePlantStage = useCallback(
    async (plantId: bigint) => {
      if (!client || !account) {
        toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        })
        return
      }

      setLoading(true)
      try {
        // Send transaction and wait for receipt
        const result = await updatePlantStageContract(client, account, plantId)

        toast({
          title: 'Stage updated!',
          description: 'Plant stage has been synchronized with blockchain.',
        })

        // --- PERBAIKAN ---
        // Beri jeda 2 detik agar RPC node sempat sinkron
        await waitForRPC();
        // --- AKHIR PERBAIKAN ---

        // Transaction is confirmed, refresh plants immediately
        await fetchPlants()
      } catch (err: any) {
        console.error('Error updating plant stage:', err)
        toast({
          title: 'Error',
          description: err.message || 'Failed to update plant stage. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [client, account, toast, fetchPlants]
  )

  // Auto-fetch plants when connected
  useEffect(() => {
    if (isConnected && address) {
      fetchPlants()
    }
  }, [isConnected, address, fetchPlants])

  // Auto-refresh data every 5 seconds (silent mode for seamless updates)
  useEffect(() => {
    if (!isConnected || !address) {
      return
    }

    // Set up interval to refetch every 5 seconds in silent mode
    const intervalId = setInterval(() => {
      fetchPlants(true) // true = silent mode (no loading state)
    }, 5000)

    // Cleanup interval on unmount or when dependencies change
    return () => clearInterval(intervalId)
  }, [isConnected, address, fetchPlants])

  return {
    plants,
    loading,
    error,
    fetchPlants,
    plantSeed,
    waterPlant,
    harvestPlant,
    updatePlantStage,
  }
}