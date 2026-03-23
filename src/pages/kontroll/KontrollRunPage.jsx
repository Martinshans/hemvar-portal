import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { KONTROLLOPPGAVER, formatInterval } from '@/data/kontrolloppgaver'
import { getPunkterForOppgave } from '@/data/kontrollpunkter'
import { getCategoryLabel } from '@/data/ns3451-categories'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  ArrowLeft, CheckCircle2, AlertTriangle, MinusCircle,
  Shield, ClipboardCheck, ChevronDown, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function StatusIcon({ status }) {
  if (status === 'ok') return <CheckCircle2 className="h-5 w-5 text-green-500" />
  if (status === 'avvik') return <AlertTriangle className="h-5 w-5 text-orange-500" />
  if (status === 'ikke_aktuelt') return <MinusCircle className="h-5 w-5 text-gray-400" />
  return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
}

export default function KontrollRunPage() {
  const { oppgaveId } = useParams()
  const navigate = useNavigate()

  const oppgave = KONTROLLOPPGAVER.find((o) => o.id === oppgaveId)
  const punkter = useMemo(() => getPunkterForOppgave(oppgaveId), [oppgaveId])

  const [results, setResults] = useState({})
  const [avvikForms, setAvvikForms] = useState({})
  const [expandedId, setExpandedId] = useState(null)

  if (!oppgave) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Kontrolloppgave ikke funnet</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/kontroll')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tilbake
        </Button>
      </div>
    )
  }

  const completedCount = Object.keys(results).length
  const totalCount = punkter.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const allDone = completedCount === totalCount
  const avvikCount = Object.values(results).filter((r) => r.status === 'avvik').length

  const setResult = (punktId, status) => {
    setResults((prev) => ({
      ...prev,
      [punktId]: { status, comment: prev[punktId]?.comment || '' },
    }))
    if (status === 'avvik') {
      setExpandedId(punktId)
    }
  }

  const handleComplete = () => {
    const completedRuns = JSON.parse(localStorage.getItem('hemvar_completed_runs') || '{}')
    completedRuns[oppgaveId] = {
      completedAt: new Date().toISOString(),
      results,
      avvikCount,
    }
    localStorage.setItem('hemvar_completed_runs', JSON.stringify(completedRuns))
    toast.success(`Kontroll fullført — ${avvikCount > 0 ? avvikCount + ' avvik registrert' : 'Ingen avvik'}`)
    navigate('/kontroll')
  }

  const registerAvvik = (punkt) => {
    toast.success('Avvik registrert')
    setAvvikForms((prev) => ({ ...prev, [punkt.id]: { ...prev[punkt.id], registered: true } }))
    setExpandedId(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/kontroll')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbake til kontrolloppgaver
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-semibold">{oppgave.lokasjonNavn}</h1>
              {oppgave.obligatorisk && (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                  <Shield className="h-3 w-3 mr-1" />
                  Obligatorisk
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {oppgave.id} — NS {oppgave.nsKode} — {formatInterval(oppgave.intervalMonths)}
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {completedCount} av {totalCount} kontrollpunkter
            </span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {avvikCount > 0 && (
                <span className="text-orange-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {avvikCount} avvik
                </span>
              )}
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                progress === 100 ? 'bg-green-500' : 'bg-hemvar-600'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {punkter.map((punkt) => {
              const result = results[punkt.id]
              const isExpanded = expandedId === punkt.id
              const avvikForm = avvikForms[punkt.id]

              return (
                <div key={punkt.id}>
                  {/* Compact row — click to expand */}
                  <div
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                      !result && 'hover:bg-muted/50',
                      result?.status === 'ok' && 'bg-green-50/60',
                      result?.status === 'avvik' && 'bg-orange-50/60',
                      result?.status === 'ikke_aktuelt' && 'bg-gray-50/60 opacity-60',
                    )}
                    onClick={() => setExpandedId(isExpanded ? null : punkt.id)}
                  >
                    <StatusIcon status={result?.status} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-muted-foreground">{punkt.kode}</span>
                        <p className={cn(
                          'text-sm truncate',
                          result?.status === 'ikke_aktuelt' && 'line-through'
                        )}>
                          {punkt.beskrivelse}
                        </p>
                      </div>
                      {avvikForm?.registered && result?.status === 'avvik' && (
                        <span className="text-[11px] text-orange-600 ml-8">Avvik registrert</span>
                      )}
                    </div>

                    {result?.comment && (
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}

                    <ChevronDown className={cn(
                      'h-4 w-4 text-muted-foreground shrink-0 transition-transform',
                      isExpanded && 'rotate-180'
                    )} />
                  </div>

                  {/* Expanded section with actions */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-3 bg-muted/30 border-t border-dashed">
                      <p className="text-sm text-muted-foreground mb-4">{punkt.beskrivelse}</p>

                      {/* Action buttons with labels */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button
                          onClick={() => setResult(punkt.id, 'ok')}
                          className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                            result?.status === 'ok'
                              ? 'bg-green-100 border-green-300 text-green-800'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                          )}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          OK
                        </button>
                        <button
                          onClick={() => setResult(punkt.id, 'avvik')}
                          className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                            result?.status === 'avvik'
                              ? 'bg-orange-100 border-orange-300 text-orange-800'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700'
                          )}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Avvik
                        </button>
                        <button
                          onClick={() => setResult(punkt.id, 'ikke_aktuelt')}
                          className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                            result?.status === 'ikke_aktuelt'
                              ? 'bg-gray-100 border-gray-300 text-gray-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700'
                          )}
                        >
                          <MinusCircle className="h-4 w-4" />
                          Ikke aktuelt
                        </button>
                      </div>

                      {/* Comment field */}
                      <Textarea
                        placeholder="Legg til kommentar (valgfritt)..."
                        className="text-sm h-16 resize-none"
                        value={result?.comment || ''}
                        onChange={(e) =>
                          setResults((prev) => ({
                            ...prev,
                            [punkt.id]: { ...prev[punkt.id], comment: e.target.value },
                          }))
                        }
                      />

                      {/* Avvik registration form */}
                      {result?.status === 'avvik' && !avvikForm?.registered && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg space-y-3">
                          <h4 className="text-sm font-medium text-orange-800">Registrer avvik</h4>
                          <div className="space-y-2">
                            <Label className="text-xs">Beskrivelse</Label>
                            <Textarea
                              className="text-sm h-16"
                              defaultValue={punkt.beskrivelse}
                              onChange={(e) =>
                                setAvvikForms((prev) => ({
                                  ...prev,
                                  [punkt.id]: { ...prev[punkt.id], beskrivelse: e.target.value },
                                }))
                              }
                            />
                          </div>
                          <div className="flex items-end gap-3">
                            <div className="space-y-2 flex-1">
                              <Label className="text-xs">Alvorlighetsgrad</Label>
                              <Select
                                defaultValue="middels"
                                onValueChange={(v) =>
                                  setAvvikForms((prev) => ({
                                    ...prev,
                                    [punkt.id]: { ...prev[punkt.id], severity: v },
                                  }))
                                }
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lav">Lav</SelectItem>
                                  <SelectItem value="middels">Middels</SelectItem>
                                  <SelectItem value="høy">Høy</SelectItem>
                                  <SelectItem value="kritisk">Kritisk</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700"
                              onClick={() => registerAvvik(punkt)}
                            >
                              Registrer avvik
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 mt-6 pb-4">
        <Card className="shadow-lg border-t">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {completedCount}/{totalCount} gjennomført
                </span>
                {avvikCount > 0 && (
                  <span className="text-xs text-orange-600">{avvikCount} avvik</span>
                )}
              </div>
              <Button
                onClick={handleComplete}
                disabled={!allDone}
                className={cn(!allDone && 'opacity-50')}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Fullfør kontroll
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
