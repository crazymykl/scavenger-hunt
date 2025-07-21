import type { PayloadAction } from "@reduxjs/toolkit"
import { createSelector } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"

type ItemState = { found: string } | "unfound"

type HuntProgress = { [k: string]: ItemState }

type HuntSliceState = {
  progress: HuntProgress
  goals: string[]
}

export const initialState: HuntSliceState = {
  progress: {},
  goals: [],
}

const selectProgress: (hunt: HuntSliceState) => HuntProgress = hunt =>
  hunt.progress
const selectItemId = (_hunt: HuntSliceState, itemId: string) => itemId

const selectProgressById = createSelector(
  [selectProgress, selectItemId],
  (progress, itemId) => progress[itemId],
)

const baseGoalProgress = (goals: string[]): HuntProgress =>
  goals.reduce((acc, k) => ({ ...acc, [k]: "unfound" }), {})

export const huntSlice = createAppSlice({
  name: "hunt",
  initialState,
  reducers: create => ({
    markItemFound: create.reducer(
      (state, { payload }: PayloadAction<{ id: string; code: string }>) => {
        state.progress[payload.id] = {
          found: payload.code,
        }
      },
    ),
    startOver: create.reducer(state => {
      state.progress = baseGoalProgress(state.goals)
    }),
    setGoals: create.reducer(
      (state, { payload: goals }: PayloadAction<string[]>) => {
        state.goals = goals
        state.progress = { ...baseGoalProgress(goals), ...state.progress }
      },
    ),
  }),
  selectors: {
    selectProgressById,
  },
})
