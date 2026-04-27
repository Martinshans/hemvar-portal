import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import { NS3451_CATEGORIES, getCategoryLabel, getMainCategory } from '@/data/ns3451-categories'
import { MOCK_TASKS } from '@/data/mock-tasks'
import { MOCK_DOCUMENTS } from '@/data/mock-documents'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, ClipboardList, AlertTriangle, FileText, Wrench,
  Activity, Clock, Download, CheckCircle2, Plus
} from 'lucide-react'
import { useConditions } from '@/context/ConditionContext'
import { useDeviations } from '@/context/DeviationContext'
import { useMaintenance } from '@/context/MaintenanceContext'
import { cn } from '@/lib/utils'

export default function BygningsdelDetailPage() {
  const { code } = useParams()
  const navigate = useNavigate()

  const { conditions } = useConditions()
  const { deviations } = useDeviations()
  const { items: maintenanceItems } = useMaintenance()

  const label = getCategoryLabel(code)
  const mainCategory = getMainCategory(code)

  // Aggregate all data for this building part
  const condition = conditions.find((c) => c.buildingPart === code)
  const tasks = MOCK_TASKS.filter((t) => t.ns3451Category === code)
  const deviationsForPart = deviations.filter((d) => d.ns3451Category === code)
  const documents = MOCK_DOCUMENTS.filter((d) => d.ns3451Category === code)
  const maintenance = maintenanceItems.filter((m) => m.ns3451Category === code)

  const openDeviations = deviationsForPart.filter((d) => d.status !== 'lukket')

  return (
    <div>
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/eiendom/bygningsdeler')}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Tilbake til bygningsdeler
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {code}
          </span>
          <h1 className="text-2xl font-semibold">{label}</h1>
        </div>
        {mainCategory && (
          <p className="text-sm text-muted-foreground">
            Hovedkategori: {mainCategory.code} {mainCategory.label}
          </p>
        )}
      </div>

      {/* Summary cards — at a glance */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Activity className="h-3.5 w-3.5" />
              Tilstand
            </div>
            {condition ? (
              <div className="flex items-center gap-2">
                <StatusBadge value={condition.tg} type="tg" />
                <span className="text-xs text-muted-foreground">KG {condition.kg}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Ikke vurdert</span>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <ClipboardList className="h-3.5 w-3.5" />
              Oppgaver
            </div>
            <p className="text-2xl font-semibold">{tasks.length}</p>
          </CardContent>
        </Card>
        <Card className={cn('bg-white', openDeviations.length > 0 && 'border-orange-300')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Åpne avvik
            </div>
            <p className={cn('text-2xl font-semibold', openDeviations.length > 0 && 'text-orange-600')}>
              {openDeviations.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <FileText className="h-3.5 w-3.5" />
              Dokumenter
            </div>
            <p className="text-2xl font-semibold">{documents.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Wrench className="h-3.5 w-3.5" />
              Vedlikeholdstiltak
            </div>
            <p className="text-2xl font-semibold">{maintenance.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tilstand">
        <TabsList>
          <TabsTrigger value="tilstand">Tilstand</TabsTrigger>
          <TabsTrigger value="oppgaver">Oppgaver ({tasks.length})</TabsTrigger>
          <TabsTrigger value="avvik">Avvik ({deviationsForPart.length})</TabsTrigger>
          <TabsTrigger value="dokumenter">Dokumenter ({documents.length})</TabsTrigger>
          <TabsTrigger value="vedlikehold">Vedlikehold ({maintenance.length})</TabsTrigger>
        </TabsList>

        {/* TILSTAND */}
        <TabsContent value="tilstand" className="mt-4">
          {condition ? (
            <Card className="bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge value={condition.tg} type="tg" />
                      <span className="text-sm text-muted-foreground">
                        Konsekvensgrad: KG {condition.kg}
                      </span>
                    </div>
                    <p className="text-sm">{condition.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/tilstand')}
                  >
                    Se i tilstandsvurdering
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Vurdert av</span>
                    <p className="font-medium mt-0.5">{condition.assessedBy}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Vurdert dato</span>
                    <p className="font-medium mt-0.5">
                      {new Date(condition.assessedDate).toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Neste vurdering</span>
                    <p className="font-medium mt-0.5">
                      {new Date(condition.nextAssessment).toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Anbefalt tiltak</span>
                    <p className="font-medium mt-0.5">{condition.recommendedAction}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={Activity}
              title="Ingen tilstandsvurdering"
              description="Denne bygningsdelen har ikke fått noen tilstandsvurdering ennå."
              action="Gå til tilstandsvurdering"
              onAction={() => navigate('/tilstand')}
            />
          )}
        </TabsContent>

        {/* OPPGAVER */}
        <TabsContent value="oppgaver" className="mt-4">
          {tasks.length > 0 ? (
            <Card className="bg-white">
              <CardContent className="p-0">
                <div className="divide-y">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer"
                      onClick={() => navigate('/oppgaver')}
                    >
                      <ClipboardList className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString('nb-NO')}
                          <span>•</span>
                          <span>{task.assignedTo}</span>
                        </div>
                      </div>
                      <StatusBadge value={task.priority} type="severity" />
                      <StatusBadge value={task.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Ingen oppgaver"
              description="Det er ikke registrert noen oppgaver på denne bygningsdelen."
              action="Opprett oppgave"
              onAction={() => navigate('/oppgaver')}
            />
          )}
        </TabsContent>

        {/* AVVIK */}
        <TabsContent value="avvik" className="mt-4">
          {deviationsForPart.length > 0 ? (
            <Card className="bg-white">
              <CardContent className="p-0">
                <div className="divide-y">
                  {deviationsForPart.map((dev) => (
                    <div
                      key={dev.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer"
                      onClick={() => navigate('/avvik')}
                    >
                      <AlertTriangle className={cn(
                        'h-4 w-4 shrink-0',
                        dev.status === 'lukket' ? 'text-green-500' : 'text-orange-500'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{dev.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{dev.location}</span>
                          <span>•</span>
                          <span>{new Date(dev.reportedDate).toLocaleDateString('nb-NO')}</span>
                        </div>
                      </div>
                      <StatusBadge value={dev.severity} type="severity" />
                      <StatusBadge value={dev.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={AlertTriangle}
              title="Ingen avvik"
              description="Det er ikke registrert noen avvik på denne bygningsdelen."
              action="Registrer avvik"
              onAction={() => navigate('/avvik')}
            />
          )}
        </TabsContent>

        {/* DOKUMENTER */}
        <TabsContent value="dokumenter" className="mt-4">
          {documents.length > 0 ? (
            <Card className="bg-white">
              <CardContent className="p-0">
                <div className="divide-y">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.uploadedBy}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadedDate).toLocaleDateString('nb-NO')}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs uppercase">{doc.type}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={FileText}
              title="Ingen dokumenter"
              description="Det er ikke lastet opp noen dokumenter for denne bygningsdelen."
              action="Last opp dokument"
              onAction={() => navigate('/dokumenter')}
            />
          )}
        </TabsContent>

        {/* VEDLIKEHOLD */}
        <TabsContent value="vedlikehold" className="mt-4">
          {maintenance.length > 0 ? (
            <Card className="bg-white">
              <CardContent className="p-0">
                <div className="divide-y">
                  {maintenance.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer"
                      onClick={() => navigate('/vedlikehold')}
                    >
                      <Wrench className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>Planlagt {m.plannedYear}</span>
                          <span>•</span>
                          <span>{m.estimatedCost.toLocaleString('nb-NO')} kr</span>
                        </div>
                      </div>
                      <StatusBadge value={m.priority} type="severity" />
                      <StatusBadge value={m.status} />
                    </div>
                  ))}
                </div>

                {condition && (
                  <div className="p-4 bg-hemvar-50/30 border-t">
                    <p className="text-xs text-muted-foreground mb-2">
                      💡 Tilstandsdata fra denne bygningsdelen (TG {condition.tg}) danner grunnlaget for vedlikeholdstiltakene.
                    </p>
                    <Button size="sm" variant="outline" disabled>
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Start prosjektering (v2.0)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={Wrench}
              title="Ingen vedlikeholdstiltak"
              description="Det er ikke planlagt noen vedlikeholdstiltak for denne bygningsdelen."
              action="Gå til vedlikeholdsplan"
              onAction={() => navigate('/vedlikehold')}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <Card className="bg-white">
      <CardContent className="p-12 text-center">
        <Icon className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-medium mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">{description}</p>
        {action && (
          <Button variant="outline" size="sm" onClick={onAction}>
            {action}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
