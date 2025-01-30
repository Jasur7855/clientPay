import { configureStore } from "@reduxjs/toolkit/react";
import { paymentApi } from "./Api/paymentApi";

export const store = configureStore({
  reducer: {
    [paymentApi.reducerPath]: paymentApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(paymentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
