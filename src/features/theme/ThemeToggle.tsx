import { useMantineColorScheme, ActionIcon } from "@mantine/core"
import { IconMoon, IconSun } from "@tabler/icons-react"

export const ThemeToggle = () => {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme()

  return (
    <ActionIcon variant="default" onClick={toggleColorScheme}>
      {colorScheme === "light" ? <IconSun size={14} /> : <IconMoon size={14} />}
    </ActionIcon>
  )
}
