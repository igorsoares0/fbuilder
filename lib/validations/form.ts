import { z } from 'zod'

// Schema for creating a new form
export const createFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  template: z.enum(['default', 'blank']).optional().default('default'),
})

// Schema for updating a form
export const updateFormSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  elements: z.array(z.any()).optional(), // FormElement[] - can be more strict if needed
  background: z.object({
    type: z.enum(['color', 'gradient', 'image']),
    color: z.string().optional(),
    gradientFrom: z.string().optional(),
    gradientTo: z.string().optional(),
    gradientDirection: z.string().optional(),
    imageUrl: z.string().optional(),
    imageOpacity: z.string().optional(),
  }).optional(),
})

// Schema for publishing a form
export const publishFormSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
})

// Schema for form submission
export const submitFormSchema = z.object({
  formId: z.string().cuid(),
  data: z.record(z.any()), // Record<fieldId, value>
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})

export type CreateFormInput = z.infer<typeof createFormSchema>
export type UpdateFormInput = z.infer<typeof updateFormSchema>
export type PublishFormInput = z.infer<typeof publishFormSchema>
export type SubmitFormInput = z.infer<typeof submitFormSchema>
