import { AuthorizationModel } from "@openfga/sdk";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface ISAuthorizationModelFgaState {
    authorizationModel?: AuthorizationModel;
    
}

const initialState: ISAuthorizationModelFgaState = {
    authorizationModel:undefined,

};

export const authorizationModelSlice = createSlice({
    name: "authorization-model",
    initialState,
    reducers: {
        setAuthorizationModelState: (state, action: PayloadAction<AuthorizationModel>) => {
            state.authorizationModel = action.payload;
        },
    },
});

export const { setAuthorizationModelState } = authorizationModelSlice.actions;
export const authorizationModelReducer = authorizationModelSlice.reducer;