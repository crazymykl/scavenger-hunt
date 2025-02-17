import {
  useMantineColorScheme,
  useComputedColorScheme,
  Button,
} from "@mantine/core"

export const ThemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  })

  return (
    <Button
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
    >
      Toggle
    </Button>
  )
}
