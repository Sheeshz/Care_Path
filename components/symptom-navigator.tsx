"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageCircle, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react"

interface Question {
  id: string
  text: string
  key: string
}

interface ChatMessage {
  type: "bot" | "user"
  content: string
  timestamp: Date
}

interface SymptomResult {
  result: string
  level: "green" | "yellow" | "red"
  message: string
}

const questions: Question[] = [
  { id: "1", text: "Do you have a fever?", key: "fever" },
  { id: "2", text: "Are you experiencing chest pain or difficulty breathing?", key: "chestPain" },
  { id: "3", text: "Do you have a severe headache?", key: "severeHeadache" },
  { id: "4", text: "Are you feeling nauseous or vomiting?", key: "nausea" },
  { id: "5", text: "Do you have a persistent cough?", key: "cough" },
  { id: "6", text: "Are you feeling unusually tired or weak?", key: "fatigue" },
]

export function SymptomNavigator() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      content:
        "Hi! I'm here to help you understand your symptoms. I'll ask you a few simple questions to provide guidance. Let's start:",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SymptomResult | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const handleAnswer = async (answer: boolean) => {
    const currentQuestion = questions[currentQuestionIndex]
    const newAnswers = { ...answers, [currentQuestion.key]: answer }
    setAnswers(newAnswers)

    // Add user response to chat
    const userMessage: ChatMessage = {
      type: "user",
      content: answer ? "Yes" : "No",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Check if we have more questions
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)

      // Add next question to chat
      setTimeout(() => {
        const nextQuestion = questions[currentQuestionIndex + 1]
        const botMessage: ChatMessage = {
          type: "bot",
          content: nextQuestion.text,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }, 500)
    } else {
      // All questions answered, get result
      setIsLoading(true)

      try {
        const response = await fetch("/api/check-symptoms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAnswers),
        })

        const data = await response.json()
        setResult(data)
        setIsComplete(true)

        // Add result message to chat
        const resultMessage: ChatMessage = {
          type: "bot",
          content: "Based on your answers, here's my recommendation:",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, resultMessage])
      } catch (error) {
        console.error("Error checking symptoms:", error)
        // Fallback result
        setResult({
          result: "Visit campus clinic",
          level: "yellow",
          message: "Unable to process your symptoms. Please consult a healthcare professional.",
        })
        setIsComplete(true)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const resetChat = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setMessages([
      {
        type: "bot",
        content:
          "Hi! I'm here to help you understand your symptoms. I'll ask you a few simple questions to provide guidance. Let's start:",
        timestamp: new Date(),
      },
    ])
    setResult(null)
    setIsComplete(false)
  }

  const getResultIcon = (level: string) => {
    switch (level) {
      case "green":
        return <CheckCircle className="h-5 w-5" />
      case "yellow":
        return <AlertTriangle className="h-5 w-5" />
      case "red":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <MessageCircle className="h-5 w-5" />
    }
  }

  const getResultColor = (level: string) => {
    switch (level) {
      case "green":
        return "bg-green-100 text-green-800 border-green-200"
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "red":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-white border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Health Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing your symptoms...
              </div>
            </div>
          )}
        </div>

        {/* Result Card */}
        {result && (
          <div className="p-4 border-t bg-gray-50">
            <Card className={`border-2 ${getResultColor(result.level)}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {getResultIcon(result.level)}
                  <Badge variant="outline" className={getResultColor(result.level)}>
                    {result.level.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{result.result}</h3>
                <p className="text-sm opacity-90">{result.message}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 border-t bg-white">
          {!isComplete && !isLoading && currentQuestionIndex < questions.length && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">{questions[currentQuestionIndex].text}</p>
              <div className="flex gap-3">
                <Button onClick={() => handleAnswer(true)} className="flex-1 bg-green-600 hover:bg-green-700">
                  Yes
                </Button>
                <Button onClick={() => handleAnswer(false)} variant="outline" className="flex-1">
                  No
                </Button>
              </div>
            </div>
          )}

          {isComplete && (
            <Button onClick={resetChat} className="w-full">
              Start New Assessment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
