import { screen, waitFor } from "@testing-library/react"

import { RememberGate } from "./RememberGate"
import { renderWithProviders } from "../../utils/test-utils"

test("RememberGate should display a loading screen until state is rehydrated", async () => {
  const { store } = renderWithProviders(
    <RememberGate>
      <div>Done</div>
    </RememberGate>,
  )
  expect(store.getState().remember.isRehydrated).toBeFalsy()
  expect(screen.getByTestId("remembering")).toBeInTheDocument()

  await waitFor(() => {
    expect(store.getState().remember.isRehydrated).toBeTruthy()
  })

  expect(screen.queryByTestId("remembering")).not.toBeInTheDocument()
  expect(screen.getByText("Done")).toBeInTheDocument()
})
