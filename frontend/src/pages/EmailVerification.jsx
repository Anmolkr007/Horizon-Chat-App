import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import EmailVerified from "./EmailVerified";
import VerificationFailed from "./VerificationFailed";
import Verifying from "./Verifying";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const token = searchParams.get("token");
  const {verifyEmail,error} = useAuthStore();

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };
    if (token) verify();
  }, [token]);

  if (status === "loading") return <Verifying/>;
  if (status === "success")
    return <EmailVerified/>
  return <VerificationFailed/>;
};

export default VerifyEmailPage;
