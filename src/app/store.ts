import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { rememberReducer, rememberEnhancer } from "redux-remember"
import { counterSlice } from "../features/counter/counterSlice"
import { rememberSlice } from "../features/remember/rememberSlice"
import { huntSlice } from "../features/hunt/huntSlice"

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = rememberReducer(
  combineSlices(counterSlice, rememberSlice, huntSlice),
)

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>

const rememberedKeys = [counterSlice.name]

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers().concat(
        rememberEnhancer(window.localStorage, rememberedKeys),
      ),
    preloadedState,
  })
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
