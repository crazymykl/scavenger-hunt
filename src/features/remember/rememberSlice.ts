import { createAction, createSlice } from "@reduxjs/toolkit"
import { REMEMBER_PERSISTED, REMEMBER_REHYDRATED } from "redux-remember"

const initialState = {
  isRehydrated: false,
  isPersisted: false,
}

export const rememberSlice = createSlice({
  name: "remember",
  initialState,
  reducers: {},
  selectors: {
    selectRehydrated: remember => remember.isRehydrated,
  },
  extraReducers: builder =>
    builder
      .addCase(createAction(REMEMBER_REHYDRATED), (state, _action) => {
        // "action.payload" is the Rehydrated Root State
        state.isRehydrated = true
      })
      .addCase(createAction(REMEMBER_PERSISTED), (state, _action) => {
        state.isPersisted = true
      }),
})

export const { selectRehydrated } = rememberSlice.selectors
