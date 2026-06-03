"use client"

import { cn } from "@/lib/utils"
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CallControlsProps {
  isConnected: boolean
  isMuted: boolean
  isVolumeOff: boolean
  onStartCall: () => void
  onEndCall: () => void
  onToggleMute: () => void
  onToggleVolume: () => void
  isConnecting: boolean
}

export function CallControls({
  isConnected,
  isMuted,
  isVolumeOff,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleVolume,
  isConnecting
}: CallControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {isConnected ? (
        <>
          {/* Mute toggle */}
          <Button
            variant="secondary"
            size="lg"
            className={cn(
              "w-14 h-14 rounded-full",
              isMuted && "bg-destructive/20 text-destructive hover:bg-destructive/30"
            )}
            onClick={onToggleMute}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          
          {/* End call */}
          <Button
            variant="destructive"
            size="lg"
            className="w-16 h-16 rounded-full"
            onClick={onEndCall}
          >
            <PhoneOff className="w-7 h-7" />
          </Button>
          
          {/* Volume toggle */}
          <Button
            variant="secondary"
            size="lg"
            className={cn(
              "w-14 h-14 rounded-full",
              isVolumeOff && "bg-muted text-muted-foreground"
            )}
            onClick={onToggleVolume}
          >
            {isVolumeOff ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </Button>
        </>
      ) : (
        <Button
          size="lg"
          className={cn(
            "px-8 py-6 text-lg rounded-full",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "shadow-lg shadow-primary/30 hover:shadow-primary/50",
            "transition-all duration-300 hover:scale-105"
          )}
          onClick={onStartCall}
          disabled={isConnecting}
        >
          <Phone className="w-6 h-6 mr-3" />
          {isConnecting ? "Connecting..." : "Start Conversation"}
        </Button>
      )}
    </div>
  )
}
