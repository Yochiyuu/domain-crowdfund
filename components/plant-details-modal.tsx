"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Droplets, Sparkles, TrendingUp, Coins, Skull } from "lucide-react"
import { Plant, GrowthStage, STAGE_NAMES } from "@/types/contracts"
import { formatPlantAge, formatLastWatered, canHarvest, getPlantProgress, getClientWaterLevel, isCritical } from "@/lib/contract"
import { usePlants } from "@/hooks/usePlants"
import { HARVEST_REWARD } from "@/types/contracts"

const STAGE_EMOJIS = {
  [GrowthStage.SEED]: "🌱",
  [GrowthStage.SPROUT]: "🌿",
  [GrowthStage.GROWING]: "🪴",
  [GrowthStage.BLOOMING]: "🌸",
}

const STAGE_BACKGROUNDS = {
  [GrowthStage.SEED]: "from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950",
  [GrowthStage.SPROUT]: "from-green-50 to-lime-50 dark:from-green-950 dark:to-lime-950",
  [GrowthStage.GROWING]: "from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950",
  [GrowthStage.BLOOMING]: "from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950",
}

interface PlantDetailsModalProps {
  plant: Plant | null
  isOpen: boolean
  onClose: () => void
}

export default function PlantDetailsModal({ plant, isOpen, onClose }: PlantDetailsModalProps) {
  const { harvestPlant, waterPlant, loading } = usePlants()

  if (!plant) return null

  const stageKey = STAGE_NAMES[plant.stage]
  const progress = getPlantProgress(plant)
  const canHarvestPlant = canHarvest(plant)
  const currentWaterLevel = getClientWaterLevel(plant)
  const critical = isCritical(plant)

  const handleHarvest = async () => {
    await harvestPlant(plant.id)
    onClose()
  }

  const handleWater = async () => {
    await waterPlant(plant.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">{plant.isDead ? '💀' : STAGE_EMOJIS[plant.stage]}</span>
            Plant #{plant.id.toString()}
            {plant.isDead && <span className="text-sm text-gray-500">(Dead)</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plant visualization */}
          <div className={`h-40 rounded-lg flex items-center justify-center relative overflow-hidden ${
            plant.isDead
              ? 'bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900'
              : `bg-gradient-to-b ${STAGE_BACKGROUNDS[plant.stage]}`
          }`}>
            {plant.isDead ? (
              <div className="text-8xl grayscale opacity-50">💀</div>
            ) : (
              <>
                <div className="text-8xl animate-float">{STAGE_EMOJIS[plant.stage]}</div>
                {/* Stage-specific decorations */}
                {plant.stage === GrowthStage.SEED && (
                  <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-3 bg-amber-600/20 dark:bg-amber-400/20 rounded-full" />
                    <div className="absolute top-4 right-6 text-3xl opacity-30">☀️</div>
                  </>
                )}
                {plant.stage === GrowthStage.SPROUT && (
                  <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-3 bg-green-600/30 dark:bg-green-400/30 rounded-full" />
                    <div className="absolute top-4 left-6 text-2xl opacity-40 animate-pulse">💧</div>
                    <div className="absolute top-4 right-6 text-2xl opacity-40">☀️</div>
                  </>
                )}
                {plant.stage === GrowthStage.GROWING && (
                  <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-4 bg-emerald-600/40 dark:bg-emerald-400/40 rounded-full" />
                    <div className="absolute top-6 left-8 text-2xl opacity-30 animate-bounce">🍃</div>
                    <div className="absolute bottom-8 right-8 text-2xl opacity-30 animate-bounce delay-100">🍃</div>
                  </>
                )}
                {plant.stage === GrowthStage.BLOOMING && (
                  <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-5 bg-rose-600/40 dark:bg-rose-400/40 rounded-full" />
                    <div className="absolute top-3 right-3 animate-bounce">
                      <Sparkles className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="absolute top-6 left-6 text-3xl animate-pulse">✨</div>
                    <div className="absolute bottom-8 left-8 text-2xl opacity-50 animate-bounce">🌺</div>
                    <div className="absolute bottom-8 right-8 text-2xl opacity-50 animate-bounce delay-100">🦋</div>
                  </>
                )}
              </>
            )}
            {!plant.isDead && critical && (
              <div className="absolute top-3 left-3 animate-pulse">
                <Skull className="w-6 h-6 text-red-500" />
              </div>
            )}
          </div>

          {/* Plant info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Stage</span>
              <span className="text-sm font-semibold text-foreground capitalize">{stageKey}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Planted</span>
              <span className="text-sm font-semibold text-foreground">{formatPlantAge(plant.plantedDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Last Watered</span>
              <span className="text-sm font-semibold text-foreground">{formatLastWatered(plant.lastWatered)}</span>
            </div>
          </div>

          {/* Growth Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                Growth Progress
              </span>
              <span className="text-sm font-semibold text-foreground">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {plant.stage === GrowthStage.SEED && "🌱 Germinating... Water regularly to sprout!"}
              {plant.stage === GrowthStage.SPROUT && "🌿 Growing strong! Keep watering to reach next stage."}
              {plant.stage === GrowthStage.GROWING && "🪴 Almost there! One more stage until blooming."}
              {plant.stage === GrowthStage.BLOOMING && "🌸 Fully grown! Ready to harvest for rewards!"}
            </p>
          </div>

          {/* Water level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Droplets className={`w-4 h-4 ${plant.isDead ? 'text-gray-400' : 'text-blue-500'}`} />
                Water Level
              </span>
              <span className="text-sm font-semibold text-foreground">{currentWaterLevel}%</span>
            </div>
            <Progress value={currentWaterLevel} className="h-3" />
            {!plant.isDead && currentWaterLevel < 50 && currentWaterLevel > 20 && (
              <p className="text-xs text-orange-600 dark:text-orange-400">⚠️ Water level low! Water your plant soon.</p>
            )}
            {!plant.isDead && currentWaterLevel <= 20 && currentWaterLevel > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 animate-pulse">🚨 Critical! Plant will die soon!</p>
            )}
            {plant.isDead && (
              <p className="text-xs text-gray-600 dark:text-gray-400">💀 Plant died from dehydration</p>
            )}
          </div>

          {/* Harvest info */}
          {canHarvestPlant && (
            <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-green-500/10 border-yellow-500/30">
              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Ready to Harvest!
                </p>
                <p className="text-sm text-muted-foreground">
                  Harvest this plant to receive
                </p>
                <p className="flex items-center justify-center gap-2 font-bold text-lg text-primary">
                  <Coins className="w-5 h-5" />
                  {HARVEST_REWARD} ETH
                </p>
              </div>
            </Card>
          )}

          {/* Dead plant warning */}
          {plant.isDead && (
            <Card className="p-4 bg-gradient-to-br from-gray-500/10 to-gray-500/10 border-gray-500/30">
              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <Skull className="w-4 h-4 text-gray-500" />
                  Plant Died
                </p>
                <p className="text-sm text-muted-foreground">
                  This plant died from lack of water. Plant a new seed to try again!
                </p>
              </div>
            </Card>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Close
            </Button>
            {!plant.isDead && (
              <>
                {canHarvestPlant ? (
                  <Button
                    onClick={handleHarvest}
                    disabled={loading}
                    className="flex-1 gap-2 bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Harvesting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Harvest Plant
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleWater}
                    disabled={loading}
                    className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Watering...
                      </>
                    ) : (
                      <>
                        <Droplets className="w-4 h-4" />
                        Water Plant
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
