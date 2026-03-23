import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, ChevronRight, ChevronDown, Building2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

function NavGroup({ item, collapsed }) {
  const location = useLocation()
  const isChildActive = item.children?.some((child) => location.pathname.startsWith(child.path))
  const [open, setOpen] = useState(isChildActive)

  // Auto-open when a child route becomes active
  useEffect(() => {
    if (isChildActive) setOpen(true)
  }, [isChildActive])

  // Simple top-level link (no children)
  if (!item.children) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-hemvar-50 text-hemvar-700'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )
        }
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </NavLink>
    )
  }

  // Collapsed: just show icon, highlight if child active
  if (collapsed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-md px-3 py-2 transition-colors cursor-pointer',
          isChildActive
            ? 'bg-hemvar-50 text-hemvar-700'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
        title={item.label}
      >
        <item.icon className="h-4 w-4" />
      </div>
    )
  }

  // Expanded: collapsible group
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full',
          isChildActive
            ? 'text-hemvar-700'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform text-muted-foreground',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="ml-4 pl-3 border-l border-border space-y-0.5 mt-0.5 mb-1">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-hemvar-50 text-hemvar-700 font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-white border-r border-border h-screen transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
        <Building2 className="h-7 w-7 text-hemvar-600 shrink-0" />
        {!collapsed && (
          <span className="font-semibold text-lg text-hemvar-900">Hemvar</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavGroup key={item.label} item={item} collapsed={collapsed} />
          ))}
        </div>

        <Separator className="my-4" />

        <div className="px-3 mb-2">
          {!collapsed && (
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Innstillinger
            </span>
          )}
        </div>
        <div className="space-y-0.5">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-hemvar-50 text-hemvar-700'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full rounded-md py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
