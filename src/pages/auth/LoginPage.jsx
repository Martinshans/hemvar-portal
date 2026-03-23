import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-hemvar-900 text-white flex-col justify-center items-center p-12">
        <Building2 className="h-16 w-16 mb-6 text-hemvar-400" />
        <h1 className="text-4xl font-bold mb-4">Hemvar</h1>
        <p className="text-hemvar-100 text-lg text-center max-w-md">
          Digital FDV-portal for borettslag og sameier. Enkel oversikt over styrearbeidet.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2 lg:hidden">
              <Building2 className="h-8 w-8 text-hemvar-600" />
              <span className="font-bold text-xl text-hemvar-900">Hemvar</span>
            </div>
            <CardTitle className="text-2xl">Logg inn</CardTitle>
            <CardDescription>
              Skriv inn dine opplysninger for å logge inn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-postadresse</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="navn@eksempel.no"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Skriv inn passord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Husk meg
                  </Label>
                </div>
                <Link
                  to="/glemt-passord"
                  className="text-sm text-hemvar-600 hover:underline"
                >
                  Glemt passord?
                </Link>
              </div>
              <Button type="submit" className="w-full">
                Logg inn
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Har du ikke konto?{' '}
              <Link to="/registrer" className="text-hemvar-600 hover:underline">
                Registrer deg
              </Link>
            </p>
            <div className="mt-4 p-3 rounded-md bg-muted text-xs text-muted-foreground">
              <p className="font-medium mb-1">Testbrukere:</p>
              <p>admin@hemvar.no / admin123</p>
              <p>bruker@hemvar.no / bruker123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
