"use client"

import { cn } from "@/lib/utils"
import { Heart, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  activeTab: "chat" | "tip" | "custom"
  onTabChange: (tab: "chat" | "tip" | "custom") => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "chat" as const, label: "Chat", icon: MessageCircle },
    { id: "tip" as const, label: "Tip", icon: Heart },
    { id: "custom" as const, label: "Custom", icon: Sparkles },
  ]

  return (
    <nav className="flex items-center justify-center gap-2 p-2 bg-card/50 backdrop-blur-md rounded-full border border-border">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          size="sm"
          className={cn(
            "px-4 py-2 rounded-full transition-all duration-300",
            activeTab === tab.id 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          <tab.icon className="w-4 h-4 mr-2" />
          {tab.label}
        </Button>
      ))}
    </nav>
  )
}
