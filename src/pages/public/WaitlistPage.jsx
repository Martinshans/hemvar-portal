import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    toast.success('Du er meldt på ventelisten!')
  }

  return (
    <div className="min-h-screen bg-[#F5F2EA]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e5dc]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/rapport" className="flex items-center">
            <img src="/hemvar-logo.png" alt="Hemvar" className="h-8 w-auto" />
          </Link>
          <Link
            to="/rapport"
            className="text-sm text-[#073932]/70 hover:text-[#073932] flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Tilbake</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#073932] mb-5 tracking-tight">
            FDV for borettslag,<br />sameier og eneboliger
          </h1>
          <p className="text-lg text-[#073932]/70 leading-relaxed max-w-xl mx-auto">
            Hemvar samler alt om bygget ditt på ett sted — tilstandsrapporter,
            kontroller, avvik og vedlikeholdsplan. Alltid tilgjengelig, alltid
            oppdatert.
          </p>
        </div>

        {/* Waitlist form */}
        <div className="bg-white rounded-2xl border border-[#e8e5dc] shadow-sm p-8 sm:p-10">
          {!submitted ? (
            <>
              <h2 className="text-xl font-semibold text-[#073932] mb-2 text-center">
                Bli med på ventelisten
              </h2>
              <p className="text-sm text-[#073932]/70 text-center mb-6">
                Vi lanserer snart. Legg igjen e-posten din så gir vi deg beskjed
                når Hemvar er klar.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
                <div className="relative">
                  <Mail className="h-4 w-4 text-[#073932]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder="din@epost.no"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 text-base bg-[#F5F2EA]/40 border-[#e8e5dc]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-[#073932] hover:bg-[#0a524a] text-white rounded-lg"
                >
                  Meld meg på
                </Button>
                <p className="text-xs text-[#073932]/50 text-center pt-1">
                  Ingen spam. Vi bruker kun e-posten til å varsle om lansering.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#edf7f5] mb-4">
                <CheckCircle2 className="h-7 w-7 text-[#073932]" />
              </div>
              <h2 className="text-xl font-semibold text-[#073932] mb-2">
                Takk — du er på ventelisten!
              </h2>
              <p className="text-sm text-[#073932]/70 max-w-sm mx-auto">
                Vi sender deg en e-post til <strong>{email}</strong> så snart
                Hemvar er klar til å tas i bruk.
              </p>
            </div>
          )}
        </div>

        {/* Simple value props */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Alt på ett sted',
              desc: 'Tilstandsrapporter, kontroller, avvik og dokumenter.',
            },
            {
              title: 'Følger bygget',
              desc: 'Også ved eierskifte. All historikk bevares.',
            },
            {
              title: 'Smarte påminnelser',
              desc: 'Aldri gå glipp av en obligatorisk kontroll.',
            },
          ].map((item) => (
            <div key={item.title} className="text-center px-2">
              <h3 className="text-sm font-semibold text-[#073932] mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-[#073932]/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#e8e5dc] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-[#073932]/50">
            © 2026 Hemvar AS. Alle rettigheter reservert.
          </p>
        </div>
      </footer>
    </div>
  )
}
