import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'

const STORAGE_KEY = 'hemvar_demo_auth'
// Password kan settes via miljøvariabel i Vercel: VITE_DEMO_PASSWORD
// Hvis ikke satt, fallback er "hemvar2026"
const VALID_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || 'hemvar2026'

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'true') {
      setAuthed(true)
    }
    setChecking(false)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === VALID_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true')
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (checking) return null
  if (authed) return children

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#e8e5dc] shadow-sm p-10 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#edf7f5] mb-4">
            <Lock className="h-6 w-6 text-[#073932]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#073932] mb-2">
            Hemvar — Demo
          </h1>
          <p className="text-sm text-[#073932]/70">
            Skriv inn passord for å se demo-versjonen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Passord"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError(false)
            }}
            className={`h-11 bg-[#F5F2EA]/40 ${error ? 'border-red-400' : ''}`}
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-600">Feil passord. Prøv igjen.</p>
          )}
          <Button
            type="submit"
            className="w-full h-11 bg-[#073932] hover:bg-[#0a524a] text-white"
          >
            Logg inn
          </Button>
        </form>

        <p className="text-xs text-[#073932]/50 text-center mt-6">
          Tilgang er begrenset til personer med passord.
        </p>
      </div>
    </div>
  )
}
