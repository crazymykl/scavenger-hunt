import { Link, Navigate, Route, Routes, useParams } from "react-router"
import { Hunt } from "./features/hunt/Hunt"
import { ScanControl } from "./features/scan/ScanControl"
import { AppShell, Button, Center, Group } from "@mantine/core"
import { OptionsMenu } from "./features/OptionsMenu"
import { ResetControl } from "./features/hunt/ResetControl"

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
        <Link to="/scan">
          <Button>Scan</Button>
        </Link>
        <OptionsMenu />
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
            <Route path="/reset" element=<ResetControl /> />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Center>
    </AppShell.Main>
  </AppShell>
)

export default App
