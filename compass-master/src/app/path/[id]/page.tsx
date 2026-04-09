'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function PathPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const choice = searchParams.get('choice') || '1'
  const pathId = params.id as string

  const [path, setPath] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('path_recommendations')
          .select('*')
          .eq('id', pathId)
          .single()

        if (data) {
          setPath(choice === '2' ? data.path_2 : data.path_1)

          // Load existing chat
          const { data: chatData } = await supabase
            .from('guidance_chats')
            .select('*')
            .eq('path_recommendation_id', pathId)
            .single()

          if (chatData?.messages) {
            setMessages(chatData.messages)
          }
        }
      } catch (error) {
        console.error('Path fetch error:', error)
      }
      setLoading(false)
    }

    fetchPath()
  }, [pathId, choice])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || sending) return

    setSending(true)
    const userMessage = input.trim()
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path_id: pathId,
          choice: parseInt(choice),
          message: userMessage,
          conversation_history: messages
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: 'user', content: userMessage },
          { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response }
        ])
      }
    } catch (error) {
      console.error('Chat error:', error)
    }
    setSending(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-subtle">loading path...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 py-12 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl mb-4">{path?.name}</h1>
        <p className="text-xl text-blue-600">{path?.tagline}</p>
      </div>

      <div className="px-6 max-w-4xl mx-auto space-y-12">
        {/* Why it fits */}
        <section className="animate-fade-in">
          <h2 className="font-serif text-2xl mb-4">why this fits you</h2>
          <p className="text-gray-700 leading-relaxed">{path?.why_it_fits}</p>
        </section>

        {/* Next 30 days */}
        <section className="animate-fade-in">
          <h2 className="font-serif text-2xl mb-4">your next 30 days</h2>
          <ol className="space-y-3">
            {path?.next_30_days?.map((action: string, i: number) => (
              <li key={i} className="flex gap-4">
                <span className="font-serif text-blue-600 text-xl">{i + 1}.</span>
                <span className="text-gray-700">{action}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Skills */}
        <section className="animate-fade-in">
          <h2 className="font-serif text-2xl mb-4">build these skills</h2>
          <div className="flex flex-wrap gap-2">
            {path?.skills_to_build?.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-4 py-2 bg-gray-100 rounded-full text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="animate-fade-in">
          <h2 className="font-serif text-2xl mb-4">resources</h2>
          <ul className="space-y-3">
            {path?.resources?.map((resource: any, i: number) => (
              <li key={i}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {resource.name}
                </a>
                <span className="text-gray-500 text-sm ml-2">({resource.type})</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Warning */}
        <section className="card bg-amber-50 border-amber-200 animate-fade-in">
          <h2 className="font-serif text-xl mb-2">honest warning</h2>
          <p className="text-gray-700">{path?.honest_warning}</p>
        </section>

        {/* Chat */}
        <section className="pt-8 border-t border-gray-200">
          <h2 className="font-serif text-2xl mb-6">ask me anything about this path</h2>

          <div className="space-y-4 mb-4 min-h-[200px]">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Start a conversation about this path...
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-black rounded-bl-md'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="input flex-1"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="btn-primary disabled:opacity-50"
            >
              {sending ? '...' : 'send'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
