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

//we have use this type of redux so that we do nit have to login each time 

// ✅ Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// ✅ Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  job: jobSlice,
  company : companySlice,
  application : applicationsSlice,
});

// ✅ Apply persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ✅ Create persistor (required for PersistGate)
export const persistor = persistStore(store);
export default store;
