import { Tuple } from "@openfga/sdk";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface ITupleState {
    tuples: Tuple[];
}

const initialState: ITupleState = {
    tuples: [],
};

export const tupleFgaSlice = createSlice({
    name: "fga-tuple",
    initialState,
    reducers: {
        setTupleState: (state, action: PayloadAction<Tuple[]>) => {
            state.tuples = action.payload;
        },
        addTuple: (state, action: PayloadAction<Tuple>) => {
            state.tuples = [...state.tuples, action.payload];
        },
        removeTuple: (state, action: PayloadAction<Tuple>) => {
            state.tuples = state.tuples.filter((tuple) => {
                const isSameTuple = 
                    tuple.key.user === action.payload.key.user &&
                    tuple.key.relation === action.payload.key.relation &&
                    tuple.key.object === action.payload.key.object;
                return !isSameTuple;
            });
        },
    },
});

export const { setTupleState, addTuple, removeTuple } = tupleFgaSlice.actions;
export const TupleFgaReducer = tupleFgaSlice.reducer;