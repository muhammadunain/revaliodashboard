'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { processPropertyChat, ChatMessage, PropertyFormData } from '@/lib/actions/ai-property.action'
import { toast } from 'sonner'
import { LoaderCircle, Bot, User, Send, Sparkles, CheckCircle, MessageCircle, X } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface AIPropertyChatbotProps {
  onDataExtracted?: (data: PropertyFormData) => void
  onComplete?: (data: PropertyFormData) => void
  className?: string
  compact?: boolean
}

const AIPropertyChatbot: React.FC<AIPropertyChatbotProps> = ({
  onDataExtracted,
  onComplete,
  className = "",
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! 👋 I'm your AI Property Assistant. I'll help you gather all the necessary property information by asking you a few simple questions.

I need to collect:
• 🏠 Property Address
• 🌍 Country
• 🏙️ City  
• 📍 Township/Area

Let's start! Could you tell me the full address of the property you'd like to add?`
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [extractedData, setExtractedData] = useState<PropertyFormData>({})
  const [conversationComplete, setConversationComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || aiLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setAiLoading(true)

    // Add user message to chat
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage
    }

    setMessages(prev => [...prev, newUserMessage])

    try {
      // Call server action
      const response = await processPropertyChat(messages, userMessage)

      if (response.success) {
        // Add AI response to chat
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message
        }

        setMessages(prev => [...prev, aiMessage])

        // Handle extracted data
        if (response.extractedData) {
          setExtractedData(response.extractedData)
          onDataExtracted?.(response.extractedData)
        }

        if (response.conversationComplete) {
          setConversationComplete(true)
          onComplete?.(response.extractedData || {})
          toast.success("All property information collected! 🎉")
        }
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to process your message. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const resetChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Hello! 👋 I'm your AI Property Assistant. I'll help you gather all the necessary property information by asking you a few simple questions.

I need to collect:
• 🏠 Property Address
• 🌍 Country
• 🏙️ City  
• 📍 Township/Area

Let's start! Could you tell me the full address of the property you'd like to add?`
    }])
    setExtractedData({})
    setConversationComplete(false)
    setInputValue('')
  }

  const getCompletedFields = () => {
    return Object.keys(extractedData).filter(key => extractedData[key as keyof PropertyFormData])
  }

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        {/* Compact Floating Button */}
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50"
          >
            <Bot className="w-6 h-6" />
          </Button>
        )}

        {/* Compact Chat Window */}
        {isOpen && (
          <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-background border rounded-lg shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-sm">AI Property Assistant</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCompletedFields().length}/4 fields
                    </Badge>
                    {conversationComplete && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block p-3 rounded-lg text-xs ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block p-3 rounded-lg bg-gray-100">
                        <div className="flex items-center gap-2 text-xs">
                          <LoaderCircle className="w-3 h-3 animate-spin" />
                          AI is thinking...
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 h-9 text-sm"
                  disabled={aiLoading}
                />
                <Button 
                  type="submit" 
                  disabled={aiLoading || !inputValue.trim()}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              
              {conversationComplete && (
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={resetChat} className="text-xs">
                    Reset
                  </Button>
                  <Button size="sm" onClick={() => onComplete?.(extractedData)} className="text-xs">
                    Use Data
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full-size component
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Property Assistant</CardTitle>
              <CardDescription>Let me help you gather property information through conversation</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {getCompletedFields().length}/4 fields collected
            </Badge>
            {conversationComplete && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chat Interface */}
        <div className="bg-muted/30 rounded-lg p-6">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[75%] ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border shadow-sm'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-4 rounded-lg bg-background border shadow-sm">
                      <div className="flex items-center gap-2 text-sm">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        AI is thinking...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleChatSubmit} className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 h-12"
            disabled={aiLoading}
          />
          <Button 
            type="submit" 
            disabled={aiLoading || !inputValue.trim()}
            className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Data Preview */}
        {conversationComplete && Object.keys(extractedData).length > 0 && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <div className="text-lg font-semibold text-green-800 mb-3">
                    🎉 Property Information Collected Successfully!
                  </div>
                  <div className="text-sm text-green-700 space-y-2">
                    {extractedData.address && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-20 justify-center">Address</Badge>
                        <span>{extractedData.address}</span>
                      </div>
                    )}
                    {extractedData.country && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-20 justify-center">Country</Badge>
                        <span>{extractedData.country}</span>
                      </div>
                    )}
                    {extractedData.city && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-20 justify-center">City</Badge>
                        <span>{extractedData.city}</span>
                      </div>
                    )}
                    {extractedData.towerShip && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-20 justify-center">Township</Badge>
                        <span>{extractedData.towerShip}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={resetChat} variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
                <Button size="sm" onClick={() => onComplete?.(extractedData)} className="bg-green-600 hover:bg-green-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use This Data
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AIPropertyChatbot