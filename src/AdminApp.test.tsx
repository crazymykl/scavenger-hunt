import { screen } from "@testing-library/react"
import AdminApp from "./AdminApp"
import { renderWithProviders } from "./utils/test-utils"

beforeEach(() => window.localStorage.clear())

test("App should have correct initial render", () => {
  renderWithProviders(<AdminApp />)

  expect(screen.getByText("111111")).toBeInTheDocument()
})
