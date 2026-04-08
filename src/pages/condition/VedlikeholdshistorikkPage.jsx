import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CheckCircle2 } from 'lucide-react'
import { useConditions } from '@/context/ConditionContext'

export default function VedlikeholdshistorikkPage() {
  const { completedConditions } = useConditions()
  const [selected, setSelected] = useState(null)

  const columns = [
    {
      header: 'Bygningsdel',
      accessorKey: 'buildingPartLabel',
      cell: (row) => <span className="font-medium">{row.buildingPartLabel}</span>,
    },
    {
      header: 'Tidligere TG',
      accessorKey: 'previousTg',
      cell: (row) => <StatusBadge value={row.previousTg} type="tg" />,
    },
    {
      header: 'Fullført dato',
      accessorKey: 'completedDate',
      cell: (row) => new Date(row.completedDate).toLocaleDateString('nb-NO'),
    },
    {
      header: 'Kostnad',
      accessorKey: 'completedCost',
      cell: (row) => row.completedCost > 0
        ? `${row.completedCost.toLocaleString('nb-NO')} kr`
        : '—',
    },
    {
      header: 'Neste planlagt',
      accessorKey: 'nextPlannedYear',
      className: 'hidden sm:table-cell',
    },
    {
      header: 'Tiltak',
      accessorKey: 'previousAction',
      className: 'hidden lg:table-cell',
      cell: (row) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {row.previousAction}
        </span>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Vedlikeholdshistorikk"
        description="Oversikt over gjennomførte tiltak på bygningsdeler"
      />

      {completedConditions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Ingen gjennomførte tiltak ennå</p>
          <p className="text-xs mt-1">Bygningsdeler flyttes hit fra tilstandsanalysen når tiltak er gjennomført</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={completedConditions}
          onRowClick={(row) => setSelected(row)}
          searchPlaceholder="Søk i historikk..."
        />
      )}

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent side="right" className="w-[90vw] sm:w-[40vw] sm:max-w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selected?.buildingPartLabel}</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 px-4 pb-6">
              <div className="rounded-lg border bg-green-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Status</h4>
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Tiltak gjennomført {new Date(selected.completedDate).toLocaleDateString('nb-NO')}
                </div>
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tilstandsgrad ved gjennomføring</h4>
                <div className="flex items-center gap-3">
                  <StatusBadge value={selected.previousTg} type="tg" />
                  <span className="text-sm text-muted-foreground">KG {selected.previousKg}</span>
                </div>
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Vurdering</h4>
                <p className="text-sm">{selected.previousDescription}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Vurdert av: {selected.previousAssessedBy} — {new Date(selected.previousAssessedDate).toLocaleDateString('nb-NO')}
                </p>
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Kostnad</h4>
                <p className="text-sm font-medium">
                  {selected.completedCost > 0
                    ? `${selected.completedCost.toLocaleString('nb-NO')} kr`
                    : 'Ikke registrert'}
                </p>
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Gjennomført tiltak</h4>
                <p className="text-sm">{selected.previousAction}</p>
              </div>

              <div className="rounded-lg border bg-gray-50/50 p-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Neste planlagte tiltak</h4>
                <p className="text-sm font-medium">{selected.nextPlannedYear}</p>
              </div>

              {selected.history?.length > 0 && (
                <div className="rounded-lg border bg-gray-50/50 p-4">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Tidligere historikk</h4>
                  <div className="space-y-3">
                    {[...selected.history].reverse().map((entry, i) => (
                      <div key={i} className="rounded-md border bg-white p-3 text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusBadge value={entry.tg} type="tg" />
                            <span className="text-muted-foreground">KG {entry.kg}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.completedDate).toLocaleDateString('nb-NO')}
                          </span>
                        </div>
                        {entry.description && <p className="text-muted-foreground mb-1">{entry.description}</p>}
                        {entry.completedCost > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Kostnad: {entry.completedCost.toLocaleString('nb-NO')} kr
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
