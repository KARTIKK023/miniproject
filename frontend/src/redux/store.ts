import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import conversationReducer from "./conversationSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    conversations: conversationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;