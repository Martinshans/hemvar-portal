import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_STYLES = {
  planlagt: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  pågående: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  fullført: 'bg-green-100 text-green-700 hover:bg-green-100',
  forfalt: 'bg-red-100 text-red-700 hover:bg-red-100',
  åpent: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  under_behandling: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  lukket: 'bg-green-100 text-green-700 hover:bg-green-100',
  budsjettert: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  bestilt: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100',
  gjennomført: 'bg-green-100 text-green-700 hover:bg-green-100',
}

const SEVERITY_STYLES = {
  lav: 'bg-green-100 text-green-700 hover:bg-green-100',
  middels: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  høy: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  kritisk: 'bg-red-100 text-red-700 hover:bg-red-100',
}

const TG_STYLES = {
  0: 'bg-green-100 text-green-700 hover:bg-green-100',
  1: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  2: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  3: 'bg-red-100 text-red-700 hover:bg-red-100',
}

export default function StatusBadge({ value, type = 'status' }) {
  const styles =
    type === 'severity'
      ? SEVERITY_STYLES
      : type === 'tg'
        ? TG_STYLES
        : STATUS_STYLES

  const label =
    type === 'tg' ? `TG ${value}` : String(value).replace('_', ' ')

  return (
    <Badge variant="secondary" className={cn('font-medium capitalize', styles[value])}>
      {label}
    </Badge>
  )
}
