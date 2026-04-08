import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { useMaintenance } from '@/context/MaintenanceContext'
import { getCategoryLabel } from '@/data/ns3451-categories'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const YEAR_COLORS = {
  '2': '#3b82f6',
  '3': '#10b981',
  '4': '#f59e0b',
  '6': '#ec4899',
  '7': '#06b6d4',
}

function formatNOK(amount) {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function MaintenancePlanPage() {
  const { items, addItem } = useMaintenance()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const years = Array.from({ length: 11 }, (_, i) => 2026 + i)
  const totalCost = items.reduce((sum, i) => sum + i.estimatedCost, 0)

  const costByYear = {}
  items.forEach((item) => {
    costByYear[item.plannedYear] = (costByYear[item.plannedYear] || 0) + item.estimatedCost
  })

  const maxYearCost = Math.max(...Object.values(costByYear), 1)

  const columns = [
    {
      header: 'Tiltak',
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
      header: 'Planlagt år',
      accessorKey: 'plannedYear',
    },
    {
      header: 'Estimert kostnad',
      accessorKey: 'estimatedCost',
      cell: (row) => formatNOK(row.estimatedCost),
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
        title="Vedlikeholdsplan"
        description={`Langsiktig vedlikeholdsplan — Totalt estimert: ${formatNOK(totalCost)}`}
        action={() => setDialogOpen(true)}
        actionLabel="Nytt tiltak"
        actionIcon={Plus}
      />

      <Tabs defaultValue="tidslinje">
        <TabsList className="mb-4">
          <TabsTrigger value="tidslinje">Tidslinje</TabsTrigger>
          <TabsTrigger value="liste">Listevisning</TabsTrigger>
        </TabsList>

        <TabsContent value="tidslinje">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {years.map((year) => {
                  const yearItems = items.filter((i) => i.plannedYear === year)
                  const yearCost = costByYear[year] || 0
                  const barWidth = (yearCost / maxYearCost) * 100

                  return (
                    <div key={year} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-12 shrink-0">
                        {year}
                      </span>
                      <div className="flex-1">
                        {yearCost > 0 ? (
                          <div className="space-y-1">
                            <div
                              className="h-8 rounded flex items-center px-3 transition-all"
                              style={{
                                width: `${Math.max(barWidth, 8)}%`,
                                backgroundColor:
                                  YEAR_COLORS[
                                    yearItems[0]?.ns3451Category?.[0]
                                  ] || '#94a3b8',
                                opacity: 0.8,
                              }}
                            >
                              <span className="text-xs text-white font-medium truncate">
                                {yearItems.map((i) => i.title).join(', ')}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              {yearItems.map((item) => (
                                <Badge
                                  key={item.id}
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {item.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="h-8 flex items-center">
                            <span className="text-xs text-muted-foreground">
                              Ingen planlagte tiltak
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground w-28 text-right shrink-0">
                        {yearCost > 0 ? formatNOK(yearCost) : '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 pt-4 border-t flex justify-between text-sm font-medium">
                <span>Total estimert kostnad</span>
                <span>{formatNOK(totalCost)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liste">
          <DataTable
            columns={columns}
            data={items}
            onRowClick={(row) => setSelectedItem(row)}
            searchPlaceholder="Søk i vedlikeholdsplan..."
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Bygningsdel:</span>
                  <p className="font-medium">{getCategoryLabel(selectedItem.ns3451Category)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Planlagt år:</span>
                  <p className="font-medium">{selectedItem.plannedYear}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Estimert kostnad:</span>
                  <p className="font-medium">{formatNOK(selectedItem.estimatedCost)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1"><StatusBadge value={selectedItem.status} /></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nytt vedlikeholdstiltak</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.target)
              addItem({
                id: `vedl-${Date.now()}`,
                title: fd.get('title'),
                ns3451Category: '26',
                linkedConditionId: null,
                estimatedCost: Number(fd.get('cost')) || 0,
                plannedYear: Number(fd.get('year')) || 2027,
                priority: 'middels',
                status: 'planlagt',
                description: fd.get('description'),
              })
              setDialogOpen(false)
              toast.success('Vedlikeholdstiltak opprettet')
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Tittel</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cost">Estimert kostnad (NOK)</Label>
                <Input id="cost" name="cost" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Planlagt år</Label>
                <Input id="year" name="year" type="number" min="2026" max="2040" defaultValue="2027" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beskrivelse</Label>
              <Textarea id="description" name="description" />
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
