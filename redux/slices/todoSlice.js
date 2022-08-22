import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todo: [],
  },
  reducers: {
    setTodo(state, action) {
      state.todo = action.payload;
    },
  },
});

const { reducer, actions } = todoSlice;

export const { setTodo } = actions;
export default reducer;
