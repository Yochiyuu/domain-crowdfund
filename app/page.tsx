"use client"

import { useState } from "react"
import GardenHeader from "@/components/garden-header"
import GardenGrid from "@/components/garden-grid"
import StatsSidebar from "@/components/stats-sidebar"
import PlantDetailsModal from "@/components/plant-details-modal"
import PlantSeedModal from "@/components/plant-seed-modal"
import { usePlants } from "@/hooks/usePlants"

export default function Home() {
  const [selectedPlantId, setSelectedPlantId] = useState<bigint | null>(null)
  const [showPlantSeedModal, setShowPlantSeedModal] = useState(false)
  const { plants } = usePlants()

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || null

  return (
    <div className="min-h-screen bg-background">
      <GardenHeader />
      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        <main className="flex-1">
          <GardenGrid onSelectPlant={setSelectedPlantId} onPlantSeed={() => setShowPlantSeedModal(true)} />
        </main>
        <aside className="w-80">
          <StatsSidebar selectedPlantId={selectedPlantId} />
        </aside>
      </div>

      {/* Modals */}
      <PlantDetailsModal
        plant={selectedPlant}
        isOpen={!!selectedPlantId}
        onClose={() => setSelectedPlantId(null)}
      />
      <PlantSeedModal isOpen={showPlantSeedModal} onClose={() => setShowPlantSeedModal(false)} />
    </div>
  )
}
