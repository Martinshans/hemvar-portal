import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Download, FileText, Calendar, User, MapPin,
  Clock, ArrowRight, Mail
} from 'lucide-react'
import { toast } from 'sonner'

// Mock report data — i produksjon hentes dette fra backend via token
const MOCK_REPORT = {
  buildingAddress: 'Solsvingen 12, 0150 Oslo',
  buildingType: 'Borettslag — 24 enheter',
  reportDate: '2026-03-15',
  inspector: 'Lars Hansen',
  senderCompanyName: 'Takstmann Hansen AS',
  senderEmail: 'lars@takstmannhansen.no',
  reportFileName: 'Tilstandsrapport_Solsvingen_12.pdf',
  reportFileSize: '4.2 MB',
  expiresAt: '2026-04-14',
  customMessage:
    'Hei! Vedlagt finner du den ferdige tilstandsrapporten for bygget. Ta gjerne kontakt hvis du har spørsmål til innholdet eller de foreslåtte tiltakene.',
}

export default function DownloadReportPage() {
  const { token } = useParams()
  const [downloading, setDownloading] = useState(false)
  const report = MOCK_REPORT

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      toast.success('Tilstandsrapporten lastes ned')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#F5F2EA]">
      {/* Top bar with logo + waitlist CTA */}
      <header className="bg-white border-b border-[#e8e5dc]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/hemvar-logo.png" alt="Hemvar" className="h-8 w-auto" />
          <Link to="/ventelisten">
            <Button className="bg-[#073932] hover:bg-[#0a524a] text-white rounded-lg h-10 px-5 text-sm font-medium">
              Bli med på ventelisten
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Hemvar promo — now at the top with illustration */}
        <div className="bg-[#073932] text-white rounded-2xl p-8 sm:p-10 shadow-sm mb-6 overflow-hidden relative">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Illustration */}
            <div className="shrink-0">
              <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Building */}
                <rect x="30" y="45" width="80" height="75" rx="4" fill="#F5F2EA" />
                {/* Roof */}
                <path d="M25 50 L70 20 L115 50 Z" fill="#5ec4b6" />
                {/* Door */}
                <rect x="60" y="85" width="20" height="35" fill="#073932" />
                <circle cx="76" cy="103" r="1.5" fill="#5ec4b6" />
                {/* Windows */}
                <rect x="40" y="60" width="14" height="14" fill="#5ec4b6" rx="1" />
                <rect x="86" y="60" width="14" height="14" fill="#5ec4b6" rx="1" />
                <rect x="40" y="88" width="14" height="14" fill="#5ec4b6" rx="1" />
                {/* Document/shield overlay */}
                <circle cx="110" cy="100" r="18" fill="#F5F2EA" stroke="#5ec4b6" strokeWidth="2" />
                <path d="M104 100 L108 104 L116 96" stroke="#073932" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-semibold mb-3 leading-tight">
                La rapporten følge bygget i all tid
              </h2>
              <p className="text-sm text-white/80 leading-relaxed mb-5">
                Registrer eiendommen hos Hemvar og få tilstandsrapporten, kontroller
                og vedlikeholdsplan samlet på ett sted.
              </p>
              <Link to="/ventelisten">
                <Button
                  variant="outline"
                  className="bg-white text-[#073932] hover:bg-white/90 border-white h-11 font-medium"
                >
                  Bli med på ventelisten
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Report card */}
        <div className="bg-white rounded-2xl border border-[#e8e5dc] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-8 text-center border-b border-[#e8e5dc]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#edf7f5] mb-4">
              <FileText className="h-8 w-8 text-[#073932]" />
            </div>
            <h1 className="text-3xl font-semibold text-[#073932] mb-2">
              Din tilstandsrapport er klar
            </h1>
            <p className="text-base text-[#073932]/70 max-w-lg mx-auto">
              Rapporten for <strong>{report.buildingAddress}</strong> er ferdig og klar til å lastes ned.
            </p>
          </div>

          {/* Report metadata */}
          <div className="px-8 py-6 bg-[#F5F2EA]/40 border-b border-[#e8e5dc]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#073932]/60 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#073932]/60 text-xs uppercase tracking-wider mb-0.5">Bygg</p>
                  <p className="font-medium text-[#073932]">{report.buildingAddress}</p>
                  <p className="text-[#073932]/60 text-xs">{report.buildingType}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-[#073932]/60 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#073932]/60 text-xs uppercase tracking-wider mb-0.5">Rapportdato</p>
                  <p className="font-medium text-[#073932]">
                    {new Date(report.reportDate).toLocaleDateString('nb-NO', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-[#073932]/60 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#073932]/60 text-xs uppercase tracking-wider mb-0.5">Utført av</p>
                  <p className="font-medium text-[#073932]">{report.inspector}</p>
                  <p className="text-[#073932]/60 text-xs">{report.senderCompanyName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-[#073932]/60 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#073932]/60 text-xs uppercase tracking-wider mb-0.5">Fil</p>
                  <p className="font-medium text-[#073932]">{report.reportFileName}</p>
                  <p className="text-[#073932]/60 text-xs">PDF — {report.reportFileSize}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom message */}
          {report.customMessage && (
            <div className="px-8 py-6 border-b border-[#e8e5dc]">
              <p className="text-xs uppercase tracking-wider text-[#073932]/60 mb-2 font-medium">
                Melding fra {report.senderCompanyName}
              </p>
              <div className="border-l-4 border-[#073932] pl-4 py-1">
                <p className="text-sm text-[#073932]/80 leading-relaxed italic">
                  "{report.customMessage}"
                </p>
              </div>
            </div>
          )}

          {/* Download CTA */}
          <div className="px-8 py-8">
            <Button
              onClick={handleDownload}
              disabled={downloading}
              size="lg"
              className="w-full bg-[#073932] hover:bg-[#0a524a] text-white h-14 text-base font-medium rounded-xl"
            >
              {downloading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Laster ned...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-3" />
                  Last ned tilstandsrapport
                </>
              )}
            </Button>

            <div className="mt-4 flex items-start gap-2 text-xs text-[#073932]/60">
              <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>
                Lenken utløper{' '}
                <strong className="text-[#073932]">
                  {new Date(report.expiresAt).toLocaleDateString('nb-NO', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </strong>
                . Kontakt {report.senderCompanyName} dersom lenken har utløpt.
              </p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#073932]/60 mb-2">
            Har du spørsmål til rapportens innhold?
          </p>
          <p className="text-sm text-[#073932]">
            Ta kontakt med{' '}
            <a href={`mailto:${report.senderEmail}`} className="font-medium underline">
              {report.senderCompanyName}
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#e8e5dc] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-[#073932]/50">
            © 2026 Hemvar AS. Alle rettigheter reservert.
          </p>
          {token && (
            <p className="text-xs text-[#073932]/40 mt-1">
              Token: <span className="font-mono">{token}</span>
            </p>
          )}
        </div>
      </footer>
    </div>
  )
}
