"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, ExternalLink, Search, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PhishingDetector() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<null | {
    status: "safe" | "suspicious" | "dangerous"
    reasons: string[]
    score: number
  }>(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const analyzeUrl = () => {
    if (!url) return

    setIsAnalyzing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // This is mock analysis logic - in a real app, this would call an actual API
      const mockAnalysis = () => {
        // Simple mock detection logic
        const hasHttps = url.startsWith("https://")
        const hasSuspiciousWords = /free|login|verify|account|update|secure|bank/i.test(url)
        const hasManySubdomains = (url.match(/\./g) || []).length > 2
        const hasIpAddress = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)

        const reasons = []
        let score = 0

        if (!hasHttps) {
          reasons.push("Missing SSL/TLS encryption (no HTTPS)")
          score += 30
        }

        if (hasSuspiciousWords) {
          reasons.push("Contains suspicious keywords commonly used in phishing")
          score += 20
        }

        if (hasManySubdomains) {
          reasons.push("Contains an unusual number of subdomains")
          score += 15
        }

        if (hasIpAddress) {
          reasons.push("Uses IP address instead of domain name")
          score += 35
        }

        let status: "safe" | "suspicious" | "dangerous" = "safe"
        if (score >= 50) {
          status = "dangerous"
        } else if (score >= 20) {
          status = "suspicious"
        }

        return { status, reasons, score }
      }

      const analysis = mockAnalysis()
      setResult(analysis)
      setIsAnalyzing(false)
    }, 1500)
  }

  const getStatusIcon = (status: "safe" | "suspicious" | "dangerous") => {
    switch (status) {
      case "safe":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "suspicious":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />
      case "dangerous":
        return <ShieldAlert className="h-6 w-6 text-red-500" />
      default:
        return null
    }
  }

  const submitFeedback = (isCorrect: boolean) => {
    // In a real application, this would send the URL and feedback to a server
    console.log(`Feedback submitted for ${url}: Analysis ${isCorrect ? "correct" : "incorrect"}`)
    // Simulate successful submission
    setFeedbackSubmitted(true)
    // In a real app, you would reset this after some time or on new analysis
    setTimeout(() => setFeedbackSubmitted(false), 5000)
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mb-2">Phishing Website Detector</h1>
      <p className="text-muted-foreground text-center mb-8">
        Check if a website is potentially dangerous or attempting to steal your information
      </p>

      <Card>
        <CardHeader>
          <CardTitle>URL Analyzer</CardTitle>
          <CardDescription>Enter a website URL to check if it's safe to visit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyzeUrl()}
            />
            <Button onClick={analyzeUrl} disabled={!url || isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Analyze"}
              {!isAnalyzing && <Search className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(result.status)}
                <h3 className="text-xl font-semibold capitalize">{result.status}</h3>
                <Badge
                  className={`ml-2 ${
                    result.status === "safe"
                      ? "bg-green-100 text-green-800"
                      : result.status === "suspicious"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  Risk Score: {result.score}/100
                </Badge>
              </div>

              <Alert
                className={`
                ${
                  result.status === "safe"
                    ? "border-green-500"
                    : result.status === "suspicious"
                      ? "border-yellow-500"
                      : "border-red-500"
                }
              `}
              >
                <AlertTitle className="flex items-center">
                  {result.status === "safe" ? (
                    <>This website appears to be safe</>
                  ) : result.status === "suspicious" ? (
                    <>This website shows some suspicious characteristics</>
                  ) : (
                    <>This website is likely dangerous</>
                  )}
                </AlertTitle>
                <AlertDescription>
                  {result.status === "safe" ? (
                    <p>Our analysis didn't detect common phishing indicators, but always remain cautious.</p>
                  ) : (
                    <p>Our analysis detected the following concerns:</p>
                  )}

                  {result.reasons.length > 0 && (
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {result.reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
              {result && (
                <div className="mt-4 p-4 border rounded-lg bg-muted">
                  <h4 className="font-medium mb-2">Help improve our detection model</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Was our analysis correct? Your feedback helps us improve our detection capabilities.
                  </p>
                  {!feedbackSubmitted ? (
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => submitFeedback(true)}>
                        Yes, correct analysis
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => submitFeedback(false)}>
                        No, this is {result.status === "safe" ? "actually suspicious" : "actually safe"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-green-600 font-medium">
                      Thank you for your feedback! Your contribution helps protect other users.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Always verify the legitimacy of websites before entering sensitive information
          </p>
          {result && (
            <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}>
              Visit anyway <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Safe Browsing Tips</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Check the URL</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Verify the website address. Phishing sites often use URLs that look similar to legitimate sites but with
                slight variations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Look for HTTPS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Secure websites use HTTPS and display a padlock icon in the address bar. This indicates encrypted
                communication.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
