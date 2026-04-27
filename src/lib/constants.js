import {
  LayoutDashboard,
  Building2,
  FolderOpen,
  ClipboardList,
  CalendarDays,
  AlertTriangle,
  Clock,
  Search,
  Wrench,
  Settings,
  Users,
  CreditCard,
} from 'lucide-react'

export const NAV_ITEMS = [
  {
    label: 'Oversikt',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Eiendom',
    icon: Building2,
    children: [
      { label: 'Byggoversikt', path: '/eiendom/bygg' },
      { label: 'Bygningsdeler', path: '/eiendom/bygningsdeler' },
      { label: 'Dokumentarkiv', path: '/dokumenter' },
    ],
  },
  {
    label: 'Oppgaver',
    icon: ClipboardList,
    children: [
      { label: 'Alle oppgaver', path: '/oppgaver' },
      { label: 'Årshjul', path: '/oppgaver/arshjul' },
    ],
  },
  {
    label: 'Avvik',
    icon: AlertTriangle,
    children: [
      { label: 'Åpne avvik', path: '/avvik' },
      { label: 'Historikk', path: '/avvik/historikk' },
    ],
  },
  {
    label: 'Tilstand',
    icon: Search,
    children: [
      { label: 'Tilstandsanalyse', path: '/tilstand' },
      { label: 'Vedlikeholdsplan', path: '/vedlikehold' },
      { label: 'Vedlikeholdshistorikk', path: '/tilstand/historikk' },
    ],
  },
]

export const ADMIN_NAV_ITEMS = [
  { label: 'Profil', path: '/admin/innstillinger', icon: Settings },
  { label: 'Brukere', path: '/admin/brukere', icon: Users },
  { label: 'Abonnement', path: '/abonnement', icon: CreditCard },
]
