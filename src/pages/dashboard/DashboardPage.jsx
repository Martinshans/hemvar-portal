import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/components/shared/StatusBadge'
import AnnualWheel from '@/components/shared/AnnualWheel'
import PageHeader from '@/components/shared/PageHeader'
import { MOCK_TASKS } from '@/data/mock-tasks'
import { MOCK_DEVIATIONS } from '@/data/mock-deviations'
import { MOCK_CONDITIONS } from '@/data/mock-conditions'
import { MOCK_DOCUMENTS } from '@/data/mock-documents'
import { getCategoryLabel } from '@/data/ns3451-categories'
import {
  ClipboardList, AlertTriangle, AlertOctagon, FolderOpen,
  Clock, User, CheckCircle, FileWarning
} from 'lucide-react'

const ACTIVITY_FEED = [
  { id: 1, icon: AlertTriangle, text: 'Kari Nordmann registrerte avvik: Fukt i kjellerbod', time: '2 timer siden', color: 'text-orange-500' },
  { id: 2, icon: CheckCircle, text: 'Oppgave fullført: Kontroll av nødlys og rømningsveier', time: '5 timer siden', color: 'text-green-500' },
  { id: 3, icon: FileWarning, text: 'Ola Hansen rapporterte: Løs takstein på vestside', time: 'I går', color: 'text-red-500' },
  { id: 4, icon: FolderOpen, text: 'Nytt dokument: Styremøtereferat mars 2026', time: 'I går', color: 'text-blue-500' },
  { id: 5, icon: ClipboardList, text: 'Ny oppgave opprettet: Sjekk av takrenner og nedløp', time: '2 dager siden', color: 'text-gray-500' },
  { id: 6, icon: User, text: 'Per Johansen oppdaterte avvik: Heisdør lukker ikke', time: '3 dager siden', color: 'text-purple-500' },
  { id: 7, icon: CheckCircle, text: 'Avvik lukket: Brannslukningsapparat utgått', time: '4 dager siden', color: 'text-green-500' },
  { id: 8, icon: ClipboardList, text: 'Oppgave startet: Inspeksjon av ventilasjonsanlegg', time: '1 uke siden', color: 'text-blue-500' },
]

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(null)

  const activeTasks = MOCK_TASKS.filter((t) => t.status !== 'fullført').length
  const openDeviations = MOCK_DEVIATIONS.filter((d) => d.status !== 'lukket').length
  const criticalConditions = MOCK_CONDITIONS.filter((c) => c.tg === 3).length
  const totalDocs = MOCK_DOCUMENTS.length

  const upcomingTasks = [...MOCK_TASKS]
    .filter((t) => t.status !== 'fullført')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const stats = [
    { label: 'Aktive oppgaver', value: activeTasks, icon: ClipboardList, color: 'text-blue-600 bg-blue-50' },
    { label: 'Åpne avvik', value: openDeviations, icon: AlertTriangle, color: 'text-orange-600 bg-orange-50' },
    { label: 'Kritisk tilstand (TG 3)', value: criticalConditions, icon: AlertOctagon, color: 'text-red-600 bg-red-50' },
    { label: 'Dokumenter', value: totalDocs, icon: FolderOpen, color: 'text-green-600 bg-green-50' },
  ]

  return (
    <div>
      <PageHeader
        title="Oversikt"
        description="Solsiden Borettslag — Dashboard"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Årshjul — Driftsoppgaver</CardTitle>
          </CardHeader>
          <CardContent>
            <AnnualWheel
              tasks={MOCK_TASKS}
              selectedMonth={selectedMonth}
              onMonthClick={(m) =>
                setSelectedMonth(selectedMonth === m ? null : m)
              }
            />
            {selectedMonth && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">
                  Oppgaver i{' '}
                  {new Date(2026, selectedMonth - 1).toLocaleString('nb-NO', {
                    month: 'long',
                  })}
                  :
                </p>
                <div className="space-y-2">
                  {MOCK_TASKS.filter(
                    (t) => t.monthDue === selectedMonth
                  ).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{t.title}</span>
                      <StatusBadge value={t.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Siste aktivitet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ACTIVITY_FEED.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className={`mt-0.5 ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kommende oppgaver</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Oppgave</th>
                  <th className="pb-3 font-medium text-muted-foreground hidden sm:table-cell">Kategori</th>
                  <th className="pb-3 font-medium text-muted-foreground hidden md:table-cell">Ansvarlig</th>
                  <th className="pb-3 font-medium text-muted-foreground">Frist</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTasks.map((task) => (
                  <tr key={task.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{task.title}</td>
                    <td className="py-3 hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(task.ns3451Category)}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell">
                      {task.assignedTo}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString('nb-NO')}
                      </div>
                    </td>
                    <td className="py-3">
                      <StatusBadge value={task.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
