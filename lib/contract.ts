// Contract interaction utilities for Lisk Garden DApp (Simplified Workshop Version)
//
// WATER PRESERVATION MECHANIC:
// Once a plant reaches ADULT stage, water stops depleting.
// This ensures plants don't die while waiting for harvest.
// Players have unlimited time to harvest ADULT plants without water loss.

import { liskSepolia } from 'panna-sdk'
import { prepareContractCall, sendTransaction, readContract, waitForReceipt } from 'thirdweb/transaction'
import { getContract } from 'thirdweb/contract'
import { toWei } from 'thirdweb/utils'
import {
  LISK_GARDEN_CONTRACT_ADDRESS,
  LISK_GARDEN_ABI,
  Plant,
  GrowthStage,
  DonationLevel,
  STAGE_NAMES,
  DONATION_LEVEL_NAME,
  PLANT_PRICE,
  BASE_WATER_FEE,
  HARVEST_REWARD,
  STAGE_DURATION,
  WATER_DEPLETION_TIME,
  WATER_DEPLETION_RATE,
} from '@/types/contracts'
import { toast } from '@/hooks/use-toast'
import { uploadNftMetadata } from '@/hooks/usePinata'

// Convert raw contract plant data to typed Plant interface
export function parsePlantData(rawPlant: any): Plant {
  // Handle both array-like tuples and object-like structures
  const isArray = Array.isArray(rawPlant)

  return {
    id: BigInt(isArray ? rawPlant[0] ?? 0 : rawPlant.id ?? 0),
    owner: isArray ? rawPlant[1] ?? '' : rawPlant.owner ?? '',
    stage: Number(isArray ? rawPlant[2] ?? 0 : rawPlant.stage ?? 0) as GrowthStage,
    plantedDate: BigInt(isArray ? rawPlant[3] ?? 0 : rawPlant.plantedDate ?? 0),
    lastWatered: BigInt(isArray ? rawPlant[4] ?? 0 : rawPlant.lastWatered ?? 0),
    waterLevel: Number(isArray ? rawPlant[5] ?? 0 : rawPlant.waterLevel ?? 0),
    quantity: Number(isArray ? rawPlant[6] ?? 0 : rawPlant.quantity ?? 0),
    exists: Boolean(isArray ? rawPlant[7] ?? false : rawPlant.exists ?? false),
    isDead: Boolean(isArray ? rawPlant[8] ?? false : rawPlant.isDead ?? false),
  }
}

// Contract write functions using Panna SDK

export async function plantSeed(client: any, account: any, quantity: number) {
  const TOTAL_PLANT_PRICE = parseFloat(PLANT_PRICE) * quantity;
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_CONTRACT_ADDRESS,
    }),
    method: 'function plantSeed(uint16 quantity) payable returns (uint256)',
    params: [quantity],
    value: toWei(TOTAL_PLANT_PRICE.toString()),
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  // Wait for transaction to be mined
  await waitForReceipt(result)

  return result
}

export async function waterPlant(client: any, account: any, plantId: bigint) {
  const plant = await getPlant(client, plantId);
  const TOTAL_WATER_PRICE = parseFloat(BASE_WATER_FEE) * plant.quantity;
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_CONTRACT_ADDRESS,
    }),
    method: 'function waterPlant(uint256 plantId) payable',
    params: [plantId],
    value: toWei(TOTAL_WATER_PRICE.toString()),
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  // Wait for transaction to be mined
  await waitForReceipt(result)

  return result
}

export async function getNFT(client: any, account: any, plantId: bigint, plant: Plant) {
  const uri = await uploadNftMetadata(plant)

  if(!uri) {
    toast({
      title: 'Error',
      description: 'Failed to create uri. Please try again.',
      variant: 'destructive',
    })
    return
  }

  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: LISK_GARDEN_CONTRACT_ADDRESS,
    }),
    method: 'function getNFT(uint256 plantId, string memory uri)',
    params: [plantId, uri],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  // Wait for transaction to be mined
  await waitForReceipt(result)

  return result
}

export async function updatePlantStage(client: any, account: any, plantId: bigint) {
  try {
    const tx = prepareContractCall({
      contract: getContract({
        client,
        chain: liskSepolia,
        address: LISK_GARDEN_CONTRACT_ADDRESS,
      }),
      method: 'function updatePlantStage(uint256 plantId)',
      params: [plantId],
    })

    const result = await sendTransaction({
      account,
      transaction: tx,
    })

    // Wait for transaction to be mined
    const recipe = await waitForReceipt(result)

    toast({
      title: 'Stage updated!',
      description: `${JSON.stringify(recipe)}`,
    })

    return result
  } catch (error) {
    console.log(error);
  }
}

// Contract read functions using Panna SDK

export async function getPlant(client: any, plantId: bigint): Promise<Plant> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_CONTRACT_ADDRESS,
  })

  const rawPlant = await readContract({
    contract,
    method: 'function getPlant(uint256 plantId) view returns (uint256 id, address owner, uint8 stage, uint256 plantedDate, uint256 lastWatered, uint8 waterLevel, uint16 quantity, bool exists, bool isDead)',
    params: [plantId],
  })
  return parsePlantData(rawPlant)
}

