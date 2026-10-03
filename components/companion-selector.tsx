"use client"

import Image from "next/image"
import { companions, type Companion } from "@/lib/companions"
import { cn } from "@/lib/utils"

interface CompanionSelectorProps {
  selectedId: string
  onSelect: (companion: Companion) => void
}

export function CompanionSelector({ selectedId, onSelect }: CompanionSelectorProps) {
  return (
    <div className="flex gap-4 justify-center">
      {companions.map((companion) => {
        const isSelected = companion.id === selectedId
        return (
          <button
            key={companion.id}
            onClick={() => onSelect(companion)}
            className={cn(
              "group relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300",
              isSelected
                ? "bg-secondary ring-2 ring-primary"
                : "bg-secondary/50 hover:bg-secondary"
            )}
          >
            <div
              className={cn(
                "relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 transition-all duration-300",
                isSelected
                  ? companion.glowColor === "orange"
                    ? "ring-orange-500 shadow-lg shadow-orange-500/30"
                    : companion.glowColor === "purple"
                      ? "ring-purple-500 shadow-lg shadow-purple-500/30"
                      : companion.glowColor === "cyan"
                        ? "ring-cyan-500 shadow-lg shadow-cyan-500/30"
                        : companion.glowColor === "pink"
                          ? "ring-pink-500 shadow-lg shadow-pink-500/30"
                          : "ring-lime-500 shadow-lg shadow-lime-500/30"
                  : "ring-border group-hover:ring-muted-foreground"
              )}
            >
              <Image
                src={companion.avatar}
                alt={companion.name}
                fill
                className="object-cover"
              />
            </div>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isSelected ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {companion.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
