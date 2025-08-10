import { screen } from "@testing-library/react"

import AdminApp from "./AdminApp"
import { loadingDone, renderWithProviders } from "./utils/test-utils"

beforeEach(() => window.localStorage.clear())

test("App should have correct initial render", async () => {
  renderWithProviders(<AdminApp />, { preloadShadow: true })
  await loadingDone()

  expect(screen.getByText("111111")).toBeInTheDocument()
})

test("Toggle theme", async () => {
  const { user } = renderWithProviders(<AdminApp />)
  const theme = document.documentElement.dataset.mantineColorScheme

  await user.click(screen.getByTitle("Toggle theme"))
  expect(document.documentElement.dataset.mantineColorScheme).not.toEqual(theme)
  await user.click(screen.getByTitle("Toggle theme"))
  expect(document.documentElement.dataset.mantineColorScheme).toEqual(theme)
})
