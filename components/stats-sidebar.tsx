"use client"

import { Card } from "@/components/ui/card"
import { Leaf, Sparkles, Coins, Skull, Droplets, Clock } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { GrowthStage } from "@/types/contracts"
import {
  PLANT_PRICE,
  HARVEST_REWARD,
  STAGE_DURATION,
  WATER_DEPLETION_TIME,
  WATER_DEPLETION_RATE
} from "@/types/contracts"

interface StatsSidebarProps {
  selectedPlantId: bigint | null
}

export default function StatsSidebar({ selectedPlantId }: StatsSidebarProps) {
  const { plants } = usePlants()
  const { isConnected, address } = useContract()

  const bloomingPlants = plants.filter((p) => p.stage === GrowthStage.BLOOMING && !p.isDead).length
  const growingPlants = plants.filter((p) => p.stage !== GrowthStage.BLOOMING && !p.isDead).length
  const deadPlants = plants.filter((p) => p.isDead).length
  const alivePlants = plants.filter((p) => !p.isDead).length

  return (
    <div className="space-y-4 sticky top-24">
      {/* Garden Stats */}
      <Card className="p-4 bg-gradient-to-br from-card to-card/50 border border-border animate-slide-in-up hover:shadow-lg transition-all duration-300 ease-out">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          Garden Stats
        </h3>
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-primary" />
                Total Plants
              </span>
              <span className="font-semibold text-foreground">{plants.length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-green-500" />
                Alive
              </span>
              <span className="font-semibold text-foreground">{alivePlants}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Blooming
              </span>
              <span className="font-semibold text-foreground">{bloomingPlants}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Leaf className="w-4 h-4 text-emerald-500" />
                Growing
              </span>
              <span className="font-semibold text-foreground">{growingPlants}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Skull className="w-4 h-4 text-gray-500" />
                Dead
              </span>
              <span className="font-semibold text-foreground">{deadPlants}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Connect wallet to view stats</p>
        )}
      </Card>

      {/* Wallet Info */}
      {isConnected && (
        <Card
          className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            Wallet
          </h3>
          <div className="space-y-2">
            <div className="p-2 rounded bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <p className="text-xs font-mono text-foreground truncate">{address}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Info */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.2s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Game Info
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Plant Cost</p>
            <p className="font-semibold text-foreground">{PLANT_PRICE} ETH</p>
          </div>
          <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-muted-foreground mb-1">Harvest Reward</p>
            <p className="font-semibold text-foreground">{HARVEST_REWARD} ETH</p>
          </div>
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Watering Cost</p>
            <p className="font-semibold text-primary">FREE (gas only)</p>
          </div>
        </div>
      </Card>

      {/* How to Play */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="font-semibold text-foreground mb-3">How to Play</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>1. Plant a seed (costs {PLANT_PRICE} ETH)</p>
          <p>2. Water it regularly (FREE!)</p>
          <p>3. Wait 3 minutes for full growth</p>
          <p>4. Harvest for {HARVEST_REWARD} ETH reward</p>
          <p className="text-primary font-semibold pt-2">💰 3x profit on every harvest!</p>
          <p className="text-red-500 font-semibold pt-2">⚠️ Keep water above 0% or plant dies!</p>
        </div>
      </Card>

      {/* Game Mechanics */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.4s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Growth & Water
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Stage Duration</p>
            <p className="font-semibold text-foreground">{STAGE_DURATION} seconds each</p>
          </div>
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-muted-foreground mb-1">Water Depletion</p>
            <p className="font-semibold text-foreground">{WATER_DEPLETION_RATE}% every {WATER_DEPLETION_TIME}s</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
