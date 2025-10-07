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
    const res = await dispatch(
      handleVerifyOtp({ email: user.email!, otp: otp })
    ).unwrap();
    if (res.statusCode === 200) {
      router.push("/organizationsetup");
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

    // Start the 1-minute (60 seconds) timer
    setResendTimer(60);
    setIsResendDisabled(true);
  };

  const formatTimer = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-xl">
            <Mail className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{user.email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-center block">
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
            <p className="text-xs text-muted-foreground text-center">
              {otp.length}/6 digits
            </p>
          </div>

          {isVerifyingOtp ? (
            <ButtonLoading content="Verifying..." />
          ) : (
            <Button
              type="button"
              onClick={handleOtpVerification}
              disabled={otp.length !== 6}
              className="w-full cursor-pointer"
              size="default"
            >
              Verify & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <Button
              onClick={handleResendOtpToEmail}
              variant="link"
              className="p-0 h-auto font-medium"
              disabled={isResendDisabled}
            >
              {isResendDisabled
                ? `Resend in ${formatTimer(resendTimer)}`
                : "Resend"}
            </Button>
          </p>
        </div>

        <div className="text-center">
          <Link href={"/"}>
            <Button
              variant="ghost"
              onClick={() => setShowOtpVerification(false)}
              className="text-sm"
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
