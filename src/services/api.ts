import {
  createApi,
  type FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react"
import { huntSlice } from "../features/hunt/huntSlice"
import type { Shadow, Hunt } from "../features/hunt/lib"
import type { ApiExtra } from "../app/store"

export const api = createApi({
  baseQuery: async (arg: string | FetchArgs, api, extraOptions) =>
    fetchBaseQuery(
      api.extra
        ? (api.extra as ApiExtra).overrideBaseQueryArgs /* v8 ignore start */
        : { baseUrl: "/" } /* v8 ignore stop */,
    )(arg, api, extraOptions),
  endpoints: build => ({
    getHunt: build.query<Hunt, undefined>({
      query: () => "hunt.json",
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        dispatch(huntSlice.actions.setGoals(data.items.map(({ id }) => id)))
      },
    }),
    getShadow: build.query<Shadow, undefined>({
      query: () => "hunt.shadow.json",
    }),
  }),
})

export const { useLazyGetHuntQuery, useLazyGetShadowQuery } = api
