import { fireEvent, screen, waitFor } from "@testing-library/react"
import { mock } from "node:test"

import App from "./App"
import { handleCodes } from "./features/scan/ScanControl"
import {
  getUrl,
  hunt,
  loadingDone,
  qrCode,
  renderWithProviders,
} from "./utils/test-utils"

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

test("Introduction page should work", async () => {
  const { user } = renderWithProviders(<App />)

  await user.click(screen.getByTestId("options-menu"))
  await user.click(await waitFor(() => screen.getByText("Introduction")))

  expect(getUrl()).toEqual("/intro")
  expect(screen.getByAltText("Intro")).toBeInTheDocument()
})

test("Viewing unfound details", async () => {
  renderWithProviders(<App />, { route: "/find/1" })
  await loadingDone()

  expect(screen.getByText("find one")).toBeInTheDocument()
})

test("Viewing details of an invalid id redirects to the root", async () => {
  renderWithProviders(<App />, { route: "/find/foo" })

  await waitFor(() => expect(getUrl()).toEqual("/"))
})

test("Invalid route redirects to the root", async () => {
  renderWithProviders(<App />, { route: "/bluh" })

  await waitFor(() => expect(getUrl()).toEqual("/"))
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

  await waitFor(() => expect(pinInput.dataset.error).toEqual("true"))
  await waitFor(() => expect(pinInput.dataset.error).toBeUndefined())
})

test("Opens camera control modal", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />)
  await loadingDone()

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

test("Unearned reward route redirects to the root", async () => {
  renderWithProviders(<App />, { route: "/reward" })

  await waitFor(() => expect(getUrl()).toEqual("/"))
})

test("Marking all items founds earns acccess to the reward route", async () => {
  const { user } = renderWithProviders(<App transitionDuration={50} />, {
    route: "/find/2/111112",
  })

  await waitFor(() =>
    expect(screen.getByAltText("found two")).toBeInTheDocument(),
  )

  await user.click(screen.getByAltText("find one"))
  const [pinInput] = screen.getAllByLabelText("PinInput")
  await user.click(pinInput)
  await user.keyboard("111111")

  await waitFor(() =>
    expect(screen.getByAltText("found one")).toBeInTheDocument(),
  )

  await user.click(screen.getByText("View Reward"))

  await waitFor(() => expect(getUrl()).toEqual("/reward"))
  expect(screen.getByText(hunt.rewardTitle)).toBeInTheDocument()
  expect(screen.getByText(hunt.rewardText)).toBeInTheDocument()
})
