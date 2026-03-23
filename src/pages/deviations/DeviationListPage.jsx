import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { MOCK_DEVIATIONS } from '@/data/mock-deviations'
import { getCategoryLabel } from '@/data/ns3451-categories'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function DeviationListPage() {
  const [deviations, setDeviations] = useState(MOCK_DEVIATIONS)
  const [statusFilter, setStatusFilter] = useState('alle')
  const [severityFilter, setSeverityFilter] = useState('alle')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDeviation, setSelectedDeviation] = useState(null)

  const filtered = deviations.filter((d) => {
    if (statusFilter !== 'alle' && d.status !== statusFilter) return false
    if (severityFilter !== 'alle' && d.severity !== severityFilter) return false
    return true
  })

  const columns = [
    {
      header: 'Avvik',
      accessorKey: 'title',
      cell: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      header: 'Bygningsdel',
      accessorKey: 'ns3451Category',
      className: 'hidden md:table-cell',
      cell: (row) => (
        <Badge variant="outline" className="text-xs">
          {getCategoryLabel(row.ns3451Category)}
        </Badge>
      ),
    },
    {
      header: 'Alvorlighet',
      accessorKey: 'severity',
      cell: (row) => <StatusBadge value={row.severity} type="severity" />,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge value={row.status} />,
    },
    {
      header: 'Rapportert',
      accessorKey: 'reportedDate',
      className: 'hidden lg:table-cell',
      cell: (row) => new Date(row.reportedDate).toLocaleDateString('nb-NO'),
    },
    {
      header: 'Rapportert av',
      accessorKey: 'reportedBy',
      className: 'hidden xl:table-cell',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Avviksregister"
        description="Registrering og oppfølging av avvik"
        action={() => setDialogOpen(true)}
        actionLabel="Registrer avvik"
        actionIcon={Plus}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle statuser</SelectItem>
            <SelectItem value="åpent">Åpent</SelectItem>
            <SelectItem value="under_behandling">Under behandling</SelectItem>
            <SelectItem value="lukket">Lukket</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle alvorligheter</SelectItem>
            <SelectItem value="lav">Lav</SelectItem>
            <SelectItem value="middels">Middels</SelectItem>
            <SelectItem value="høy">Høy</SelectItem>
            <SelectItem value="kritisk">Kritisk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => setSelectedDeviation(row)}
        searchPlaceholder="Søk i avvik..."
      />

      <Dialog open={!!selectedDeviation} onOpenChange={() => setSelectedDeviation(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedDeviation?.title}</DialogTitle>
          </DialogHeader>
          {selectedDeviation && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selectedDeviation.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Bygningsdel:</span>
                  <p className="font-medium">{getCategoryLabel(selectedDeviation.ns3451Category)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Plassering:</span>
                  <p className="font-medium">{selectedDeviation.location}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Alvorlighet:</span>
                  <div className="mt-1"><StatusBadge value={selectedDeviation.severity} type="severity" /></div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1"><StatusBadge value={selectedDeviation.status} /></div>
                </div>
              </div>
              {selectedDeviation.actions.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Tiltak:</span>
                  <ul className="mt-1 space-y-1">
                    {selectedDeviation.actions.map((a, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrer avvik</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.target)
              setDeviations((prev) => [
                {
                  id: `avvik-${Date.now()}`,
                  title: fd.get('title'),
                  description: fd.get('description'),
                  ns3451Category: '31',
                  severity: 'middels',
                  status: 'åpent',
                  reportedBy: 'Kari Nordmann',
                  reportedDate: new Date().toISOString().slice(0, 10),
                  location: fd.get('location'),
                  actions: [],
                  closedDate: null,
                },
                ...prev,
              ])
              setDialogOpen(false)
              toast.success('Avvik registrert')
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Tittel</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beskrivelse</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Plassering</Label>
              <Input id="location" name="location" placeholder="F.eks. Kjeller, rom 3" />
            </div>
            <DialogFooter>
              <Button type="submit">Registrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
