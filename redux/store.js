import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { todoSlice } from "./slices";

const appReducers = combineReducers({ todoSlice });

const rootReducer = (state, action) => {
  if (action.type === "RESET_STATE") {
    state = undefined;
  }

  return appReducers(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;