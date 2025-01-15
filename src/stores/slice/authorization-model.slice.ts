import { AuthorizationModel } from "@openfga/sdk";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface ISAuthorizationModelFgaState {
    authorizationModel?: AuthorizationModel;
    currentDsl:string;
    
}

const initialState: ISAuthorizationModelFgaState = {
    authorizationModel:undefined,
    currentDsl:"",

};

export const authorizationModelSlice = createSlice({
    name: "authorization-model",
    initialState,
    reducers: {
        setAuthorizationModelState: (state, action: PayloadAction<AuthorizationModel>) => {
            state.authorizationModel = action.payload;
        },
        setCurrentDsl:(state, action: PayloadAction<string>) => {
            state.currentDsl = action.payload;
        }
    },
});

export const { setAuthorizationModelState,setCurrentDsl } = authorizationModelSlice.actions;
export const authorizationModelReducer = authorizationModelSlice.reducer;