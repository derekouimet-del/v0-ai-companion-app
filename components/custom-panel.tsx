"use client"

import { Sparkles, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  "Custom voice personality",
  "Specialized knowledge domains",
  "Unique character traits",
  "Custom avatar design",
  "Priority support",
]

export function CustomPanel() {
  const handleContactClick = () => {
    const subject = encodeURIComponent("Custom AI Companion Request")
    const body = encodeURIComponent(`Hi,

I'm interested in creating a custom AI companion with the following characteristics:

Voice/Personality:

Knowledge Areas:

Use Case:

Budget Range:

Please let me know the next steps and provide a quote.

Thank you!`)
    
    window.open(`mailto:your-email@example.com?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-md border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Custom Companion
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Create your perfect AI companion tailored to your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">What you get:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Starting from</p>
          <p className="text-3xl font-bold text-foreground">Contact for Quote</p>
        </div>
        
        <Button 
          className="w-full py-6 text-lg"
          onClick={handleContactClick}
        >
          <Mail className="w-5 h-5 mr-2" />
          Get in Touch
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          We typically respond within 24-48 hours
        </p>
      </CardContent>
    </Card>
  )
}
