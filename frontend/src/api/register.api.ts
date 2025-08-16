import axiosSetup from "../utils/axiosSetup";

export const handleRegisterApi = async (
  username: string,
  email: string,
  password: string
) => {
  const { data } = await axiosSetup.post("/register", {
    username,
    email,
    password,
  });
  return { token: data.data, user: data.user };
};
