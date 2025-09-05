import { IUser } from "@/models/user.model";
import Cookies from "js-cookie";

export const getToken = () => Cookies.get("token");

export const getUser = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

export const setToken = (token: string, user: IUser) => {
  Cookies.set("token", token, { expires: 1 });
  Cookies.set("user", JSON.stringify(user), { expires: 1 });
  Cookies.set("role", user.role, { expires: 1 });
};

export const clearToken = () => {
  ["token", "user", "role"].forEach((key) =>
    Cookies.remove(key, { path: "/" })
  );
};
