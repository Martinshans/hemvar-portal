import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { KONTROLLOPPGAVER, getNextDueDate, formatInterval } from '@/data/kontrolloppgaver'
import { KONTROLLPUNKTER } from '@/data/kontrollpunkter'
import { getCategoryLabel } from '@/data/ns3451-categories'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Clock, CheckCircle2, AlertTriangle, Shield, Play
} from 'lucide-react'
import { cn } from '@/lib/utils'

function KontrollStatus({ oppgave }) {
  if (oppgave.isCompleted) {
    return (
      <div className="flex items-center gap-1.5 text-green-600">
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Gjennomført</span>
      </div>
    )
  }
  if (oppgave.isOverdue) {
    return (
      <div className="flex items-center gap-1.5 text-orange-600">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Forfalt</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Clock className="h-3.5 w-3.5" />
      <span className="text-xs">{oppgave.nextDue.toLocaleDateString('nb-NO')}</span>
    </div>
  )
}

export default function KontrollListPage() {
  const navigate = useNavigate()
  const [onlyObligatorisk, setOnlyObligatorisk] = useState(false)
  const [intervalFilter, setIntervalFilter] = useState('alle')

  const [completedRuns] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hemvar_completed_runs') || '{}')
    } catch { return {} }
  })

  const punkterCount = useMemo(() => {
    const counts = {}
    KONTROLLPUNKTER.forEach((p) => {
      counts[p.oppgaveId] = (counts[p.oppgaveId] || 0) + 1
    })
    return counts
  }, [])

  const enriched = useMemo(() => {
    return KONTROLLOPPGAVER.map((o) => ({
      ...o,
      nextDue: getNextDueDate(o),
      punkterCount: punkterCount[o.id] || 0,
      isCompleted: !!completedRuns[o.id],
      isOverdue: getNextDueDate(o) < new Date(),
    })).sort((a, b) => a.nextDue - b.nextDue)
  }, [punkterCount, completedRuns])

  const filtered = enriched.filter((o) => {
    if (onlyObligatorisk && !o.obligatorisk) return false
    if (intervalFilter !== 'alle' && String(o.intervalMonths) !== intervalFilter) return false
    return true
  })

  const columns = [
    {
      header: 'Kontrolloppgave',
      accessorKey: 'lokasjonNavn',
      cell: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{row.lokasjonNavn}</span>
            {row.obligatorisk && (
              <Shield className="h-3.5 w-3.5 text-red-500 shrink-0" />
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {row.id} — NS {row.nsKode}
          </span>
        </div>
      ),
    },
    {
      header: 'Bygningsdel',
      accessorKey: 'nsKode',
      className: 'hidden lg:table-cell',
      cell: (row) => (
        <Badge variant="outline" className="text-xs">
          {getCategoryLabel(String(row.nsKode))}
        </Badge>
      ),
    },
    {
      header: 'Intervall',
      accessorKey: 'intervalMonths',
      className: 'hidden md:table-cell',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{formatInterval(row.intervalMonths)}</span>
      ),
    },
    {
      header: 'Punkter',
      accessorKey: 'punkterCount',
      className: 'hidden sm:table-cell',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{row.punkterCount}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <KontrollStatus oppgave={row} />,
    },
    {
      header: '',
      accessorKey: 'action',
      cell: (row) => (
        <Button
          size="sm"
          variant={row.isCompleted ? 'outline' : 'default'}
          className="h-7 text-xs"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/kontroll/${row.id}`)
          }}
        >
          <Play className="h-3 w-3 mr-1" />
          {row.isCompleted ? 'Gjenta' : 'Start'}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Kontrollrunder"
        description="Planlagte kontroller og inspeksjoner for bygget"
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={intervalFilter} onValueChange={setIntervalFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle intervaller</SelectItem>
            <SelectItem value="1">Månedlig</SelectItem>
            <SelectItem value="3">Kvartalsvis</SelectItem>
            <SelectItem value="6">Halvårlig</SelectItem>
            <SelectItem value="12">Årlig</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Checkbox
            id="obligatorisk"
            checked={onlyObligatorisk}
            onCheckedChange={setOnlyObligatorisk}
          />
          <Label htmlFor="obligatorisk" className="text-sm font-normal">
            Kun obligatoriske
          </Label>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => navigate(`/kontroll/${row.id}`)}
        searchPlaceholder="Søk i kontrolloppgaver..."
      />
    </div>
  )
}
