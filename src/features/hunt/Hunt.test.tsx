import { screen } from "@testing-library/react"
import { renderWithProviders } from "../../utils/test-utils"
import { Item } from "./Hunt"
import { huntSlice } from "./huntSlice"
import { act } from "react"

test("Renders item yet to be found", async () => {
  renderWithProviders(<Item id="1" />)

  expect(screen.queryByAltText("find one")).toBeInTheDocument()
})

test("Renders item already found", () => {
  renderWithProviders(<Item id="1" />, {
    preloadedState: {
      hunt: {
        ...huntSlice.getInitialState(),
        progress: { "1": { found: "1" } },
      },
    },
  })

  expect(screen.queryByAltText("found one")).toBeInTheDocument()
})

test("Renders item unfound after reset", () => {
  act(() => {
    const { store } = renderWithProviders(<Item id="1" />)
    store.dispatch(huntSlice.actions.markItemFound({ id: "1", code: "1" }))
    store.dispatch(huntSlice.actions.startOver())
  })

  expect(screen.queryByAltText("find one")).toBeInTheDocument()
})

test("Invalid Item renders missingItem", async () => {
  renderWithProviders(<Item id="foo" />)

  expect(screen.queryByTestId("missingItem")).toBeInTheDocument()
})
