"use client"

import PlantCard from "@/components/plant-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Loader2, Sprout, RefreshCw } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
import { useToast } from "@/hooks/use-toast"

interface GardenGridProps {
  onSelectPlant: (plantId: bigint) => void
  onPlantSeed: () => void
}

export default function GardenGrid({ onSelectPlant, onPlantSeed }: GardenGridProps) {
  const { plants, loading, fetchPlants } = usePlants()
  const { isConnected } = useContract()
  const { toast } = useToast()

  const handleRefresh = async () => {
    await fetchPlants()
    toast({
      title: "Garden refreshed!",
      description: "All plant conditions have been updated.",
    })
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Garden</h2>
            <p className="text-muted-foreground mt-1">Tend to your plants and watch them grow</p>
          </div>
        </div>

        <Card className="p-12 text-center border-2 border-dashed border-primary/30">
          <Sprout className="w-16 h-16 mx-auto mb-4 text-primary/50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground">
            Please connect your wallet to view and manage your garden
          </p>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Garden</h2>
            <p className="text-muted-foreground mt-1">Tend to your plants and watch them grow</p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your plants...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Your Garden</h2>
          <p className="text-muted-foreground mt-1">
            {plants.length === 0
              ? "Start your garden by planting your first seed"
              : `${plants.length} plant${plants.length !== 1 ? "s" : ""} growing`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="gap-2"
            title="Refresh plant conditions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={onPlantSeed}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          >
            <Plus className="w-4 h-4" />
            Plant Seed
          </Button>
        </div>
      </div>

      {plants.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-primary/30">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Your garden is empty</h3>
          <p className="text-muted-foreground mb-6">
            Plant your first seed and start your Web3 garden journey!
          </p>
          <Button onClick={onPlantSeed} className="gap-2">
            <Plus className="w-4 h-4" />
            Plant Your First Seed
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants.map((plant) => (
            <div key={plant.id.toString()} onClick={() => onSelectPlant(plant.id)} className="cursor-pointer">
              <PlantCard plant={plant} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
