"use client"

import { useState } from "react"
// Impor komponen yang sudah di-rename
import ProjectGrid from "@/components/project-grid"
import StatsSidebar from "@/components/stats-sidebar"
import ProjectDetailsModal from "@/components/project-details-modal"
import CreateProjectModal from "@/components/create-project-modal"
import { usePlants } from "@/hooks/usePlants" // Biarkan nama hook ini, atau ganti jika Anda mau
import { usePlantStageScheduler } from "@/hooks/usePlantStageScheduler" // Biarkan

export default function CrowdfundPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<bigint | null>(null)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const { plants: projects } = usePlants() // Ganti nama variabel 'plants' menjadi 'projects'

  // Logika scheduler biarkan saja
  const { isRunning } = usePlantStageScheduler()

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null

  return (
    <div className="min-h-screen bg-background">
      {/* Header sudah ada di layout.tsx */}
      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        <main className="flex-1">
          <ProjectGrid
            onSelectProject={setSelectedProjectId}
            onCreateProject={() => setShowCreateProjectModal(true)}
          />
        </main>
        <aside className="w-80">
          <StatsSidebar selectedProjectId={selectedProjectId} />
        </aside>
      </div>

      {/* Modals */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={!!selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />
      <CreateProjectModal isOpen={showCreateProjectModal} onClose={() => setShowCreateProjectModal(false)} />
    </div>
  )
}