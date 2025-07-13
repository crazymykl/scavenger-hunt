import { Burger, Menu } from "@mantine/core"
import { ThemeToggle } from "./theme/ThemeToggle"
import { useState } from "react"
import { useNavigate } from "react-router"

export const OptionsMenu = () => {
  const [opened, setOpened] = useState(false)
  const navigate = useNavigate()

  return (
    <Menu withArrow onChange={setOpened}>
      <Menu.Target>
        <Burger opened={opened} data-testid="options-menu" />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component="span">
          <ThemeToggle />
        </Menu.Item>
        <Menu.Item color="red" onClick={() => navigate("/reset")}>
          Start Over
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
