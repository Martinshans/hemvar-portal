import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Building2 } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    orgType: '',
  })
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    register(form)
    navigate('/dashboard')
  }

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-hemvar-900 text-white flex-col justify-center items-center p-12">
        <Building2 className="h-16 w-16 mb-6 text-hemvar-400" />
        <h1 className="text-4xl font-bold mb-4">Hemvar</h1>
        <p className="text-hemvar-100 text-lg text-center max-w-md">
          Kom i gang med digital FDV for ditt borettslag eller sameie.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2 lg:hidden">
              <Building2 className="h-8 w-8 text-hemvar-600" />
              <span className="font-bold text-xl text-hemvar-900">Hemvar</span>
            </div>
            <CardTitle className="text-2xl">Opprett konto</CardTitle>
            <CardDescription>
              Fyll inn informasjonen under for å komme i gang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Fornavn</Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Etternavn</Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-postadresse</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="navn@eksempel.no"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passord</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bekreft passord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organisasjonsnavn</Label>
                <Input
                  id="organization"
                  placeholder="F.eks. Solsiden Borettslag"
                  value={form.organization}
                  onChange={(e) => update('organization', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type organisasjon</Label>
                <Select onValueChange={(v) => update('orgType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borettslag">Borettslag</SelectItem>
                    <SelectItem value="sameie">Sameie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm font-normal">
                  Jeg godtar vilkårene og personvernerklæringen
                </Label>
              </div>
              <Button type="submit" className="w-full">
                Opprett konto
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Har du allerede en konto?{' '}
              <Link to="/logg-inn" className="text-hemvar-600 hover:underline">
                Logg inn
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
