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
  checkCode?: never
  checkHash: string
}

export type RawHunt = {
  name: string
  items: RawItem[]
}

export type Shadow = { [k: string]: string }

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
})

export const hashCheckHunt = ({ name, items }: RawHunt): Hunt => ({
  name,
  items: items.map(hashCheckCode),
})

export const bakeRawHunt = (
  raw: RawHunt,
): {
  hunt: Hunt
  shadow: Shadow
} => ({
  hunt: hashCheckHunt(raw),
  shadow: raw.items.reduce(
    (acc, item) => ({
      ...acc,
      [item.id]: item.checkCode,
    }),
    {},
  ),
})

const { hunt, shadow } = bakeRawHunt(testHunt)

const getUrl = (ri: RequestInfo): URL =>
  new URL(typeof ri === "string" ? ri : ri.url)

const baseQuery = fetchBaseQuery(
  process.env.NODE_ENV === "test"
    ? {
        baseUrl: "http://bogus.host/",
        fetchFn: async (info, _init) => {
          const { pathname } = getUrl(info)

          switch (pathname) {
            case "/hunt.json":
              return new Response(JSON.stringify(hunt))
            case "/hunt.shadow.json":
              return new Response(JSON.stringify(shadow))
            default: /* v8 ignore start */
              return Promise.reject(new Error(`Not found: "${pathname}`))
            /* v8 ignore stop */
          }
        },
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
    }),
    getShadow: build.query<Shadow, void>({
      query: () => "hunt.shadow.json",
    }),
  }),
})

export const { useLazyGetHuntQuery, useLazyGetShadowQuery } = api
