'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [latestScore, setLatestScore] = useState<any>(null)
  const [latestPaths, setLatestPaths] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const supabase = createClient()

        // Get user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Get profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!profileData) {
          router.push('/onboard')
          return
        }

        setProfile(profileData)

        // Get latest score
        const { data: scoreData } = await supabase
          .from('psychometric_scores')
          .select('*, test_sessions!inner(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (scoreData) {
          setLatestScore(scoreData)

          // Get latest paths
          const { data: pathData } = await supabase
            .from('path_recommendations')
            .select('*')
            .eq('session_id', scoreData.session_id)
            .single()

          if (pathData) {
            setLatestPaths(pathData)
          }
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      }
      setLoading(false)
    }

    fetchDashboard()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-subtle">loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <div className="mb-12">
          <p className="text-gray-600 mb-1">welcome back,</p>
          <h1 className="font-serif text-4xl">{profile?.name}</h1>
        </div>

        {latestScore ? (
          <>
            {/* Latest Score */}
            <div className="card mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-gray-600 mb-2">your latest compass score</p>
                  <div className="text-6xl font-serif text-blue-600">
                    {latestScore.compass_score}
                  </div>
                  <p className="text-gray-500">out of 100</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'IQ', value: latestScore.iq_score },
                    { label: 'AQ', value: latestScore.aq_score },
                    { label: 'EQ', value: latestScore.eq_score },
                    { label: 'SQ', value: latestScore.sq_score }
                  ].map((dim) => (
                    <div key={dim.label} className="text-center">
                      <p className="text-sm text-gray-500">{dim.label}</p>
                      <p className="text-2xl font-bold">{dim.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Paths */}
            {latestPaths && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl mb-4">your paths</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="card card-hover">
                    <h3 className="font-serif text-xl mb-2">{latestPaths.path_1?.name}</h3>
                    <p className="text-blue-600 mb-4">{latestPaths.path_1?.tagline}</p>
                    <a
                      href={`/path/${latestPaths.id}?choice=1`}
                      className="btn-secondary block text-center"
                    >
                      continue exploring
                    </a>
                  </div>
                  <div className="card card-hover">
                    <h3 className="font-serif text-xl mb-2">{latestPaths.path_2?.name}</h3>
                    <p className="text-blue-600 mb-4">{latestPaths.path_2?.tagline}</p>
                    <a
                      href={`/path/${latestPaths.id}?choice=2`}
                      className="btn-secondary block text-center"
                    >
                      continue exploring
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-16 mb-8">
            <h2 className="font-serif text-2xl mb-4">Take your first test</h2>
            <p className="text-gray-600 mb-8">
              Discover your psychometric profile and get personalized career paths.
            </p>
            <a href="/test" className="btn-primary">
              start test
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <a href="/history" className="btn-secondary text-center flex-1">
            view history
          </a>
          <a href="/test" className="btn-primary text-center flex-1">
            {latestScore ? 'retake test' : 'start test'}
          </a>
        </div>
      </div>
    </div>
  )
}
