import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newDeviations: true,
    tasksDue: true,
    conditionExpiry: false,
    weeklySummary: true,
  })

  return (
    <div>
      <PageHeader title="Innstillinger" />

      <Tabs defaultValue="organisasjon">
        <TabsList className="mb-6">
          <TabsTrigger value="organisasjon">Organisasjon</TabsTrigger>
          <TabsTrigger value="varsler">Varsler</TabsTrigger>
          <TabsTrigger value="personvern">Personvern</TabsTrigger>
        </TabsList>

        <TabsContent value="organisasjon">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organisasjonsdetaljer</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success('Innstillinger lagret')
                }}
                className="space-y-4 max-w-lg"
              >
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organisasjonsnavn</Label>
                  <Input id="orgName" defaultValue="Solsiden Borettslag" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgNumber">Organisasjonsnummer</Label>
                  <Input id="orgNumber" defaultValue="123 456 789" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" defaultValue="Solsiden 1, 0160 Oslo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgType">Type</Label>
                  <Input id="orgType" defaultValue="Borettslag" disabled />
                </div>
                <Button type="submit">Lagre endringer</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="varsler">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">E-postvarsler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-lg">
                {[
                  { key: 'newDeviations', label: 'Nye avvik', desc: 'Få varsel når nye avvik blir registrert' },
                  { key: 'tasksDue', label: 'Oppgaver som forfaller', desc: 'Påminnelse om oppgaver som snart forfaller' },
                  { key: 'conditionExpiry', label: 'Tilstandsvurderinger utløper', desc: 'Varsel når vurderinger bør fornyes' },
                  { key: 'weeklySummary', label: 'Ukentlig sammendrag', desc: 'Motta en oppsummering hver mandag' },
                ].map((item) => (
                  <div key={item.key} className="flex items-start gap-3">
                    <Checkbox
                      id={item.key}
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                      }
                    />
                    <div>
                      <Label htmlFor={item.key} className="font-medium">
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
                <Button onClick={() => toast.success('Varselinnstillinger lagret')}>
                  Lagre innstillinger
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personvern">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personvern og GDPR</CardTitle>
            </CardHeader>
            <CardContent className="max-w-lg space-y-6">
              <p className="text-sm text-muted-foreground">
                Hemvar behandler personopplysninger i henhold til GDPR og den norske
                personopplysningsloven. Vi lagrer kun nødvendige data for å levere tjenesten.
              </p>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Last ned dine data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Du kan be om en kopi av alle data vi har lagret om deg.
                </p>
                <Button
                  variant="outline"
                  onClick={() => toast.success('Din data er klar for nedlasting')}
                >
                  Last ned mine data
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Slett konto</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Ved sletting fjernes alle dine personopplysninger permanent. Denne handlingen kan ikke angres.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => toast.error('Kontosletting er deaktivert i demomodus')}
                >
                  Slett min konto
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Dataoppbevaring</h4>
                <p className="text-sm text-muted-foreground">
                  Persondata lagres så lenge du har en aktiv konto. Dokumenter og FDV-data tilhører organisasjonen
                  og lagres i henhold til avtale. Ved oppsigelse av abonnement slettes persondata innen 30 dager.
                </p>
              </div>

              <a
                href="#"
                className="text-sm text-hemvar-600 hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Les full personvernerklæring
              </a>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
