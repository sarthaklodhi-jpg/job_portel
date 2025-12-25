import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authslice";
import jobSlice from "./jobslice";
import companySlice from "./companyslice";
import applicationsSlice from "./applicationsSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

/* =========================
   PERSIST CONFIG
========================= */

// ❗ DO NOT persist loading state
const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["loading"],
};

/* =========================
   ROOT REDUCER
========================= */

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  job: jobSlice,
  company: companySlice,
  application: applicationsSlice,
});

/* =========================
   PERSISTED REDUCER
========================= */

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* =========================
   STORE
========================= */

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

/* =========================
   PERSISTOR
========================= */

export const persistor = persistStore(store);
export default store;
