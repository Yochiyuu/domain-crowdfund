"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, Sparkles, Clock, Skull } from "lucide-react"
import { Plant, GrowthStage, STAGE_NAMES } from "@/types/contracts"
import { formatLastWatered, formatPlantAge, getPlantProgress, getClientWaterLevel, isCritical } from "@/lib/contract"

const STAGE_COLORS = {
  seed: "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
  sprout: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  growing: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
  blooming: "bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100",
}

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

const STAGE_HOVER_BACKGROUNDS = {
  [GrowthStage.SEED]: "group-hover:from-amber-100 group-hover:to-yellow-100 dark:group-hover:from-amber-900 dark:group-hover:to-yellow-900",
  [GrowthStage.SPROUT]: "group-hover:from-green-100 group-hover:to-lime-100 dark:group-hover:from-green-900 dark:group-hover:to-lime-900",
  [GrowthStage.GROWING]: "group-hover:from-emerald-100 group-hover:to-teal-100 dark:group-hover:from-emerald-900 dark:group-hover:to-teal-900",
  [GrowthStage.BLOOMING]: "group-hover:from-pink-100 group-hover:to-rose-100 dark:group-hover:from-pink-900 dark:group-hover:to-rose-900",
}

const STAGE_BORDERS = {
  [GrowthStage.SEED]: "border-amber-300 dark:border-amber-700",
  [GrowthStage.SPROUT]: "border-green-300 dark:border-green-700",
  [GrowthStage.GROWING]: "border-emerald-300 dark:border-emerald-700",
  [GrowthStage.BLOOMING]: "border-rose-300 dark:border-rose-700",
}

export default function PlantCard({ plant }: { plant: Plant }) {
  const stageKey = STAGE_NAMES[plant.stage] as keyof typeof STAGE_COLORS
  const progress = getPlantProgress(plant)
  const currentWaterLevel = getClientWaterLevel(plant)
  const critical = isCritical(plant)

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ease-out animate-grow border-2 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
        plant.isDead
          ? 'border-gray-500 opacity-75 hover:border-gray-600'
          : `${STAGE_BORDERS[plant.stage]} hover:border-opacity-100`
      }`}
    >
      {/* Plant visualization */}
      <div className={`h-48 flex items-center justify-center relative overflow-hidden transition-all duration-300 ease-out ${
        plant.isDead
          ? 'bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900'
          : `bg-gradient-to-b ${STAGE_BACKGROUNDS[plant.stage]} ${STAGE_HOVER_BACKGROUNDS[plant.stage]}`
      }`}>
        {plant.isDead ? (
          <div className="text-7xl grayscale opacity-50">💀</div>
        ) : (
          <>
            <div className="text-7xl animate-float">{STAGE_EMOJIS[plant.stage]}</div>
            {/* Stage-specific decorations */}
            {plant.stage === GrowthStage.SEED && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-amber-600/20 dark:bg-amber-400/20 rounded-full" />
                <div className="absolute top-4 right-4 text-2xl opacity-30">☀️</div>
              </>
            )}
            {plant.stage === GrowthStage.SPROUT && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 bg-green-600/30 dark:bg-green-400/30 rounded-full" />
                <div className="absolute top-4 left-4 text-xl opacity-40 animate-pulse">💧</div>
                <div className="absolute top-4 right-4 text-xl opacity-40">☀️</div>
              </>
            )}
            {plant.stage === GrowthStage.GROWING && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-emerald-600/40 dark:bg-emerald-400/40 rounded-full" />
                <div className="absolute top-6 left-6 text-lg opacity-30 animate-bounce">🍃</div>
                <div className="absolute bottom-6 right-6 text-lg opacity-30 animate-bounce delay-100">🍃</div>
              </>
            )}
            {plant.stage === GrowthStage.BLOOMING && (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-rose-600/40 dark:bg-rose-400/40 rounded-full" />
                <div className="absolute top-3 left-3 animate-bounce-in">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="absolute top-6 right-6 text-2xl animate-pulse">✨</div>
                <div className="absolute bottom-6 left-6 text-xl opacity-50 animate-bounce">🌺</div>
                <div className="absolute bottom-6 right-6 text-xl opacity-50 animate-bounce delay-100">🦋</div>
              </>
            )}
          </>
        )}
        {!plant.isDead && currentWaterLevel > 80 && (
          <div className="absolute top-3 right-3">
            <Droplets className="w-5 h-5 text-blue-500 animate-pulse" />
          </div>
        )}
        {!plant.isDead && critical && (
          <div className="absolute top-3 right-3 animate-pulse">
            <Skull className="w-6 h-6 text-red-500" />
          </div>
        )}
      </div>

      {/* Plant info */}
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Plant #{plant.id.toString()}</h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              {plant.isDead ? (
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30">
                  💀 Dead
                </span>
              ) : (
                <>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${STAGE_COLORS[stageKey]}`}>
                    {stageKey.charAt(0).toUpperCase() + stageKey.slice(1)}
                  </span>
                  {plant.stage === GrowthStage.BLOOMING && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30">
                      Ready to Harvest!
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Growth Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              Growth
            </span>
            <span className="text-muted-foreground font-medium">{Math.floor(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Water level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Droplets className={`w-4 h-4 ${plant.isDead ? 'text-gray-400' : 'text-blue-500'}`} />
              Water
            </span>
            <span className="text-muted-foreground font-medium">{currentWaterLevel}%</span>
          </div>
          <Progress value={currentWaterLevel} className="h-2" />
          {!plant.isDead && currentWaterLevel < 50 && currentWaterLevel > 20 && (
            <p className="text-xs text-orange-600 dark:text-orange-400">⚠️ Needs watering soon!</p>
          )}
          {!plant.isDead && currentWaterLevel <= 20 && currentWaterLevel > 0 && (
            <p className="text-xs text-red-600 dark:text-red-400 animate-pulse">🚨 Critical! Water immediately!</p>
          )}
          {(plant.isDead || currentWaterLevel === 0) && (
            <p className="text-xs text-gray-600 dark:text-gray-400">💀 Plant died from dehydration</p>
          )}
        </div>

        {/* Meta info */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
          <p className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            Last watered: {formatLastWatered(plant.lastWatered)}
          </p>
          <p className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Planted: {formatPlantAge(plant.plantedDate)}
          </p>
        </div>
      </div>
    </Card>
  )
}
