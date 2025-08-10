import { AppShell, Center, Group } from "@mantine/core"

import { AdminHunt } from "./features/hunt/admin/AdminHunt"
import { ThemeToggle } from "./features/theme/ThemeToggle"
import { useGetHuntQuery, useGetShadowQuery } from "./services/api"

const AdminApp = () => {
  const { data: hunt, isLoading } = useGetHuntQuery(undefined)
  const { data: shadow } = useGetShadowQuery(undefined)

  return (
    <AppShell header={{ height: 48 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="flex-end">
          <ThemeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Center>
          {isLoading || !hunt || !shadow ? (
            "Loading..."
          ) : (
            <AdminHunt hunt={hunt} shadow={shadow} />
          )}
        </Center>
      </AppShell.Main>
    </AppShell>
  )
}

export default AdminApp
