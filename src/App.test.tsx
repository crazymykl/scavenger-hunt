import { screen, waitFor } from "@testing-library/react"
import App from "./App"
import { renderWithProviders } from "./utils/test-utils"

beforeEach(() => window.localStorage.clear())

test("App should have correct initial render", () => {
  renderWithProviders(<App />)

  expect(screen.getByAltText("find one")).toBeInTheDocument()
})

test("Theme toggle should work", async () => {
  const { user } = renderWithProviders(<App />)

  expect(document.documentElement.dataset.mantineColorScheme).toEqual("light")
  await user.click(screen.getByText("Toggle"))
  expect(document.documentElement.dataset.mantineColorScheme).toEqual("dark")
  await user.click(screen.getByText("Toggle"))
  expect(document.documentElement.dataset.mantineColorScheme).toEqual("light")
})

test("Viewing unfound details", () => {
  renderWithProviders(<App />, { route: "/find/1" })

  expect(screen.getByText("find one")).toBeInTheDocument()
})

test("Viewing details of an invalid id redirects to the root", () => {
  renderWithProviders(<App />, { route: "/find/foo" })

  expect(document.location.pathname).toEqual("/")
})

test("Finding an item should work as expected", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />)
  await user.click(screen.getByAltText("find one"))
  await user.keyboard("111111")

  await waitFor(() =>
    expect(screen.getByAltText("found one")).toBeInTheDocument(),
  )
})

test("Wrong code blocks finding", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />)
  await user.click(screen.getByAltText("find one"))
  const [pinInput] = screen.getAllByLabelText("PinInput")
  await user.keyboard("111112")

  await waitFor(() => expect(pinInput.dataset["error"]).toEqual("true"))
  await waitFor(() => expect(pinInput.dataset["error"]).toBeUndefined())
})

test("Starting over should work as expected", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />, {
    route: "/find/1/111111",
  })

  await waitFor(() =>
    expect(screen.getByAltText("found one")).toBeInTheDocument(),
  )
  await user.keyboard("[Escape]")

  await user.click(screen.getByText("Reset"))
  expect(screen.getByAltText("find one")).toBeInTheDocument()
})
