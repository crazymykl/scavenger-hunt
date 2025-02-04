import type { FC, PropsWithChildren } from "react"
import { useAppSelector } from "../../app/hooks"

export const RememberGate: FC<PropsWithChildren> = ({ children }) => {
  const isRehydrated = useAppSelector(state => state.remember.isRehydrated)

  return isRehydrated ? (
    children
  ) : (
    <div className="loading" data-testid="remembering">
      Loading, please wait...
    </div>
  )
}
