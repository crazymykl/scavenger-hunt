import type { PayloadAction } from "@reduxjs/toolkit"
import { createSelector } from "@reduxjs/toolkit"
import cyrb53 from "cyrb53"
import { createAppSlice } from "../../app/createAppSlice"
import testHunt from "./testHunt.json"

type BaseItem = {
  id: string
  name: string
  searchText: string
  searchImage: string
  foundText: string
  foundImage: string
}

type RawItem = BaseItem & {
  checkCode: string
}

export type Item = BaseItem & {
  checkCode?: never
  checkHash: string
}

type ItemState = { found: string } | "unfound"

type HuntProgress = { [k: string]: ItemState }

type HuntSliceState = {
  name: string
  items: Item[]
  progress: HuntProgress
}

const makeState = (init: Omit<HuntSliceState, "progress">): HuntSliceState => {
  return { ...init, progress: initProgress(init.items) }
}

const initProgress = (items: Item[]): { [k: string]: "unfound" } =>
  items.reduce((acc, i) => ({ [i.id]: "unfound", ...acc }), {})

const hashCode = (code: string): string =>
  cyrb53(code).toString(36).padStart(7, "0")

const hashCheckCode = ({ checkCode, ...item }: RawItem): Item => ({
  ...item,
  checkHash: hashCode(checkCode),
})

export const initialState = makeState({
  ...testHunt,
  items: testHunt.items.map(hashCheckCode),
})

export const validCode = (item: Item, code: string): boolean =>
  item.checkHash === hashCode(code)

const selectItems: (hunt: HuntSliceState) => Item[] = hunt => hunt.items
const selectProgress: (hunt: HuntSliceState) => HuntProgress = hunt =>
  hunt.progress
const selectItemId = (_hunt: HuntSliceState, itemId: string) => itemId

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
