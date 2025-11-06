"use client"

import { Card } from "@/components/ui/card"
import { Layers, CheckCircle, Coins, XCircle, Clock, Info, Target, Users } from "lucide-react"
import { usePlants } from "@/hooks/usePlants"
import { useContract } from "@/hooks/useContract"
// Asumsi Anda sudah mengubah types/contracts.ts
import { GrowthStage as ProjectStage, PLANT_PRICE, HARVEST_REWARD, STAGE_DURATION, WATER_DEPLETION_TIME, WATER_DEPLETION_RATE } from "@/types/contracts"

interface StatsSidebarProps {
  selectedProjectId: bigint | null // ganti nama
}

export default function StatsSidebar({ selectedProjectId }: StatsSidebarProps) {
  const { plants: projects } = usePlants() // ganti nama
  const { isConnected, address } = useContract()

  // Sesuaikan logika ini dengan stage proyek Anda
  const successfulProjects = projects.filter((p) => p.stage === ProjectStage.BLOOMING && !p.isDead).length // BLOOMING -> SUCCESSFUL
  const activeProjects = projects.filter((p) => p.stage !== ProjectStage.BLOOMING && !p.isDead).length
  const failedProjects = projects.filter((p) => p.isDead).length // isDead -> FAILED/EXPIRED

  return (
    <div className="space-y-4 sticky top-24">
      {/* Statistik Platform */}
      <Card className="p-4 bg-linear-to-br from-card to-card/50 border border-border animate-slide-in-up hover:shadow-lg transition-all duration-300 ease-out">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Statistik Platform
        </h3>
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="w-4 h-4 text-primary" />
                Total Proyek
              </span>
              <span className="font-semibold text-foreground">{projects.length}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-blue-500" />
                Aktif
              </span>
              <span className="font-semibold text-foreground">{activeProjects}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Sukses
              </span>
              <span className="font-semibold text-foreground">{successfulProjects}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <XCircle className="w-4 h-4 text-gray-500" />
                Gagal/Kadaluarsa
              </span>
              <span className="font-semibold text-foreground">{failedProjects}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-accent" />
                Total Pendana
              </span>
              <span className="font-semibold text-foreground">1 (Demo)</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Hubungkan wallet untuk melihat statistik</p>
        )}
      </Card>

      {/* Info Wallet (Biarkan sama) */}
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
              <p className="text-xs text-muted-foreground mb-1">Alamat</p>
              <p className="text-xs font-mono text-foreground truncate">{address}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Info Cepat (Ubah) */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.2s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Info Aturan (Contoh)
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Biaya Membuat Proyek</p>
            <p className="font-semibold text-foreground">{PLANT_PRICE} ETH</p>
          </div>
          <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-muted-foreground mb-1">Target Pendanaan (Demo)</p>
            <p className="font-semibold text-foreground">{HARVEST_REWARD} ETH</p>
          </div>
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Biaya Pendanaan</p>
            <p className="font-semibold text-primary">GRATIS (hanya gas)</p>
          </div>
        </div>
      </Card>

      {/* Cara Kerja (Ubah) */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="font-semibold text-foreground mb-3">Cara Kerja (Demo)</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>1. Buat proyek (biaya {PLANT_PRICE} ETH)</p>
          <p>2. Ajak orang mendanai (GRATIS!)</p>
          <p>3. Capai target {HARVEST_REWARD} ETH dalam {STAGE_DURATION * 3 / 60} menit</p>
          <p>4. Klaim dana jika target tercapai</p>
          <p className="text-red-500 font-semibold pt-2">⚠️ Proyek gagal jika waktu habis sebelum target!</p>
        </div>
      </Card>
    </div>
  )
}