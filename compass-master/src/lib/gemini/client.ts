import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
})

export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}

// Strips markdown code fences Gemini sometimes wraps JSON responses in
export function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  return match ? match[1].trim() : text.trim()
}

export async function generateTextStream(prompt: string) {
  try {
    const result = await geminiModel.generateContentStream(prompt)
    return result
  } catch (error) {
    console.error('Gemini streaming error:', error)
    throw error
  }
}
