'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    status: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) {
          router.push('/login')
        }
      }).catch((err) => {
        console.error('Auth check error:', err)
        router.push('/login')
      })
    } catch (err) {
      console.error('Supabase client error:', err)
      router.push('/login')
    }
  }, [router])

  const handleNext = () => {
    if (step === 1 && formData.name.trim()) {
      setStep(2)
    } else if (step === 2 && formData.age) {
      const ageNum = parseInt(formData.age)
      if (ageNum >= 18 && ageNum <= 26) {
        setStep(3)
      }
    }
  }

  const handleComplete = async () => {
    if (!formData.status) return

    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          status: formData.status
        })
      })

      if (response.ok) {
        router.push('/test')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Profile error:', response.status, errorData)
        alert(`Something went wrong: ${errorData.error || response.status}. Please try again.`)
      }
    } catch (error) {
      console.error('Onboard error:', error)
      alert('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const statusOptions = [
    { value: 'studying', label: 'still studying', desc: 'In college, school, or courses' },
    { value: 'graduated', label: 'just graduated', desc: 'Done with formal education' },
    { value: 'dropped', label: 'dropped out', desc: 'Left formal education' },
    { value: 'working', label: 'working but lost', desc: 'Employed but directionless' }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      {/* Progress dots */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= step ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">What's your name?</h2>
            <p className="text-gray-600 mb-8">Just your first name is fine.</p>

            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="your name"
              className="input text-lg mb-6"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />

            <button
              onClick={handleNext}
              disabled={!formData.name.trim()}
              className="btn-primary w-full disabled:opacity-50"
            >
              next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">How old are you?</h2>
            <p className="text-gray-600 mb-8">Compass is designed for 18-26 year olds.</p>

            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="your age"
              min="18"
              max="26"
              className="input text-lg mb-6"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />

            <button
              onClick={handleNext}
              disabled={!formData.age || parseInt(formData.age) < 18 || parseInt(formData.age) > 26}
              className="btn-primary w-full disabled:opacity-50"
            >
              next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Where are you right now?</h2>
            <p className="text-gray-600 mb-8">No judgment. This helps us personalize your paths.</p>

            <div className="space-y-4 mb-8">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, status: option.value })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    formData.status === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="font-medium text-lg">{option.label}</p>
                  <p className="text-sm text-gray-500">{option.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={handleComplete}
              disabled={!formData.status || loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'starting...' : 'complete'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
