import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { MOCK_TASKS } from '@/data/mock-tasks'
import { getCategoryLabel } from '@/data/ns3451-categories'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useDeviations } from '@/context/DeviationContext'

export default function TaskListPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS)
  const [statusFilter, setStatusFilter] = useState('alle')
  const [priorityFilter, setPriorityFilter] = useState('alle')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // Avvik registration
  const [avvikDialogOpen, setAvvikDialogOpen] = useState(false)
  const [avvikDescription, setAvvikDescription] = useState('')
  const [avvikSeverity, setAvvikSeverity] = useState('middels')

  const { addDeviation } = useDeviations()

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'alle' && t.status !== statusFilter) return false
    if (priorityFilter !== 'alle' && t.priority !== priorityFilter) return false
    return true
  })

  const columns = [
    {
      header: 'Oppgave',
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
      header: 'Ansvarlig',
      accessorKey: 'assignedTo',
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Frist',
      accessorKey: 'dueDate',
      cell: (row) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(row.dueDate).toLocaleDateString('nb-NO')}
        </div>
      ),
    },
    {
      header: 'Prioritet',
      accessorKey: 'priority',
      className: 'hidden sm:table-cell',
      cell: (row) => <StatusBadge value={row.priority} type="severity" />,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge value={row.status} />,
    },
  ]

  const handleMarkChecked = () => {
    if (!selectedTask) return
    setTasks((prev) =>
      prev.map((t) => t.id === selectedTask.id ? { ...t, status: 'fullført' } : t)
    )
    setSelectedTask(null)
    toast.success('Oppgave merket som sjekket')
  }

  const handleRegisterAvvik = () => {
    if (!selectedTask) return

    addDeviation({
      id: `avvik-${Date.now()}`,
      title: `Avvik: ${selectedTask.title}`,
      description: avvikDescription || selectedTask.description,
      ns3451Category: selectedTask.ns3451Category,
      severity: avvikSeverity,
      status: 'åpent',
      reportedBy: 'Kari Nordmann',
      reportedDate: new Date().toISOString().slice(0, 10),
      location: getCategoryLabel(selectedTask.ns3451Category),
      actions: [],
      closedDate: null,
    })

    // Mark task as having deviation
    setTasks((prev) =>
      prev.map((t) => t.id === selectedTask.id ? { ...t, status: 'forfalt' } : t)
    )

    setAvvikDialogOpen(false)
    setAvvikDescription('')
    setAvvikSeverity('middels')
    setSelectedTask(null)
    toast.success('Avvik registrert — oppgaven er flyttet til åpne avvik')
  }

  return (
    <div>
      <PageHeader
        title="Oppgaver"
        description="Oversikt over driftsoppgaver og vedlikeholdsaktiviteter"
        action={() => setDialogOpen(true)}
        actionLabel="Ny oppgave"
        actionIcon={Plus}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle statuser</SelectItem>
            <SelectItem value="planlagt">Planlagt</SelectItem>
            <SelectItem value="pågående">Pågående</SelectItem>
            <SelectItem value="fullført">Fullført</SelectItem>
            <SelectItem value="forfalt">Forfalt</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle prioriteter</SelectItem>
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
        onRowClick={(row) => setSelectedTask(row)}
        searchPlaceholder="Søk i oppgaver..."
      />

      {/* Task detail sheet */}
      <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <SheetContent side="right" className="w-[90vw] sm:w-[40vw] sm:max-w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedTask?.title}</SheetTitle>
          </SheetHeader>
          {selectedTask && (
            <div className="space-y-4 px-4 pb-6">
              {/* Status */}
              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Status</h4>
                <div className="flex items-center gap-3">
                  <StatusBadge value={selectedTask.status} />
                  <StatusBadge value={selectedTask.priority} type="severity" />
                </div>
              </div>

              {/* Beskrivelse */}
              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Beskrivelse</h4>
                <p className="text-sm">{selectedTask.description || <span className="text-muted-foreground">Ingen beskrivelse</span>}</p>
              </div>

              {/* Detaljer */}
              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Detaljer</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Bygningsdel</span>
                    <p className="font-medium">{getCategoryLabel(selectedTask.ns3451Category)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ansvarlig</span>
                    <p className="font-medium">{selectedTask.assignedTo}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frist</span>
                    <p className="font-medium">{new Date(selectedTask.dueDate).toLocaleDateString('nb-NO')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gjentagende</span>
                    <p className="font-medium">{selectedTask.recurring ? selectedTask.recurringInterval : 'Nei'}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {selectedTask.status !== 'fullført' && (
                <div className="space-y-3 pt-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleMarkChecked}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Sjekket / Utbedret
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => {
                      setAvvikDescription('')
                      setAvvikSeverity('middels')
                      setAvvikDialogOpen(true)
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Registrer avvik
                  </Button>
                </div>
              )}

              {selectedTask.status === 'fullført' && (
                <div className="rounded-lg border bg-green-50 p-4 flex items-center gap-2 text-sm font-medium text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Oppgave fullført
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Avvik registration popup */}
      <Dialog open={avvikDialogOpen} onOpenChange={setAvvikDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Registrer avvik</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Registrer avvik for <strong>{selectedTask?.title}</strong>
          </p>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Beskrivelse av avviket</Label>
              <Textarea
                placeholder="Beskriv hva som er galt..."
                value={avvikDescription}
                onChange={(e) => setAvvikDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Alvorlighetsgrad</Label>
              <Select value={avvikSeverity} onValueChange={setAvvikSeverity}>
                <SelectTrigger>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvvikDialogOpen(false)}>
              Avbryt
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleRegisterAvvik}>
              Registrer avvik
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New task dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ny oppgave</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.target)
              setTasks((prev) => [
                {
                  id: `task-${Date.now()}`,
                  title: fd.get('title'),
                  description: fd.get('description'),
                  ns3451Category: '26',
                  status: 'planlagt',
                  priority: 'middels',
                  assignedTo: 'Kari Nordmann',
                  dueDate: fd.get('dueDate'),
                  createdAt: new Date().toISOString().slice(0, 10),
                  recurring: false,
                  monthDue: new Date(fd.get('dueDate')).getMonth() + 1,
                },
                ...prev,
              ])
              setDialogOpen(false)
              toast.success('Oppgave opprettet')
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
              <Label htmlFor="dueDate">Frist</Label>
              <Input id="dueDate" name="dueDate" type="date" required />
            </div>
            <DialogFooter>
              <Button type="submit">Opprett</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
