import { configureStore } from "@reduxjs/toolkit";
import atmDataReducer from './atm/atmSlice';

export const atmStore = configureStore({
    reducer: {
        atm: atmDataReducer,
    },
});

export type RootState = ReturnType<typeof atmStore.getState>;
export type AppDispatch = typeof atmStore.dispatch;