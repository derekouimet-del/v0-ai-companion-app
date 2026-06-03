export interface Companion {
  id: string
  name: string
  agentId: string
  avatar: string
  description: string
  accentColor: string
  glowColor: string
}

export const companions: Companion[] = [
  {
    id: "mindy",
    name: "Mindy",
    agentId: "agent_5001kjk3cbf9ekksj5bk1sfmyacr",
    avatar: "/images/mindy-avatar.jpg",
    description: "Confident and futuristic, ready for deep conversations",
    accentColor: "from-orange-500 to-amber-500",
    glowColor: "orange",
  },
  {
    id: "destiny",
    name: "Destiny",
    agentId: "agent_5501kjw5jpx1ebptmremavw2vbhw",
    avatar: "/images/destiny-avatar.png",
    description: "Unpredictable and spontaneous, you never know what mood she'll be in",
    accentColor: "from-purple-500 to-violet-500",
    glowColor: "purple",
  },
  {
    id: "razorback",
    name: "Razor Back",
    agentId: "agent_3401kjk30880ex1t9wwxwvtbd5xs",
    avatar: "/images/razorback-avatar.png",
    description: "Tough and confident, ready to pump you up",
    accentColor: "from-cyan-500 to-blue-500",
    glowColor: "cyan",
  },
  {
    id: "jessica",
    name: "Jessica",
    agentId: "agent_3901kjwjhz3yf7danbxfhm9f9ggg",
    avatar: "/images/jessica-avatar.png",
    description: "Stylish and energetic, your go-to companion",
    accentColor: "from-pink-500 to-rose-500",
    glowColor: "pink",
  },
]

export function getCompanionById(id: string): Companion | undefined {
  return companions.find((c) => c.id === id)
}
