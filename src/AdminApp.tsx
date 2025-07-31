import { AppShell, Center, Group } from "@mantine/core"
import { AdminHunt } from "./features/hunt/admin/AdminHunt"
import { ThemeToggle } from "./features/theme/ThemeToggle"
import { useLazyGetHuntQuery, useLazyGetShadowQuery } from "./services/api"

const AdminApp = () => {
  const [trigger, { data: hunt, isLoading }] = useLazyGetHuntQuery()
  if (!hunt && !isLoading) trigger(undefined)
  const [shadowTrigger, { data: shadow, isLoading: shadowLoading }] =
    useLazyGetShadowQuery()
  if (!shadow && !shadowLoading) shadowTrigger(undefined)

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
