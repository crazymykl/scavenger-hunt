import { fireEvent, screen, waitFor } from "@testing-library/react"
import App from "./App"
import { loadingDone, qrCode, renderWithProviders } from "./utils/test-utils"
import { handleCodes } from "./features/scan/ScanControl"
import { mock } from "node:test"
import { useLocation } from "react-router"

beforeEach(() => window.localStorage.clear())

test("App should have correct initial render", async () => {
  renderWithProviders(<App />)
  await loadingDone()

  expect(screen.getByAltText("find one")).toBeInTheDocument()
})

test("App should handle resize", async () => {
  renderWithProviders(<App />)
  await loadingDone()

  // flip the aspect ratio
  const [w, h] = [window.innerWidth, window.innerHeight]
  window.innerWidth = h
  window.innerHeight = w
  fireEvent(window, new Event("resize"))

  expect(screen.getByAltText("find one")).toBeInTheDocument()
})

test("Theme toggle should work", async () => {
  const { user } = renderWithProviders(<App />)

  expect(document.documentElement.dataset.mantineColorScheme).toEqual("light")
  await user.click(screen.getByTestId("options-menu"))
  await user.click(await waitFor(() => screen.getByText("Toggle Theme")))
  expect(document.documentElement.dataset.mantineColorScheme).toEqual("dark")
  await user.click(screen.getByTestId("options-menu"))
  await user.click(await waitFor(() => screen.getByText("Toggle Theme")))
  expect(document.documentElement.dataset.mantineColorScheme).toEqual("light")
})

test("Viewing unfound details", async () => {
  renderWithProviders(<App />, { route: "/find/1" })
  await loadingDone()

  expect(screen.getByText("find one")).toBeInTheDocument()
})

test("Viewing details of an invalid id redirects to the root", async () => {
  const LocationSpy = () => {
    const location = useLocation()

    return (
      <span data-url={location.pathname} data-testid="url">
        <App />
      </span>
    )
  }

  renderWithProviders(<LocationSpy />, { route: "/find/foo" })

  await waitFor(() =>
    expect(screen.getByTestId("url").dataset.url).toEqual("/"),
  )
})

test("Finding an item should work as expected", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />)
  await loadingDone()

  await user.click(screen.getByAltText("find one"))
  await user.keyboard("111111")

  await waitFor(() =>
    expect(screen.getByAltText("found one")).toBeInTheDocument(),
  )
})

test("Wrong code blocks finding", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />)
  await loadingDone()

  await user.click(screen.getByAltText("find one"))
  const [pinInput] = screen.getAllByLabelText("PinInput")
  await user.keyboard("111112")

  await waitFor(() => expect(pinInput.dataset["error"]).toEqual("true"))
  await waitFor(() => expect(pinInput.dataset["error"]).toBeUndefined())
})

test("Opens camera control modal", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />)

  await user.click(screen.getByText("Scan"))

  expect(screen.getByText("Scan QR Code")).toBeInTheDocument()
})

test("Fires callback when a valid QR code is scanned", () => {
  const callback = mock.fn()
  handleCodes([qrCode(`${window.location.origin}/foo`)], callback)

  expect(callback.mock.callCount()).toEqual(1)
  expect(callback.mock.calls[0].arguments[0]).toEqual("/foo")
})

test("Doesn't fire callback when an invalid QR code is scanned", () => {
  const callback = mock.fn()
  handleCodes([qrCode("/foo")], callback)

  expect(callback.mock.callCount()).toEqual(0)
})

test("Starting over should work as expected", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />, {
    route: "/find/1/111111",
  })

  await waitFor(() =>
    expect(screen.getByAltText("found one")).toBeInTheDocument(),
  )

  await user.click(screen.getByTestId("options-menu"))
  await user.click(await waitFor(() => screen.getByText("Start Over")))
  await user.click(await waitFor(() => screen.getByText("Reset")))

  expect(screen.getByAltText("find one")).toBeInTheDocument()
})
