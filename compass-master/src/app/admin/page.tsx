'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAIL = 'mihird5554@gmail.com'

interface Stats {
  totalUsers: number
  totalCompleted: number
  totalStarted: number
  avgScore: number
  topPath1: string
  topPath2: string
  dropoffRate: number
}

interface UserRow {
  name: string
  age: number
  status: string
  compass_score: number | null
  chosen_path: string
  date: string
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<UserRow[]>([])
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // IMMEDIATE REDIRECT: Not logged in
        if (!user) {
          router.push('/login')
          return
        }

        // IMMEDIATE REDIRECT: Not admin
        if (user.email !== ADMIN_EMAIL) {
          router.push('/dashboard')
          return
        }

        // User is authorized - mark as authorized before fetching data
        setIsAuthorized(true)

        const res = await fetch('/api/admin')
        const data = await res.json()

        if (!data.success) {
          setError(data.error || 'Failed to load admin data')
        } else {
          setStats(data.stats)
          setUsers(data.users)
        }
      } catch (err) {
        setError('Failed to load admin data')
        console.error(err)
      }
      setLoading(false)
    }
    init()
  }, [router])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const statusLabel: Record<string, string> = {
    studying: 'studying',
    graduated: 'graduated',
    dropped: 'dropped out',
    working: 'working',
  }

  // Show nothing while checking auth - prevents flash of content
  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-subtle">verifying access...</div>
      </div>
    )
  }

  // Extra guard: should never reach here due to redirect, but just in case
  if (isAuthorized === false) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-gray-500 text-sm">Make sure SUPABASE_SERVICE_ROLE_KEY is set in Vercel environment variables.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-gray-500 text-sm mb-1">admin dashboard</p>
            <h1 className="font-serif text-3xl">compass</h1>
          </div>
          <a href="/dashboard" className="text-blue-600 hover:underline text-sm">exit admin</a>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'total users', value: stats?.totalUsers },
            { label: 'tests completed', value: stats?.totalCompleted },
            { label: 'avg compass score', value: stats?.avgScore },
            { label: 'drop-off rate', value: `${stats?.dropoffRate}%` },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <p className="text-sm text-gray-500 mb-2">{s.label}</p>
              <p className="text-3xl font-serif text-blue-600">{s.value ?? '—'}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="card">
            <p className="text-sm text-gray-500 mb-1">most recommended path 1</p>
            <p className="font-medium">{stats?.topPath1 || '—'}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500 mb-1">most recommended path 2</p>
            <p className="font-medium">{stats?.topPath2 || '—'}</p>
          </div>
        </div>

        {/* Users table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-serif text-xl">all users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">name</th>
                  <th className="px-6 py-3 font-medium">age</th>
                  <th className="px-6 py-3 font-medium">status</th>
                  <th className="px-6 py-3 font-medium">compass score</th>
                  <th className="px-6 py-3 font-medium">path 1</th>
                  <th className="px-6 py-3 font-medium">joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">no users yet</td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{u.name}</td>
                      <td className="px-6 py-4 text-gray-600">{u.age}</td>
                      <td className="px-6 py-4 text-gray-600">{statusLabel[u.status] || u.status}</td>
                      <td className="px-6 py-4">
                        {u.compass_score !== null
                          ? <span className="text-blue-600 font-bold">{u.compass_score}</span>
                          : <span className="text-gray-400">no test</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{u.chosen_path}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(u.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
