import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRound = 12;
  const hashed = await bcrypt.hash(password, saltRound);
  return hashed;
};
