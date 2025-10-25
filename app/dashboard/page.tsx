"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
  ExternalLink,
  FileText,
  Eye,
  Sparkles,
  FileX,
  Circle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FormData {
  id: string
  title: string
  description: string
  responses: number
  views: number
  conversionRate: number
  lastEdited: string
  status: "published" | "draft"
}

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [forms, setForms] = useState<FormData[]>([
    {
      id: "1",
      title: "Newsletter Signup",
      description: "Main landing page newsletter form",
      responses: 1284,
      views: 4821,
      conversionRate: 26.6,
      lastEdited: "2 hours ago",
      status: "published",
    },
    {
      id: "2",
      title: "Contact Form",
      description: "General contact inquiry form",
      responses: 342,
      views: 1205,
      conversionRate: 28.4,
      lastEdited: "1 day ago",
      status: "published",
    },
    {
      id: "3",
      title: "Product Waitlist",
      description: "Early access signup for new product",
      responses: 89,
      views: 256,
      conversionRate: 34.8,
      lastEdited: "3 days ago",
      status: "draft",
    },
    {
      id: "4",
      title: "Free Guide Download",
      description: "Lead magnet for creative business guide",
      responses: 756,
      views: 2341,
      conversionRate: 32.3,
      lastEdited: "5 days ago",
      status: "published",
    },
  ])

  const totalResponses = forms.reduce((acc, form) => acc + form.responses, 0)
  const totalViews = forms.reduce((acc, form) => acc + form.views, 0)

  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateForm = (template: "default" | "blank") => {
    setShowTemplateDialog(false)
    router.push(`/?template=${template}`)
  }

  const handleEditForm = (formId: string) => {
    router.push(`/?id=${formId}`)
  }

  const handleDuplicateForm = (formId: string) => {
    console.log("Duplicating form:", formId)
  }

  const handleDeleteForm = (formId: string) => {
    setForms(forms.filter((form) => form.id !== formId))
  }

  const handleViewLive = (formId: string) => {
    window.open(`/preview/${formId}`, "_blank")
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-semibold">FormBuilder</h1>
              <nav className="hidden md:flex items-center gap-6">
                <button className="text-sm font-medium text-gray-900">Forms</button>
                <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Analytics</button>
                <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Settings</button>
              </nav>
            </div>

            <Button
              onClick={() => setShowTemplateDialog(true)}
              className="bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">Here's what's happening with your forms today.</p>
          </div>

          {/* Stats Overview */}
          <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Total Forms */}
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Forms</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{forms.length}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* Total Views */}
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{totalViews.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </Card>

            {/* Total Responses */}
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Responses</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{totalResponses.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-200 bg-white pl-10 shadow-sm"
              />
            </div>
          </div>

          {/* Forms List */}
          <div className="space-y-3">
            {filteredForms.map((form) => (
              <Card
                key={form.id}
                className="group cursor-pointer border-0 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                onClick={() => handleEditForm(form.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{form.title}</h3>
                        <div className="flex items-center gap-1">
                          <Circle
                            className={`h-2 w-2 fill-current ${
                              form.status === "published" ? "text-green-500" : "text-gray-400"
                            }`}
                          />
                          <span className="text-xs text-gray-500">
                            {form.status === "published" ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{form.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{form.views.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{form.responses.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Responses</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{form.conversionRate}%</p>
                        <p className="text-xs text-gray-500">Rate</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg p-2 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-5 w-5 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleEditForm(form.id)
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Form
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateForm(form.id)
                        }}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleViewLive(form.id)
                        }}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Live
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteForm(form.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredForms.length === 0 && (
            <Card className="border-0 bg-white p-16 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {searchQuery ? "No forms found" : "No forms yet"}
              </h3>
              <p className="mb-6 text-sm text-gray-600">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first form to start collecting responses"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowTemplateDialog(true)}
                  className="bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Form
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Create a new form</DialogTitle>
            <p className="text-sm text-gray-600">Choose how you want to start</p>
          </DialogHeader>
          <div className="grid gap-4 py-6 md:grid-cols-2">
            {/* Template Option */}
            <button
              onClick={() => handleCreateForm("default")}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-8 text-left transition-all hover:border-blue-500 hover:shadow-lg"
            >
              <div className="mb-6 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <Sparkles className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Use Template</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Start with a beautiful pre-designed newsletter form. Save time with ready-to-use elements and professional styling.
              </p>
              <div className="mt-6">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                  ⭐ Recommended
                </Badge>
              </div>
            </button>

            {/* Blank Option */}
            <button
              onClick={() => handleCreateForm("blank")}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-8 text-left transition-all hover:border-gray-400 hover:shadow-lg"
            >
              <div className="mb-6 flex h-40 items-center justify-center rounded-xl bg-gray-50">
                <FileX className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Start from Scratch</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Build your form from the ground up. Perfect for custom designs and when you need complete creative control.
              </p>
              <div className="mt-6">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                  For Advanced Users
                </Badge>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
