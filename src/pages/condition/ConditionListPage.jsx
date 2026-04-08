import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { TILSTANDSGRADER } from '@/data/ns3424-grades'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useMaintenance } from '@/context/MaintenanceContext'
import { useConditions } from '@/context/ConditionContext'

const TG_CARD_COLORS = [
  'border-green-200 bg-green-50 text-green-700',
  'border-yellow-200 bg-yellow-50 text-yellow-700',
  'border-orange-200 bg-orange-50 text-orange-700',
  'border-red-200 bg-red-50 text-red-700',
]

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear + i)

export default function ConditionListPage() {
  const { conditions, setConditions, addCondition, completeCondition } = useConditions()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCondition, setSelectedCondition] = useState(null)
  const [newTg, setNewTg] = useState(0)

  const [tiltakDialogOpen, setTiltakDialogOpen] = useState(false)
  const [tiltakYear, setTiltakYear] = useState(String(currentYear + 1))
  const [tiltakCost, setTiltakCost] = useState('')

  const { getByConditionId, addItem, updateItem } = useMaintenance()

  const columns = [
    {
      header: 'Bygningsdel',
      accessorKey: 'buildingPartLabel',
      cell: (row) => (
        <span className="font-medium">
          <span className="text-muted-foreground font-mono text-xs mr-2">{row.buildingPart}</span>
          {row.buildingPartLabel}
        </span>
      ),
    },
    {
      header: 'Tilstandsgrad',
      accessorKey: 'tg',
      cell: (row) => <StatusBadge value={row.tg} type="tg" />,
    },
    {
      header: 'Konsekvensgrad',
      accessorKey: 'kg',
      className: 'hidden sm:table-cell',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">KG {row.kg}</span>
      ),
    },
    {
      header: 'Vurdert dato',
      accessorKey: 'assessedDate',
      className: 'hidden md:table-cell',
      cell: (row) => new Date(row.assessedDate).toLocaleDateString('nb-NO'),
    },
    {
      header: 'Neste vurdering',
      accessorKey: 'nextAssessment',
      className: 'hidden lg:table-cell',
      cell: (row) => new Date(row.nextAssessment).toLocaleDateString('nb-NO'),
    },
    {
      header: 'Anbefalt tiltak',
      accessorKey: 'recommendedAction',
      className: 'hidden xl:table-cell',
      cell: (row) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {row.recommendedAction}
        </span>
      ),
    },
  ]

  const handleTiltakSubmit = () => {
    if (!selectedCondition) return

    const existingMaintenance = getByConditionId(selectedCondition.id)
    const cost = tiltakCost ? parseInt(tiltakCost, 10) : 0
    const year = parseInt(tiltakYear, 10)
    const today = new Date().toISOString().slice(0, 10)

    if (existingMaintenance) {
      updateItem(existingMaintenance.id, {
        plannedYear: year,
        estimatedCost: cost,
        status: 'gjennomført',
      })
    } else {
      addItem({
        id: `vedl-${Date.now()}`,
        title: `Vedlikehold: ${selectedCondition.buildingPartLabel}`,
        ns3451Category: selectedCondition.buildingPart,
        linkedConditionId: selectedCondition.id,
        estimatedCost: cost,
        plannedYear: year,
        priority: selectedCondition.tg >= 2 ? 'høy' : 'middels',
        status: 'gjennomført',
        description: selectedCondition.recommendedAction,
      })
    }

    completeCondition(selectedCondition.id, { completedDate: today, cost, year })

    setSelectedCondition(null)
    setTiltakDialogOpen(false)
    setTiltakCost('')
    setTiltakYear(String(currentYear + 1))
    toast.success('Tiltak gjennomført — flyttet til vedlikeholdshistorikk')
  }

  const linkedMaintenance = selectedCondition
    ? getByConditionId(selectedCondition.id)
    : null

  return (
    <div>
      <PageHeader
        title="Tilstandsvurdering (NS 3424)"
        description="Vurdering av byggets tilstand med tilstandsgrader og konsekvensgrader"
        action={() => setDialogOpen(true)}
        actionLabel="Ny vurdering"
        actionIcon={Plus}
      />

      <DataTable
        columns={columns}
        data={conditions}
        onRowClick={(row) => setSelectedCondition(row)}
        searchPlaceholder="Søk i vurderinger..."
      />

      {/* Detail sheet */}
      <Sheet open={!!selectedCondition} onOpenChange={() => setSelectedCondition(null)}>
        <SheetContent side="right" className="w-[90vw] sm:w-[40vw] sm:max-w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedCondition?.buildingPartLabel}</SheetTitle>
          </SheetHeader>
          {selectedCondition && (
            <div className="space-y-4 px-4 pb-6">
              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tilstandsgrad</h4>
                <div className="flex items-center gap-3">
                  <StatusBadge value={selectedCondition.tg} type="tg" />
                  <span className="text-sm text-muted-foreground">Konsekvensgrad: KG {selectedCondition.kg}</span>
                </div>
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Kontrollpunkt</h4>
                <p className="text-sm font-medium">{selectedCondition.buildingPartLabel}</p>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Vurdert av: {selectedCondition.assessedBy}</span>
                </div>
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Vurdering</h4>
                <p className="text-sm">{selectedCondition.description || <span className="text-muted-foreground">Ingen vurdering</span>}</p>
                <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Vurdert dato</span>
                    <p className="font-medium">{new Date(selectedCondition.assessedDate).toLocaleDateString('nb-NO')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Neste vurdering</span>
                    <p className="font-medium">{new Date(selectedCondition.nextAssessment).toLocaleDateString('nb-NO')}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Estimert kostnad</h4>
                {linkedMaintenance ? (
                  <p className="text-sm font-medium">
                    {linkedMaintenance.estimatedCost.toLocaleString('nb-NO')} kr
                    <span className="text-muted-foreground font-normal ml-2">
                      — planlagt {linkedMaintenance.plannedYear}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Ingen kostnad registrert</p>
                )}
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tiltaksbeskrivelse</h4>
                <p className="text-sm">{selectedCondition.recommendedAction || <span className="text-muted-foreground">Ingen tiltak beskrevet</span>}</p>
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Bilder</h4>
                <div className="flex items-center justify-center h-24 rounded-md border-2 border-dashed border-gray-200 text-sm text-muted-foreground">
                  Ingen bilder lastet opp
                </div>
              </div>

              {selectedCondition.history?.length > 0 && (
                <div className="rounded-lg border bg-gray-50/50 p-4">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Historikk</h4>
                  <div className="space-y-3">
                    {[...selectedCondition.history].reverse().map((entry, i) => (
                      <div key={i} className="rounded-md border bg-white p-3 text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusBadge value={entry.tg} type="tg" />
                            <span className="text-muted-foreground">KG {entry.kg}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Fullført {new Date(entry.completedDate).toLocaleDateString('nb-NO')}
                          </span>
                        </div>
                        {entry.description && <p className="text-muted-foreground mb-1">{entry.description}</p>}
                        {entry.recommendedAction && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Tiltak:</span> {entry.recommendedAction}
                          </p>
                        )}
                        {entry.completedCost > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">Kostnad:</span> {entry.completedCost.toLocaleString('nb-NO')} kr
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => {
                  if (linkedMaintenance) {
                    setTiltakYear(String(linkedMaintenance.plannedYear))
                    setTiltakCost(String(linkedMaintenance.estimatedCost))
                  } else {
                    setTiltakYear(String(currentYear + 1))
                    setTiltakCost('')
                  }
                  setTiltakDialogOpen(true)
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Tiltak gjennomført
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Tiltak gjennomført popup */}
      <Dialog open={tiltakDialogOpen} onOpenChange={setTiltakDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Planlegg neste tiltak</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Flytt <strong>{selectedCondition?.buildingPartLabel}</strong> fremover i vedlikeholdsplanen.
          </p>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Planlagt år</Label>
              <Select value={tiltakYear} onValueChange={setTiltakYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiltakCost">Estimert kostnad (kr)</Label>
              <Input
                id="tiltakCost"
                type="number"
                placeholder="F.eks. 500000"
                value={tiltakCost}
                onChange={(e) => setTiltakCost(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTiltakDialogOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleTiltakSubmit}>
              Bekreft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New assessment dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ny tilstandsvurdering</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.target)
              addCondition({
                id: `tilstand-${Date.now()}`,
                buildingPart: '26',
                buildingPartLabel: fd.get('buildingPart'),
                tg: newTg,
                kg: 1,
                description: fd.get('description'),
                assessedBy: 'Kari Nordmann',
                assessedDate: new Date().toISOString().slice(0, 10),
                nextAssessment: '2027-03-23',
                recommendedAction: fd.get('action'),
              })
              setDialogOpen(false)
              toast.success('Tilstandsvurdering registrert')
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="buildingPart">Bygningsdel</Label>
              <Input id="buildingPart" name="buildingPart" placeholder="F.eks. Yttertak" required />
            </div>
            <div className="space-y-2">
              <Label>Tilstandsgrad</Label>
              <div className="grid grid-cols-4 gap-2">
                {TILSTANDSGRADER.map((tg) => (
                  <button
                    key={tg.grade}
                    type="button"
                    onClick={() => setNewTg(tg.grade)}
                    className={cn(
                      'p-3 rounded-lg border-2 text-center transition-all',
                      newTg === tg.grade
                        ? TG_CARD_COLORS[tg.grade] + ' border-current'
                        : 'border-muted hover:border-gray-300'
                    )}
                  >
                    <p className="text-lg font-bold">{tg.grade}</p>
                    <p className="text-[10px]">{tg.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beskrivelse</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Anbefalt tiltak</Label>
              <Textarea id="action" name="action" />
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
