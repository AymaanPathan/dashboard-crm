"use client";
import { ChevronRightIcon } from "lucide-react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import React, { useState } from "react";
import OtpPage from "./OtpPage";
import { RootDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { handleVerifyOtp, registerUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorToast from "@/assets/toast/ErrorToast";
import { isValidEmail } from "@/utils/validation.utils";
import { useRegisterLoading } from "@/assets/loadingStates/auth.loading.state";
import { ButtonLoading } from "@/components/ui/ButtonLoading";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpDigits, setOtpDigits] = useState("");
  const dispatch: RootDispatch = useDispatch();
  // Loading
  const isRegisterLoading = useRegisterLoading();
  console.log("isRegisterLoading:", isRegisterLoading);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignup = async () => {
    if (!username) return ErrorToast({ title: "Username is required" });
    if (!isValidEmail(email)) return ErrorToast({ title: "Invalid email" });
    if (!password) return ErrorToast({ title: "Password is required" });

    try {
      const res = await dispatch(registerUser({ username, email, password }));
      console.log("Signup success", res);
      if (res.meta.requestStatus === "fulfilled") {
        setShowOtpVerification(true);
      }
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  const handleOtpVerification = async () => {
    await dispatch(handleVerifyOtp({ email, otp: otpDigits })).unwrap();
  };
  if (showOtpVerification) {
    return (
      <OtpPage
        email={email}
        otp={otpDigits}
        setOtp={setOtpDigits}
        handleOtpVerification={handleOtpVerification}
        setShowOtpVerification={setShowOtpVerification}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <div className="h-6 w-6 rounded-md bg-foreground" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Create your account
          </CardTitle>
          <CardDescription>
            Get started with your free account today
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked as boolean)
                }
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm leading-5">
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:underline"
                >
                  Privacy Policy
                </a>
              </Label>
            </div>
            {isRegisterLoading ? (
              <ButtonLoading content="Creating account..." />
            ) : (
              <Button
                variant="secondary"
                onClick={handleSignup}
                size="icon"
                className="w-full cursor-pointer"
              >
                Create an account <ChevronRightIcon />
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-medium">
                Sign in
              </Button>
            </p>
          </div>

          <div className="border-t pt-6">
            <p className="text-center text-xs text-muted-foreground">
              Free to get started • No credit card required
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
