import type { ComponentType } from 'react'
import { template, notification, reminder, cancellation, ownerCancellation } from './booking'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-confirmation': template,
  'booking-notification': notification,
  'booking-reminder': reminder,
  'booking-cancellation': cancellation,
  'booking-owner-cancellation': ownerCancellation,
}
