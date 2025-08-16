import { ArrowRight, Mail } from "lucide-react";
import React from "react";

interface OtpPageProps {
  email: string;
  otpDigits: string[];
  handleOtpChange: (index: number, value: string) => void;
  handleKeyDown: (index: number, e: React.KeyboardEvent) => void;
  handleOtpVerification: () => void;
  setShowOtpVerification: (show: boolean) => void;
}

const OtpPage: React.FC<OtpPageProps> = ({
  email,
  otpDigits,
  handleOtpChange,
  handleKeyDown,
  handleOtpVerification,
  setShowOtpVerification,
}) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-xl mb-4">
            <Mail className="w-6 h-6 text-neutral-600" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Verify your email
          </h1>
          <p className="text-sm text-neutral-600">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-medium border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:border-neutral-950 transition-colors"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleOtpVerification}
            className="w-full bg-neutral-950 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            Verify & Continue
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <p className="text-sm text-neutral-600">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                className="text-neutral-950 font-medium hover:underline"
              >
                Resend
              </button>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowOtpVerification(false)}
            className="w-full text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Back to signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
