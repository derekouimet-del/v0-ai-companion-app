"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ConversationInterface } from "@/components/conversation-interface"
import { TipPanel } from "@/components/tip-panel"
import { CustomPanel } from "@/components/custom-panel"
import { CozyBackground } from "@/components/cozy-background"
import { CompanionSelector } from "@/components/companion-selector"
import { companions, type Companion } from "@/lib/companions"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"chat" | "tip" | "custom">("chat")
  const [selectedCompanion, setSelectedCompanion] = useState<Companion>(companions[0])

  return (
    <main className="min-h-screen flex flex-col">
      <CozyBackground isActive={activeTab === "chat"} />
      
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{selectedCompanion.name.charAt(0)}</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">{selectedCompanion.name}</h1>
        </div>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </header>
      
      {/* Companion Selector - only show on chat tab */}
      {activeTab === "chat" && (
        <div className="px-4 py-2">
          <CompanionSelector 
            selectedId={selectedCompanion.id} 
            onSelect={setSelectedCompanion} 
          />
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        {activeTab === "chat" && (
          <ConversationInterface key={selectedCompanion.id} companion={selectedCompanion} />
        )}
        {activeTab === "tip" && <TipPanel />}
        {activeTab === "custom" && <CustomPanel />}
      </div>
      
      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>Powered by ElevenLabs AI</p>
      </footer>
    </main>
  )
}
