"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Droplets } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"

interface WaterModalProps {
  isOpen: boolean
  onClose: () => void
  plantId: bigint | null
  onComplete?: () => void
}

export default function WaterModal({ isOpen, onClose, plantId, onComplete }: WaterModalProps) {
  const { waterPlant, loading } = usePlants()

  const handleWater = async () => {
    if (!plantId) return
    await waterPlant(plantId)
    onClose()
    onComplete?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            Water Your Plant
          </DialogTitle>
          <DialogDescription>Keep your plant healthy and growing!</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Water animation */}
          <div className="flex justify-center py-4">
            <div className="relative">
              <div className="text-6xl">💧</div>
              <div className="absolute -bottom-2 -right-2 text-3xl animate-bounce">🪴</div>
            </div>
          </div>

          {/* Info card */}
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-primary/10 border-blue-500/30">
            <div className="text-center space-y-2">
              <p className="font-semibold text-foreground">Watering Benefits</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Restores water level to 100%</li>
                <li>✅ Helps plant advance to next stage</li>
                <li>✅ <strong className="text-primary">Completely FREE</strong> - only gas cost!</li>
              </ul>
            </div>
          </Card>

          {/* Cost info */}
          <Card className="p-3 bg-muted/30 border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Transaction Cost
              </span>
              <span className="font-semibold text-primary">FREE (gas only)</span>
            </div>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWater}
              disabled={loading || !plantId}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
