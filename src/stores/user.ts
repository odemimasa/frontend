import type { StateCreator } from "zustand";
import type { UserResponse } from "../models/UserModel";

interface UserSlice {
  user: UserResponse | undefined;
  setUser: (
    user:
      | ((user: UserResponse | undefined) => UserResponse | undefined)
      | UserResponse
      | undefined
  ) => void;
}

const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: undefined,
  setUser: (user) => {
    set((state) => {
      if (typeof user === "function") {
        return { user: user(state.user) };
      }
      return { user };
    });
  },
});

export { createUserSlice };
export type { UserSlice };
