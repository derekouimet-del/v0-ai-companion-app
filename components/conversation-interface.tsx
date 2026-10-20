"use client"

import { useCallback, useEffect, useState } from "react"
import { useConversation, ConversationProvider } from "@elevenlabs/react"
import { CompanionAvatar } from "./mindy-avatar"
import { CallControls } from "./call-controls"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Monitor } from "lucide-react"
import type { Companion } from "@/lib/companions"

interface ConversationInterfaceProps {
  companion: Companion
}

interface NoticeInfo {
  title: string
  body: string
}

function describeError(error: unknown, companion: Companion): NoticeInfo {
  const name = error instanceof DOMException ? error.name : ""
  const raw = error instanceof Error ? error.message : String(error)
  const lower = raw.toLowerCase()

  if (name === "NotAllowedError" || lower.includes("permission")) {
    return {
      title: "Microphone permission was blocked",
      body:
        "Allow the mic when your browser asks, then try again. In Firefox, click the shield or lock icon in the address bar, set Microphone to Allowed, and reload. If you opened this inside a v0 preview frame, use the standalone site link instead.",
    }
  }
  if (name === "NotFoundError") {
    return {
      title: "No microphone found",
      body: "Connect a microphone and make sure it is not disabled in your browser's privacy settings.",
    }
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return {
      title: "Microphone is busy",
      body: "Another app is holding the mic, or the browser kept an old stream open. Close other voice apps and reload the page.",
    }
  }
  if (lower.includes("session cancelled during connection") || lower.includes("cancelled during")) {
    return {
      title: "Session cancelled during connection",
      body:
        `The mic was granted, but ElevenLabs cancelled ${companion.name}'s session while connecting. In the ElevenLabs dashboard go to Conversational AI > ${companion.name} > Security: either make the agent public or add "${typeof window !== "undefined" ? window.location.hostname : "this site's domain"}" to the allowed domains list, then retry. If the agent is already public, wait a few seconds and try again once, since this can also happen on transient network failures.`,
    }
  }
  if (lower.includes("401") || lower.includes("403") || lower.includes("unauthorized") || lower.includes("auth")) {
    return {
      title: "ElevenLabs rejected the connection",
      body:
        `ElevenLabs accepted the mic but refused the connection for ${companion.name}. In the ElevenLabs dashboard go to Conversational AI > ${companion.name} > Security: either make the agent public or add "${typeof window !== "undefined" ? window.location.hostname : "this site's domain"}" to the allowed domains list, then retry.`,
    }
  }
  return {
    title: "Could not start the conversation",
    body: raw || "Unknown error. Check the browser console for details.",
  }
}

function ConversationStage({
  companion,
  setNotice,
}: {
  companion: Companion
  setNotice: (notice: NoticeInfo | null) => void
}) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVolumeOff, setIsVolumeOff] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const conversation = useConversation({
    micMuted: isMuted,
    onConnect: () => setIsConnecting(false),
    onDisconnect: () => setIsConnecting(false),
    onError: (error) => {
      setIsConnecting(false)
      setNotice(describeError(error, companion))
      console.error("Conversation error:", error)
    },
  })

  const startConversation = useCallback(async () => {
    if (isConnecting || conversation.status !== "disconnected") {
      return
    }

    setNotice(null)
    setIsConnecting(true)

    try {
      if (typeof window !== "undefined" && !window.isSecureContext) {
        throw new DOMException("Microphone access requires HTTPS", "NotSupportedError")
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new DOMException("Microphone API unavailable in this browser", "NotSupportedError")
      }

      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      permissionStream.getTracks().forEach((track) => track.stop())

      await conversation.startSession({
        agentId: companion.agentId,
      })
      await conversation.setVolume({ volume: 1 })
    } catch (error) {
      console.error("Failed to start conversation:", { companion: companion.id, agentId: companion.agentId, error })
      setIsConnecting(false)
      setNotice(describeError(error, companion))
    }
  }, [companion, conversation, isConnecting, setNotice])

  const endConversation = useCallback(() => {
    conversation.endSession()
    setIsConnecting(false)
  }, [conversation])

  useEffect(() => {
    return () => {
      conversation.endSession()
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
      <CompanionAvatar
        companion={companion}
        isSpeaking={isSpeaking}
        isConnected={isConnected}
      />

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

export function ConversationInterface({ companion }: ConversationInterfaceProps) {
  const [error, setError] = useState<NoticeInfo | null>(null)
  const [inIframe, setInIframe] = useState(false)

  useEffect(() => {
    try {
      setInIframe(window.self !== window.top)
    } catch {
      setInIframe(true)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-10 max-w-2xl mx-auto">
      {inIframe && (
        <Alert className="border-amber-500/40 bg-amber-500/10">
          <Monitor className="h-4 w-4" />
          <AlertDescription className="text-amber-200/90">
            You are viewing this app inside a preview frame. Browsers block the microphone in embedded previews, so {companion.name} cannot hear you here. Open the standalone site directly to talk.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-destructive/40 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            <p className="font-semibold mb-1">{error.title}</p>
            <p className="text-sm">{error.body}</p>
          </AlertDescription>
        </Alert>
      )}

      <ConversationProvider>
        <ConversationStage companion={companion} setNotice={setError} />
      </ConversationProvider>
    </div>
  )
}
