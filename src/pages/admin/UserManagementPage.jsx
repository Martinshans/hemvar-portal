import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'

const ROLE_DESCRIPTIONS = [
  { role: 'Admin', description: 'Full tilgang til alle funksjoner', color: 'bg-purple-100 text-purple-700' },
  { role: 'Styreleder', description: 'Kan administrere oppgaver og avvik', color: 'bg-blue-100 text-blue-700' },
  { role: 'Styremedlem', description: 'Kan registrere og se oppgaver', color: 'bg-green-100 text-green-700' },
  { role: 'Beboer', description: 'Kun lesetilgang og avviksmelding', color: 'bg-gray-100 text-gray-700' },
]

const INITIAL_USERS = [
  { id: '1', name: 'Kari Nordmann', email: 'kari@solsiden-brl.no', role: 'Admin', status: 'Aktiv', lastLogin: '2026-03-23' },
  { id: '2', name: 'Ola Hansen', email: 'ola@solsiden-brl.no', role: 'Styreleder', status: 'Aktiv', lastLogin: '2026-03-22' },
  { id: '3', name: 'Per Johansen', email: 'per@solsiden-brl.no', role: 'Styremedlem', status: 'Aktiv', lastLogin: '2026-03-20' },
  { id: '4', name: 'Lisa Berg', email: 'lisa@solsiden-brl.no', role: 'Styremedlem', status: 'Aktiv', lastLogin: '2026-03-18' },
  { id: '5', name: 'Erik Dahl', email: 'erik@solsiden-brl.no', role: 'Beboer', status: 'Aktiv', lastLogin: '2026-03-15' },
  { id: '6', name: 'Anna Olsen', email: 'anna@solsiden-brl.no', role: 'Beboer', status: 'Inaktiv', lastLogin: '2026-01-10' },
]

export default function UserManagementPage() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [inviteOpen, setInviteOpen] = useState(false)

  const columns = [
    {
      header: 'Navn',
      accessorKey: 'name',
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: 'E-post',
      accessorKey: 'email',
      className: 'hidden sm:table-cell',
    },
    {
      header: 'Rolle',
      accessorKey: 'role',
      cell: (row) => {
        const rd = ROLE_DESCRIPTIONS.find((r) => r.role === row.role)
        return (
          <Badge variant="secondary" className={rd?.color}>
            {row.role}
          </Badge>
        )
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge
          variant="secondary"
          className={
            row.status === 'Aktiv'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Sist innlogget',
      accessorKey: 'lastLogin',
      className: 'hidden md:table-cell',
      cell: (row) => new Date(row.lastLogin).toLocaleDateString('nb-NO'),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Brukeradministrasjon"
        description="Administrer brukere og tilgangsnivåer"
        action={() => setInviteOpen(true)}
        actionLabel="Inviter bruker"
        actionIcon={UserPlus}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {ROLE_DESCRIPTIONS.map((rd) => (
          <Card key={rd.role}>
            <CardContent className="pt-4 pb-4">
              <Badge variant="secondary" className={rd.color + ' mb-2'}>
                {rd.role}
              </Badge>
              <p className="text-xs text-muted-foreground">{rd.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Søk etter brukere..."
      />

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inviter ny bruker</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.target)
              setUsers((prev) => [
                ...prev,
                {
                  id: String(Date.now()),
                  name: 'Ny bruker',
                  email: fd.get('email'),
                  role: fd.get('role') || 'Beboer',
                  status: 'Invitert',
                  lastLogin: '—',
                },
              ])
              setInviteOpen(false)
              toast.success('Invitasjon sendt')
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">E-postadresse</Label>
              <Input id="email" name="email" type="email" placeholder="navn@eksempel.no" required />
            </div>
            <div className="space-y-2">
              <Label>Rolle</Label>
              <Select name="role" defaultValue="Beboer">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Styreleder">Styreleder</SelectItem>
                  <SelectItem value="Styremedlem">Styremedlem</SelectItem>
                  <SelectItem value="Beboer">Beboer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Send invitasjon</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
