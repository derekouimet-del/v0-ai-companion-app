"use client"

import { useCallback, useEffect, useState } from "react"
import { useConversation } from "@elevenlabs/react"
import { CompanionAvatar } from "./mindy-avatar"
import { CallControls } from "./call-controls"
import type { Companion } from "@/lib/companions"

interface ConversationInterfaceProps {
  companion: Companion
}

export function ConversationInterface({ companion }: ConversationInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVolumeOff, setIsVolumeOff] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const conversation = useConversation({
    micMuted: isMuted,
    onConnect: () => {
      setIsConnecting(false)
    },
    onDisconnect: () => {
      setIsConnecting(false)
    },
    onError: (error) => {
      console.error("Conversation error:", error)
      setIsConnecting(false)
    },
  })

  const startConversation = useCallback(async () => {
    if (isConnecting || conversation.status === "connected" || conversation.status === "connecting") {
      return
    }

    try {
      setIsConnecting(true)

      // ElevenLabs requests and owns the microphone stream for the session.
      // Do not preflight with getUserMedia: stopping that stream before the
      // SDK starts can leave browsers with a denied or unavailable track.
      await conversation.startSession({
        agentId: companion.agentId,
      })
    } catch (error) {
      console.error("Failed to start conversation:", error)
      setIsConnecting(false)
      alert("Could not start conversation. Please make sure you've allowed microphone access.")
    }
  }, [companion.agentId, conversation, isConnecting])

  const endConversation = useCallback(async () => {
    await conversation.endSession()
    setIsConnecting(false)
  }, [conversation])

  useEffect(() => {
    return () => {
      void conversation.endSession()
    }
  }, [conversation])

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  const handleToggleVolume = useCallback(() => {
    setIsVolumeOff((prev) => {
      const newValue = !prev
      conversation.setVolume({ volume: newValue ? 0 : 1 })
      return newValue
    })
  }, [conversation])

  const isConnected = conversation.status === "connected"
  const isSpeaking = conversation.isSpeaking

  return (
    <div className="flex flex-col items-center gap-12">
      {/* Avatar */}
      <CompanionAvatar 
        companion={companion}
        isSpeaking={isSpeaking} 
        isConnected={isConnected} 
      />
      
      {/* Call duration or greeting */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 text-balance">
          {isConnected 
            ? `Connected with ${companion.name}` 
            : `Ready to chat with ${companion.name}?`}
        </h2>
        <p className="text-muted-foreground max-w-md text-pretty">
          {isConnected 
            ? `Just speak naturally. ${companion.name} is listening and ready to help.` 
            : "Start a voice conversation with your AI companion."}
        </p>
      </div>
      
      {/* Controls */}
      <CallControls
        isConnected={isConnected}
        isConnecting={isConnecting}
        isMuted={isMuted}
        isVolumeOff={isVolumeOff}
        onStartCall={startConversation}
        onEndCall={endConversation}
        onToggleMute={handleToggleMute}
        onToggleVolume={handleToggleVolume}
      />
    </div>
  )
}