export async function calculateWaterLevel(client: any, plantId: bigint, plant?: Plant): Promise<number> {
  // Optimization: Skip blockchain call for ADULT plants - water is preserved
  if (plant && plant.stage === GrowthStage.ADULT) {
    return plant.waterLevel
  }

  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_CONTRACT_ADDRESS,
  })

  const waterLevel = await readContract({
    contract,
    method: 'function calculateWaterLevel(uint256 plantId) view returns (uint8)',
    params: [plantId],
  })
  return Number(waterLevel)
}

export async function getUserPlants(client: any, userAddress: string): Promise<bigint[]> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_CONTRACT_ADDRESS,
  })

  const plantIds = await readContract({
    contract,
    method: 'function getUserPlants(address user) view returns (uint256[])',
    params: [userAddress],
  })
  return plantIds.map((id: any) => BigInt(id))
}

export async function getPlantCounter(client: any): Promise<bigint> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: LISK_GARDEN_CONTRACT_ADDRESS,
  })

  return BigInt(
    await readContract({
      contract,
      method: 'function plantCounter() view returns (uint256)',
      params: [],
    })
  )
}

// Helper functions for UI

export function formatPlantAge(plantedDate: bigint): string {
  const now = Date.now()
  const planted = Number(plantedDate) * 1000
  const diff = now - planted

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ago`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s ago`
  }
  return `${seconds}s ago`
}

export function formatLastWatered(lastWatered: bigint): string {
  const now = Date.now()
  const watered = Number(lastWatered) * 1000
  const diff = now - watered

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ago`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s ago`
  }
  return `${seconds}s ago`
}

export function getStageDisplayName(stage: GrowthStage): string {
  return STAGE_NAMES[stage]
}

export function canHarvest(plant: Plant): boolean {
  return plant.stage === GrowthStage.ADULT && plant.exists && !plant.isDead
}

export function getPlantProgress(plant: Plant): number {
  // Calculate progress percentage based on stage
  const now = Date.now() / 1000
  const planted = Number(plant.plantedDate)
  const timePassed = now - planted

  if (plant.stage === GrowthStage.ADULT) return 100

  // Use STAGE_DURATION constant (60 seconds = 1 minute per stage)
  const currentStageStart = Number(plant.stage) * STAGE_DURATION
  const currentStageProgress = ((timePassed - currentStageStart) / STAGE_DURATION) * 25

  return Math.min(Number(plant.stage) * 25 + currentStageProgress, 100)
}

// Calculate current water level based on time (client-side)
export function getClientWaterLevel(plant: Plant): number {
  if (!plant.exists || plant.isDead) {
    return 0
  }

  // ADULT plants don't lose water - they're ready to harvest!
  // This prevents plants from dying after reaching full maturity
  if (plant.stage === GrowthStage.ADULT) {
    return plant.waterLevel // Keep water level stable at ADULT stage
  }

  const now = Date.now() / 1000
  const timeSinceWatered = now - Number(plant.lastWatered)
  const depletionIntervals = Math.floor(timeSinceWatered / WATER_DEPLETION_TIME)
  const waterLost = depletionIntervals * WATER_DEPLETION_RATE

  if (waterLost >= plant.waterLevel) {
    return 0
  }

  return plant.waterLevel - waterLost
}

// Check if plant needs watering (below 50%)
export function needsWater(plant: Plant): boolean {
  if (plant.isDead || !plant.exists) return false
  // ADULT plants don't need water - they're preserved at harvest stage
  if (plant.stage === GrowthStage.ADULT) return false
  return getClientWaterLevel(plant) < 50
}

// Check if plant is critical (below 20%)
export function isCritical(plant: Plant): boolean {
  if (plant.isDead || !plant.exists) return false
  // ADULT plants can't be critical - water is preserved
  if (plant.stage === GrowthStage.ADULT) return false
  return getClientWaterLevel(plant) < 20
}

// Calculate expected stage based on time (what stage the plant SHOULD be at)
export function getExpectedStage(plant: Plant): GrowthStage {
  if (plant.isDead || !plant.exists) return plant.stage

  const now = Date.now() / 1000
  const planted = Number(plant.plantedDate)
  const timePassed = now - planted

  // Calculate which stage based on time
  const calculatedStage = Math.min(Math.floor(timePassed / STAGE_DURATION), 3)
  return calculatedStage as GrowthStage
}

// Check if plant stage is out of sync (on-chain stage < expected stage)
export function isStageOutOfSync(plant: Plant): boolean {
  if (plant.isDead || !plant.exists) return false
  const expectedStage = getExpectedStage(plant)
  return plant.stage < expectedStage
}

export { LISK_GARDEN_CONTRACT_ADDRESS, PLANT_PRICE, HARVEST_REWARD, STAGE_DURATION }
