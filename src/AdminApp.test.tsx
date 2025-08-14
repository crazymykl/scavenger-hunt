import { screen } from "@testing-library/react"

import AdminApp from "./AdminApp"
import {
  checkCode,
  hunt,
  loadingDone,
  renderWithProviders,
} from "./utils/test-utils"

beforeEach(() => window.localStorage.clear())

test("App should have correct initial render", async () => {
  renderWithProviders(<AdminApp />, { preloadShadow: true })
  await loadingDone()

  expect(screen.getByText("Scan to Begin")).toBeInTheDocument()
})

test("App should show item QR codes", async () => {
  const { user } = renderWithProviders(<AdminApp />, { preloadShadow: true })
  await loadingDone()

  await user.click(screen.getByText("Show Items"))

  expect(screen.getByText(hunt.items[0].name)).toBeInTheDocument()
  expect(screen.getByText(hunt.items[1].name)).toBeInTheDocument()

  expect(screen.getByText(checkCode(0))).toBeInTheDocument()
  expect(screen.getByText(checkCode(1))).toBeInTheDocument()
})

test("Toggle theme", async () => {
  const { user } = renderWithProviders(<AdminApp />)
  const theme = document.documentElement.dataset.mantineColorScheme

  await user.click(screen.getByTitle("Toggle theme"))
  expect(document.documentElement.dataset.mantineColorScheme).not.toEqual(theme)
  await user.click(screen.getByTitle("Toggle theme"))
  expect(document.documentElement.dataset.mantineColorScheme).toEqual(theme)
})
