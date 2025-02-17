import { createSelector, createSlice } from "@reduxjs/toolkit"

// FIXME
type Item = {
  id: string
  name: string
  searchText: string
  searchImage: string
  foundText: string
  foundImage: string
}

type ItemState = { found: string } | "unfound"

type ItemProgress = {
  item: Item
  state: ItemState
}

export type ItemView = {
  name: string
  text: string
  image: string
}

type HuntSliceState = {
  name: string
  items: ItemProgress[]
}

const initialState: HuntSliceState = {
  name: "test hunt",
  items: [
    {
      item: {
        id: "1",
        name: "first",
        searchText: "find one",
        searchImage: "https://placehold.co/200/goldenrod/white",
        foundText: "found one",
        foundImage: "https://placehold.co/200/green/white",
      },
      state: "unfound",
    },
    {
      item: {
        id: "2",
        name: "second",
        searchText: "find two",
        searchImage: "https://placehold.co/200/goldenrod/white",
        foundText: "found two",
        foundImage: "https://placehold.co/200/green/white",
      },
      state: { found: "yep" },
    },
  ],
}

const itemView = (i: ItemProgress): ItemView => {
  const found = i.state !== "unfound"

  return {
    name: i.item.name,
    text: found ? i.item.foundText : i.item.searchText,
    image: found ? i.item.foundImage : i.item.searchImage,
  }
}

const selectItems: (_: any) => ItemView[] = createSelector(
  [hunt => hunt.items],
  items => items.map(itemView),
)

export const huntSlice = createSlice({
  name: "hunt",
  initialState,
  reducers: {},
  selectors: {
    selectItems,
  },
})
