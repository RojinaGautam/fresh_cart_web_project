"use client";

import { FormEvent, useState } from "react";
import {
  resendVerificationAction,
  verifyEmailAction,
} from "../../../lib/actions/auth-action";

// ViewModel: owns the OTP verification form state/logic for the View.
export function useVerifyEmailViewModel(initialEmail: string) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [verified, setVerified] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setResendMessage("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage("Enter the 6-digit code from your email.");
      return;
    }

    setLoading(true);
    const response = await verifyEmailAction(email, otp);
    setLoading(false);

    if (!response.success) {
      setErrorMessage(response.message || "Verification failed.");
      return;
    }

    setVerified(true);
  };

  const handleResend = async () => {
    setErrorMessage("");
    setResendMessage("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage("Enter a valid email address first.");
      return;
    }

    setResending(true);
    const response = await resendVerificationAction(email);
    setResending(false);

    setResendMessage(
      response.success
        ? response.message || "Verification code sent."
        : response.message || "Unable to resend code.",
    );
  };

  return {
    email,
    setEmail,
    otp,
    setOtp,
    loading,
    resending,
    errorMessage,
    resendMessage,
    verified,
    handleSubmit,
    handleResend,
  };
}
