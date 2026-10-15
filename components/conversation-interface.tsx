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

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone access is unavailable in this browser")
      }

      // Request permission first, then give ElevenLabs the concrete input
      // device. Some browsers do not expose a usable `default` device to the
      // SDK until permission has been granted, which surfaces as
      // "Requested device not found" before the agent connection starts.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioInput = navigator.mediaDevices
        .enumerateDevices
        ? (await navigator.mediaDevices.enumerateDevices()).find(
            (device) => device.kind === "audioinput" && device.deviceId,
          )
        : undefined
      stream.getTracks().forEach((track) => track.stop())

      await conversation.startSession({
        agentId: companion.agentId,
        connectionType: "websocket",
        ...(audioInput?.deviceId ? { inputDeviceId: audioInput.deviceId } : {}),
      })
    } catch (error) {
      console.error("Failed to start conversation:", {
        companion: companion.id,
        agentId: companion.agentId,
        error,
      })
      setIsConnecting(false)
      const message = error instanceof DOMException && error.name === "NotAllowedError"
        ? "Microphone access was blocked. Please allow microphone access and try again."
        : error instanceof DOMException && error.name === "NotFoundError"
          ? "No microphone was found. Connect a microphone and try again."
          : "Could not start conversation. Please try again."
      alert(message)
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
