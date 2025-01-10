import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { StoreFgaReducer, TupleFgaReducer,authorizationModelReducer,AssertionFgaReducer } from "./slice";

export const store = configureStore({
  reducer: { storeFga: StoreFgaReducer, tupleFga: TupleFgaReducer,authorizationModel: authorizationModelReducer,assertionFga:AssertionFgaReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
    
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;