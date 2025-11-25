import { configureStore } from "@reduxjs/toolkit";
import milestoneReducer from "./milestoneSlice";

export const store = configureStore({
  reducer: {
    milestone: milestoneReducer,
  },
});

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
