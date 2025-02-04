import { createSlice, createAction } from "@reduxjs/toolkit"
import { REMEMBER_REHYDRATED, REMEMBER_PERSISTED } from "redux-remember"

const initialState = {
  isRehydrated: false,
  isPersisted: false,
}

export const rememberSlice = createSlice({
  name: "remember",
  initialState,
  reducers: {},
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
