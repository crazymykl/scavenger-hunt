import { huntSlice, initialState } from "./huntSlice"
import { makeStore } from "../../app/store"
import { hunt } from "../../utils/test-utils"

import type { AppStore } from "../../app/store"

type LocalTestContext = {
  store: AppStore
}

describe<LocalTestContext>("progress tracking", it => {
  beforeEach<LocalTestContext>(context => {
    context.store = makeStore()
  })

  it("should handle initial state", () => {
    expect(huntSlice.reducer(undefined, { type: "unknown" })).toStrictEqual(
      initialState,
    )
  })

  it("should handle finding an item", ({ store }) => {
    store.dispatch(huntSlice.actions.setGoals(hunt.items.map(i => i.id)))

    expect(
      huntSlice.selectors.selectProgressById(store.getState(), "1"),
    ).toEqual("unfound")

    store.dispatch(huntSlice.actions.markItemFound({ id: "1", code: "1" }))

    expect(
      huntSlice.selectors.selectProgressById(store.getState(), "1"),
    ).toEqual({
      found: "1",
    })
  })
})
