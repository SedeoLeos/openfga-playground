import { Tuple } from "@openfga/sdk";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
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
       
    },
});

export const { setTupleState } = tupleFgaSlice.actions;
export const TupleFgaReducer = tupleFgaSlice.reducer;