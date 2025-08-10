import { AppShell, Center, Group } from "@mantine/core"
import { Navigate, Route, Routes, useParams } from "react-router"

import { useAppSelector } from "./app/hooks"
import { ActionButton } from "./features/ActionButton"
import { OptionsMenu } from "./features/OptionsMenu"
import { Hunt } from "./features/hunt/Hunt"
import { ResetControl } from "./features/hunt/ResetControl"
import { huntSlice } from "./features/hunt/huntSlice"
import { ScanControl } from "./features/scan/ScanControl"
import { useGetHuntQuery } from "./services/api"

import type { Hunt as HuntData } from "./features/hunt/lib"

const ItemDetailsHelper = ({
  hunt,
  transitionDuration,
}: {
  hunt?: HuntData
  transitionDuration: number
}) => {
  const { id, code } = useParams()
  const item = id && hunt?.items.find(i => i.id === id)

  return item ? (
    <Hunt.ItemDetails
      item={item}
      code={code}
      transitionDuration={transitionDuration}
    />
  ) : (
    <Navigate to="/" replace />
  )
}

const App = ({
  transitionDuration = 1000,
}: {
  transitionDuration?: number
}) => {
  const { data: hunt, isLoading, error } = useGetHuntQuery(undefined)
  const done = useAppSelector(huntSlice.selectors.selectComplete)

  return (
    <AppShell header={{ height: 48 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="flex-end">
          <ActionButton done={done} />
          <OptionsMenu />
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Center>
          <Routes>
            <Route
              path="/"
              element={
                isLoading ? (
                  "Loading..."
                ) : /* v8 ignore next */ error || !hunt ? (
                  `Error: ${error ? JSON.stringify(error) : "General Failure"}`
                ) : (
                  <Hunt hunt={hunt} />
                )
              }
            >
              <Route
                path="/find/:id/:code?"
                element={
                  <ItemDetailsHelper
                    hunt={hunt}
                    transitionDuration={transitionDuration}
                  />
                }
              />
              <Route path="/scan" element=<ScanControl /> />
              <Route path="/reset" element=<ResetControl /> />
              {hunt && done && (
                <Route path="/reward" element={<Hunt.Reward hunt={hunt} />} />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Center>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
