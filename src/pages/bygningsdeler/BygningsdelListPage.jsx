import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import { NS3451_CATEGORIES, getCategoryLabel } from '@/data/ns3451-categories'
import { MOCK_TASKS } from '@/data/mock-tasks'
import { MOCK_DOCUMENTS } from '@/data/mock-documents'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Search, ChevronRight, AlertTriangle, CheckCircle2,
  Clock, Activity, Sparkles
} from 'lucide-react'
import { useConditions } from '@/context/ConditionContext'
import { useDeviations } from '@/context/DeviationContext'
import { useMaintenance } from '@/context/MaintenanceContext'
import { cn } from '@/lib/utils'

const SEVERITY_ORDER = { kritisk: 0, høy: 1, middels: 2, lav: 3 }

export default function BygningsdelListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const { conditions } = useConditions()
  const { deviations } = useDeviations()
  const { items: maintenanceItems } = useMaintenance()

  // Flatten all NS3451 subcategories
  const allParts = useMemo(() => {
    return NS3451_CATEGORIES.flatMap((cat) =>
      cat.subcategories.map((sub) => ({
        ...sub,
        mainCategory: cat.label,
        mainCode: cat.code,
      }))
    )
  }, [])

  // Enrich each part with data
  const enrichedParts = useMemo(() => {
    return allParts.map((part) => {
      const condition = conditions.find((c) => c.buildingPart === part.code)
      const partDeviations = deviations.filter(
        (d) => d.ns3451Category === part.code && d.status !== 'lukket'
      )
      const taskCount = MOCK_TASKS.filter((t) => t.ns3451Category === part.code).length
      const documentCount = MOCK_DOCUMENTS.filter((d) => d.ns3451Category === part.code).length
      const maintenanceCount = maintenanceItems.filter((m) => m.ns3451Category === part.code).length
      const hasData = !!condition || partDeviations.length > 0 || taskCount > 0 || documentCount > 0 || maintenanceCount > 0

      // Determine status:
      // - 'kritisk' if TG 3 or open critical/high deviation
      // - 'oppmerksomhet' if TG 2 or any open deviation
      // - 'i_orden' if TG 0-1 and no open deviations
      // - 'ikke_vurdert' if no condition data
      let status = 'ikke_vurdert'
      if (condition) {
        if (condition.tg === 3 || partDeviations.some((d) => ['kritisk', 'høy'].includes(d.severity))) {
          status = 'kritisk'
        } else if (condition.tg === 2 || partDeviations.length > 0) {
          status = 'oppmerksomhet'
        } else {
          status = 'i_orden'
        }
      } else if (partDeviations.length > 0) {
        status = 'oppmerksomhet'
      }

      return {
        ...part,
        condition,
        deviations: partDeviations,
        taskCount,
        documentCount,
        maintenanceCount,
        status,
        hasData,
      }
    })
  }, [allParts, conditions, deviations, maintenanceItems])

  // Filter by search
  const filtered = enrichedParts.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return p.label.toLowerCase().includes(q) || p.code.includes(q)
  })

  // Group by status
  const kritisk = filtered.filter((p) => p.status === 'kritisk')
  const oppmerksomhet = filtered.filter((p) => p.status === 'oppmerksomhet')
  const iOrden = filtered.filter((p) => p.status === 'i_orden')
  const ikkeVurdert = filtered.filter((p) => p.status === 'ikke_vurdert')

  // Build "Hva må du gjøre nå?" action list
  const actionItems = useMemo(() => {
    const items = []

    // TG 3 conditions → akutt
    conditions.filter((c) => c.tg === 3).forEach((c) => {
      items.push({
        id: `cond-${c.id}`,
        level: 'akutt',
        title: c.recommendedAction || `${c.buildingPartLabel} — kritisk tilstand`,
        context: `${c.buildingPartLabel} · TG 3`,
        buildingPartCode: c.buildingPart,
      })
    })

    // Open kritisk/høy deviations → akutt
    deviations
      .filter((d) => d.status !== 'lukket' && ['kritisk', 'høy'].includes(d.severity))
      .forEach((d) => {
        items.push({
          id: `dev-${d.id}`,
          level: 'akutt',
          title: d.title,
          context: `${getCategoryLabel(d.ns3451Category)} · ${d.severity}`,
          buildingPartCode: d.ns3451Category,
        })
      })

    // TG 2 conditions → planlegg
    conditions.filter((c) => c.tg === 2).forEach((c) => {
      items.push({
        id: `cond-${c.id}`,
        level: 'planlegg',
        title: c.recommendedAction || `${c.buildingPartLabel} — planlegg tiltak`,
        context: `${c.buildingPartLabel} · TG 2`,
        buildingPartCode: c.buildingPart,
      })
    })

    // Open middels/lav deviations → planlegg
    deviations
      .filter((d) => d.status !== 'lukket' && ['middels', 'lav'].includes(d.severity))
      .forEach((d) => {
        items.push({
          id: `dev-${d.id}`,
          level: 'planlegg',
          title: d.title,
          context: `${getCategoryLabel(d.ns3451Category)} · ${d.severity}`,
          buildingPartCode: d.ns3451Category,
        })
      })

    // Sort: akutt first, then planlegg
    return items.sort((a, b) => {
      if (a.level !== b.level) return a.level === 'akutt' ? -1 : 1
      return 0
    })
  }, [conditions, deviations])

  const akuttCount = actionItems.filter((i) => i.level === 'akutt').length
  const planleggCount = actionItems.filter((i) => i.level === 'planlegg').length

  return (
    <div>
      <PageHeader
        title="Bygningsdeler"
        description="Oversikt over status og handlinger for bygningsdelene"
      />

      {/* Hva må du gjøre nå? — action list */}
      {actionItems.length > 0 && (
        <Card className="mb-6 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-hemvar-600" />
                  <h2 className="text-lg font-semibold">Hva må du gjøre nå?</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Sortert etter hva som haster mest
                </p>
              </div>
              <div className="flex gap-4 text-right text-xs">
                {akuttCount > 0 && (
                  <div>
                    <div className="text-xl font-semibold text-red-600">{akuttCount}</div>
                    <div className="text-muted-foreground">Akutt</div>
                  </div>
                )}
                {planleggCount > 0 && (
                  <div>
                    <div className="text-xl font-semibold text-orange-600">{planleggCount}</div>
                    <div className="text-muted-foreground">Planlegg</div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {actionItems.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/eiendom/bygningsdeler/${item.buildingPartCode}`)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 text-left transition-colors',
                    'hover:bg-muted/40',
                    item.level === 'akutt'
                      ? 'border-l-red-500 bg-red-50/40'
                      : 'border-l-orange-400 bg-orange-50/40'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm',
                      item.level === 'akutt' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    )}
                  >
                    {item.level === 'akutt' ? '🚨' : '⚠️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.context}</p>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-semibold shrink-0 flex items-center gap-1',
                      item.level === 'akutt' ? 'text-red-600' : 'text-orange-600'
                    )}
                  >
                    {item.level === 'akutt' ? 'Akutt' : 'Planlegg'}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              ))}
            </div>

            {actionItems.length > 6 && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                +{actionItems.length - 6} flere punkter
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Søk i bygningsdeler..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Kritisk — needs immediate attention */}
      {kritisk.length > 0 && (
        <StatusSection
          icon={AlertTriangle}
          iconColor="text-red-600"
          title="Kritisk — krever umiddelbar handling"
          count={kritisk.length}
        >
          <div className="space-y-2">
            {kritisk.map((part) => (
              <PartRow key={part.code} part={part} navigate={navigate} variant="kritisk" />
            ))}
          </div>
        </StatusSection>
      )}

      {/* Trenger oppmerksomhet */}
      {oppmerksomhet.length > 0 && (
        <StatusSection
          icon={AlertTriangle}
          iconColor="text-orange-500"
          title="Trenger oppmerksomhet"
          count={oppmerksomhet.length}
        >
          <div className="space-y-2">
            {oppmerksomhet.map((part) => (
              <PartRow key={part.code} part={part} navigate={navigate} variant="oppmerksomhet" />
            ))}
          </div>
        </StatusSection>
      )}

      {/* I orden */}
      {iOrden.length > 0 && (
        <StatusSection
          icon={CheckCircle2}
          iconColor="text-green-600"
          title="I orden"
          count={iOrden.length}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {iOrden.map((part) => (
              <PartCompact key={part.code} part={part} navigate={navigate} />
            ))}
          </div>
        </StatusSection>
      )}

      {/* Ikke vurdert */}
      {ikkeVurdert.length > 0 && (
        <StatusSection
          icon={Clock}
          iconColor="text-muted-foreground"
          title="Ikke vurdert ennå"
          count={ikkeVurdert.length}
          collapsedByDefault={!showAll}
        >
          {showAll ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ikkeVurdert.map((part) => (
                <PartCompact key={part.code} part={part} navigate={navigate} muted />
              ))}
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>
              Vis alle {ikkeVurdert.length} bygningsdeler
            </Button>
          )}
        </StatusSection>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Ingen bygningsdeler matcher søket.</p>
        </div>
      )}
    </div>
  )
}

/* ===== Components ===== */

function StatusSection({ icon: Icon, iconColor, title, count, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={cn('h-4 w-4', iconColor)} />
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">({count})</span>
      </div>
      {children}
    </div>
  )
}

function PartRow({ part, navigate, variant }) {
  const borderColor = {
    kritisk: 'border-l-red-500',
    oppmerksomhet: 'border-l-orange-400',
  }[variant]

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md bg-white border-l-4',
        borderColor
      )}
      onClick={() => navigate(`/eiendom/bygningsdeler/${part.code}`)}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{part.code}</span>
            <h4 className="text-sm font-semibold truncate">{part.label}</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {part.condition?.description || `${part.deviations.length} åpne avvik`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {part.condition && <StatusBadge value={part.condition.tg} type="tg" />}
          {part.deviations.length > 0 && (
            <span className="text-xs font-medium text-orange-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {part.deviations.length}
            </span>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}

function PartCompact({ part, navigate, muted = false }) {
  return (
    <button
      onClick={() => navigate(`/eiendom/bygningsdeler/${part.code}`)}
      className={cn(
        'flex items-center gap-2 px-3 py-2.5 rounded-lg border bg-white text-left hover:border-hemvar-300 hover:shadow-sm transition-all w-full',
        muted && 'opacity-60'
      )}
    >
      <span className="text-[11px] font-mono text-muted-foreground shrink-0">{part.code}</span>
      <span className="text-sm font-medium truncate flex-1">{part.label}</span>
      {part.condition && <StatusBadge value={part.condition.tg} type="tg" />}
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
    </button>
  )
}
