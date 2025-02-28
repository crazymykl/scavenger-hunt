import type { PayloadAction } from "@reduxjs/toolkit"
import { createSelector } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

type ItemId = string

// FIXME
type Item = {
  id: ItemId
  name: string
  searchText: string
  searchImage: string
  foundText: string
  foundImage: string
}

type ItemState = { found: string } | "unfound"

type HuntProgress = { [k: ItemId]: ItemState }

type HuntSliceState = {
  name: string
  items: Item[]
  progress: HuntProgress
}

const makeState = (init: Omit<HuntSliceState, "progress">): HuntSliceState => {
  return { ...init, progress: initProgress(init.items) }
}

const initProgress = (items: Item[]) =>
  items.reduce((acc, i) => ({ [i.id]: "unfound", ...acc }), {})

export const initialState = makeState({
  name: "test hunt",
  items: [
    {
      id: "1",
      name: "first",
      searchText: "find one",
      searchImage: "https://placehold.co/200/goldenrod/white",
      foundText: "found one",
      foundImage: "https://placehold.co/200/green/white",
    },
    {
      id: "2",
      name: "second",
      searchText: "find two",
      searchImage: "https://placehold.co/200/goldenrod/white",
      foundText: "found two",
      foundImage: "https://placehold.co/200/green/white",
    },
  ],
})

const selectItems: (hunt: HuntSliceState) => Item[] = hunt => hunt.items
const selectProgress: (hunt: HuntSliceState) => HuntProgress = hunt =>
  hunt.progress
const selectItemId = (_hunt: HuntSliceState, itemId: ItemId) => itemId

const selectItemIds = createSelector([selectItems], items =>
  items.map(i => i.id),
)

const selectItemById = createSelector(
  [selectItems, selectItemId],
  (items, itemId) => items.find(i => i.id === itemId),
)

const selectProgressById = createSelector(
  [selectProgress, selectItemId],
  (progress, itemId) => progress[itemId],
)

export const huntSlice = createAppSlice({
  name: "hunt",
  initialState,
  reducers: create => ({
    markItemFound: create.reducer(
      (state, action: PayloadAction<{ id: string; code: string }>) => {
        const foundItem = state.items.find(i => i.id === action.payload.id)

        if (foundItem) {
          state.progress[foundItem.id] = { found: action.payload.code }
        }
      },
    ),
    startOver: create.reducer(state => {
      state.progress = initProgress(state.items)
    }),
  }),
  selectors: {
    selectItemIds,
    selectItemById,
    selectProgressById,
  },
})
