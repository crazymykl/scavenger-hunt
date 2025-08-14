import { useState } from "react"
import { AppShell, Card, Center, Group, Stack, Switch } from "@mantine/core"
import { QRCodeSVG } from "qrcode.react"

import { AdminHunt } from "./features/hunt/admin/AdminHunt"
import { makeAbsoluteUrl } from "./features/hunt/lib"
import { ThemeToggle } from "./features/theme/ThemeToggle"
import { useGetHuntQuery, useGetShadowQuery } from "./services/api"

const AdminApp = () => {
  const { data: hunt, isLoading } = useGetHuntQuery(undefined)
  const { data: shadow } = useGetShadowQuery(undefined)
  const [showHunt, setShowHunt] = useState(false)

  return (
    <AppShell header={{ height: 48 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="flex-end">
          <Switch
            labelPosition="left"
            label="Show Items"
            defaultChecked={showHunt}
            onChange={e => setShowHunt(e.currentTarget.checked)}
            disabled={!hunt || !shadow}
          />
          <ThemeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Center>
          {isLoading ? (
            "Loading..."
          ) : !showHunt || !hunt || !shadow ? (
            <Card withBorder mt={12}>
              <Stack>
                <QRCodeSVG value={makeAbsoluteUrl("/intro")} size={325} />
                <Center>Scan to Begin</Center>
              </Stack>
            </Card>
          ) : (
            <AdminHunt hunt={hunt} shadow={shadow} />
          )}
        </Center>
      </AppShell.Main>
    </AppShell>
  )
}

export default AdminApp
