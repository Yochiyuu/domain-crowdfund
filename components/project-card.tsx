"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Coins, CheckCircle, Clock, XCircle, RefreshCw, Target, Users } from "lucide-react"
// Impor tipe yang benar
import { 
  Plant as Project, 
  GrowthStage as ProjectStage, 
  STAGE_NAMES 
} from "@/types/contracts"
import { 
  getClientWaterLevel as getFundingPercentage, 
  isCritical as isFundingLow, 
  isStageOutOfSync 
} from "@/lib/contract"

// Hapus 'enum MockStage' yang error

const STAGE_EMOJIS = {
  [ProjectStage.SEED]: "💡",     // Gunakan ProjectStage.SEED (alias untuk GrowthStage.SEED)
  [ProjectStage.SPROUT]: "🚀",   // Gunakan ProjectStage.SPROUT
  [ProjectStage.GROWING]: "⌛", // Gunakan ProjectStage.GROWING
  [ProjectStage.BLOOMING]: "✅",  // Gunakan ProjectStage.BLOOMING
}

const STAGE_BACKGROUNDS = {
  [ProjectStage.SEED]: "from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950",
  [ProjectStage.SPROUT]: "from-green-50 to-lime-50 dark:from-green-950 dark:to-lime-950",
  [ProjectStage.GROWING]: "from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950",
  [ProjectStage.BLOOMING]: "from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950",
}

const STAGE_HOVER_BACKGROUNDS = {
  [ProjectStage.SEED]: "group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-900 dark:group-hover:to-indigo-900",
  [ProjectStage.SPROUT]: "group-hover:from-green-100 group-hover:to-lime-100 dark:group-hover:from-green-900 dark:group-hover:to-lime-900",
  [ProjectStage.GROWING]: "group-hover:from-gray-100 group-hover:to-gray-200 dark:group-hover:from-gray-800 dark:group-hover:to-gray-900",
  [ProjectStage.BLOOMING]: "group-hover:from-emerald-100 group-hover:to-teal-100 dark:group-hover:from-emerald-900 dark:group-hover:to-teal-900",
}

const STAGE_BORDERS = {
  [ProjectStage.SEED]: "border-blue-300 dark:border-blue-700",
  [ProjectStage.SPROUT]: "border-green-300 dark:border-green-700",
  [ProjectStage.GROWING]: "border-gray-300 dark:border-gray-700",
  [ProjectStage.BLOOMING]: "border-emerald-300 dark:border-emerald-700",
}

// Hapus 'MOCK_STAGE_NAMES'

export default function ProjectCard({ project }: { project: Project }) {
  // Gunakan STAGE_NAMES yang diimpor
  const stageKey = STAGE_NAMES[project.stage]
  
  const fundingPercentage = getFundingPercentage(project)
  const isExpired = project.isDead
  const fundingLow = fundingPercentage < 20 && !isExpired
  const stageOutOfSync = isStageOutOfSync(project)
  const progress = fundingPercentage

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ease-out animate-grow border-2 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
        isExpired
          ? 'border-gray-500 opacity-75 hover:border-gray-600'
          // Gunakan project.stage secara langsung
          : `${STAGE_BORDERS[project.stage]} hover:border-opacity-100` 
      }`}
    >
      {/* Visualisasi Proyek */}
      <div className={`h-48 flex items-center justify-center relative overflow-hidden transition-all duration-300 ease-out ${
        isExpired
          ? 'bg-linear-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900'
           // Gunakan project.stage secara langsung
          : `bg-linear-to-b ${STAGE_BACKGROUNDS[project.stage]} ${STAGE_HOVER_BACKGROUNDS[project.stage]}`
      }`}>
        {isExpired ? (
          <div className="text-7xl grayscale opacity-50"><XCircle /></div>
        ) : (
          <>
            {/* Gunakan project.stage secara langsung */}
            <div className="text-7xl animate-float">{STAGE_EMOJIS[project.stage]}</div>
            {/* Perbaiki perbandingan di sini */}
            {project.stage === ProjectStage.SEED && (
              <>
                <div className="absolute top-4 right-4 text-2xl opacity-30 animate-pulse">💰</div>
              </>
            )}
            {/* Perbaiki perbandingan di sini */}
            {project.stage === ProjectStage.SPROUT && (
              <>
                <div className="absolute top-3 left-3 animate-bounce-in">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </>
            )}
          </>
        )}
        {!isExpired && stageOutOfSync && (
          <div className="absolute top-3 left-3 animate-pulse">
            <RefreshCw className="w-5 h-5 text-orange-500" />
          </div>
        )}
        {!isExpired && fundingLow && (
          <div className="absolute top-3 right-3 animate-pulse">
            <Users className="w-6 h-6 text-red-500" />
            <span className="text-xs text-red-500">Pendanaan Lambat</span>
          </div>
        )}
      </div>

      {/* Info Proyek */}
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Proyek #{project.id.toString()}</h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              {isExpired ? (
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30">
                  <XCircle className="w-3 h-3 inline mr-1" /> Gagal
                </span>
              ) : (
                <>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30`}>
                    {/* Perbaiki: Gunakan stageKey langsung, karena sudah string */}
                    <Clock className="w-3 h-3 inline mr-1" /> {stageKey}
                  </span>
                  {stageOutOfSync && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/30">
                      🔄 Perlu Update
                    </span>
                  )}
                  {/* Perbaiki perbandingan di sini */}
                  {project.stage === ProjectStage.SPROUT && (
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30">
                      <CheckCircle className="w-3 h-3 inline mr-1" /> Sukses!
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress Pendanaan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Target className="w-4 h-4 text-primary" />
              Terdanai
            </span>
            <span className="text-muted-foreground font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Info Meta */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
          <p className="flex items-center gap-1">
            <Coins className="w-3 h-3" />
            Target: 0.003 ETH
          </p>
          <p className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Dimulai: {/* formatPlantAge(project.plantedDate) */} (logika tetap)
          </p>
        </div>
      </div>
    </Card>
  )
}