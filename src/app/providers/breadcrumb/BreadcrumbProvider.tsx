import { useState, type ReactNode } from "react";
import { BreadcrumbContext, type Crumb } from "./BreadcrumbContext";

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [crumbs, _setCrumbs] = useState<Crumb[]>([])

  const setCrumbs = (crumbs: Crumb[]) => {
    const unique = Array.from(new Map(crumbs.map(c => [c.title, c])).values())
    _setCrumbs(unique)
  }

  return (
    <BreadcrumbContext.Provider
      value={{ crumbs, setCrumbs }}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}
