import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import { MOCK_DOCUMENTS } from '@/data/mock-documents'
import { NS3451_CATEGORIES, getCategoryLabel } from '@/data/ns3451-categories'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  FolderOpen, FileText, FileSpreadsheet, File, Upload,
  Search, ChevronRight, ChevronDown, Trash2, Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const FILE_ICONS = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  jpg: File,
  png: File,
}

export default function DocumentArchivePage() {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [search, setSearch] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)

  const toggleExpanded = (code) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      next.has(code) ? next.delete(code) : next.add(code)
      return next
    })
  }

  const getDocCount = (code) =>
    documents.filter(
      (d) => d.ns3451Category === code || d.ns3451Category.startsWith(code)
    ).length

  const filteredDocs = documents.filter((d) => {
    if (selectedCategory) {
      const match =
        d.ns3451Category === selectedCategory ||
        d.ns3451Category.startsWith(selectedCategory)
      if (!match) return false
    }
    if (search) {
      return d.name.toLowerCase().includes(search.toLowerCase())
    }
    return true
  })

  return (
    <div>
      <PageHeader
        title="Dokumentarkiv"
        description="FDV-dokumenter organisert etter NS 3451"
        action={() => setUploadOpen(true)}
        actionLabel="Last opp"
        actionIcon={Upload}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <Card className="h-fit">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">
              Bygningsdeler (NS 3451)
            </h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm mb-1 transition-colors',
                !selectedCategory
                  ? 'bg-hemvar-50 text-hemvar-700 font-medium'
                  : 'hover:bg-muted text-muted-foreground'
              )}
            >
              <FolderOpen className="h-4 w-4" />
              Alle dokumenter
              <span className="ml-auto text-xs">{documents.length}</span>
            </button>

            {NS3451_CATEGORIES.map((cat) => (
              <div key={cat.code}>
                <button
                  onClick={() => {
                    toggleExpanded(cat.code)
                    setSelectedCategory(cat.code)
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors',
                    selectedCategory === cat.code
                      ? 'bg-hemvar-50 text-hemvar-700 font-medium'
                      : 'hover:bg-muted text-muted-foreground'
                  )}
                >
                  {expandedCategories.has(cat.code) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  <span>{cat.code} {cat.label}</span>
                  <span className="ml-auto text-xs">{getDocCount(cat.code)}</span>
                </button>

                {expandedCategories.has(cat.code) &&
                  cat.subcategories.map((sub) => (
                    <button
                      key={sub.code}
                      onClick={() => setSelectedCategory(sub.code)}
                      className={cn(
                        'w-full flex items-center gap-2 pl-7 pr-2 py-1 rounded text-xs transition-colors',
                        selectedCategory === sub.code
                          ? 'bg-hemvar-50 text-hemvar-700 font-medium'
                          : 'hover:bg-muted text-muted-foreground'
                      )}
                    >
                      {sub.code} {sub.label}
                      <span className="ml-auto">{getDocCount(sub.code)}</span>
                    </button>
                  ))}
              </div>
            ))}
          </CardContent>
        </Card>

        <div>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Søk i dokumenter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 max-w-sm bg-white"
            />
          </div>

          {filteredDocs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Ingen dokumenter funnet</p>
            </div>
          ) : (
            <div className="rounded-md border divide-y bg-white">
              {filteredDocs.map((doc) => {
                const Icon = FILE_ICONS[doc.type] || File
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.uploadedBy}</span>
                        <span>•</span>
                        <span>{new Date(doc.uploadedDate).toLocaleDateString('nb-NO')}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                      {getCategoryLabel(doc.ns3451Category)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs uppercase">
                      {doc.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-hemvar-700"
                      onClick={() => toast.success(`Laster ned ${doc.name}`)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500"
                      onClick={() => {
                        setDocuments((prev) => prev.filter((d) => d.id !== doc.id))
                        toast.success('Dokument slettet')
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Last opp dokument</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.target)
              setDocuments((prev) => [
                {
                  id: `doc-${Date.now()}`,
                  name: fd.get('name'),
                  ns3451Category: '2',
                  type: 'pdf',
                  size: '1.0 MB',
                  uploadedBy: 'Kari Nordmann',
                  uploadedDate: new Date().toISOString().slice(0, 10),
                  tags: [],
                },
                ...prev,
              ])
              setUploadOpen(false)
              toast.success('Dokument lastet opp')
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Dokumentnavn</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Dra og slipp filer her, eller klikk for å velge</p>
              <p className="text-xs mt-1">PDF, Word, Excel, bilder (maks 50 MB)</p>
            </div>
            <DialogFooter>
              <Button type="submit">Last opp</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
