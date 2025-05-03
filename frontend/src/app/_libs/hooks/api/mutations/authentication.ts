import { fromError } from "@/app/_libs/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { clientApi } from "../axios";

export const useSignIn = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      window.location.replace("/");
    },
    onError: (e) => {
      setErrorMessage(fromError(e).message);
    },
  });

  return { mutation, errorMessage };
};

const signIn = async (loginInfo: FormData) => {
  const resp = await clientApi.post("signin", loginInfo);
  return resp.data;
};

export const useLogout = () => {
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      window.location.replace("/");
    },
    onError: (e) => {
      toast(fromError(e).message);
    },
  });

  return { mutation };
};

const logout = async () => {
  const resp = await clientApi.post("signout");
  return resp.data;
};

export const useRegistration = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      window.location.replace("/");
    },
    onError: (e) => {
      setErrorMessage(fromError(e).message);
    },
  });

  return { mutation, errorMessage };
};

const register = async (registrationInfo: FormData) => {
  const resp = await clientApi.post("registration", registrationInfo);
  return resp.data;
};
