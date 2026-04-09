'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Session {
  session_id: string
  date: string
  compass_score: number
  strongest_dimension: string
  paths: Array<{ name: string; tagline: string }>
}

export default function HistoryPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history')
        const data = await response.json()
        if (data.success) {
          setSessions(data.sessions)
        }
      } catch (error) {
        console.error('History fetch error:', error)
      }
      setLoading(false)
    }

    fetchHistory()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-subtle">loading history...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">your journey</h1>
          <a href="/dashboard" className="text-blue-600 hover:underline">
            back to dashboard
          </a>
        </div>

        {sessions.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-gray-600 mb-4">No tests taken yet.</p>
            <a href="/test" className="btn-primary">
              take your first test
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.session_id} className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{formatDate(session.date)}</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Compass Score</p>
                        <p className="text-3xl font-bold text-blue-600">{session.compass_score}</p>
                      </div>
                      <div className="pl-4 border-l border-gray-200">
                        <p className="text-sm text-gray-500">Strongest</p>
                        <p className="text-lg font-medium">{session.strongest_dimension}</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`/results?session=${session.session_id}`}
                    className="btn-secondary text-center md:w-auto"
                  >
                    view results
                  </a>
                </div>

                {session.paths.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Recommended paths:</p>
                    <div className="flex flex-wrap gap-2">
                      {session.paths.map((path, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {path.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
