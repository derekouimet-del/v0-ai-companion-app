"use client"

import { cn } from "@/lib/utils"

interface CozyBackgroundProps {
  isActive: boolean
}

export function CozyBackground({ isActive }: CozyBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Warm ambient orbs */}
      <div 
        className={cn(
          "absolute top-1/4 -left-20 w-96 h-96 rounded-full",
          "bg-primary/10 blur-[100px] transition-all duration-[3000ms]",
          isActive && "bg-primary/15 scale-110"
        )}
      />
      <div 
        className={cn(
          "absolute bottom-1/4 -right-20 w-80 h-80 rounded-full",
          "bg-accent/10 blur-[100px] transition-all duration-[3000ms]",
          isActive && "bg-accent/15 scale-110"
        )}
      />
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full",
          "bg-primary/5 blur-[120px] transition-all duration-[3000ms]",
          isActive && "bg-primary/10 scale-105"
        )}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at center, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, var(--background) 100%)',
        }}
      />
    </div>
  )
}
