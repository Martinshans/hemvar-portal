import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { MOCK_TASKS } from '@/data/mock-tasks'
import { getCategoryLabel } from '@/data/ns3451-categories'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function TaskListPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS)
  const [statusFilter, setStatusFilter] = useState('alle')
  const [priorityFilter, setPriorityFilter] = useState('alle')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

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

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Bygningsdel:</span>
                  <p className="font-medium">{getCategoryLabel(selectedTask.ns3451Category)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ansvarlig:</span>
                  <p className="font-medium">{selectedTask.assignedTo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Frist:</span>
                  <p className="font-medium">{new Date(selectedTask.dueDate).toLocaleDateString('nb-NO')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1"><StatusBadge value={selectedTask.status} /></div>
                </div>
                <div>
                  <span className="text-muted-foreground">Prioritet:</span>
                  <div className="mt-1"><StatusBadge value={selectedTask.priority} type="severity" /></div>
                </div>
                <div>
                  <span className="text-muted-foreground">Gjentagende:</span>
                  <p className="font-medium">{selectedTask.recurring ? selectedTask.recurringInterval : 'Nei'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
