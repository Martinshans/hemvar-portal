import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileNav({ open, onClose }) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="flex flex-row items-center gap-2 px-4 h-16 border-b border-border">
          <Building2 className="h-7 w-7 text-hemvar-600" />
          <SheetTitle className="font-semibold text-lg text-hemvar-900">
            Hemvar
          </SheetTitle>
        </SheetHeader>

        <nav className="py-4 px-2">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-hemvar-50 text-hemvar-700'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="px-3 mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Administrasjon
            </span>
          </div>
          <div className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-hemvar-50 text-hemvar-700'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
