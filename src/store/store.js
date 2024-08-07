// src/redux/store.js

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import authSlice from "./slices/authSlice";
import cartSlice from "./slices/cartSlice";
import modelSlice from "./slices/modalSlice";
import searchSlice from "./slices/searchSlice";

const rootReducer = combineReducers({
  user: authSlice,
  cart: cartSlice,
  modal: modelSlice,
  search: searchSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
