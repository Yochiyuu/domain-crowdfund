"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Lightbulb, Minus, Plus } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { PLANT_PRICE } from "@/types/contracts"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { plantSeed: createProject, loading } = usePlants()
  const [quantity, setQuantity] = useState(1)

  const handleCreate = async (quantity: number) => {
    await createProject(quantity)
    onClose()
  }

  const handleIncrement = () => setQuantity((prev) => prev + 1)
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            Buat Proyek Crowdfunding Baru
          </DialogTitle>
          <DialogDescription>Isi detail proyek Anda untuk memulai penggalangan dana.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Form UI */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Proyek</Label>
              <Input id="title" placeholder="Contoh: Donasi Pohon Jakarta" />
            </div>
            <div className="space-y-2">
              <Label>Kuantitas</Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrement} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg w-10 text-center">{quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrement}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-white">
                Total Biaya: {(parseFloat(PLANT_PRICE) * quantity).toFixed(4)} ETH
              </p>
            </div>
          </div>

          {/* Info card */}
          <Card className="p-3 bg-muted/30 border-primary/20">
            <p className="text-xs text-muted-foreground">
              💰 <strong>Biaya per Proyek</strong>: {PLANT_PRICE} ETH.
              <br />
              ⏱️ <strong>Durasi Kampanye (Demo)</strong>: 1 menit per tahap.
              <br />
              ⚠️ <strong>Aturan</strong>: Proyek harus didanai secara berkala agar tidak &quot;mati&quot; dan gagal.
            </p>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              onClick={() => handleCreate(quantity)}
              disabled={loading}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Membuat...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Mulai Kampanye
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}