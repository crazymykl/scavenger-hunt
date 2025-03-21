import { AppShell, Center, Group } from "@mantine/core"
import { AdminHunt } from "./features/hunt/admin/AdminHunt"
import { ThemeToggle } from "./features/theme/ThemeToggle"

const AdminApp = () => (
  <AppShell header={{ height: 48 }}>
    <AppShell.Header>
      <Group h="100%" px="md" justify="flex-end">
        <ThemeToggle />
      </Group>
    </AppShell.Header>
    <AppShell.Main>
      <Center>
        <AdminHunt />
      </Center>
    </AppShell.Main>
  </AppShell>
)

export default AdminApp
