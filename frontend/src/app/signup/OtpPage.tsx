import { ArrowRight, Mail } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { handleResendOtp, handleVerifyOtp } from "@/store/slices/authSlice";
import { useVerifyLoading } from "@/assets/loadingStates/auth.loading.state";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorToast from "@/assets/toast/ErrorToast";

interface OtpPageProps {
  otp: string;
  setOtp: (otp: string) => void;
  setShowOtpVerification: (show: boolean) => void;
}

const OtpPage: React.FC<OtpPageProps> = ({
  otp,
  setOtp,
  setShowOtpVerification,
}) => {
  const dispatch: RootDispatch = useDispatch();
  const router = useRouter();

  const [resendTimer, setResendTimer] = useState<number>(0);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const isVerifyingOtp = useVerifyLoading();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleOtpVerification = async () => {
    try {
      const res = await dispatch(
        handleVerifyOtp({ email: user.email!, otp: otp })
      ).unwrap();
      console.log("OTP Verification Response:", res);
      if (res.data.token) {
        router.push("/organizationsetup");
      }
    } catch (error) {
      ErrorToast({
        title: "Verification failed",
        description: error as string,
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendTimer]);

  const handleResendOtpToEmail = async () => {
    await dispatch(handleResendOtp({ email: user.email! }));

    setResendTimer(60);
    setIsResendDisabled(true);
  };

  const formatTimer = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-14 h-14 bg-gray-50 rounded-lg border border-gray-100">
            <Mail className="w-7 h-7 text-gray-700" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Verify your email
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="font-medium text-gray-900">{user.email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <div className="space-y-6 pt-2">
          <div className="space-y-4">
            <Label
              htmlFor="otp"
              className="text-center block text-sm font-medium text-gray-700"
            >
              Enter verification code
            </Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value: string) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-gray-500 text-center font-normal">
              {otp.length}/6 digits entered
            </p>
          </div>

          {isVerifyingOtp ? (
            <ButtonLoading content="Verifying..." />
          ) : (
            <Button
              type="button"
              onClick={handleOtpVerification}
              disabled={otp.length !== 6}
              className="w-full cursor-pointer h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
              size="default"
            >
              Verify & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Resend */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive the code?{" "}
            <Button
              onClick={handleResendOtpToEmail}
              variant="link"
              className="p-0 h-auto font-medium text-gray-900 hover:text-gray-700 underline-offset-4"
              disabled={isResendDisabled}
            >
              {isResendDisabled
                ? `Resend in ${formatTimer(resendTimer)}`
                : "Resend code"}
            </Button>
          </p>
        </div>

        <div className="text-center pt-4">
          <Link href={"/"}>
            <Button
              variant="ghost"
              onClick={() => setShowOtpVerification(false)}
              className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-normal"
            >
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
