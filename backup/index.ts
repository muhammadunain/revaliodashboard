"use server"
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { AI_PROMPT } from '@/constants'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface PropertyFormData {
  address?: string
  country?: string
  city?: string
  towerShip?: string
}

export interface AIResponse {
  success: boolean
  message: string
  extractedData?: PropertyFormData
  conversationComplete?: boolean
}

export const processPropertyChat = async (
  messages: ChatMessage[],
  userMessage: string
): Promise<AIResponse> => {
  try {
    const systemPrompt = AI_PROMPT

    // Filter out messages with empty content and ensure proper format
    const conversationHistory = messages
      .filter(msg => msg.content && msg.content.trim().length > 0)
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content.trim(),
      }))

    // Add the new user message (with validation)
    const trimmedUserMessage = userMessage?.trim()
    if (!trimmedUserMessage) {
      return {
        success: false,
        message: 'Please provide a valid message.',
      }
    }

    conversationHistory.push({
      role: 'user',
      content: trimmedUserMessage,
    })

    // Additional validation: ensure no empty content
    const validMessages = conversationHistory.filter(msg => 
      msg.content && msg.content.length > 0
    )

    if (validMessages.length === 0) {
      return {
        success: false,
        message: 'No valid messages found. Please try again.',
      }
    }

    const result = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages: validMessages,
      temperature: 0.7,
      maxTokens: 500,
    })

    const aiResponse = result.text

    // Check if AI has completed data collection
    const formDataMatch = aiResponse.match(/FORM_DATA_COMPLETE:\s*(\{[\s\S]*?\})/i)
    let extractedData: PropertyFormData | undefined
    let conversationComplete = false

    if (formDataMatch) {
      try {
        extractedData = JSON.parse(formDataMatch[1].trim())
        conversationComplete = true
      } catch (parseError) {
        console.error('Error parsing extracted data:', parseError)
      }
    }

    return {
      success: true,
      message: aiResponse.replace(/FORM_DATA_COMPLETE:[\s\S]*$/i, '').trim(),
      extractedData,
      conversationComplete,
    }
  } catch (error: any) {
    console.error('Error in AI property chat:', error)
    
    // Handle specific error types
    if (error?.statusCode === 429) {
      return {
        success: false,
        message: 'API quota exceeded. Please try again later or upgrade your plan.',
      }
    }
    
    if (error?.statusCode === 400 && error?.message?.includes('contents.parts must not be empty')) {
      return {
        success: false,
        message: 'Invalid message format. Please try again with a valid message.',
      }
    }

    return {
      success: false,
      message: 'Sorry, I encountered an error. Please try again or fill the form manually.',
    }
  }
}