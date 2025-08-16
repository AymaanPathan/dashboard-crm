import Cookies from "js-cookie";

export const getToken = () => Cookies.get("token");
export const getRole = () => Cookies.get("role");
export const getUserId = () => Cookies.get("userId");
export const getMobileNumber = () => Cookies.get("mobileNumber");

export const getUser = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

export const setToken = (token: string, role: string, user: any) => {
  Cookies.set("token", token, { expires: 1 });
  Cookies.set("role", role, { expires: 1 });
  Cookies.set("userId", user.id, { expires: 1 });
  Cookies.set("user", JSON.stringify(user), { expires: 1 });
  Cookies.set("mobileNumber", user.mobileNumber, { expires: 1 });
};

export const clearToken = () => {
  ["token", "role", "userId", "mobileNumber", "user"].forEach((key) =>
    Cookies.remove(key, { path: "/" })
  );
};
