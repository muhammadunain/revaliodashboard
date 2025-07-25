// lib/actions/ai-property.action.ts
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

    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add the new user message
    conversationHistory.push({
      role: 'user',
      content: userMessage,
    })

    const result = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages: conversationHistory,
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

  } catch (error) {
    console.error('Error in AI property chat:', error)
    return {
      success: false,
      message: 'Sorry, I encountered an error. Please try again or fill the form manually.',
    }
  }
}