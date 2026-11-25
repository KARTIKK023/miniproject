import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Conversation {
  _id: string;
  title: string;
  updatedAt?: string;
  [key: string]: any;
}
interface SelectedConversation {
  _id: string;
  title: string;
  [key: string]: any;
}

interface ConversationState {
  conversations: Conversation[];
  selectedConversation: SelectedConversation | null;
  hasFetched:boolean;
}

const initialState: ConversationState = {
  conversations: [],
  selectedConversation: null,
  hasFetched:false
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    ...initialState,
  },
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.hasFetched = true;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
    },
    setSelectedConversation: (
      state,
      action: PayloadAction<SelectedConversation | null>,
    ) => {
      state.selectedConversation = action.payload;
    },
    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (c) => c._id !== action.payload && c.id !== action.payload,
      );
      if (
        state.selectedConversation?._id === action.payload ||
        state.selectedConversation?.id === action.payload
      ) {
        state.selectedConversation = null;
      }
    },
    clearConversations: (state) => {
      state.conversations = [];
      state.selectedConversation = null;
      state.hasFetched = false;
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  removeConversation,
  clearConversations,
} = conversationSlice.actions;

export default conversationSlice.reducer;
