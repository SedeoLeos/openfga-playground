import { Store } from "@openfga/sdk";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IStoreFgaState {
    store: Store[];
    currentStore?: Store;
}

const initialState: IStoreFgaState = {
    store: [],
    currentStore: undefined,
};

export const storeFgaSlice = createSlice({
    name: "fga-store",
    initialState,
    reducers: {
        setStoreState: (state, action: PayloadAction<Store[]>) => {
            state.store = action.payload;
        },
        appendStoreState: (state, action: PayloadAction<Store>) => {
            state.store.push(action.payload);
        },
        setCurrentStoreState: (state, action: PayloadAction<Store>) => {
            state.currentStore = action.payload;
        },
    },
});

export const { setStoreState, setCurrentStoreState, appendStoreState } = storeFgaSlice.actions;
export const StoreFgaReducer = storeFgaSlice.reducer;