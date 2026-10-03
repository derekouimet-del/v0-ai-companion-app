"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import type { Companion } from "@/lib/companions"

interface CompanionAvatarProps {
  companion: Companion
  isSpeaking: boolean
  isConnected: boolean
}

export function CompanionAvatar({ companion, isSpeaking, isConnected }: CompanionAvatarProps) {
  const glowColor = companion.glowColor
  const isGran = companion.id === "gran"
  
  const glowClasses = {
    orange: {
      outer: "bg-orange-500/10",
      inner: "bg-amber-500/15",
      ring: "ring-orange-500/30 shadow-orange-500/20",
      ringConnected: "ring-orange-500/60",
      ringSpeaking: "ring-orange-500 shadow-orange-500/40",
      overlay: "bg-orange-500/10",
    },
    purple: {
      outer: "bg-purple-500/10",
      inner: "bg-violet-500/15",
      ring: "ring-purple-500/30 shadow-purple-500/20",
      ringConnected: "ring-purple-500/60",
      ringSpeaking: "ring-purple-500 shadow-purple-500/40",
      overlay: "bg-purple-500/10",
    },
    cyan: {
      outer: "bg-cyan-500/10",
      inner: "bg-blue-500/15",
      ring: "ring-cyan-500/30 shadow-cyan-500/20",
      ringConnected: "ring-cyan-500/60",
      ringSpeaking: "ring-cyan-500 shadow-cyan-500/40",
      overlay: "bg-cyan-500/10",
    },
    pink: {
      outer: "bg-pink-500/10",
      inner: "bg-rose-500/15",
      ring: "ring-pink-500/30 shadow-pink-500/20",
      ringConnected: "ring-pink-500/60",
      ringSpeaking: "ring-pink-500 shadow-pink-500/40",
      overlay: "bg-pink-500/10",
    },
    green: {
      outer: "bg-lime-500/10",
      inner: "bg-emerald-500/15",
      ring: "ring-lime-500/30 shadow-lime-500/20",
      ringConnected: "ring-emerald-500/60",
      ringSpeaking: "ring-lime-500 shadow-lime-500/40",
      overlay: "bg-emerald-500/10",
    },
  }
  
  const colors = glowClasses[glowColor as keyof typeof glowClasses] || glowClasses.orange
  
  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow rings */}
      <div 
        className={cn(
          "absolute w-80 h-80 md:w-96 md:h-96 rounded-full transition-all duration-1000 blur-3xl",
          colors.outer,
          isSpeaking && "animate-pulse scale-110"
        )}
      />
      <div 
        className={cn(
          "absolute w-72 h-72 md:w-80 md:h-80 rounded-full transition-all duration-700 blur-2xl",
          colors.inner,
          isSpeaking && "animate-pulse scale-105"
        )}
      />
      
      {isGran && (
        <>
          <div className="absolute w-[19rem] h-[19rem] md:w-[24rem] md:h-[24rem] rounded-full border border-lime-400/20 animate-[spin_18s_linear_infinite]" aria-hidden="true" />
          <div className="absolute w-[17rem] h-[17rem] md:w-[22rem] md:h-[22rem] rounded-full border border-dashed border-emerald-400/25 animate-[spin_24s_linear_infinite_reverse]" aria-hidden="true" />
          <span className="absolute top-5 right-12 size-2 rounded-full bg-lime-300 shadow-[0_0_14px_4px_rgba(190,242,100,0.7)] animate-pulse" aria-hidden="true" />
          <span className="absolute bottom-10 left-10 size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_3px_rgba(110,231,183,0.7)] animate-pulse [animation-delay:700ms]" aria-hidden="true" />
        </>
      )}

      {/* Main avatar container */}
      <div 
        className={cn(
          "relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden",
          "ring-4 transition-all duration-500",
          "shadow-2xl",
          colors.ring,
          isConnected && colors.ringConnected,
          isSpeaking && `${colors.ringSpeaking} scale-[1.02]`
        )}
      >
        <Image
          src={companion.avatar}
          alt={`${companion.name} - AI Companion`}
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Speaking indicator overlay */}
        {isSpeaking && (
          <div className={cn("absolute inset-0 animate-pulse", colors.overlay)} />
        )}
      </div>
      
      {/* Status indicator */}
      <div 
        className={cn(
          "absolute -bottom-2 left-1/2 -translate-x-1/2",
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-card/80 backdrop-blur-sm border border-border",
          "text-sm font-medium"
        )}
      >
        <span 
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            isConnected ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
          )}
        />
        <span className="text-foreground">
          {isSpeaking ? `${companion.name} is speaking...` : isConnected ? "Listening..." : "Ready to chat"}
        </span>
      </div>
    </div>
  )
}
