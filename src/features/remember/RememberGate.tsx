import type { FC, PropsWithChildren } from "react"
import { useAppSelector } from "../../app/hooks"
import { selectRehydrated } from "./rememberSlice"

export const RememberGate: FC<PropsWithChildren> = ({ children }) => {
  const isRehydrated = useAppSelector(selectRehydrated)

  return isRehydrated ? (
    children
  ) : (
    <div className="loading" data-testid="remembering">
      Loading, please wait...
    </div>
  )
}
