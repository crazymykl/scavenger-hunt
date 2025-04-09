import { screen, waitFor } from "@testing-library/react"
import App from "./App"
import { renderWithProviders } from "./utils/test-utils"
import { handleCodes } from "./features/scan/ScanControl"
import { mock } from "node:test"

beforeEach(() => window.localStorage.clear())

const qr_code = (rawValue: string) => ({
  rawValue,
  format: "qr_code",
  cornerPoints: [],
  boundingBox: {
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  },
})

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

test("Opens camera control modal", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />)

  await user.click(screen.getByText("Scan"))

  expect(screen.getByText("Scan QR Code")).toBeInTheDocument()
})

test("Fires callback when a valid QR code is scanned", () => {
  const callback = mock.fn()
  handleCodes([qr_code(`${window.location.origin}/foo`)], callback)

  expect(callback.mock.callCount()).toEqual(1)
  expect(callback.mock.calls[0].arguments[0]).toEqual("/foo")
})

test("Doesn't fire callbck when an invalid QR code is scanned", () => {
  const callback = mock.fn()
  handleCodes([qr_code("/foo")], callback)

  expect(callback.mock.callCount()).toEqual(0)
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
