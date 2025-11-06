"use client"

import ProjectCard from "@/components/project-card" // Ganti
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Loader2, Rocket, RefreshCw, Layers } from "lucide-react"
import { usePlants } from "@/hooks/usePlants" // Biarkan
import { useContract } from "@/hooks/useContract"
import { useToast } from "@/hooks/use-toast"

interface ProjectGridProps {
  onSelectProject: (projectId: bigint) => void
  onCreateProject: () => void
}

export default function ProjectGrid({ onSelectProject, onCreateProject }: ProjectGridProps) {
  const { plants: projects, loading, fetchPlants } = usePlants() // Ganti nama variabel
  const { isConnected } = useContract()
  const { toast } = useToast()

  const handleRefresh = async () => {
    await fetchPlants()
    toast({
      title: "Proyek Diperbarui!",
      description: "Semua status proyek telah disinkronkan.",
    })
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Proyek Crowdfunding</h2>
            <p className="text-muted-foreground mt-1">Dukung ide inovatif di Lisk.</p>
          </div>
        </div>

        <Card className="p-12 text-center border-2 border-dashed border-primary/30">
          <Layers className="w-16 h-16 mx-auto mb-4 text-primary/50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Hubungkan Wallet Anda</h3>
          <p className="text-muted-foreground">
            Silakan hubungkan wallet Anda untuk melihat dan mendanai proyek.
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
            <h2 className="text-3xl font-bold text-foreground">Proyek Crowdfunding</h2>
            <p className="text-muted-foreground mt-1">Dukung ide inovatif di Lisk.</p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Memuat proyek Anda...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Proyek Crowdfunding</h2>
          <p className="text-muted-foreground mt-1">
            {projects.length === 0
              ? "Mulai kampanye pertama Anda"
              : `${projects.length} proyek aktif`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="gap-2"
            title="Refresh status proyek"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={onCreateProject}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          >
            <Plus className="w-4 h-4" />
            Buat Proyek Baru
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-primary/30">
          <div className="text-6xl mb-4">💡</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Belum Ada Proyek</h3>
          <p className="text-muted-foreground mb-6">
            Jadilah yang pertama dan mulai kampanye crowdfunding Anda!
          </p>
          <Button onClick={onCreateProject} className="gap-2">
            <Plus className="w-4 h-4" />
            Buat Proyek Pertama Anda
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id.toString()} onClick={() => onSelectProject(project.id)} className="cursor-pointer">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}