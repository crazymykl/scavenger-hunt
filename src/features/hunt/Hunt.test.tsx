import { screen } from "@testing-library/react"
import { hunt, loadingDone, renderWithProviders } from "../../utils/test-utils"
import { Hunt } from "./Hunt"
import { huntSlice } from "./huntSlice"
import { act } from "react"

test("Renders item yet to be found", () => {
  renderWithProviders(<Hunt.Item item={hunt.items[0]} />, {
    preloadedState: {
      hunt: {
        goals: ["1", "2"],
        progress: {
          "1": "unfound",
        },
      },
    },
  })

  expect(screen.getByAltText("find one")).toBeInTheDocument()
})

test("Renders item already found", () => {
  renderWithProviders(<Hunt.Item item={hunt.items[0]} />, {
    preloadedState: {
      hunt: {
        progress: { "1": { found: "1" } },
        goals: ["1", "2"],
      },
    },
  })

  expect(screen.getByAltText("found one")).toBeInTheDocument()
})

test("Renders item unfound after reset", async () => {
  const { store } = renderWithProviders(<Hunt.Item item={hunt.items[0]} />, {
    preloadedState: {
      hunt: {
        progress: {},
        goals: ["1", "2"],
      },
    },
  })
  await loadingDone()

  act(() => {
    store.dispatch(huntSlice.actions.markItemFound({ id: "1", code: "1" }))
    store.dispatch(huntSlice.actions.startOver())
  })

  expect(screen.getByAltText("find one")).toBeInTheDocument()
})
