import rootReducer from "./reducers";
import thunk from "redux-thunk";
// import setAuthToken from "./api/setAuthToken";

import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

const rootPersistConfig = {
  key: "user",
  storage,
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store: any = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
