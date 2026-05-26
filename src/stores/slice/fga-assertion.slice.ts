import { Assertion } from "@openfga/sdk";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AssertionResult = 'pending' | 'pass' | 'fail' | 'error'

export interface IAssertionState {
  assertions: Assertion[];
  currentAssertion?: Assertion;
  results: Record<string, AssertionResult>;
}

const initialState: IAssertionState = {
  assertions: [],
  currentAssertion: undefined,
  results: {},
};

/** Stable key for a given assertion */
export function assertionKey(a: Assertion): string {
  return `${a.tuple_key.user}|${a.tuple_key.relation}|${a.tuple_key.object}`
}

export const assertionFgaSlice = createSlice({
  name: "fga-assertion",
  initialState,
  reducers: {
    setAssertionState: (state, action: PayloadAction<Assertion[]>) => {
      state.assertions = action.payload;
      state.results = {};
    },
    setCurrentAssertionState: (state, action: PayloadAction<Assertion>) => {
      state.currentAssertion = action.payload;
    },
    removeAssertionState: (state, action: PayloadAction<Assertion>) => {
      const key = assertionKey(action.payload)
      state.assertions = state.assertions.filter((a) => assertionKey(a) !== key)
      delete state.results[key]
      if (state.currentAssertion && assertionKey(state.currentAssertion) === key) {
        state.currentAssertion = undefined
      }
    },
    setAssertionResult: (
      state,
      action: PayloadAction<{ assertion: Assertion; result: AssertionResult }>
    ) => {
      state.results[assertionKey(action.payload.assertion)] = action.payload.result
    },
    clearResults: (state) => {
      state.results = {}
    },
  },
});

export const {
  setAssertionState,
  setCurrentAssertionState,
  removeAssertionState,
  setAssertionResult,
  clearResults,
} = assertionFgaSlice.actions;
export const AssertionFgaReducer = assertionFgaSlice.reducer;