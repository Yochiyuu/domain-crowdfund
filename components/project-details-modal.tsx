"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Coins, Sparkles, Target, Users, XCircle, RefreshCw, CheckCircle, Clock } from "lucide-react"
// Ganti nama impor
import { 
  Plant as Project, 
  GrowthStage as ProjectStage, 
  STAGE_NAMES 
} from "@/types/contracts" 
// Ganti nama impor fungsi
import { 
  formatPlantAge as formatProjectAge, 
  formatLastWatered as formatLastFunded, 
  canHarvest as canClaimFunds, 
  getPlantProgress as getFundingProgress, 
  getClientWaterLevel as getFundingPercentage, 
  isCritical as isFundingLow, 
  isStageOutOfSync, 
  getExpectedStage 
} from "@/lib/contract"
import { usePlants } from "@/hooks/usePlants"
import { HARVEST_REWARD } from "@/types/contracts" // Ini jadi target

// Hapus 'MOCK_STAGE_NAMES' dan 'enum MockStage'

const STAGE_EMOJIS = {
  [ProjectStage.SEED]: "💡", // FUNDING
  [ProjectStage.SPROUT]: "🚀", // SUCCESSFUL
  [ProjectStage.GROWING]: "⌛", // EXPIRED (logika lama, bisa diubah)
  [ProjectStage.BLOOMING]: "✅", // CLAIMED
}

const STAGE_BACKGROUNDS = {
  [ProjectStage.SEED]: "from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950",
  [ProjectStage.SPROUT]: "from-green-50 to-lime-50 dark:from-green-950 dark:to-lime-950",
  [ProjectStage.GROWING]: "from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950",
  [ProjectStage.BLOOMING]: "from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950",
}


interface ProjectDetailsModalProps {
  project: Project | null // ganti nama
  isOpen: boolean
  onClose: () => void
}

export default function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  // Ganti nama fungsi
  const { harvestPlant: claimFunds, waterPlant: fundProject, updatePlantStage, loading } = usePlants()

  if (!project) return null

  // Gunakan STAGE_NAMES yang diimpor
  const stageKey = STAGE_NAMES[project.stage]
  const progress = getFundingProgress(project)
  const canClaim = canClaimFunds(project) // Ganti nama
  const currentFunding = getFundingPercentage(project) // Ganti nama
  const isExpired = project.isDead // Ganti nama
  const stageOutOfSync = isStageOutOfSync(project)
  const expectedStage = getExpectedStage(project)

  const handleClaim = async () => {
    await claimFunds(project.id)
    onClose()
  }

  const handleFund = async () => {
    await fundProject(project.id) 
  }

  const handleUpdateStage = async () => {
    await updatePlantStage(project.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">{isExpired ? <XCircle/> : STAGE_EMOJIS[project.stage]}</span>
            Proyek #{project.id.toString()}
            {isExpired && <span className="text-sm text-gray-500">(Gagal)</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Visualisasi */}
          <div className={`h-40 rounded-lg flex items-center justify-center relative overflow-hidden ${
            isExpired
              ? 'bg-linear-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900'
              : `bg-linear-to-b ${STAGE_BACKGROUNDS[project.stage]}`
          }`}>
            {isExpired ? (
              <div className="text-8xl grayscale opacity-50"><XCircle /></div>
            ) : (
              <div className="text-8xl animate-float">{STAGE_EMOJIS[project.stage]}</div>
            )}
          </div>

          {/* Info Proyek */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <span className="text-sm font-semibold text-foreground capitalize">{stageKey}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Dimulai</span>
              <span className="text-sm font-semibold text-foreground">{formatProjectAge(project.plantedDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Pendanaan Terakhir</span>
              <span className="text-sm font-semibold text-foreground">{formatLastFunded(project.lastWatered)}</span>
            </div>
          </div>

          {/* Progress Pendanaan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Target className="w-4 h-4 text-primary" />
                Target Pendanaan
              </span>
              <span className="text-sm font-semibold text-foreground">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Target: {HARVEST_REWARD} ETH. {currentFunding}% tercapai.
            </p>
          </div>

          {/* Sisa Waktu (Pengganti Water Level) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className={`w-4 h-4 ${isExpired ? 'text-gray-400' : 'text-blue-500'}`} />
                Sisa Waktu (Demo)
              </span>
              {/* Ini menggunakan waterLevel sbg sisa waktu */}
              <span className="text-sm font-semibold text-foreground">{currentFunding}%</span>
            </div>
            <Progress value={currentFunding} className="h-3" /> 
            {!isExpired && currentFunding < 50 && currentFunding > 20 && (
              <p className="text-xs text-orange-600 dark:text-orange-400">⚠️ Waktu hampir habis!</p>
            )}
            {!isExpired && currentFunding <= 20 && currentFunding > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 animate-pulse">🚨 Kritis! Kampanye akan segera berakhir!</p>
            )}
            {isExpired && (
              <p className="text-xs text-gray-600 dark:text-gray-400">⌛ Waktu habis. Proyek gagal didanai.</p>
            )}
          </div>

          {/* Stage sync warning (Biarkan) */}
          {!isExpired && stageOutOfSync && (
            <Card className="p-4 bg-linear-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30">
                <div className="text-center space-y-1">
                  <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 text-orange-500" />
                    Status Tidak Sinkron
                  </p>
                  <p className="text-sm text-muted-foreground">
                    On-chain: {STAGE_NAMES[project.stage]} → Seharusnya: {STAGE_NAMES[expectedStage]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Update status untuk sinkronisasi dengan blockchain.
                  </p>
                </div>
                <Button
                  onClick={handleUpdateStage}
                  disabled={loading}
                  className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Update Status
                    </>
                  )}
                </Button>
            </Card>
          )}

          {/* Info Klaim Dana (Pengganti Harvest) */}
          {canClaim && (
            <Card className="p-4 bg-linear-to-br from-yellow-500/10 to-green-500/10 border-yellow-500/30">
              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Target Tercapai!
                </p>
                <p className="text-sm text-muted-foreground">
                  Anda dapat mengklaim dana yang terkumpul.
                </p>
                <p className="flex items-center justify-center gap-2 font-bold text-lg text-primary">
                  <Coins className="w-5 h-5" />
                  {HARVEST_REWARD} ETH
                </p>
              </div>
            </Card>
          )}

          {/* Info Proyek Gagal (Pengganti Dead Plant) */}
          {isExpired && (
            <Card className="p-4 bg-linear-to-br from-gray-500/10 to-gray-500/10 border-gray-500/30">
              <div className="text-center space-y-2">
                <p className="font-semibold text-foreground flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4 text-gray-500" />
                  Proyek Gagal
                </p>
                <p className="text-sm text-muted-foreground">
                  Proyek ini gagal mencapai target pendanaan sebelum waktu habis.
                </p>
              </div>
            </Card>
          )}

          {/* Tombol Aksi */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Tutup
            </Button>
            {!isExpired && (
              <>
                {canClaim ? (
                  <Button
                    onClick={handleClaim}
                    disabled={loading}
                    className="flex-1 gap-2 bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Mengklaim...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Klaim Dana
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleFund}
                    disabled={loading}
                    className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4" />
                        Danai Proyek (Demo)
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