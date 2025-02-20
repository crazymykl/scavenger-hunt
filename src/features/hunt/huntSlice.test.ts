import type { AppStore } from "../../app/store"
import { makeStore } from "../../app/store"
import { huntSlice, initialState } from "./huntSlice"

type LocalTestContext = {
  store: AppStore
}

describe<LocalTestContext>("counter reducer", it => {
  beforeEach<LocalTestContext>(context => {
    context.store = makeStore()
  })

  it("should handle initial state", () => {
    expect(huntSlice.reducer(undefined, { type: "unknown" })).toStrictEqual(
      initialState,
    )
  })

  it("should handle finding an item", ({ store }) => {
    expect(
      huntSlice.selectors.selectProgressById(store.getState(), "1"),
    ).toEqual("unfound")

    store.dispatch(huntSlice.actions.markItemFound("1"))

    expect(
      huntSlice.selectors.selectProgressById(store.getState(), "1"),
    ).toEqual({
      found: "1",
    })
  })
})
