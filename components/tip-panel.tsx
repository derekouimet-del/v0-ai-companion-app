"use client"

import { Heart, Coffee, Gift, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const tipOptions = [
  { amount: 5, label: "Coffee", icon: Coffee, description: "Buy me a coffee" },
  { amount: 10, label: "Support", icon: Heart, description: "Show some love" },
  { amount: 25, label: "Boost", icon: Sparkles, description: "Help grow Mindy" },
  { amount: 50, label: "Gift", icon: Gift, description: "Make my day" },
]

export function TipPanel() {
  const handleTip = (amount: number) => {
    // For now, open a payment link or placeholder
    // In production, integrate with Stripe or similar
    window.open(`mailto:your-email@example.com?subject=Mindy%20Tip%20-%20$${amount}&body=I'd%20like%20to%20tip%20$${amount}%20for%20Mindy!%20Please%20send%20payment%20instructions.`, '_blank')
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-md border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          Support Mindy
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Your tips help keep Mindy running and improving!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {tipOptions.map((option) => (
            <Button
              key={option.amount}
              variant="secondary"
              className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/20 hover:border-primary transition-all"
              onClick={() => handleTip(option.amount)}
            >
              <option.icon className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">${option.amount}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </Button>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Thank you for supporting independent AI development!
        </p>
      </CardContent>
    </Card>
  )
}
