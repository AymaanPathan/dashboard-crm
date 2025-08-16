import axiosSetup from "../utils/axiosSetup";

export const handleRegisterApi = async (
  email: string,
  username: string,
  password: string
) => {
  const { data } = await axiosSetup.post("/register", {
    email,
    username,
    password,
  });
  return { token: data.data, role: data.user.role, user: data.user };
};
