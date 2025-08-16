import { ArrowRight, Mail } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OtpPageProps {
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  handleOtpVerification: () => void;
  setShowOtpVerification: (show: boolean) => void;
}

const OtpPage: React.FC<OtpPageProps> = ({
  email,
  otp,
  setOtp,
  handleOtpVerification,
  setShowOtpVerification,
}) => {
  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setOtp(numericValue);
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
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-center block">
              Enter verification code
            </Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className="text-center text-lg font-mono tracking-widest"
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
            />
            <p className="text-xs text-muted-foreground text-center">
              {otp.length}/6 digits
            </p>
          </div>

          <Button
            type="button"
            onClick={handleOtpVerification}
            disabled={otp.length !== 6}
            className="w-full"
            size="default"
          >
            Verify & Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <Button variant="link" className="p-0 h-auto font-medium">
              Resend
            </Button>
          </p>
        </div>

        {/* Back to signup */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setShowOtpVerification(false)}
            className="text-sm"
          >
            ← Back to signup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
