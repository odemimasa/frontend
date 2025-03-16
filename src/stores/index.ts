import { create } from "zustand";
import { createUserSlice, type UserSlice } from "./user";

const useStore = create<UserSlice>()((...a) => ({
  ...createUserSlice(...a),
}));

export { useStore };
