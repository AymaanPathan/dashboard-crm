import axiosSetup from "../utils/axiosSetup";

export const handleLoginApi = async (email: string, password: string) => {
  const { data } = await axiosSetup.post("/login", {
    email,
    password,
  });
  return { token: data.data, role: data.user.role, user: data.user };
};
