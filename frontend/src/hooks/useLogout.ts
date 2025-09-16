import { RootDispatch } from "@/store";
import { logoutUser } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";

export const useLogout = () => {
  const dispatch: RootDispatch = useDispatch();
  const logout = async () => {
    try {
      await dispatch(logoutUser());

      localStorage.clear();
      window.location.href = "http://localhost:8000";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return logout;
};
