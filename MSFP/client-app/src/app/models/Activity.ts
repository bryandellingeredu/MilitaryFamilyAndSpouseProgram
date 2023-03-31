import { Organization } from "./Organization"

export interface Activity {
    id: string
    title: string
    allDayEvent: boolean
    start: string
    end: string
    description: string
    actionOfficer: string
    actionOfficerPhone: string
    primaryLocation: string
    roomEmails: any
    coordinatorEmail: string
    coordinatorDisplayName: string
    eventLookup: any
    categoryId: string
    category: any
    organizationId: string
    organization: Organization
    mfp: boolean
    educationalCategory: string
  }