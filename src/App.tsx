import { Navigate, Route, Routes, useParams } from "react-router"
import { Hunt } from "./features/hunt/Hunt"
import { ThemeToggle } from "./features/theme/ThemeToggle"
import { ScanControl } from "./features/scan/ScanControl"
import { AppShell, Center, Group } from "@mantine/core"

const ItemDetailsHelper = ({
  transitionDuration,
}: {
  transitionDuration: number
}) => {
  const { id, code } = useParams()

  return (
    <Hunt.ItemDetails
      id={id!}
      code={code}
      transitionDuration={transitionDuration}
    />
  )
}

const App = ({
  transitionDuration = 1000,
}: {
  transitionDuration?: number
}) => (
  <AppShell header={{ height: 48 }}>
    <AppShell.Header>
      <Group h="100%" px="md" justify="flex-end">
        <ThemeToggle />
      </Group>
    </AppShell.Header>
    <AppShell.Main>
      <Center>
        <Routes>
          <Route path="/" element={<Hunt />}>
            <Route
              path="/find/:id/:code?"
              element={
                <ItemDetailsHelper transitionDuration={transitionDuration} />
              }
            />
            <Route path="/scan" element=<ScanControl /> />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Center>
    </AppShell.Main>
  </AppShell>
)

export default App
