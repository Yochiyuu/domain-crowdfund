"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Coins, Lightbulb, Target } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { PLANT_PRICE, HARVEST_REWARD } from "@/types/contracts"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { plantSeed: createProject, loading } = usePlants() // Ganti nama

  const handleCreate = async () => {
    // Logika backend Anda akan mengambil data dari form
    // Untuk UI, kita hanya panggil fungsi lama
    await createProject()
    onClose()
  }

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
              <Input id="title" placeholder="Contoh: Dompet Web3 Revolusioner" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea id="description" placeholder="Jelaskan proyek Anda secara singkat..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Target Pendanaan (ETH)</Label>
              <Input id="goal" type="number" placeholder="0.003" defaultValue={HARVEST_REWARD} readOnly />
              <p className="text-xs text-muted-foreground">Target demo di-hardcode: {HARVEST_REWARD} ETH.</p>
            </div>
          </div>


          {/* Info card */}
          <Card className="p-3 bg-muted/30 border-primary/20">
            <p className="text-xs text-muted-foreground">
              💰 <strong>Biaya Admin</strong>: {PLANT_PRICE} ETH untuk membuat proyek.
              <br />
              ⏱️ <strong>Durasi Kampanye (Demo)</strong>: 3 menit.
              <br />
              ⚠️ <strong>Aturan</strong>: Dana hanya bisa diklaim jika target 100% tercapai sebelum waktu habis.
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
              onClick={handleCreate}
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