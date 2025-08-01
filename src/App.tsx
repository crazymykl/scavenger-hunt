import { Link, Navigate, Route, Routes, useParams } from "react-router"
import { Hunt } from "./features/hunt/Hunt"
import { ScanControl } from "./features/scan/ScanControl"
import { AppShell, Button, Center, Group } from "@mantine/core"
import { OptionsMenu } from "./features/OptionsMenu"
import { ResetControl } from "./features/hunt/ResetControl"
import { useLazyGetHuntQuery } from "./services/api"
import { type Hunt as HuntData } from "./features/hunt/lib"

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
  const [trigger, { data: hunt, isLoading, error }] = useLazyGetHuntQuery()
  if (!hunt && !isLoading) trigger(undefined)

  return (
    <AppShell header={{ height: 48 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="flex-end">
          <Link to="/scan">
            <Button>Scan</Button>
          </Link>
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
                ) : error || !hunt ? (
                  `Error: ${error ?? "General Failure"}`
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Center>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
