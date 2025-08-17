import { RootState } from "@/store";
import { useSelector } from "react-redux";

export const useRegisterLoading = (): boolean =>
  useSelector((state: RootState) => state.auth.loadingState.register);

export const useLoginLoading = (): boolean =>
  useSelector((state: RootState) => state.auth.loadingState.login);

export const useVerifyLoading = (): boolean =>
  useSelector((state: RootState) => state.auth.loadingState.verifyOtp);
