import PageHeader from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Basis',
    price: '990',
    description: 'For små borettslag',
    features: ['Inntil 20 enheter', 'Dashboard og årshjul', 'Oppgaveregister', 'Dokumentarkiv', 'E-poststøtte'],
    current: false,
  },
  {
    name: 'Pluss',
    price: '1 990',
    description: 'For mellomstore borettslag',
    features: ['Inntil 100 enheter', 'Alt i Basis', 'Avviksregistrering', 'Tilstandsvurdering', 'Vedlikeholdsplan', 'Prioritert støtte'],
    current: true,
  },
  {
    name: 'Premium',
    price: '3 990',
    description: 'For store sameier og borettslag',
    features: ['Ubegrenset enheter', 'Alt i Pluss', 'Adminpanel', 'API-tilgang', 'Dedikert kontaktperson', 'Tilpasset onboarding'],
    current: false,
  },
]

const INVOICES = [
  { id: 'INV-2026-03', date: '01.03.2026', amount: 'kr 1 990', status: 'Betalt' },
  { id: 'INV-2026-02', date: '01.02.2026', amount: 'kr 1 990', status: 'Betalt' },
  { id: 'INV-2026-01', date: '01.01.2026', amount: 'kr 1 990', status: 'Betalt' },
  { id: 'INV-2025-12', date: '01.12.2025', amount: 'kr 1 990', status: 'Betalt' },
]

export default function SubscriptionPage() {
  return (
    <div>
      <PageHeader
        title="Abonnement"
        description="Administrer ditt abonnement og fakturering"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              'relative',
              plan.current && 'border-hemvar-600 border-2'
            )}
          >
            {plan.current && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hemvar-600">
                Nåværende plan
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">kr {plan.price}</span>
                <span className="text-muted-foreground"> / mnd</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.current ? 'outline' : 'default'}
                disabled={plan.current}
              >
                {plan.current ? 'Aktiv' : 'Oppgrader'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Betalingsmetode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-6 text-center text-muted-foreground">
            <p className="text-sm">
              Betaling håndteres via faktura med KID-nummer.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Faktureringshistorikk</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Faktura</th>
                  <th className="pb-3 font-medium text-muted-foreground">Dato</th>
                  <th className="pb-3 font-medium text-muted-foreground">Beløp</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{inv.id}</td>
                    <td className="py-3 text-muted-foreground">{inv.date}</td>
                    <td className="py-3">{inv.amount}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {inv.status}
                      </Badge>
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
