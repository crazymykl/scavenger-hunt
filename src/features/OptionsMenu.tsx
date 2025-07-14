import { Burger, Menu, useMantineColorScheme } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router"
import { IconMoon, IconRestore, IconSun } from "@tabler/icons-react"

export const OptionsMenu = () => {
  const [opened, setOpened] = useState(false)
  const { toggleColorScheme, colorScheme } = useMantineColorScheme()
  const navigate = useNavigate()

  return (
    <Menu withArrow position="bottom-end" onChange={setOpened}>
      <Menu.Target>
        <Burger opened={opened} data-testid="options-menu" />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            colorScheme === "light" ? (
              <IconSun size={14} />
            ) : (
              <IconMoon size={14} />
            )
          }
          onClick={toggleColorScheme}
        >
          Toggle Theme
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconRestore size={14} />}
          onClick={() => navigate("/reset")}
        >
          Start Over
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
