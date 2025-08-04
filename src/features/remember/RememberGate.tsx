import { selectRehydrated } from "./rememberSlice"
import { useAppSelector } from "../../app/hooks"

import type { ReactNode } from "react"

export const RememberGate = ({ children }: { children: ReactNode }) => {
  const isRehydrated = useAppSelector(selectRehydrated)

  return isRehydrated ? (
    children
  ) : (
    <div className="loading" data-testid="remembering">
      Loading, please wait...
    </div>
  )
}
