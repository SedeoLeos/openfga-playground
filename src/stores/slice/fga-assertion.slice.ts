import { Assertion } from "@openfga/sdk";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IAssertionState {
    assertions: Assertion[];
    currentAssertion?: Assertion

}

const initialState: IAssertionState = {
    assertions: [],
    currentAssertion: undefined

};

export const assertionFgaSlice = createSlice({
    name: "fga-assertion",
    initialState,
    reducers: {
        setAssertionState: (state, action: PayloadAction<Assertion[]>) => {
            state.assertions = action.payload;
        },
        setCurrentAssertionState: (state, action: PayloadAction<Assertion>) => {
            state.currentAssertion = action.payload;
        },

    },
});

export const { setAssertionState, setCurrentAssertionState } = assertionFgaSlice.actions;
export const AssertionFgaReducer = assertionFgaSlice.reducer;