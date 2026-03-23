import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { MOCK_CONDITIONS } from '@/data/mock-conditions'
import { TILSTANDSGRADER } from '@/data/ns3424-grades'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const TG_CARD_COLORS = [
  'border-green-200 bg-green-50 text-green-700',
  'border-yellow-200 bg-yellow-50 text-yellow-700',
  'border-orange-200 bg-orange-50 text-orange-700',
  'border-red-200 bg-red-50 text-red-700',
]

export default function ConditionListPage() {
  const [conditions, setConditions] = useState(MOCK_CONDITIONS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCondition, setSelectedCondition] = useState(null)
  const [newTg, setNewTg] = useState(0)

  const tgCounts = [0, 1, 2, 3].map(
    (g) => conditions.filter((c) => c.tg === g).length
  )

  const columns = [
    {
      header: 'Bygningsdel',
      accessorKey: 'buildingPartLabel',
      cell: (row) => <span className="font-medium">{row.buildingPartLabel}</span>,
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

  return (
    <div>
      <PageHeader
        title="Tilstandsvurdering (NS 3424)"
        description="Vurdering av byggets tilstand med tilstandsgrader og konsekvensgrader"
        action={() => setDialogOpen(true)}
        actionLabel="Ny vurdering"
        actionIcon={Plus}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {TILSTANDSGRADER.map((tg, i) => (
          <Card key={tg.grade} className={cn('border', TG_CARD_COLORS[i])}>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{tgCounts[i]}</p>
              <p className="text-sm font-medium">{tg.label}</p>
              <p className="text-xs opacity-75 mt-0.5">{tg.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={conditions}
        onRowClick={(row) => setSelectedCondition(row)}
        searchPlaceholder="Søk i vurderinger..."
      />

      <Dialog open={!!selectedCondition} onOpenChange={() => setSelectedCondition(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCondition?.buildingPartLabel}</DialogTitle>
          </DialogHeader>
          {selectedCondition && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <StatusBadge value={selectedCondition.tg} type="tg" />
                <span className="text-sm text-muted-foreground">KG {selectedCondition.kg}</span>
              </div>
              <p className="text-sm">{selectedCondition.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Vurdert av:</span>
                  <p className="font-medium">{selectedCondition.assessedBy}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Vurdert dato:</span>
                  <p className="font-medium">{new Date(selectedCondition.assessedDate).toLocaleDateString('nb-NO')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Neste vurdering:</span>
                  <p className="font-medium">{new Date(selectedCondition.nextAssessment).toLocaleDateString('nb-NO')}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Anbefalt tiltak:</span>
                <p className="text-sm font-medium mt-1">{selectedCondition.recommendedAction}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ny tilstandsvurdering</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.target)
              setConditions((prev) => [
                {
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
                },
                ...prev,
              ])
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
