import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  userEmail: null,
  isVerified: false,
  token:null,
  role:null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      console.log("Payload:", action.payload);
      state.id = action.payload.id;
      state.userEmail = action.payload.userEmail;
      state.token = action.payload.token;
      state.role=Number(action.payload.role);
      localStorage.setItem("user", JSON.stringify(state));
    },
    setVerified(state, action) {
      state.isVerified = action.payload.isVerified;
    },
    clearUser(state) {
      state.id = null;
      state.userEmail = null;
      state.isVerified = false;
      state.role=null;
      localStorage.removeItem("user");

    },
  },
});

export const { setUser, setVerified, clearUser } = userSlice.actions;
export default userSlice.reducer;
