type TokenStorage = {
  getAccessToken: () => string;
  setAccessToken: (token: string) => void;
  removeAccessToken: () => void;
  getRefreshToken: () => string;
  setRefreshToken: (token: string) => void;
  removeRefreshToken: () => void;
};

const tokenStorage: TokenStorage = {
  getAccessToken: () => localStorage.getItem("access_token") ?? "",
  setAccessToken: (token) => localStorage.setItem("access_token", token),
  removeAccessToken: () => localStorage.removeItem("access_token"),
  getRefreshToken: () => localStorage.getItem("refresh_token") ?? "",
  setRefreshToken: (token) => localStorage.setItem("refresh_token", token),
  removeRefreshToken: () => localStorage.removeItem("refresh_token"),
};

export { tokenStorage };
