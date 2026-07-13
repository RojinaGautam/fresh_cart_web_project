"use client";

import { FormEvent, useState } from "react";
import {
  forgotPasswordAction,
  resetPasswordAction,
} from "../../../lib/actions/auth-action";

export type ForgotPasswordStep = "request" | "reset" | "done";

// ViewModel: owns the two-step (request OTP -> reset password) form state/logic for the View.
export function useForgotPasswordViewModel() {
  const [step, setStep] = useState<ForgotPasswordStep>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const handleRequestOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setLoading(true);
    const response = await forgotPasswordAction(email);
    setLoading(false);

    if (!response.success) {
      setErrorMessage(response.message || "Unable to send reset code.");
      return;
    }

    setStep("reset");
  };

  const handleResendOtp = async () => {
    setErrorMessage("");
    setResendMessage("");
    setResending(true);
    const response = await forgotPasswordAction(email);
    setResending(false);

    setResendMessage(
      response.success
        ? response.message || "Reset code sent."
        : response.message || "Unable to resend code.",
    );
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (otp.length !== 6) {
      setErrorMessage("Enter the 6-digit code from your email.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    const response = await resetPasswordAction(email, otp, newPassword);
    setLoading(false);

    if (!response.success) {
      setErrorMessage(response.message || "Unable to reset password.");
      return;
    }

    setStep("done");
  };

  return {
    step,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    resending,
    errorMessage,
    resendMessage,
    handleRequestOtp,
    handleResendOtp,
    handleResetPassword,
  };
}
