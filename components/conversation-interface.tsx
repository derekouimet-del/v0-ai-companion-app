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

    let permissionStream: MediaStream | undefined

    try {
      setIsConnecting(true)

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone access is unavailable in this browser")
      }

      // ElevenLabs requires microphone permission before its WebRTC session starts.
      permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      permissionStream.getTracks().forEach((track) => track.stop())
      permissionStream = undefined

      // The SDK selects the browser's active input device. Passing a device ID to
      // startSession is not supported by this SDK version and prevents the agent
      // session from connecting after permission is granted.
      await conversation.startSession({
        agentId: companion.agentId,
        connectionType: "webrtc",
      })
    } catch (error) {
      permissionStream?.getTracks().forEach((track) => track.stop())
      console.error("Failed to start conversation:", error)
      setIsConnecting(false)
      alert("Could not start conversation. Please allow microphone access and try again.")
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
