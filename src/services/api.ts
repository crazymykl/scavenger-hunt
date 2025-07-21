import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import cyrb53 from "cyrb53"
import { huntSlice } from "../features/hunt/huntSlice"
import testHunt from "../features/hunt/testHunt.json"

type BaseItem = {
  id: string
  name: string
  searchText: string
  searchImage: string
  foundText: string
  foundImage: string
}

export type RawItem = BaseItem & {
  checkCode: string
}

export type Item = BaseItem & {
  checkCode?: string // FIXME: make this admin-only
  checkHash: string
}

export type Hunt = {
  name: string
  items: Item[]
}

export const validCode = (item: Item, code: string): boolean =>
  item.checkHash === hashCode(code)

const hashCode = (code: string): string =>
  cyrb53(code).toString(36).padStart(7, "0")

const hashCheckCode = ({ checkCode, ...item }: RawItem): Item => ({
  ...item,
  checkHash: hashCode(checkCode),
  checkCode,
})

export const hashCheckHunt = ({
  name,
  items,
}: {
  name: string
  items: RawItem[]
}) => ({
  name,
  items: items.map(hashCheckCode),
})

export const baseQuery = fetchBaseQuery(
  process.env.NODE_ENV === "test"
    ? {
        baseUrl: "http://bogus.host/",
        fetchFn: async (_info, _init) => new Response(JSON.stringify(testHunt)),
      } /* v8 ignore next */
    : { baseUrl: "/" },
)

export const api = createApi({
  baseQuery,
  endpoints: build => ({
    getHunt: build.query<Hunt, void>({
      query: () => "hunt.json",
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        queryFulfilled.then(({ data }) => {
          dispatch(huntSlice.actions.setGoals(data.items.map(({ id }) => id)))
        })
      },
      transformResponse: hashCheckHunt,
    }),
  }),
})

export const { useLazyGetHuntQuery } = api
