import { createContext } from 'react'

export type Crumb = {
  title: string
  href?: string
}

export type BreadcrumbContextType = {
  crumbs: Crumb[]
  setCrumbs: (crumbs: Crumb[]) => void,
}

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)



